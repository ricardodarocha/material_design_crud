const banco_dados_versao = "b776f62c7743085bf6";
if (!localStorage.getItem(banco_dados_versao)) {
    localStorage.setItem(banco_dados_versao, JSON.stringify(
        []
    ));
}

var banco_dados = JSON.parse(localStorage.getItem(banco_dados_versao));
let cursor = -1;

//Begin Of File
function bof() {
    return cursor == -1;
}
//End Of File
function eof() {
    return cursor == banco_dados.length;
}

function current_record() {
    if ((banco_dados.length) == 0) {
        return {}
    } else if (eof() || bof()) {
        if (eof()) {
            return banco_dados[banco_dados.length - 1]
        } else {
            return banco_dados[0]
        }
    } else
        return banco_dados[cursor]
}

//Enumerado para representar o estado
const Status = Object.freeze({
    INSERINDO: 'inserindo',
    EDITANDO: 'editando',
    NAVEGANDO: 'navegando'
});

function formatar_modo() {
    switch (modo) {
        case Status.INSERINDO:
            return "➕ INSERINDO"
            break;
        case Status.EDITANDO:
            return "✏ EDITANDO"
            break;
        case Status.NAVEGANDO:
            return "✈ NAVEGANDO"
            break;
        default:
            "⏳"
    }
}

let modo; //inserindo, editando, navegando

//Cria uma chave em localStorage
if (!localStorage.getItem(banco_dados_versao)) {
    localStorage.setItem(banco_dados_versao, JSON.stringify(
        {
            cadastro: []

        }
    ));
}

//Decorator Design Pattern
const atualizar_storage = (fn) => {
    if (typeof fn === 'function') {
        fn(banco_dados);
    }
    localStorage.setItem(banco_dados_versao, JSON.stringify(banco_dados));
};

function habilitarStatus() {
    const info_mode = document.getElementById("info-mode");
    if (info_mode) {
        info_mode.textContent = formatar_modo(modo);
    }

    //Paginacao
    const info_recno = document.getElementById("info-recno");
    const info_record_count = document.getElementById("info-record-count");
    if (info_recno) {
        if (cursor < 0) {
            info_recno.textContent = 1; 
        } else if (cursor < banco_dados.length) {
            info_recno.textContent = cursor + 1;
        } else {
            info_recno.textContent = banco_dados.length;
        }
    }
    if (info_record_count) {
        info_record_count.textContent = "/ " + banco_dados.length;
    }
}

const habilitar_botoes = (fn) => {

    if (typeof fn === 'function') {
        fn();
    }

    console.log(`"habilitar_botoes()`);
    console.log("status " + modo);
    const botao_primeiro = document.getElementById("btn-primeiro");
    const botao_anterior = document.getElementById("btn-anterior");
    const botao_proximo = document.getElementById("btn-proximo");
    const botao_ultimo = document.getElementById("btn-ultimo");
    const svg_botao_primeiro = document.getElementById("svg-btn-primeiro");
    const svg_botao_anterior = document.getElementById("svg-btn-anterior");
    const svg_botao_proximo = document.getElementById("svg-btn-proximo");
    const svg_botao_ultimo = document.getElementById("svg-btn-ultimo");
    const botao_inserir = document.getElementById("btn-inserir");
    const botao_alterar = document.getElementById("btn-alterar");
    const botao_salvar = document.getElementById("btn-salvar");
    const btn_cancelar = document.getElementById("btn-cancelar");
    const btn_excluir = document.getElementById("btn-excluir");
    const btn_limpar = document.getElementById("btn-limpar");

    botao_primeiro.disabled = (modo != Status.NAVEGANDO) || (bof());
    botao_anterior.disabled = (modo != Status.NAVEGANDO) || (bof());
    botao_proximo.disabled = (modo != Status.NAVEGANDO) || (eof());
    botao_ultimo.disabled = (modo != Status.NAVEGANDO) || (eof());

    botao_inserir.disabled = (modo != Status.NAVEGANDO);
    botao_alterar.disabled = (modo != Status.NAVEGANDO);
    botao_salvar.disabled = (modo == Status.NAVEGANDO);
    btn_cancelar.disabled = (modo == Status.NAVEGANDO);
    btn_excluir.disabled = (modo != Status.NAVEGANDO) || banco_dados.length == 0;
    btn_limpar.disabled = (modo == Status.NAVEGANDO) ;
    
    habilitarPersonalidade((modo != Status.NAVEGANDO) && (banco_dados.length != 0));

    if (modo == Status.NAVEGANDO) {
        if (bof()) {
            svg_botao_primeiro.setAttribute("fill", "#CCCC");
            svg_botao_anterior.setAttribute("fill", "#CCCC");
        } else {
            svg_botao_primeiro.setAttribute("fill", "#1f1f1f");
            svg_botao_anterior.setAttribute("fill", "#1f1f1f");
        }

        if (eof()) {
            svg_botao_proximo.setAttribute("fill", "#CCCC");
            svg_botao_ultimo.setAttribute("fill", "#CCCC");
        } else {
            svg_botao_proximo.setAttribute("fill", "#1f1f1f");
            svg_botao_ultimo.setAttribute("fill", "#1f1f1f");
        }

    } else {
        svg_botao_primeiro.setAttribute("fill", "#CCCC");
        svg_botao_anterior.setAttribute("fill", "#CCCC");
        svg_botao_proximo.setAttribute("fill", "#CCCC");
        svg_botao_ultimo.setAttribute("fill", "#CCCC");

    }
};

