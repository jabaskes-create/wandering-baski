import { useMemo } from 'react'

// Animated DANGER banner styles
const dangerKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 50%, 90% { transform: translateX(-4px); }
  30%, 70% { transform: translateX(4px); }
}
@keyframes pulseRed {
  0%, 100% { background: #ef4444; }
  50% { background: #b91c1c; }
}
@keyframes flashBorder {
  0%, 100% { border-color: #ef4444; }
  50% { border-color: #fff; }
}
`

function today() {
  return new Date().toISOString().slice(0, 10)
}

function friendlyName(entry) {
  return entry.displayName || entry.userId?.split('@')[0] || 'Someone'
}

function isAway(entry, date) {
  return entry.startDate <= date && entry.endDate >= date
}

export default function WhosAway({ awayDates, currentUserName }) {
  const todayStr = today()

  const awayToday = useMemo(() =>
    awayDates.filter(d => isAway(d, todayStr)),
    [awayDates, todayStr]
  )

  const allAway = awayToday.length > 0

  // Find overlapping trips (multiple people away same future day)
  const overlaps = useMemo(() => {
    const future = awayDates.filter(d => d.endDate >= todayStr)
    const byDay = {}
    future.forEach(d => {
      let cur = new Date(d.startDate + 'T12:00:00')
      const end = new Date(d.endDate + 'T12:00:00')
      while (cur <= end) {
        const k = cur.toISOString().slice(0, 10)
        if (!byDay[k]) byDay[k] = []
        byDay[k].push(d)
        cur.setDate(cur.getDate() + 1)
      }
    })
    return Object.entries(byDay)
      .filter(([, entries]) => entries.length > 1)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 3)
  }, [awayDates, todayStr])

  if (awayDates.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>✈️</span>
        <p style={styles.emptyText}>No trips logged yet. Add one!</p>
      </div>
    )
  }

  return (
    <div>
      <style>{dangerKeyframes}</style>

      {/* DANGER banner — all travelers away */}
      {allAway && (
        <div style={styles.danger}>
          <div style={styles.dangerInner}>
            <span style={styles.dangerIcon}>🚨</span>
            <div>
              <div style={styles.dangerTitle}>Everyone's away right now</div>
              <div style={styles.dangerSub}>
                All travelers away{' '}
                {new Date(todayStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Who's away today */}
      {awayToday.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardLabel}>Away right now</div>
          {awayToday.map(d => (
            <div key={d.id} style={styles.awayRow}>
              <span style={styles.awayName}>{friendlyName(d)}</span>
              <span style={styles.awayDates}>
                {fmtDate(d.startDate)} – {fmtDate(d.endDate)}
                {d.label ? ` · ${d.label}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming overlaps */}
      {overlaps.length > 0 && (
        <div style={{ ...styles.card, marginTop: '0.6rem' }}>
          <div style={styles.cardLabel}>Upcoming overlaps</div>
          {overlaps.map(([date, entries]) => (
            <div key={date} style={styles.overlapRow}>
              <span style={styles.overlapDate}>{fmtDate(date)}</span>
              <span style={styles.overlapNames}>
                {entries.map(e => friendlyName(e)).join(' & ')} both away
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const styles = {
  empty: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#bbb',
  },
  emptyIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  emptyText: {
    margin: 0,
    fontSize: '0.88rem',
  },
  danger: {
    background: '#ef4444',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    border: '2px solid #ef4444',
    animation: 'shake 0.5s ease-in-out, pulseRed 2s ease-in-out infinite, flashBorder 1s ease-in-out infinite',
  },
  dangerInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dangerIcon: {
    fontSize: '1.5rem',
  },
  dangerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  dangerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.78rem',
    marginTop: '1px',
  },
  card: {
    background: '#fff',
    border: '1px solid #e8e4de',
    borderRadius: '14px',
    padding: '0.9rem 1rem',
    marginBottom: '0.6rem',
  },
  cardLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#bbb',
    marginBottom: '0.5rem',
  },
  awayRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '0.5rem',
    padding: '0.2rem 0',
  },
  awayName: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#1a1a1a',
  },
  awayDates: {
    fontSize: '0.78rem',
    color: '#aaa',
  },
  overlapRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
    padding: '0.2rem 0',
  },
  overlapDate: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#f59e0b',
    minWidth: '60px',
  },
  overlapNames: {
    fontSize: '0.82rem',
    color: '#555',
  },
}
