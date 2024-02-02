let nomeArquivoHTML = ''

// Função principal para gerar preços
function gerarPrecos() {
    const htmlInput = document.getElementById('htmlInput');
    const fatorInput = document.getElementById('fator'); // Adicionado para obter o campo do fator

    const file = htmlInput.files[0];
    const fatorMultiplicacao = fatorInput.value.trim(); // Obtendo o valor do fator de multiplicação
    
    nomeArquivoHTML = file.name;
    document.getElementById('nomeArquivo').innerText = `${nomeArquivoHTML}`;

    if (!file || fatorMultiplicacao === '') {
        alert("Selecione um arquivo HTML e informe o Fator de Multiplicação!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const htmlText = e.target.result;

        // Renderizar a tabela e realizar as tarefas adicionais
        processarTabela(htmlText, fatorMultiplicacao);
    };

    reader.readAsText(file, 'UTF-8'); // Adicionado parâmetro para especificar a codificação
}


// Função para processar a tabela
function processarTabela(htmlText) {
    console.log('Iniciando processamento da tabela...');

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Obter a tabela original
    const tabelaOriginal = doc.querySelector('table:nth-of-type(2)');

    if (!tabelaOriginal) {
        console.error('Tabela original não encontrada.');
        return;
    }

    // 1. Remover colunas e linhas da tabela
    console.log('Removendo colunas e linhas da tabela...');
    const colunasRemover = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
    const linhasRemover = [1, 2, 3, 4];
    removerColunasLinhas(tabelaOriginal, colunasRemover, linhasRemover);

    // 2-4. Armazenar dados das colunas em objetos
    const numeroProduto = extrairValoresColuna(tabelaOriginal, 1, 'Produto');
    console.log(numeroProduto)
    const descricaoProduto = extrairValoresColuna(tabelaOriginal, 2, 'Produto');
    console.log(descricaoProduto)
    const valorLiquidoUnitario = extrairValoresColuna(tabelaOriginal, 3, 'Produto');
    console.log(valorLiquidoUnitario)

    // 5. Calcular preço de venda e armazenar em um objeto
    console.log('Calculando o preço de venda...');
    const fatorMultiplicacao = parseFloat(document.getElementById('fator').value) || 1;
    const precoVenda = calcularPrecoVenda(valorLiquidoUnitario, fatorMultiplicacao);

    // 6. Renderizar os objetos no console
    console.log('Objeto numeroProduto:', numeroProduto);
    console.log('Objeto descricaoProduto:', descricaoProduto);
    console.log('Objeto valorLiquidoUnitario:', valorLiquidoUnitario);
    console.log('Objeto precoVenda:', precoVenda);

    // 7. Criar uma nova tabela com os dados dos objetos
    console.log('Criando uma nova tabela com os dados dos objetos...');
    criarNovaTabela(numeroProduto, descricaoProduto, valorLiquidoUnitario, precoVenda);

    console.log('Processamento concluído.');
}

// Função para extrair valores de uma coluna e armazenar em um objeto
function extrairValoresColuna(tabela, indiceColuna, prefixoChave) {
    const linhas = tabela.getElementsByTagName('tr');
    const valoresObjeto = {};

    for (let i = 0; i < linhas.length; i++) {
        const celulas = linhas[i].getElementsByTagName('td');
        const valorCelula = celulas[indiceColuna - 1]?.innerText.trim();

        // Armazenar valor na propriedade correspondente do objeto
        valoresObjeto[`${prefixoChave}${i + 1}`] = valorCelula;
    }

    return valoresObjeto;
}



// Função para calcular o preço de venda com arredondamento personalizado e formatar em Real BRL
function calcularPrecoVenda(valorLiquidoUnitario, fatorMultiplicacao) {
    const precoVenda = {};

    for (const produto in valorLiquidoUnitario) {
        const valor = parseFloat(valorLiquidoUnitario[produto].replace(',', '.')) || 0;
        const fator = parseFloat(String(fatorMultiplicacao).replace(',', '.')) || 1;
        let valorCalculado = valor * fator;

        // Arredondamento personalizado
        let fracao = valorCalculado % 1;
        if (fracao < 0.1) {
            valorCalculado = Math.floor(valorCalculado);
        } else if (fracao >= 0.1 && fracao < 0.5) {
            valorCalculado = Math.floor(valorCalculado) + 0.5;
        } else if (fracao >= 0.5 && fracao < 0.9) {
            valorCalculado = Math.floor(valorCalculado) + 0.9;
        } else {
            valorCalculado = Math.ceil(valorCalculado);
        }

        // Formatando em Real BRL
        precoVenda[produto] = valorCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return precoVenda;
}




// Função para criar uma nova tabela com os dados dos objetos
function criarNovaTabela(numeroProduto, descricaoProduto, valorLiquidoUnitario, precoVenda) {
    const tabelaNova = document.createElement('table');
    tabelaNova.style.width = '100%';
    tabelaNova.style.borderCollapse = 'collapse';
    tabelaNova.style.marginTop = '20px';

    // Adicionar cabeçalho
    const cabecalho = tabelaNova.createTHead();
    const linhaCabecalho = cabecalho.insertRow();

    const colunas = ['Número do Produto', 'Descrição', 'Valor Unitário Líquido', 'Preço de Venda'];

    colunas.forEach((coluna) => {
        const celula = linhaCabecalho.insertCell();
        celula.textContent = coluna;
    });

    // Adicionar dados
    const corpoTabela = tabelaNova.createTBody();

    for (const chave in numeroProduto) {
        const linha = corpoTabela.insertRow();

        const celulaNumeroProduto = linha.insertCell();
        celulaNumeroProduto.textContent = numeroProduto[chave];

        const celulaDescricaoProduto = linha.insertCell();
        celulaDescricaoProduto.textContent = descricaoProduto[chave];

        const celulaValorLiquido = linha.insertCell();
        celulaValorLiquido.textContent = valorLiquidoUnitario[chave];

        const celulaPrecoVenda = linha.insertCell();
        celulaPrecoVenda.textContent = precoVenda[chave];
    }

    // Adicionar a nova tabela ao documento
    const tabelaContainer = document.getElementById('tabelaContainer');
    tabelaContainer.innerHTML = '';
    tabelaContainer.appendChild(tabelaNova);
}


// Função auxiliar para remover colunas e linhas de uma tabela
function removerColunasLinhas(tabela, colunasRemover, linhasRemover) {
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = linhasRemover.length - 1; i >= 0; i--) {
        const indiceLinha = linhasRemover[i];
        const indiceRealLinha = indiceLinha - 1;

        if (linhas[indiceRealLinha]) {
            linhas[indiceRealLinha].remove();
        }
    }

    for (let i = 0; i < linhas.length; i++) {
        const celulas = linhas[i].getElementsByTagName('td');

        for (let j = colunasRemover.length - 1; j >= 0; j--) {
            const indiceColuna = colunasRemover[j];
            const indiceRealColuna = indiceColuna - 1;

            if (celulas[indiceRealColuna]) {
                celulas[indiceRealColuna].remove();
            }
        }
    }
}

// Função auxiliar para armazenar valores de uma coluna em um objeto
function armazenarValoresColuna(tabela, indiceColuna, objeto) {
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const celulas = linhas[i].getElementsByTagName('td');
        const valorCelula = celulas[indiceColuna - 1]?.innerText.trim();

        // Armazenar valor na propriedade correspondente do objeto
        objeto[`Produto${i + 1}`] = valorCelula;
    }
}

function imprimirPagina() {
    // Verifica se há uma tabela gerada
    const tabelaGerada = document.getElementById('tabelaContainer').querySelector('table');
    
    if (tabelaGerada) {
        window.print();
    } else {
        alert("Você precisa gerar uma tabela antes de imprimir.");
    }
}
