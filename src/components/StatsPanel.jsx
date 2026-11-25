import { useMemo } from 'react'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function daysBetween(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end + 'T12:00:00')
  return Math.max(0, Math.round((e - s) / 86400000) + 1)
}

export default function StatsPanel({ awayDates }) {
  const todayStr = today()

  const stats = useMemo(() => {
    const byUser = {}
    awayDates.forEach(d => {
      if (!byUser[d.userId]) byUser[d.userId] = { name: d.displayName || d.userId, trips: 0, days: 0 }
      byUser[d.userId].trips++
      byUser[d.userId].days += daysBetween(d.startDate, d.endDate)
    })

    const upcoming = awayDates.filter(d => d.startDate > todayStr).length
    const active = awayDates.filter(d => d.startDate <= todayStr && d.endDate >= todayStr).length
    const totalTrips = awayDates.length
    const travelers = Object.values(byUser)

    return { travelers, upcoming, active, totalTrips }
  }, [awayDates, todayStr])

  return (
    <div>
      <div style={styles.statRow}>
        <Stat label="Total trips" value={stats.totalTrips} />
        <Stat label="Upcoming" value={stats.upcoming} />
        <Stat label="Active now" value={stats.active} />
      </div>

      {stats.travelers.length > 0 && (
        <div style={styles.breakdown}>
          <div style={styles.breakdownLabel}>By traveler</div>
          {stats.travelers
            .sort((a, b) => b.days - a.days)
            .map(t => (
              <div key={t.name} style={styles.travelerRow}>
                <span style={styles.travelerName}>{t.name}</span>
                <span style={styles.travelerMeta}>{t.trips} trip{t.trips !== 1 ? 's' : ''} · {t.days} day{t.days !== 1 ? 's' : ''}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  )
}

const styles = {
  statRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  stat: {
    background: '#f8f7f5',
    borderRadius: '10px',
    padding: '0.6rem 0.5rem',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: '0.65rem',
    color: '#aaa',
    marginTop: '1px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  breakdown: {
    marginTop: '0.5rem',
  },
  breakdownLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#ccc',
    marginBottom: '0.5rem',
  },
  travelerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem 0',
    borderTop: '1px solid #f5f5f5',
  },
  travelerName: {
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#1a1a1a',
  },
  travelerMeta: {
    fontSize: '0.76rem',
    color: '#aaa',
  },
}
