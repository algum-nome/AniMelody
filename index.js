document.addEventListener('DOMContentLoaded', () => {
  // Mostrar a imagem de perfil no topo
  const containerPerfil = document.getElementById('iconeUsuario');
  const fotoSalva = localStorage.getItem('fotoPerfil');

  if (fotoSalva) {
    const img = document.createElement('img');
    img.src = fotoSalva;
    img.alt = "Avatar";
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.borderRadius = "50%";
    img.style.cursor = "pointer";
    img.title = "Ir para o perfil";

    containerPerfil.innerHTML = '';
    containerPerfil.appendChild(img);

    img.addEventListener('click', () => {
      window.location.href = 'usuario.html';
    });
  } else {
    const btn = document.getElementById('btnPerfil');
    if (btn) {
      btn.addEventListener('click', () => {
        window.location.href = 'usuario.html';
      });
    }
  }

  const API_KEY = 'AIzaSyCnh0gLljcIn1KeVQKPPy2i1EBjsTvJ-GY';
  const MAX_RESULTS = 35;
  const gap = 24;

  const PLAYLISTS = {
    openings: 'PLRe9ARNnYSY41I4NXMtfHQ2HN2wap_YtX',  
    endings: 'PLxx64dx7G_TiED3uPy71L6kcBpLWT3kDY'   
  };

  const videosPorTrack = { openings: [], endings: [] };
  const campoBusca = document.querySelector('.campo-busca');
  const formulario = document.querySelector('.search-box');

  document.querySelectorAll('.carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipo = btn.dataset.track;
      const track = document.getElementById(`carousel-${tipo}`);
      const card = track.querySelector('.anime-music-card');
      if (!card) return;
      const scrollAmount = card.offsetWidth + gap;
      const direction = btn.classList.contains('esquerda') ? -scrollAmount : scrollAmount;
      track.scrollBy({ left: direction, behavior: 'smooth' });
    });
  });

  formulario.addEventListener('submit', e => {
    e.preventDefault();
    const termo = removerAcentos(campoBusca.value.toLowerCase().trim());
    Object.keys(videosPorTrack).forEach(tipo => {
      const filtrados = videosPorTrack[tipo].filter(video =>
        removerAcentos(video.title.toLowerCase()).includes(termo)
      );
      exibirVideos(tipo, filtrados);
    });
  });

  function removerAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function exibirVideos(tipo, videos) {
    const track = document.getElementById(`carousel-${tipo}`);
    track.innerHTML = '';
    if (videos.length === 0) {
      track.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }
    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'anime-music-card';
      card.innerHTML = `
        <div class="card-image">
          <img src="${video.thumbnail}" alt="${video.title}" />
          <div class="play-button" data-title="${video.title}" data-id="${video.videoId}">▶</div>
        </div>
        <div class="card-info">
          <h3 class="title">${video.title}</h3>
          <p class="anime">${tipo === 'openings' ? 'Opening' : 'Ending'}</p>
        </div>
      `;
      card.querySelector('.play-button').addEventListener('click', () => {
        const musica = video.title;
        const id = video.videoId;
        window.location.href = `letras.html?song=${encodeURIComponent(musica)}&yt=${id}`;
      });
      track.appendChild(card);
    });
  }

  async function carregarPlaylist(tipo, playlistId) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_RESULTS}&playlistId=${playlistId}&key=${API_KEY}`
      );
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        document.getElementById(`carousel-${tipo}`).innerHTML = '<p>Nenhum vídeo encontrado.</p>';
        return;
      }
      videosPorTrack[tipo] = data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
      exibirVideos(tipo, videosPorTrack[tipo]);
    } catch (err) {
      console.error(`Erro ao carregar ${tipo}:`, err);
      document.getElementById(`carousel-${tipo}`).innerHTML = '<p>Erro ao carregar vídeos.</p>';
    }
  }

  carregarPlaylist('openings', PLAYLISTS.openings);
  carregarPlaylist('endings', PLAYLISTS.endings);
});
