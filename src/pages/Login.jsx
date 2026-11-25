import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isNew) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() })
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧳 Wandering Baski</h1>
        <p style={styles.sub}>Track who's traveling</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isNew && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? '…' : isNew ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button onClick={() => setIsNew(v => !v)} style={styles.toggle}>
          {isNew ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f4f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2rem',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
    color: '#1a1a1a',
  },
  sub: {
    fontSize: '0.85rem',
    color: '#aaa',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.7rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '0.95rem',
    outline: 'none',
  },
  error: {
    color: '#e05252',
    fontSize: '0.83rem',
    margin: 0,
  },
  button: {
    padding: '0.75rem',
    borderRadius: '10px',
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
  toggle: {
    marginTop: '1rem',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
  },
}
