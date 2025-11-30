// assets/js/registro_entrada.js

// === Funções Utilitárias para Movimentações (Locais) ===
const getMovimentacoes = () => {
    const movJson = localStorage.getItem('gearstock_movimentacoes');
    return movJson ? JSON.parse(movJson) : [];
};

const saveMovimentacoes = (movimentacoes) => {
    localStorage.setItem('gearstock_movimentacoes', JSON.stringify(movimentacoes));
};

const generateUniqueIdMov = (movimentacoes) => {
    if (movimentacoes.length === 0) return 1;
    const maxId = Math.max(...movimentacoes.map(m => m.id_movimentacao));
    return maxId + 1;
};

// === Objeto Gerenciador de Entrada ===
const RegistroEntradaManager = {

    carregarPecasNoSelect: function() {
        // Assume que getPecas() está disponível globalmente via pecas.js
        if (typeof getPecas !== 'function') return; 

        const pecas = getPecas();
        const selectPeca = document.getElementById('id_peca');
        selectPeca.innerHTML = '<option value="">-- Selecione a Peça --</option>';

        pecas.forEach(peca => {
            const option = document.createElement('option');
            option.value = peca.id_peca;
            option.textContent = `${peca.nome} (${peca.codigo})`;
            selectPeca.appendChild(option);
        });
    },

    registrar: function(event) {
        event.preventDefault();
        const form = event.target;
        const feedback = document.getElementById('feedbackMessageEntrada');

        const id_peca = parseInt(form.id_peca.value);
        const quantidadeEntrada = parseInt(form.quantidade.value);
        const observacao = form.observacao.value.trim();

        if (quantidadeEntrada <= 0 || !id_peca) {
            feedback.textContent = 'Erro: Selecione uma peça e informe uma quantidade válida.';
            feedback.style.color = 'red';
            return;
        }

        // 1. Encontrar a peça e atualizar o estoque
        let pecas = getPecas(); // Assume getPecas()
        const pecaIndex = pecas.findIndex(p => p.id_peca === id_peca);

        if (pecaIndex === -1) {
            feedback.textContent = 'Erro: Peça não encontrada no estoque.';
            feedback.style.color = 'red';
            return;
        }

        const pecaAtual = pecas[pecaIndex];
        pecaAtual.quantidade += quantidadeEntrada; // Ação de ENTRADA: Soma
        
        // 2. Criar o registro de movimentação
        const movimentacoes = getMovimentacoes();
        const novaMovimentacao = {
            id_movimentacao: generateUniqueIdMov(movimentacoes),
            dataHora: new Date().toISOString(),
            tipo: 'Entrada', // Tipo de movimentação
            quantidade: quantidadeEntrada,
            valor: pecaAtual.precoCusto * quantidadeEntrada, 
            origem: observacao, // Origem da entrada (Observação)
            destino: 'Estoque',
            fk_id_peca: id_peca,
        };

        // 3. Salvar tudo
        pecas[pecaIndex] = pecaAtual;
        savePecas(pecas); // Assume savePecas()
        
        movimentacoes.push(novaMovimentacao);
        saveMovimentacoes(movimentacoes); 

        feedback.textContent = `Entrada de ${quantidadeEntrada}x ${pecaAtual.nome} registrada com sucesso!`;
        feedback.style.color = 'green';
        form.reset();
        RegistroEntradaManager.carregarPecasNoSelect();
    },
    
    init: function() {
        const form = document.getElementById('formRegistroEntrada');
        if (form) {
            RegistroEntradaManager.carregarPecasNoSelect();
            form.addEventListener('submit', RegistroEntradaManager.registrar);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    RegistroEntradaManager.init();
});