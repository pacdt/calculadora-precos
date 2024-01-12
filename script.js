function calcular(event) {
    if (event.key === "Enter") {
        const fator = parseFloat(document.getElementById('fator').value);
        const preco = parseFloat(document.getElementById('preco').value);

        if (isNaN(fator)) {
            alert("É obrigatório digitar um fator de multiplicação!");
            return;
        }

        if (isNaN(preco)) {
            alert("É obrigatório digitar um preço!");
            return;
        }

        let resultado = preco * fator;

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

        document.getElementById('resultado').innerText = `Preço Final: R$ ${resultado.toFixed(2)}`;
        adicionarResultadoTabela(resultado);

        document.getElementById('preco').value = '';
        document.getElementById('preco').focus();
    }
}

let contadorProduto = 1;

function adicionarResultadoTabela(resultado) {
    const table = document.getElementById('resultTable');
    const tbody = table.getElementsByTagName('tbody')[0];

    const precoBruto = parseFloat(document.getElementById('preco').value);

    const newRow = tbody.insertRow();
    const cellProduto = newRow.insertCell(0);
    const cellPrecoUnitarioBruto = newRow.insertCell(1);
    const cellPrecoFinal = newRow.insertCell(2);

    cellProduto.textContent = contadorProduto++;
    cellPrecoUnitarioBruto.textContent = `R$ ${precoBruto.toFixed(2)}`;
    cellPrecoFinal.textContent = `R$ ${resultado.toFixed(2)}`;
}

