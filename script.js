// ...

function calcular(event) {
    if (event.key === "Enter") {
        // Obter os valores digitados
        const fator = parseFloat(document.getElementById('fator').value);
        const preco = parseFloat(document.getElementById('preco').value);

        // Verificar se o fator de multiplicação foi digitado
        if (isNaN(fator)) {
            alert("É obrigatório digitar um fator de multiplicação!");
            return;
        }

        // Verificar se o preço foi digitado
        if (isNaN(preco)) {
            alert("É obrigatório digitar um preço!");
            return;
        }

        // Calcular o preço final
        let resultado = preco * fator;

        // Arredondar conforme as regras
        const decimalPart = resultado % 1;

        if (decimalPart > 0.1 && decimalPart < 0.5) {
            resultado = Math.floor(resultado) + 0.5;
        } else if (decimalPart < 0.1) {
            resultado = Math.floor(resultado);
        } else if (decimalPart >= 0.5 && decimalPart < 0.9) {
            resultado = Math.floor(resultado) + 0.9;
        } else if (decimalPart >= 0.9) {
            resultado = Math.ceil(resultado);
        }

        // Exibir o resultado formatado em moeda BRL
        document.getElementById('resultado').innerText = `Preço Final: R$ ${resultado.toFixed(2)}`;

        // Adicionar resultado à tabela apenas se um preço foi digitado
        adicionarResultadoTabela(resultado);

        // Limpar e focar no campo de preço
        document.getElementById('preco').value = '';
        document.getElementById('preco').focus();
    }
}



function adicionarResultadoTabela(resultado) {
    const tableBody = document.getElementById('resultBody');
    
    // Criar nova linha na tabela
    const newRow = document.createElement('tr');

    // Criar célula para o número do produto
    const produtoCell = document.createElement('td');
    produtoCell.textContent = tableBody.children.length + 1;

    // Criar célula para o preço
    const precoCell = document.createElement('td');
    precoCell.textContent = `R$ ${resultado.toFixed(2)}`;

    // Adicionar células à linha
    newRow.appendChild(produtoCell);
    newRow.appendChild(precoCell);

    // Adicionar linha ao corpo da tabela
    tableBody.appendChild(newRow);
}

// ...

// Adicione ao final do seu script.js
window.onload = function () {
    // Limpar a tabela ao recarregar a página
    limparTabela();
};

function limparTabela() {
    const tableBody = document.getElementById('resultBody');
    tableBody.innerHTML = ''; // Remove todo o conteúdo do corpo da tabela
}