//Insere um registro no final
function append(value) {
    banco_dados.push(value);
    cursor = banco_dados.length - 1;
    modo = Status.INSERINDO;
    atualizar_storage(db => db.cadastro = banco_dados);
}

//Insere um registro no início
function insert(value) {
    banco_dados.unshift(value);
    cursor = 0;
    modo = Status.INSERINDO;
    atualizar_storage(db => db.cadastro = banco_dados)
}

//Remove o registro que está sendo exibido pelo índice "cursor"
function excluir() {
    if (cursor > -1) {
        banco_dados.splice(cursor, 1);
    }
    if (cursor >= 0) {
        cursor--;
    }
    modo = Status.NAVEGANDO;
    bind();
    habilitar_edicao(false);
    habilitar_botoes();
}

//Atualiza todos os controles da tela com o item atual
function bind() {
    if (banco_dados.length == 0) {
        const formulario = document.getElementById("formulario");
        formulario.reset();
        return
    }
    
    const nome = document.getElementById("input-nome")
    if (nome ) { nome.value = current_record().nome || "" }

    const categoria = document.getElementById("input-categoria")
    if (categoria) { categoria.value = current_record().categoria || "" }

    const cor = document.getElementById("input-cor")
    if (cor) { cor.value = current_record().cor || "" }

    const tipo = document.getElementById("input-tipo")
    if (tipo) { tipo.value = current_record().tipo || "" }

    const img_foto = document.getElementById("img-foto")
    if (img_foto) { img_foto.setAttribute("src", current_record().imagem || "assets/blank.png") }
    
    setPersonalidade(current_record().personalidade)
    habilitarStatus();

}

//Inserindo um registro demonstração
function mock() {
    console.log('mock(); //Inserindo um registro de demonstração');
    acao_inserir();
    banco_dados[cursor] = { nome: "Pikachu", 
        categoria: "Pokemon", 
        cor: "Yellow", 
        personalidade: "Agitado", 
        tipo: "Camundongo",
        imagem: "assets/pikachu.png"
    }
    console.log(`cursor: ${cursor}`)
    console.log(`current: ${JSON.stringify(current_record())}`);
}

function personalidade() {
    const selectedValue = document.querySelector('input[name="personalidade-radio-group"]:checked').value;
    return selectedValue
}

function setPersonalidade(value) {
    const radio_personalidade = document.querySelectorAll('input[name="personalidade-radio-group"]');
    radio_personalidade.forEach((personalidade) => {
        personalidade.checked = personalidade.value === value;
    });
}

function habilitarPersonalidade(enable) {
    document.querySelectorAll('input[name="personalidade-radio-group"]').forEach(radio => {
        radio.disabled = !enable;
    });
}

function limpar_imagem() {
    const img_foto = document.getElementById('img-foto"]');
    img_foto.setAttribute("src", "assets/blank.png")

}

//Campos que estão sendo monitorados
function campos() {

    return ['input-nome', 'input-categoria', 'input-cor', 'input-tipo'];
}

