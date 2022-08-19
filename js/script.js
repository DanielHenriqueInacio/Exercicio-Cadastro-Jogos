const API_URL = "http://localhost:3000"
window.onload = function () {

    listarJogos()

    get("btn-cadastrar").onclick = novoJogo
    get("btn-salvar").onclick = salvarJogo
    get("btn-limpar").onclick = limpar

    addEventoDeDigitar(".campo", validarCampos)
}

function listarJogos() {
    fetch(`${API_URL}/jogos`)
        .then(response => response.json())
        .then(result => {
            let html = ""

            for (let jogo of result) {
                html += `
                        <tr>
                            <td>${jogo.id}</td>
                            <td>${jogo.nome}</td>
                            <td>${jogo.categoria}</td>
                            <td class="icones">
                                <a href="/visualizar-jogo/${jogo.id}" class="btn-visualizar" ><i class="fa-solid fa-eye"></i></a>
                                <a href="/editar-jogo/${jogo.id}" class="btn-editar"><i class="fa-solid fa-pencil"></i></a>
                                <a href="/excluir-jogo/${jogo.id}" class="btn-excluir"><i class="fa-solid fa-trash-can"></i></a>
                            </td>
                        </tr>
                        `
            }
            get("tabela-jogo").innerHTML = html;

            addEventoDeClick(".btn-visualizar", visualizar)
            addEventoDeClick(".btn-editar", editarJogo)
            addEventoDeClick(".btn-excluir", excluirJogo)

        }).catch(erro => {
        alert("O servidor está em manutenção.");
    })
}

function addEventoDeClick(cssClasse, funcao) {
    document.querySelectorAll(cssClasse).forEach(function (elem) {
        elem.addEventListener("click", function (ev) {
            ev.preventDefault();
            funcao(this)
        })
    })
}

function addEventoDeDigitar(cssClasse, funcao) {
    document.querySelectorAll(cssClasse).forEach(function (elem) {
        elem.addEventListener("keyup", function (){
            funcao(this)
        })
    })
}

function validarCampos(campo) {
    let temCampoVazio = 0;

    document.querySelectorAll(".campo").forEach(function (elem) {
        if(elem.value == "") {
            temCampoVazio++
        }
    })

    if(temCampoVazio == 0) {
        get("btn-salvar").removeAttribute("disabled");
    }else {
        get("btn-salvar").setAttribute("disabled", "disabled");
    }

}

function visualizar(item) {
    let url = item.href;
    let id = url.split("/")[4];
    carregarDadosDoJogo(id)
}

function novoJogo() {
    limparCampos();
    habilitarCampos();
}

function salvarJogo() {
    //TODO: LEMBRAR DE VALIDAR CAMPOS

    let nome = get("nome").value;
    let categoria = get("categoria").value;
    let ano_lancamento = get("ano_lancamento").value;
    let jogo_id = get("jogo_id").value;

    let url = `${API_URL}/jogos`
    let metodo = "POST"
    let msg = 'Seu jogo foi cadastrado com sucesso!'

    if (jogo_id != "") {
        url = `${API_URL}/jogos/${jogo_id}`
        metodo = "PUT"
        msg = `O jogo ${nome} foi editado com sucesso!`
    }

    const dados = {
        "nome": nome,
        "categoria": categoria,
        "ano_lancamento": ano_lancamento
    }

    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: metodo,
        body: JSON.stringify(dados)
    }

    fetch(url, options)
        .then(response => response.json())
        .then(result => {
            listarJogos()
            limparCampos()
            desabilitarCampos()

            Swal.fire(
                'Parabéns!',
                msg,
                'success'
            )
        })
}

function carregarDadosDoJogo(id) {
    fetch(`${API_URL}/jogos/${id}`)
        .then(response => response.json())
        .then(jogo => {
            get("nome").value = jogo.nome;
            get("categoria").value = jogo.categoria;
            get("ano_lancamento").value = jogo.ano_lancamento;
        })
}

function editarJogo(item) {
    let url = item.href;
    let id = url.split("/")[4];
    carregarDadosDoJogo(id)

    habilitarCampos();

    get("jogo_id").value = id;
}

function excluirJogo(item) {
    let url = item.href;
    let id = url.split("/")[4];

    Swal.fire({
        title: 'Tem Certeza?',
        text: "Se você apagar, já era!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, quero apagar!',
        cancelButtonText: 'Não, deixa quieto!'
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`${API_URL}/jogos/${id}`, {method: 'DELETE'})
                .then(response => response.json())
                .then(result => {
                    listarJogos()
                    limparCampos();
                    desabilitarCampos();
                })

            Swal.fire(
                'Já era!',
                'O jogo foi apagado com sucesso',
                'success'
            )
        }
    })

}

function limpar() {
    limparCampos()
    desabilitarCampos()
}

function limparCampos() {
    get("nome").value = "";
    get("categoria").value = "";
    get("ano_lancamento").value = "";
    get("jogo_id").value = ""
}

function habilitarCampos() {
    get("nome").removeAttribute("disabled");
    get("nome").removeAttribute("readonly");

    get("categoria").removeAttribute("disabled");
    get("categoria").removeAttribute("readonly");

    get("ano_lancamento").removeAttribute("disabled");
    get("ano_lancamento").removeAttribute("readonly");
}

function desabilitarCampos() {
    get("nome").setAttribute("disabled", "disabled");
    get("nome").setAttribute("readonly", "readonly");

    get("categoria").setAttribute("disabled", "disabled");
    get("categoria").setAttribute("readonly", "readonly");

    get("ano_lancamento").setAttribute("disabled", "disabled");
    get("ano_lancamento").setAttribute("readonly", "readonly");
}

function get(id) {
    return document.getElementById(id);
}

