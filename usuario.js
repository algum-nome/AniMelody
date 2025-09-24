document.addEventListener('DOMContentLoaded', () => {
  const fotoInput = document.getElementById('uploadPic');
  const fotoDisplay = document.getElementById('profilePic');
  const nomeInput = document.getElementById('username');
  const pronomeInput = document.getElementById('pronouns');
  const bioInput = document.getElementById('bio');
  const btnSalvar = document.getElementById('salvarPerfil');

  // Carregar dados salvos
  function carregarPerfil() {
    const dados = JSON.parse(localStorage.getItem('perfilAnimeSongs'));
    if (dados) {
      if (dados.foto) fotoDisplay.src = dados.foto;
      nomeInput.value = dados.nome || '';
      pronomeInput.value = dados.pronome || '';
      bioInput.value = dados.bio || '';
    }
  }

  // Salvar dados
  btnSalvar.addEventListener('click', () => {
    const perfil = {
      nome: nomeInput.value,
      pronome: pronomeInput.value,
      bio: bioInput.value,
      foto: fotoDisplay.src
    };
    localStorage.setItem('perfilAnimeSongs', JSON.stringify(perfil));
    btnSalvar.textContent = 'Salvo!';
    btnSalvar.disabled = true;
    setTimeout(() => {
      btnSalvar.textContent = 'Salvar alterações';
      btnSalvar.disabled = false;
    }, 1500);
  });

  // Trocar foto
  fotoInput.addEventListener('change', () => {
    const file = fotoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        fotoDisplay.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  carregarPerfil();
});
