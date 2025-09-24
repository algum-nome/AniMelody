const CLIENT_ID = '83211a431217423c881195e63f9bbfc9';
const CLIENT_SECRET = '38e9a7f347204056a1d76ae2c0af7082';

// Pega o token da API do Spotify
async function getAccessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
}

// Busca faixa do Spotify
async function searchSpotifyTrack(query, token) {
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data.tracks?.items[0];
}

// Normaliza texto para comparar (sem acento, sem pontuação, minúsculo)
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toLowerCase()
    .trim();
}

// Busca letra no JSON
async function buscarLetra(tituloOriginal) {
  try {
    const res = await fetch('letra.json');
    const json = await res.json();
    const tituloNormal = normalizarTexto(tituloOriginal);

    for (const musica of json.musicas) {
      const tituloJson = normalizarTexto(musica.titulo);
      if (tituloNormal === tituloJson || tituloNormal.includes(tituloJson) || tituloJson.includes(tituloNormal)) {
        return musica.letra;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar letra:', error);
    return null;
  }
}

// Carrega tudo na página
async function exibirPlayerEMusica() {
  const params = new URLSearchParams(window.location.search);
  const titulo = params.get('song');
  if (!titulo) return;

  document.getElementById('songTitle').innerText = titulo;
  document.getElementById('lyrics').innerText = 'Buscando letra...';

  try {
    const token = await getAccessToken();
    const track = await searchSpotifyTrack(titulo, token);

    if (track) {
      const trackId = track.id;
      document.getElementById('spotifyPlayer').src = `https://open.spotify.com/embed/track/${trackId}`;
    }

    const letra = await buscarLetra(titulo);
    document.getElementById('lyrics').innerText = letra || '❌ Letra não encontrada.';
  } catch (err) {
    console.error('Erro:', err);
    document.getElementById('lyrics').innerText = 'Erro ao carregar a letra.';
  }
}

exibirPlayerEMusica();