function login() {
    const dados = {
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };

    fetch("http://localhost:8081/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(r => r.json())
    .then(res => {
        console.log(res);
        alert("Login funcionando!");
    });
}