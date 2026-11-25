// HeroPhoto — replace with your own photo(s)!
//
// HOW TO ADD PHOTOS:
//   1. Drop your image(s) into src/assets/  (jpg, png, webp all work)
//   2. Import them at the top of this file, e.g.:
//        import myPhoto from '../assets/my-photo.jpg'
//   3. Add them to the PHOTOS array below
//   4. The app will randomly pick one each time the page loads
//
// If you only want one photo, just put one item in the PHOTOS array.

// import heroPhoto from '../assets/hero.jpg'   ← uncomment and add your photo
// const PHOTOS = [heroPhoto]

import { useMemo } from 'react'

// Placeholder gradient shown until you add a real photo
export default function HeroPhoto() {
  // Once you add imports above, replace this component body with:
  //   const src = useMemo(() => PHOTOS[Math.floor(Math.random() * PHOTOS.length)], [])
  //   return (
  //     <div style={styles.wrapper}>
  //       <img src={src} alt="Wandering Baski" style={styles.img} />
  //     </div>
  //   )

  return (
    <div style={styles.placeholder}>
      <span style={styles.icon}>🧳</span>
      <span style={styles.hint}>Add a hero photo in src/components/HeroPhoto.jsx</span>
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
    marginBottom: '1.25rem',
    aspectRatio: '16/7',
    background: '#e8e4de',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    borderRadius: '18px',
    marginBottom: '1.25rem',
    aspectRatio: '16/7',
    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '2.5rem',
  },
  hint: {
    fontSize: '0.72rem',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '0 1rem',
  },
}
