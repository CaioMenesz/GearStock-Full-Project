// assets/js/registro_saida.js

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

// === Objeto Gerenciador de Saída ===
const RegistroSaidaManager = {

    carregarPecasNoSelect: function() {
        // Assume que getPecas() está disponível globalmente via pecas.js
        if (typeof getPecas !== 'function') return;

        const pecas = getPecas();
        const selectPeca = document.getElementById('id_peca');
        selectPeca.innerHTML = '<option value="">-- Selecione a Peça --</option>';

        pecas.forEach(peca => {
            const option = document.createElement('option');
            option.value = peca.id_peca;
            option.textContent = `${peca.nome} (${peca.codigo}) - Estoque: ${peca.quantidade}`;
            selectPeca.appendChild(option);
        });
    },

    registrar: function(event) {
        event.preventDefault();
        const form = event.target;
        const feedback = document.getElementById('feedbackMessageSaida');

        const id_peca = parseInt(form.id_peca.value);
        const quantidadeSaida = parseInt(form.quantidade.value);
        const observacao = form.observacao.value.trim();

        if (quantidadeSaida <= 0 || !id_peca) {
            feedback.textContent = 'Erro: Selecione uma peça e informe uma quantidade válida.';
            feedback.style.color = 'red';
            return;
        }

        // 1. Encontrar a peça e validar/atualizar o estoque
        let pecas = getPecas(); // Assume getPecas()
        const pecaIndex = pecas.findIndex(p => p.id_peca === id_peca);

        if (pecaIndex === -1) {
            feedback.textContent = 'Erro: Peça não encontrada no estoque.';
            feedback.style.color = 'red';
            return;
        }

        const pecaAtual = pecas[pecaIndex];
        
        // VALIDAÇÃO: Estoque Suficiente
        if (pecaAtual.quantidade < quantidadeSaida) {
            feedback.textContent = `Erro: Estoque insuficiente. Apenas ${pecaAtual.quantidade} disponíveis.`;
            feedback.style.color = 'orange';
            return;
        }
        
        pecaAtual.quantidade -= quantidadeSaida; // Ação de SAÍDA: Subtrai
        
        // 2. Criar o registro de movimentação
        const movimentacoes = getMovimentacoes();
        const novaMovimentacao = {
            id_movimentacao: generateUniqueIdMov(movimentacoes),
            dataHora: new Date().toISOString(),
            tipo: 'Saída', // Tipo de movimentação
            quantidade: quantidadeSaida,
            // Usamos o preço de venda para valorizar a saída (venda), conforme a estrutura SQL
            valor: pecaAtual.precoVenda * quantidadeSaida, 
            origem: 'Estoque',
            destino: observacao, // Destino da saída (Observação)
            fk_id_peca: id_peca,
        };

        // 3. Salvar tudo
        pecas[pecaIndex] = pecaAtual;
        savePecas(pecas); // Assume savePecas()
        
        movimentacoes.push(novaMovimentacao);
        saveMovimentacoes(movimentacoes); 

        feedback.textContent = `Saída de ${quantidadeSaida}x ${pecaAtual.nome} registrada com sucesso!`;
        feedback.style.color = 'green';
        form.reset();
        RegistroSaidaManager.carregarPecasNoSelect();
    },
    
    init: function() {
        const form = document.getElementById('formRegistroSaida');
        if (form) {
            RegistroSaidaManager.carregarPecasNoSelect();
            form.addEventListener('submit', RegistroSaidaManager.registrar);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    RegistroSaidaManager.init();
});