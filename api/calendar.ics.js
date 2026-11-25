// Vercel serverless function: /api/calendar.ics
// Returns an ICS calendar feed for a specific user's crew (everyone else's trips)
//
// Usage: subscribe in Google Calendar with:
//   https://your-app.vercel.app/api/calendar.ics?uid=<firebase-user-uid>

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function initAdmin() {
  if (getApps().length) return
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

function addOneDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}

export default async function handler(req, res) {
  const { uid } = req.query
  if (!uid) {
    return res.status(400).send('Missing uid parameter')
  }

  try {
    initAdmin()
    const db = getFirestore()
    const snap = await db.collection('awayDates').get()
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    // Show everyone else's trips (or all trips — your choice)
    const trips = all.filter(d => d.userId !== uid)

    const events = trips.map(d => {
      const dtstart = d.startDate.replace(/-/g, '')
      const dtend = addOneDay(d.endDate)
      const summary = d.label
        ? `${d.displayName || 'Traveler'} away – ${d.label}`
        : `${d.displayName || 'Traveler'} away`
      return [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${summary}`,
        `UID:${d.id}@wandering-baski`,
        'END:VEVENT',
      ].join('\r\n')
    })

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wandering Baski//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Wandering Baski',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n')

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.status(200).send(ics)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error generating calendar')
  }
}
