const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const hideSpotify = false;

async function getAccessToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token })
  })
  return res.json()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { access_token } = await getAccessToken()
    const spotifyRes = await fetch(NOW_PLAYING_ENDPOINT, { headers: { Authorization: `Bearer ${access_token}` } })
    const timestamp = Date.now()
      if (hideSpotify) {
    return res.status(200).json({
      isPlaying: false,
      timestamp,
    });
  }
    
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=5')
    if (spotifyRes.status === 204 || spotifyRes.status >= 400) return res.status(200).json({ updateDate, isPlaying: false })
    const data = await spotifyRes.json()
    if (!data?.item) return res.status(200).json({ updateDate, isPlaying: false })
    return res.status(200).json({
      timestamp,
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map(a => a.name).join(', '),
      cover: data.item.album.images[0]?.url,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
      url: data.item.external_urls.spotify
    })
  } catch {
    return res.status(500).json({ error: 'Spotify fetch failed' })
  }
}
