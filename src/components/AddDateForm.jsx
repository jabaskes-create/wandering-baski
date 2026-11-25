import { useState, useEffect, useRef } from 'react'
import { addAwayDate } from '../lib/firebase'

const GEOCACHE_KEY = 'wb_geocache_v1'

function loadCache() {
  try { return JSON.parse(localStorage.getItem(GEOCACHE_KEY) || '{}') } catch { return {} }
}
function saveCache(cache) {
  try { localStorage.setItem(GEOCACHE_KEY, JSON.stringify(cache)) } catch {}
}

async function geocode(place) {
  const cache = loadCache()
  if (cache[place]) return cache[place]
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const data = await res.json()
  if (data[0]) {
    const result = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name }
    cache[place] = result
    saveCache(cache)
    return result
  }
  return null
}

export default function AddDateForm({ user, onDone }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [label, setLabel] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const locationRef = useRef(null)

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'You'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!startDate || !endDate) { setError('Pick start and end dates'); return }
    if (endDate < startDate) { setError('End date must be after start date'); return }
    setLoading(true)
    setError('')
    try {
      let geo = null
      if (location.trim()) {
        geo = await geocode(location.trim())
      }
      await addAwayDate({
        userId: user.uid,
        displayName,
        startDate,
        endDate,
        label: label.trim() || null,
        location: location.trim() || null,
        geo: geo ? { lat: geo.lat, lon: geo.lon } : null,
      })
      onDone?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <label style={styles.label}>
          <span style={styles.labelText}>From</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          <span style={styles.labelText}>To</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={e => setEndDate(e.target.value)}
            required
            style={styles.input}
          />
        </label>
      </div>
      <label style={styles.label}>
        <span style={styles.labelText}>Label (optional)</span>
        <input
          type="text"
          placeholder="e.g. Tokyo trip, conference"
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        <span style={styles.labelText}>Location (optional)</span>
        <input
          ref={locationRef}
          type="text"
          placeholder="e.g. Tokyo, Japan"
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={styles.input}
        />
      </label>
      {error && <p style={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? 'Saving…' : 'Save trip'}
      </button>
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  labelText: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  input: {
    padding: '0.6rem 0.75rem',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fafafa',
    color: '#1a1a1a',
  },
  error: {
    color: '#e05252',
    fontSize: '0.82rem',
    margin: 0,
  },
  btn: {
    padding: '0.65rem',
    borderRadius: '10px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'inherit',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
}
