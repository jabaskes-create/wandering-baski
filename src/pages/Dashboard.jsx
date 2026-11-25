import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, subscribeToAwayDates } from '../lib/firebase'
import { useAuth } from '../lib/AuthContext'
import AddDateForm from '../components/AddDateForm'
import AwayList from '../components/AwayList'
import CalendarInstructions from '../components/CalendarInstructions'
import WhosAway from '../components/WhosAway'
import StatsPanel from '../components/StatsPanel'
import CalendarView from '../components/CalendarView'
import HeroPhoto from '../components/HeroPhoto'
import MapView from '../components/MapView'

export default function Dashboard() {
  const user = useAuth()
  const [awayDates, setAwayDates] = useState([])
  const [view, setView] = useState('list')
  const [showAdd, setShowAdd] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showCalSync, setShowCalSync] = useState(false)

  useEffect(() => {
    if (!user) return
    const unsub = subscribeToAwayDates(setAwayDates)
    return unsub
  }, [user?.uid])

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'You'

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <HeroPhoto />

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🧳 Wandering Baski</h1>
            <p style={styles.greeting}>Hey, {displayName}</p>
          </div>
          <div style={styles.headerActions}>
            <button
              style={styles.iconBtn}
              title="Calendar sync"
              onClick={() => setShowCalSync(v => !v)}
            >📅</button>
            <button
              style={styles.iconBtn}
              title="Stats"
              onClick={() => setShowStats(v => !v)}
            >📊</button>
            <button
              style={styles.iconBtn}
              title="Sign out"
              onClick={() => signOut(auth)}
            >↩</button>
          </div>
        </div>

        {/* Calendar sync panel */}
        {showCalSync && (
          <div style={styles.panel}>
            <CalendarInstructions awayDates={awayDates} user={user} />
            <p style={styles.panelHint}>Export your crew's away dates to Google Calendar. Do this once — it stays in sync.</p>
            <button style={styles.panelClose} onClick={() => setShowCalSync(false)}>Done</button>
          </div>
        )}

        {/* Stats panel */}
        {showStats && (
          <div style={styles.panel}>
            <StatsPanel awayDates={awayDates} inline />
            <button style={styles.panelClose} onClick={() => setShowStats(false)}>Done</button>
          </div>
        )}

        {/* Add trip form */}
        {showAdd && (
          <div style={styles.panel}>
            <AddDateForm user={user} onDone={() => setShowAdd(false)} />
          </div>
        )}

        {/* Who's Away hero */}
        <WhosAway
          awayDates={awayDates}
          currentUserName={user?.displayName || user?.email?.split('@')[0]}
        />

        {/* Trips section */}
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Upcoming trips</span>
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(view === 'list' ? styles.tabActive : {}) }}
              onClick={() => setView('list')}
            >List</button>
            <button
              style={{ ...styles.tab, ...(view === 'calendar' ? styles.tabActive : {}) }}
              onClick={() => setView('calendar')}
            >Calendar</button>
            <button
              style={{ ...styles.tab, ...(view === 'map' ? styles.tabActive : {}) }}
              onClick={() => setView('map')}
            >Map</button>
          </div>
        </div>

        {view === 'calendar' ? (
          <CalendarView awayDates={awayDates} />
        ) : view === 'map' ? (
          <MapView awayDates={awayDates} />
        ) : (
          <div style={styles.listCard}>
            <AwayList awayDates={awayDates} currentUserId={user?.uid} />
          </div>
        )}

      </div>

      {/* Floating add button */}
      <button style={styles.fab} onClick={() => setShowAdd(v => !v)}>
        <span style={styles.fabIcon}>{showAdd ? '✕' : '+'}</span>
        <span>{showAdd ? 'Cancel' : 'Add trip'}</span>
      </button>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f4f1',
    padding: '1.5rem 1rem 6rem',
  },
  container: {
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: '0 0 1px',
    color: '#1a1a1a',
  },
  greeting: {
    fontSize: '0.8rem',
    color: '#aaa',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  iconBtn: {
    background: '#fff',
    border: '1px solid #e8e4de',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#666',
  },
  panel: {
    background: '#fff',
    border: '1px solid #e8e4de',
    borderRadius: '18px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1rem',
  },
  panelHint: {
    fontSize: '0.78rem',
    color: '#aaa',
    marginTop: '0.5rem',
  },
  panelClose: {
    marginTop: '0.75rem',
    background: 'none',
    border: '1px solid #e8e4de',
    borderRadius: '8px',
    padding: '0.35rem 0.9rem',
    fontSize: '0.82rem',
    color: '#888',
    cursor: 'pointer',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '1.25rem 0 0.6rem',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  tabs: {
    display: 'flex',
    background: '#f0ede8',
    borderRadius: '10px',
    padding: '3px',
    gap: '2px',
  },
  tab: {
    flex: 1,
    padding: '0.35rem 0.75rem',
    border: 'none',
    background: 'none',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#aaa',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#fff',
    color: '#1a1a1a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  listCard: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e8e4de',
    overflow: 'hidden',
  },
  fab: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    padding: '0.75rem 1.25rem',
    fontSize: '0.88rem',
    fontWeight: '600',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
    zIndex: 100,
  },
  fabIcon: {
    fontSize: '1rem',
    fontWeight: '700',
  },
}
