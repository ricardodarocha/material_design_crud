const banco_dados_versao = "b776f62c7743085bf6";
if (!localStorage.getItem(banco_dados_versao)) {
    localStorage.setItem(banco_dados_versao, JSON.stringify(
        []
    ));
}

var banco_dados = JSON.parse(localStorage.getItem(banco_dados_versao));

function renderGaleria() {
    const container = document.getElementById('galeria-imagens');
    container.innerHTML = '';  

    if (banco_dados.length == 0) {
        const cardHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; color: #757575;">
            <span class="material-icons" style="font-size: 64px; color: #BDBDBD;">
                photo_library
            </span>
            <h2 style="margin-top: 16px; font-weight: 500;">Ainda não há nenhum pet</h2>
            <p style="max-width: 300px; margin: 8px 0 24px;">
                Cadastre seu primeiro pet
            </p>
            <a href="index.html">
                <button class="mdc-button mdc-button--raised">
                    <span class="mdc-button__label">Cadastrar</span>
                </button>
            </a>
        </div> `;
        container.insertAdjacentHTML('beforeend', cardHTML);
        return;
    }

    banco_dados.forEach(record => {
        const cardHTML = `
        <div class="mdc-card">
          <div class="mdc-card__media" style="background-image: url('${record.imagem}');"></div>
          <div class="mdc-card__primary-action" tabindex="0">
             <a class="mdc-card__primary-action" href='index.html?id=${record.id}' tabindex="0">
                <div class="mdc-card__ripple"></div>
                <div class="mdc-typography--subtitle1" style="padding: 16px;">${record.nome || "Sem descrição"}</div>
            </a>
            
          </div>
          <div class="mdc-card__actions">
            <div class="mdc-card__action-icons">
              <button class="material-icons mdc-icon-button" title="Compartilhar">share</button>
              <button class="material-icons mdc-icon-button" title="Mais opções">more_vert</button>
            </div>
          </div>
        </div>
      `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    mdc.autoInit();
}
document.addEventListener('DOMContentLoaded', renderGaleria);