//Captura os valores digitados pelo usuário e atualiza o objeto atual
function salvar(redirect) {

    for (c in campos()) {
        const campo = campos()[c];
        const el = document.getElementsByName(campo)[0];
        console.log("Salvando ", campo, el);
        if (el && el.value.trim() !== '') {
            const valor = el.type === 'number' ? Number(el.value) : el.value.trim();

            console.log(campo, campo.slice(6), valor, current_record()[campo.slice(6)]);
                current_record()[campo.slice(6)] = valor;
      
        }
        
        if (current_record()["personalidade"]) {
            current_record()["personalidade"] = personalidade();
            console.log(current_record()["personalidade"], personalidade())
        }

    };
    
    if (cursor < -1) {
        current_record()["id"] = 1;
    } else if (cursor < banco_dados.length) {
        current_record()["id"] = cursor + 1;
    } else {
        current_record()["id"] = banco_dados.length;
    }

    modo = Status.NAVEGANDO;
    atualizar_storage();
    habilitar_botoes();

    atualizar_storage();

    if (redirect) {
        window.location.href = redirect;
    }

}

//-------------------------
//crud
//evento botao inserir
function acao_inserir() {
    modo = Status.INSERINDO;
    habilitar_edicao();
    habilitar_botoes();
    append({id: banco_dados.length+1, nome: "", categoria: "", tipo: "", cor: "⬜ branco", personalidade: "Tranquilo", imagem: "assets/blank.png"}); //Crie um registro em branco no final do array
    bind();
}

//evento botao alterar
function acao_alterar() {
    modo = Status.EDITANDO;
    habilitar_edicao();
    habilitar_botoes();
    bind();
}

//evento botao excluir
function acao_excluir() {
    console.log(`"acao_excluir()`);
    const atual = current_record().nome ? current_record().nome : JSON.stringify(current_record());
    if (confirma(`Tem certeza que deseja excluir o elemento atual? [${atual}]`)){
        excluir()
        modo = Status.NAVEGANDO;
    }
}

//evento botao cancelar
function acao_cancelar() {
    console.log(`"acao_cancelar()`);
    if (modo == Status.INSERINDO) {
        excluir();

    } else {
        bind(); //retoma os valores originais
        modo = Status.NAVEGANDO;

        habilitarStatus();
    }
    habilitar_botoes();
    habilitar_edicao(false);
    habilitarStatus();
}

//evento botao salvar
function acao_salvar() {
    console.log(`"acao_salvar()`);
    salvar();
    habilitar_edicao(false);
    bind();
}

//-------------------------
//Navegacao
//evento botao first
function acao_primeiro() {
    console.log(`"acao_primeiro()`);
    cursor = -1;
    atualizarTela();
}
//evento botao prior
function acao_anterior() {
    console.log(`"acao_anterior()`);
    if (cursor >= banco_dados.length -1) {
        cursor = banco_dados.length - 2
    } 
    else if (cursor >= 0) {
        cursor--;
    }
    atualizarTela();
}
//evento botao next
function acao_proximo() {
    console.log(`"acao_proximo()`);
    if (cursor == -1) {
        cursor = 0;
    }
    
    if (cursor < banco_dados.length - 1) {
        cursor++;
    } else
    {
        cursor = banco_dados.length;
    }
    atualizarTela();
}

//evento botao last
function acao_ultimo() {
    console.log(`"acao_ultimo()`);
    cursor = banco_dados.length - 1;

    if (cursor == banco_dados.length - 1)  {
        cursor = banco_dados.length;
    }
    atualizarTela();
}

//--------------------------
//utilitários
function safeCursor() {
    if (cursor < 0) {
        return 0
    } else if (cursor >= banco_dados.length) {
        return banco_dados.length-1
    } else
    {
        return cursor
    }
}

function atualizarTela() {
    const url = new URL(window.location.href);
    url.searchParams.set('id', safeCursor() + 1);  

    history.pushState({}, '', url);  
    console.log(`Localizado o registro: ${url.toString()}`);


    habilitar_edicao(false);
    habilitar_botoes();
    bind();
}

