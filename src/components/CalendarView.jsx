import { useState, useMemo } from 'react'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function pad(n) { return String(n).padStart(2, '0') }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa']

// Assign stable colors per userId
const COLORS = ['#3b82f6','#f59e0b','#10b981','#8b5cf6','#ef4444','#06b6d4','#f97316']
function colorFor(userId, allIds) {
  const idx = allIds.indexOf(userId)
  return COLORS[idx % COLORS.length]
}

export default function CalendarView({ awayDates }) {
  const todayStr = today()
  const todayDate = new Date(todayStr + 'T12:00:00')

  const [year, setYear] = useState(todayDate.getFullYear())
  const [month, setMonth] = useState(todayDate.getMonth())

  const allUserIds = useMemo(() => [...new Set(awayDates.map(d => d.userId))], [awayDates])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const days = daysInMonth(year, month)
  const firstDay = firstDayOfMonth(year, month)

  function getEntriesForDay(day) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    return awayDates.filter(d => d.startDate <= dateStr && d.endDate >= dateStr)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)

  return (
    <div style={styles.card}>
      {/* Nav */}
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <span style={styles.monthLabel}>{MONTHS[month]} {year}</span>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      {/* DOW header */}
      <div style={styles.grid}>
        {DOW.map(d => (
          <div key={d} style={styles.dowCell}>{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const isToday = dateStr === todayStr
          const entries = getEntriesForDay(day)

          return (
            <div key={day} style={{ ...styles.dayCell, background: isToday ? '#eff6ff' : undefined }}>
              <span style={{ ...styles.dayNum, color: isToday ? '#2563eb' : '#1a1a1a', fontWeight: isToday ? '700' : '400' }}>
                {day}
              </span>
              <div style={styles.dots}>
                {entries.map(e => (
                  <span
                    key={e.id}
                    style={{ ...styles.dot, background: colorFor(e.userId, allUserIds) }}
                    title={`${e.displayName || 'Someone'}${e.label ? ` – ${e.label}` : ''}`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {allUserIds.length > 0 && (
        <div style={styles.legend}>
          {allUserIds.map(uid => {
            const entry = awayDates.find(d => d.userId === uid)
            return (
              <div key={uid} style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: colorFor(uid, allUserIds) }} />
                <span style={styles.legendName}>{entry?.displayName || uid}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e8e4de',
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f0ede8',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#888',
    cursor: 'pointer',
    padding: '0 0.5rem',
  },
  monthLabel: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#1a1a1a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0.5rem',
    gap: '2px',
  },
  dowCell: {
    textAlign: 'center',
    fontSize: '0.65rem',
    fontWeight: '600',
    color: '#ccc',
    paddingBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dayCell: {
    borderRadius: '8px',
    padding: '4px 2px',
    minHeight: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dayNum: {
    fontSize: '0.78rem',
  },
  dots: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2px',
    justifyContent: 'center',
    marginTop: '2px',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem 1rem',
    padding: '0.6rem 1rem',
    borderTop: '1px solid #f0ede8',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendName: {
    fontSize: '0.75rem',
    color: '#666',
  },
}
