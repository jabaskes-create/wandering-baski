import { deleteAwayDate } from '../lib/firebase'

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function AwayList({ awayDates, currentUserId }) {
  const todayStr = today()

  const sorted = [...awayDates].sort((a, b) => a.startDate.localeCompare(b.startDate))

  const upcoming = sorted.filter(d => d.endDate >= todayStr)
  const past = sorted.filter(d => d.endDate < todayStr)

  if (awayDates.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No trips yet — add one with the button below!</p>
      </div>
    )
  }

  return (
    <div>
      {upcoming.length > 0 && (
        <Section title="Upcoming" entries={upcoming} currentUserId={currentUserId} todayStr={todayStr} />
      )}
      {past.length > 0 && (
        <Section title="Past" entries={past} currentUserId={currentUserId} todayStr={todayStr} faded />
      )}
    </div>
  )
}

function Section({ title, entries, currentUserId, todayStr, faded }) {
  return (
    <div>
      <div style={styles.sectionLabel}>{title}</div>
      {entries.map(entry => (
        <TripRow key={entry.id} entry={entry} currentUserId={currentUserId} todayStr={todayStr} faded={faded} />
      ))}
    </div>
  )
}

function TripRow({ entry, currentUserId, todayStr, faded }) {
  const isOwn = entry.userId === currentUserId
  const isActive = entry.startDate <= todayStr && entry.endDate >= todayStr

  async function handleDelete() {
    if (!window.confirm('Remove this trip?')) return
    await deleteAwayDate(entry.id)
  }

  return (
    <div style={{ ...styles.row, opacity: faded ? 0.5 : 1 }}>
      <div style={styles.left}>
        {isActive && <span style={styles.activeDot} />}
        <div>
          <div style={styles.name}>
            {entry.displayName || 'Unknown'}
            {isOwn && <span style={styles.youBadge}>you</span>}
          </div>
          <div style={styles.meta}>
            {fmtDate(entry.startDate)} – {fmtDate(entry.endDate)}
            {entry.label ? ` · ${entry.label}` : ''}
            {entry.location ? ` · ${entry.location}` : ''}
          </div>
        </div>
      </div>
      {isOwn && (
        <button style={styles.deleteBtn} onClick={handleDelete} title="Remove trip">
          ✕
        </button>
      )}
    </div>
  )
}

const styles = {
  empty: {
    padding: '2rem 1rem',
    textAlign: 'center',
  },
  emptyText: {
    color: '#bbb',
    fontSize: '0.88rem',
    margin: 0,
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#ccc',
    padding: '0.75rem 1rem 0.25rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    borderTop: '1px solid #f5f5f5',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  activeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
    flexShrink: 0,
  },
  name: {
    fontWeight: '600',
    fontSize: '0.88rem',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  youBadge: {
    fontSize: '0.65rem',
    background: '#dbeafe',
    color: '#2563eb',
    borderRadius: '4px',
    padding: '1px 5px',
    fontWeight: '600',
    letterSpacing: '0.03em',
  },
  meta: {
    fontSize: '0.76rem',
    color: '#aaa',
    marginTop: '1px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    flexShrink: 0,
  },
}