function verificarParametros() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id !== null) {
        const idInt = parseInt(id, 10);

        if (!isNaN(idInt) && Number.isInteger(idInt) && idInt >= 0 && idInt <= banco_dados.length) {
            console.log(`ID válido encontrado: ${idInt}`);
            cursor = idInt - 1;
            atualizarTela();

        } else {
            console.warn(`ID inválido ou fora do intervalo: ${id}`);
        }
    }
}
function configurarInputImagem() {
    const input = document.getElementById('upload')
    const fileReader = new FileReader()

    fileReader.onloadend = () => {
        let base64 = fileReader.result
            // .replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        let img = base64;
        document.getElementById("img-foto").setAttribute('src', img);        
        current_record().imagem = img;
        atualizar_storage();
        showDialog("A imagem foi salva");
    }
    input.addEventListener('change', () => {
        fileReader.readAsDataURL(input.files[0])
    })

    document.addEventListener('DOMContentLoaded', function () {
        const div = document.getElementById('drag-area');
        div.addEventListener('click', function () {
            input.click();
        });
    });

    const okButton = document.getElementById('okButton');
    const countdownLabel = document.getElementById('countdownLabel');
    let countdown = 3;
    countdownLabel.textContent = `Fechando em ${countdown}...`;
    countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownLabel.textContent = `Fechando em ${countdown}...`;
        } else {
            countdownLabel.textContent = `Fechando em 1 s`;
        }
    },500);

    okButton.onclick = () => {
        clearTimeout(autoClose);
        clearInterval(countdownInterval);
        dialog.open = false;
    };
}

function share() {
    document.getElementById('shareBtn').addEventListener('click', async () => {
        const imgSrc = document.getElementById('img-foto').src;
        const title = current_record().nome;
        const pageUrl = window.location.href;

        if (navigator.canShare && navigator.canShare({ files: [] })) {
           
            try {
                const response = await fetch(imgElement.src);
                const blob = await response.blob();
                const file = new File([blob], 'imagem-compartilhada.jpg', { type: blob.type });

                await navigator.share({
                    title: title,
                    text: `Que fofo ${title}`,
                    files: [file]
                });

                console.log('Imagem compartilhada com sucesso!');

                return;
            } catch (error) {
                console.error('Erro ao compartilhar:', error);
                alert('Não foi possível compartilhar a imagem.');
            }       
        }

        const encodedTitle = encodeURIComponent(title);
        const encodedImg = encodeURIComponent(imgSrc);
        const encodedUrl = encodeURIComponent(pageUrl);

        const shareLinks = {
            // facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedImg}&quote=${encodedTitle}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedImg}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedImg}`,
            telegram: `https://t.me/share/url?url=${encodedImg}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedImg}`
        };

        const links = Object.entries(shareLinks)
            .map(([name, url]) => `
                <a href="${url}" class="botao-compartilhar" target="_blank" rel="noopener noreferrer">
                ${name.charAt(0).toUpperCase() + name.slice(1)}
                </a>
            `)
                        .join('<br>');

                    const win = window.open('', '_blank', 'width=400,height=450');
                    win.document.write(`
            <html>
                <head>
                <title>Compartilhar</title>
                <link rel="stylesheet" href="estilo.css">
                <link href="https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap" rel="stylesheet">
                </head>
                <body class="compartilhar-container">
                <h3 class="compartilhar-titulo">Compartilhar em:</h3>
                ${links}
                </body>
            </html>
            `);
    });
    }

    function showDialog(message) {
        const dialog = document.getElementById('messageDialog');
        const msgDiv = document.getElementById('msgDialog');

       msgDiv.textContent = message;
        dialog.open = true;

    
    setTimeout(() => {
        dialog.open = false;
    }, 1200);
        
        dialog.onclick = () => {
        clearTimeout(autoClose);  
        dialog.open = false;      
    };
  }

function habilitar_edicao(value = true) {
    console.log(`"habilitar_edicao(${value})`);
    for (campo in campos()) {
        const el = document.getElementById(campos()[campo]);
        console.log(campo, el);
        if (el) {
            el.disabled = !value;
        }
        
        habilitarPersonalidade(value);
    }


    console.log(banco_dados)
}

function confirma(message) {
    let resultado = window.confirm(message);
    console.log(`"${message}" retornou ${ resultado? "Sim": "Não" }`);
    return resultado
}
if (banco_dados.length == 0) {
    mock();
} else {
    console.log(modo);
    modo = Status.NAVEGANDO;
    habilitar_botoes();
    habilitar_edicao(false);
    habilitarStatus;
}

configurarInputImagem();
verificarParametros();
bind();
share();

