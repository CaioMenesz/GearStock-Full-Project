document.addEventListener('DOMContentLoaded', () => {
    const formCadastroPeca = document.getElementById('formCadastroPeca');
    const feedbackMessagePeca = document.getElementById('feedbackMessagePeca');

    // Funções utilitárias para LocalStorage (READ)
    const getPecas = () => {
        const pecasJson = localStorage.getItem('gearstock_pecas');
        return pecasJson ? JSON.parse(pecasJson) : [];
    };

    // Função utilitária para LocalStorage (UPDATE/CREATE)
    const savePecas = (pecas) => {
        localStorage.setItem('gearstock_pecas', JSON.stringify(pecas));
    };

    // Simulação do AUTO_INCREMENT
    const generateUniqueId = (pecas) => {
        if (pecas.length === 0) {
            return 1;
        }
        const maxId = Math.max(...pecas.map(p => p.id_peca));
        return maxId + 1;
    };

    // Lógica principal de Cadastro (CREATE)
    const cadastrarPeca = (event) => {
        event.preventDefault();
        
        const form = event.target;
        let pecas = getPecas();
        const novoCodigo = form.codigo ? form.codigo.value.trim() : SKU-${Date.now()}; // Adiciona fallback para o código

        // 1. Validação de Código Único
        const codigoExists = pecas.some(p => p.codigo === novoCodigo);
        if (codigoExists) {
            feedbackMessagePeca.textContent = 'Erro: O Código/SKU da peça já existe.';
            feedbackMessagePeca.style.color = 'red';
            return;
        }

        // 2. Coleta e sanitização de Preços
        const precoCusto = parseFloat(form.preco_custo.value);
        const precoVenda = parseFloat(form.preco_venda.value);
        
        if (isNaN(precoCusto) || isNaN(precoVenda)) {
             feedbackMessagePeca.textContent = 'Erro: Preços de Custo e Venda devem ser números válidos.';
             feedbackMessagePeca.style.color = 'red';
             return;
        }

        // 3. Criação do novo objeto peça (Mantendo a estrutura SQL)
        const novaPeca = {
            id_peca: generateUniqueId(pecas),
            nome: form.nome.value.trim(),
            // Não incluí 'descricao' aqui, pois não está visível no protótipo, mas pode ser adicionada no HTML.
            codigo: novoCodigo, 
            categoria: form.categoria.value.trim(),
            fabricante: form.fabricante.value.trim(),
            precoCusto: precoCusto,
            precoVenda: precoVenda,
            quantidade: parseInt(form.quantidade.value),
            localizacao: form.localizacao.value.trim(),
            estoqueMinimo: parseInt(form.estoque_minimo.value),
            data_cadastro: new Date().toISOString()
        };

        // 4. Salva no LocalStorage
        pecas.push(novaPeca);
        savePecas(pecas);

        feedbackMessagePeca.textContent = Sucesso! Peça '${novaPeca.nome}' cadastrada.;
        feedbackMessagePeca.style.color = 'green';
        form.reset();
    };

    // Binding do Formulário
    if (formCadastroPeca) {
        formCadastroPeca.addEventListener('submit', cadastrarPeca);
    }
});