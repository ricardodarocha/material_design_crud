function login(event) {
    // event.preventDefault();  

    const login = document.getElementById("login");
    const senha = document.getElementById("senha");

    const loginErro = document.getElementById("loginerro");
    const senhaErro = document.getElementById("senhaerro");

    let valido = true;

    if (login.value.trim().toLowerCase() !== "admin") {
        loginErro.classList.remove("hidden");
        valido = false;
        loginErro.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--mdc-theme-error')
            .trim();
        login.classList.add("mdc-text-field--invalid"); 
        valido = false;
    } else {
        loginErro.classList.add("hidden");
        login.classList.remove("mdc-text-field--invalid");
    }

    if (senha.value.trim().toLowerCase() !== "admin") {
        senhaErro.classList.remove("hidden");
        valido = false;
        senhaErro.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--mdc-theme-error')
            .trim();
    } else {
        senhaErro.classList.add("hidden");
        senhaErro.classList.remove("mdc-text-field--invalid");
    }

    if (!valido) {
        alerta_login();
        return false
    } else 
    {
        window.location.href = "index.html";
        return true;
    }
}

function alerta_login() {
    var dialog = document.querySelector('dialog');
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
    dialog.showModal();
}