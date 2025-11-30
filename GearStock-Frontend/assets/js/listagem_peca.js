// assets/js/listagem_peca.js (REVISADO)

// Nota: As funções getPecas(), savePecas(), getPecaById() devem ser definidas em assets/js/pecas.js

const ListagemPecaManager = {
    
    pecasOriginais: [],

    carregarDados: function() {
        this.pecasOriginais = getPecas();
        this.popularFiltros(this.pecasOriginais);
        this.renderizarTabela(this.pecasOriginais);
    },

    popularFiltros: function(pecas) {
        // Coleta valores únicos para Categoria e Localizacao
        const categorias = [...new Set(pecas.map(p => p.categoria).filter(c => c))];
        const localizacoes = [...new Set(pecas.map(p => p.localizacao).filter(l => l))];
        
        const selectCategoria = document.getElementById('filtroCategoria');
        const selectLocalizacao = document.getElementById('filtroLocalizacao');
        
        // Limpa e popula Categorias
        selectCategoria.innerHTML = '<option value="">Categoria</option>';
        categorias.forEach(cat => {
            selectCategoria.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        
        // Limpa e popula Localizações
        selectLocalizacao.innerHTML = '<option value="">Localização</option>';
        localizacoes.forEach(loc => {
            selectLocalizacao.innerHTML += `<option value="${loc}">${loc}</option>`;
        });
    },

    renderizarTabela: function(pecas) {
        const tbody = document.getElementById('listaPecas');
        tbody.innerHTML = ''; 
        
        const formatCurrency = (value) => {
            return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        pecas.forEach(peca => {
            const row = tbody.insertRow();
            
            // Coluna de Seleção (Radio Button)
            const cellSelect = row.insertCell();
            cellSelect.innerHTML = `<input type="radio" name="pecaSelecionada" value="${peca.id_peca}">`;
            
            // Colunas de Dados
            row.insertCell().textContent = peca.nome;
            row.insertCell().textContent = peca.codigo;
            
            // Coluna de Estoque (com alerta de mínimo)
            const cellEstoque = row.insertCell();
            cellEstoque.textContent = peca.quantidade;
            if (peca.quantidade <= peca.estoque_minimo) {
                cellEstoque.style.color = 'red'; 
                cellEstoque.style.fontWeight = 'bold';
            }

            row.insertCell().textContent = peca.categoria;
            row.insertCell().textContent = peca.localizacao;
            row.insertCell().textContent = formatCurrency(peca.precoVenda);
            
            // Listener para seleção de linha
            row.addEventListener('click', () => {
                document.querySelector(`input[value="${peca.id_peca}"]`).checked = true;
                ListagemPecaManager.atualizarBotaoEdicao();
            });
        });
    },

    filtrarPecas: function() {
        // Apenas filtros por Select são usados agora
        const filtroCategoria = document.getElementById('filtroCategoria').value;
        const filtroLocalizacao = document.getElementById('filtroLocalizacao').value;

        let pecasFiltradas = this.pecasOriginais.filter(peca => {
            
            // Filtro por Categoria
            const matchCategoria = !filtroCategoria || peca.categoria === filtroCategoria;

            // Filtro por Localização
            const matchLocalizacao = !filtroLocalizacao || peca.localizacao === filtroLocalizacao;
            
            // Retorna apenas se ambas as condições de filtro por seleção baterem
            return matchCategoria && matchLocalizacao;
        });

        this.renderizarTabela(pecasFiltradas);
    },

    atualizarBotaoEdicao: function() {
        const radioSelecionado = document.querySelector('input[name="pecaSelecionada"]:checked');
        const btnEditar = document.getElementById('btnEditarPeca');
        
        if (radioSelecionado) {
            btnEditar.disabled = false;
            const id = radioSelecionado.value;
            btnEditar.onclick = () => {
                window.location.href = `cadastro_peca.html?id=${id}`; 
            };
        } else {
            btnEditar.disabled = true;
            btnEditar.onclick = null;
        }
    },

    init: function() {
        this.carregarDados();
        
        // 1. Adicionar listeners para os filtros (apenas change nos selects)
        document.getElementById('filtroCategoria').addEventListener('change', this.filtrarPecas.bind(this));
        document.getElementById('filtroLocalizacao').addEventListener('change', this.filtrarPecas.bind(this));

        // 2. Adicionar listeners para seleção da tabela
        document.getElementById('listaPecas').addEventListener('change', this.atualizarBotaoEdicao);
        
        // 3. Inicializar o botão de edição
        this.atualizarBotaoEdicao();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { 
        ListagemPecaManager.init(); 
    }, 100); 
});