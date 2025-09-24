function handleCredentialResponse(response) {
    console.log("Token JWT:", response.credential);

    window.location.href = "index.html";
}
window.onload = function () {
    google.accounts.id.initialize({
        client_id: '466063609095-ma4escsjs2gpjte2actu65t658ojchqs.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large' }
    );
};

function validarLogin(event) {
      event.preventDefault();

      var usuario = document.getElementById("usuario").value;
      var senha = document.getElementById("senha").value;

      if (usuario === "projeto@gmail.com" && senha === "1234senha") {
        window.location.href = "index.html";
      }
      else if (usuario === "fish@gmail.com" && senha === "1234spin") {
        window.location.href = "https://www.youtube.com/watch?v=jpO2zd9zbng&t=3s";
      } else {
        alert("Usuário ou senha inválidos!");
      }
    }