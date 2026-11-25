const catalogoProdutos = [
    { id: 1, codigo: "7891000100103", nome: "Arroz Tipo 1 5kg", categoria: "Mercearia", precoVarejo: 24.90, precoAtacado: 22.50 },
    { id: 2, codigo: "7891000200202", nome: "Feijão Carioca 1kg", categoria: "Mercearia", precoVarejo: 7.49, precoAtacado: 6.79 },
    { id: 3, codigo: "7891000300301", nome: "Óleo de Soja 900ml", categoria: "Mercearia", precoVarejo: 6.29, precoAtacado: 5.69 },
    { id: 4, codigo: "7891000400400", nome: "Leite Integral 1L", categoria: "Laticínios", precoVarejo: 4.89, precoAtacado: 4.39 },
    { id: 5, codigo: "7891000500509", nome: "Queijo Muçarela Fatiado 400g", categoria: "Laticínios", precoVarejo: 18.90, precoAtacado: 16.90 },
    { id: 6, codigo: "7891000600608", nome: "Refrigerante Cola 2L", categoria: "Bebidas", precoVarejo: 8.99, precoAtacado: 7.89 },
    { id: 7, codigo: "7891000700707", nome: "Suco Integral Laranja 1L", categoria: "Bebidas", precoVarejo: 11.50, precoAtacado: 9.90 },
    { id: 8, codigo: "7891000800806", nome: "Sabão em Pó 1,6kg", categoria: "Limpeza", precoVarejo: 21.90, precoAtacado: 19.40 }
];

let carrinho = [];

const listaProdutosEl = document.getElementById("listaProdutos");
const campoBuscaEl = document.getElementById("campoBusca");
const filtroCategoriaEl = document.getElementById("filtroCategoria");
const listaCarrinhoEl = document.getElementById("listaCarrinho");
const totalItensEl = document.getElementById("totalItens");
const valorTotalEl = document.getElementById("valorTotal");
const btnLimparEl = document.getElementById("btnLimpar");

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderizarCatalogo() {
    const termo = campoBuscaEl.value.trim().toLowerCase();
    const categoriaSelecionada = filtroCategoriaEl.value;

    const filtrados = catalogoProdutos.filter((produto) => {
        const correspondeTexto = produto.nome.toLowerCase().includes(termo) || produto.codigo.includes(termo);
        const correspondeCategoria = categoriaSelecionada === "Todas" || produto.categoria === categoriaSelecionada;
        return correspondeTexto && correspondeCategoria;
    });

    listaProdutosEl.innerHTML = "";

    if (filtrados.length === 0) {
        listaProdutosEl.innerHTML = "<p>Nenhum produto encontrado para os filtros informados.</p>";
        return;
    }

    filtrados.forEach((produto) => {
        const card = document.createElement("article");
        card.className = "card-produto";
        card.innerHTML = `
            <div>
                <span class="badge-categoria">${produto.categoria}</span>
                <h3>${produto.nome}</h3>
                <p class="codigo">Cód: ${produto.codigo}</p>
            </div>
            <div>
                <div class="precos">
                    <p class="preco-varejo">Varejo: ${formatarMoeda(produto.precoVarejo)}</p>
                    <p class="preco-atacado">Atacado (5+ un.): ${formatarMoeda(produto.precoAtacado)}</p>
                </div>
                <button class="btn-primario" type="button" onclick="adicionarAoCarrinho(${produto.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        listaProdutosEl.appendChild(card);
    });
}

function adicionarAoCarrinho(idProduto) {
    const itemExistente = carrinho.find((item) => item.id === idProduto);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        const produto = catalogoProdutos.find((p) => p.id === idProduto);
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
}

function removerDoCarrinho(idProduto) {
    carrinho = carrinho.filter((item) => item.id !== idProduto);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    listaCarrinhoEl.innerHTML = "";

    if (carrinho.length === 0) {
        listaCarrinhoEl.innerHTML = '<li class="vazio">Nenhum item adicionado.</li>';
        totalItensEl.textContent = "0";
        valorTotalEl.textContent = formatarMoeda(0);
        return;
    }

    let somaItens = 0;
    let somaValor = 0;

    carrinho.forEach((item) => {
        const aplicaAtacado = item.quantidade >= 5;
        const precoAplicado = aplicaAtacado ? item.precoAtacado : item.precoVarejo;
        const subtotal = precoAplicado * item.quantidade;

        somaItens += item.quantidade;
        somaValor += subtotal;

        const li = document.createElement("li");
        li.className = "item-carrinho";
        li.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                <small>${item.quantidade}x ${formatarMoeda(precoAplicado)} ${aplicaAtacado ? "(Atacado)" : ""}</small>
            </div>
            <div>
                <strong>${formatarMoeda(subtotal)}</strong>
                <button class="btn-remover" type="button" onclick="removerDoCarrinho(${item.id})">Remover</button>
            </div>
        `;
        listaCarrinhoEl.appendChild(li);
    });

    totalItensEl.textContent = somaItens;
    valorTotalEl.textContent = formatarMoeda(somaValor);
}

campoBuscaEl.addEventListener("input", renderizarCatalogo);
filtroCategoriaEl.addEventListener("change", renderizarCatalogo);
btnLimparEl.addEventListener("click", () => {
    carrinho = [];
    atualizarCarrinho();
});

renderizarCatalogo();
