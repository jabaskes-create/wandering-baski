import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon (Leaflet + bundler quirk)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function today() {
  return new Date().toISOString().slice(0, 10)
}

function fmtDate(str) {
  return new Date(str + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function MapView({ awayDates }) {
  const todayStr = today()

  const withGeo = useMemo(() =>
    awayDates.filter(d => d.geo?.lat && d.geo?.lon),
    [awayDates]
  )

  if (withGeo.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>🗺️</span>
        <p style={styles.emptyText}>Trips with a location will appear here on the map.</p>
      </div>
    )
  }

  const center = [withGeo[0].geo.lat, withGeo[0].geo.lon]

  return (
    <div style={styles.wrapper}>
      <MapContainer center={center} zoom={3} style={{ height: '340px', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {withGeo.map(d => (
          <Marker key={d.id} position={[d.geo.lat, d.geo.lon]}>
            <Popup>
              <strong>{d.displayName || 'Traveler'}</strong><br />
              {d.location}<br />
              {fmtDate(d.startDate)} – {fmtDate(d.endDate)}
              {d.label && <><br />{d.label}</>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

const styles = {
  wrapper: {
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #e8e4de',
  },
  empty: {
    background: '#fff',
    border: '1px solid #e8e4de',
    borderRadius: '14px',
    padding: '2.5rem 1rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#bbb',
    fontSize: '0.85rem',
    margin: 0,
  },
}
