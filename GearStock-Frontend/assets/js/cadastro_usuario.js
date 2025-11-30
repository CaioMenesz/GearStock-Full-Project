// assets/js/cadastro_usuario.js

// ==========================================================
// OBJETO DE GERENCIAMENTO DE USUÁRIOS (UsuarioManager)
// Contém todas as funções de CRUD e utilitárias para usuários.
// ==========================================================

const UsuarioManager = {
    // 1. Métodos Utilitários (Leitura e Gravação no localStorage)
    getUsuarios: function() {
        const usuariosJson = localStorage.getItem('gearstock_usuarios');
        return usuariosJson ? JSON.parse(usuariosJson) : [];
    },

    saveUsuarios: function(usuarios) {
        localStorage.setItem('gearstock_usuarios', JSON.stringify(usuarios));
    },

    generateUniqueId: function(usuarios) {
        if (usuarios.length === 0) {
            return 1;
        }
        const maxId = Math.max(...usuarios.map(u => u.id_usuario));
        return maxId + 1;
    },

    // 2. FUNÇÃO PRINCIPAL DE CADASTRO (CREATE)
    cadastrar: function(event) {
        event.preventDefault();
        
        const form = event.target;
        let usuarios = UsuarioManager.getUsuarios(); 
        const feedbackMessage = document.getElementById('feedbackMessageUsuario');
        
        // Validação de E-mail Único
        const email = form.email.value.trim();
        const emailExists = usuarios.some(u => u.email === email);
        if (emailExists) {
            feedbackMessage.textContent = 'Erro: Este e-mail já está cadastrado.';
            feedbackMessage.style.color = 'red';
            return;
        }
        
        // Criação do novo objeto usuário
        const novoUsuario = {
            id_usuario: UsuarioManager.generateUniqueId(usuarios), 
            nome: form.nome.value.trim(),
            email: email,
            senha: form.senha.value, 
            cargo: form.cargo.value.trim(),
            permissao: form.cargo.value.trim(),
        };

        // Salva no LocalStorage
        usuarios.push(novoUsuario);
        UsuarioManager.saveUsuarios(usuarios); 

        // Feedback e Limpeza
        feedbackMessage.textContent = `Sucesso! Usuário '${novoUsuario.nome}' cadastrado.`;
        feedbackMessage.style.color = 'green';
        form.reset();
    },

    // 3. Inicializador (Binding de Evento)
    init: function() {
        const formCadastroUsuario = document.getElementById('formCadastroUsuario');
        
        if (formCadastroUsuario) {
            // Anexa o método 'cadastrar' do objeto ao evento submit
            formCadastroUsuario.addEventListener('submit', UsuarioManager.cadastrar);
        }
    }
};


// ===================================
// INICIALIZAÇÃO ESPECÍFICA DA TELA
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Chamada que inicia toda a lógica de cadastro de usuário
    UsuarioManager.init();
});