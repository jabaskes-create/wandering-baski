// Generates an .ics calendar file from away dates
export function generateICS(awayDates, currentUserId) {
  const others = awayDates.filter(d => d.userId !== currentUserId)

  const events = others.map(d => {
    const dtstart = d.startDate.replace(/-/g, '')
    const dtend = addOneDay(d.endDate).replace(/-/g, '')
    const summary = d.label
      ? `${d.displayName} away – ${d.label}`
      : `${d.displayName} away`
    return [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${summary}`,
      `UID:${d.id}@wandering-baski`,
      'END:VEVENT',
    ].join('\r\n')
  })

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wandering Baski//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

function addOneDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}
