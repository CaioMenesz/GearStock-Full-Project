// assets/js/listagem_usuario.js

// === Funções Utilitárias ===
const getUsuarios = () => {
    const usuariosJson = localStorage.getItem('gearstock_usuarios');
    return usuariosJson ? JSON.parse(usuariosJson) : [];
};

// === Objeto Gerenciador de Listagem ===
const ListagemUsuarioManager = {
    
    renderizarTabela: function(usuarios) {
        const tbody = document.getElementById('listaUsuarios');
        tbody.innerHTML = ''; // Limpa a tabela
        
        usuarios.forEach(usuario => {
            const row = tbody.insertRow();
            
            // Coluna de Seleção (Radio Button)
            const cellSelect = row.insertCell();
            cellSelect.innerHTML = `<input type="radio" name="usuarioSelecionado" value="${usuario.id_usuario}">`;
            
            // Colunas de Dados (Baseado na tabela 'usuario': nome, email, cargo)
            row.insertCell().textContent = usuario.nome;
            row.insertCell().textContent = usuario.email;
            row.insertCell().textContent = usuario.cargo;
            
            // Adiciona um listener para edição ao clicar na linha
            row.addEventListener('click', () => {
                document.querySelector(`input[value="${usuario.id_usuario}"]`).checked = true;
                ListagemUsuarioManager.atualizarBotaoEdicao();
            });
        });
    },

    atualizarBotaoEdicao: function() {
        const radioSelecionado = document.querySelector('input[name="usuarioSelecionado"]:checked');
        const btnEditar = document.getElementById('btnEditarUsuario');
        
        if (radioSelecionado) {
            btnEditar.disabled = false;
            // Define o link de edição para a tela de cadastro/edição
            const id = radioSelecionado.value;
            btnEditar.onclick = () => {
                // Redireciona para a tela de edição, passando o ID do usuário
                window.location.href = `cadastro_usuario.html?id=${id}`; 
            };
        } else {
            btnEditar.disabled = true;
            btnEditar.onclick = null;
        }
    },

    init: function() {
        // 1. Carregar e Renderizar todos os usuários
        const usuarios = getUsuarios();
        ListagemUsuarioManager.renderizarTabela(usuarios);
        
        // 2. Inicializar o botão de edição
        ListagemUsuarioManager.atualizarBotaoEdicao();
        
        // 3. Adicionar listeners para seleção de linha
        document.getElementById('listaUsuarios').addEventListener('change', ListagemUsuarioManager.atualizarBotaoEdicao);
        
        // 4. Implementação futura: Popular e aplicar filtros (filtroNome, filtroCargo)
        // Isso será feito quando a funcionalidade de busca e filtragem for adicionada.
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ListagemUsuarioManager.init();
});