import { useState } from 'react'
import { generateICS } from '../lib/ics'

export default function CalendarInstructions({ awayDates, user }) {
  const [copied, setCopied] = useState(false)

  const calUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/calendar.ics?uid=${user?.uid}`
    : ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(calUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  function handleDownload() {
    const ics = generateICS(awayDates, user?.uid)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wandering-baski.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={styles.heading}>Sync with Google Calendar</div>
      <p style={styles.body}>
        Download a one-time <code style={styles.code}>.ics</code> snapshot, or subscribe via URL to get live updates.
      </p>

      <div style={styles.optionRow}>
        <button style={styles.btn} onClick={handleDownload}>
          ⬇️ Download .ics
        </button>
        <div style={styles.orDivider}>or</div>
        <div style={styles.urlRow}>
          <input style={styles.urlInput} value={calUrl} readOnly />
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy URL'}
          </button>
        </div>
      </div>

      <details style={styles.details}>
        <summary style={styles.summary}>How to subscribe in Google Calendar</summary>
        <ol style={styles.steps}>
          <li>Open Google Calendar → Other calendars → From URL</li>
          <li>Paste the URL above</li>
          <li>Click "Add calendar" — it syncs automatically</li>
        </ol>
      </details>
    </div>
  )
}

const styles = {
  heading: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#1a1a1a',
    marginBottom: '0.35rem',
  },
  body: {
    fontSize: '0.82rem',
    color: '#888',
    margin: '0 0 0.75rem',
  },
  code: {
    fontFamily: 'monospace',
    background: '#f5f5f5',
    padding: '0 3px',
    borderRadius: '3px',
  },
  optionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  btn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'inherit',
    alignSelf: 'flex-start',
  },
  orDivider: {
    fontSize: '0.75rem',
    color: '#ccc',
    textAlign: 'center',
  },
  urlRow: {
    display: 'flex',
    gap: '0.4rem',
    alignItems: 'center',
  },
  urlInput: {
    flex: 1,
    padding: '0.45rem 0.6rem',
    borderRadius: '7px',
    border: '1px solid #e0e0e0',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    background: '#fafafa',
    color: '#555',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyBtn: {
    padding: '0.45rem 0.75rem',
    borderRadius: '7px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    fontSize: '0.78rem',
    cursor: 'pointer',
    color: '#555',
    flexShrink: 0,
    fontFamily: 'inherit',
  },
  details: {
    marginTop: '0.75rem',
  },
  summary: {
    fontSize: '0.78rem',
    color: '#aaa',
    cursor: 'pointer',
  },
  steps: {
    fontSize: '0.78rem',
    color: '#888',
    paddingLeft: '1.2rem',
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
}
