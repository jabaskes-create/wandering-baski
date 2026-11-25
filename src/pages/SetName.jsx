import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function SetName({ user }) {
  const [name, setName] = useState(user?.displayName || '')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Your display name</h2>
        <p style={styles.sub}>This is how other travelers see you.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Saving…' : saved ? '✓ Saved!' : 'Save name'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    padding: '1rem',
    maxWidth: '360px',
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    borderRadius: '18px',
    padding: '1.5rem',
    border: '1px solid #e8e4de',
  },
  title: {
    fontWeight: '700',
    fontSize: '1rem',
    color: '#1a1a1a',
    margin: '0 0 0.25rem',
  },
  sub: {
    fontSize: '0.82rem',
    color: '#aaa',
    margin: '0 0 1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  input: {
    padding: '0.65rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
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
  },
}
