const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = btoa(`${client_id}:${client_secret}`);
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const updateDate = Math.floor(Date.now() / 1000);

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=60'
    );

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ 
        isPlaying: false, 
        updateDate 
      });
    }

    const song = await response.json();

    if (!song.item) {
      return res.status(200).json({ isPlaying: false, updateDate });
    }

    return res.status(200).json({
      updateDate,
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((_artist) => _artist.name).join(', '),
      cover: song.item.album.images[0]?.url,
      position: formatTime(song.progress_ms),
      endPos: formatTime(song.item.duration_ms),
      progressMs: song.progress_ms,
      durationMs: song.item.duration_ms,
      url: song.item.external_urls.spotify
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Spotify data" });
  }
}
