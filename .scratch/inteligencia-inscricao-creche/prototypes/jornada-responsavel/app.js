// PROTÓTIPO DESCARTÁVEL: três variantes da jornada, alternáveis por ?variant=.
// A pergunta é estrutural. Nenhuma ação abaixo persiste dados ou integra sistemas reais.

const VARIANTS = [
  { key: "A", name: "Passo a passo" },
  { key: "B", name: "Central da candidatura" },
  { key: "C", name: "Mapa como ponto de partida" },
];

const STAGES = [
  { id: "cadastro", label: "Cadastro", short: "Dados" },
  { id: "opcoes", label: "Escolha das unidades", short: "Opções" },
  { id: "espera", label: "Acompanhamento", short: "Acompanhar" },
  { id: "oferta", label: "Oferta disponível", short: "Oferta" },
  { id: "reativacao", label: "Reativação", short: "Reativar" },
  { id: "matricula", label: "Matrícula em andamento", short: "Matrícula" },
];

const STAGE_STATE = {
  cadastro: {
    canonical: "Cadastro em andamento",
    summary: "dados da Criança em edição · nenhuma Oferta",
  },
  opcoes: {
    canonical: "Cadastro em andamento",
    summary: "3 Opções de Unidade ordenadas · critérios aguardam comprovação",
  },
  espera: {
    canonical: "Aguardando vaga",
    summary: "3 opções ativas · nenhuma Oferta",
  },
  oferta: {
    canonical: "Oferta disponível",
    summary: "1 reserva ativa · demais opções suspensas",
  },
  reativacao: {
    canonical: "Aguardando vaga",
    summary: "2 opções reativadas · 1 opção recusada",
  },
  matricula: {
    canonical: "Matrícula em andamento",
    summary: "interesse confirmado · documentos pendentes",
  },
};

const UNITS = [
  {
    id: "01004",
    name: "CP Creche Cantinho Feliz de Santa Teresa",
    address: "Rua Almirante Alexandrino, 2235 · Santa Teresa",
    distance: "1,2 km",
    travel: "9 min a pé",
    shift: "Integral",
  },
  {
    id: "01005",
    name: "CP Casa Maternal Coração de Mãe",
    address: "Rua da Conceição, 1 · Rio Comprido",
    distance: "2,8 km",
    travel: "18 min de ônibus",
    shift: "Integral",
  },
  {
    id: "0101801",
    name: "EDI Parque da Alegria",
    address: "Rua Paraíso, s/nº · São Cristóvão",
    distance: "4,9 km",
    travel: "31 min de ônibus",
    shift: "Parcial",
  },
  {
    id: "01006",
    name: "CP Creche do Tuiuti",
    address: "Rua São Luiz Gonzaga, 1612 · São Cristóvão",
    distance: "5,4 km",
    travel: "34 min de ônibus",
    shift: "Integral",
  },
  {
    id: "0101602",
    name: "CM Virgínia Lemos",
    address: "Rua Paraíso, 17 · São Cristóvão",
    distance: "5,1 km",
    travel: "32 min de ônibus",
    shift: "Parcial",
  },
  {
    id: "0101802",
    name: "EDI Machado de Assis",
    address: "Rua da América, 81 · Santo Cristo",
    distance: "4,6 km",
    travel: "29 min de ônibus",
    shift: "Integral",
  },
];

const model = {
  optionOrder: [0, 1, 2],
  offeredUnit: 1,
  selectedUnit: 0,
  contact: "(21) 9••••-4821",
};

const app = document.querySelector("#app");
const stageSelect = document.querySelector("#stage-select");
const stateSummary = document.querySelector("#state-summary");
const variantLabel = document.querySelector("#variant-label");
const toast = document.querySelector("#toast");
const dialog = document.querySelector("#prototype-dialog");

function readRoute() {
  const params = new URLSearchParams(window.location.search);
  const variant = VARIANTS.some((item) => item.key === params.get("variant"))
    ? params.get("variant")
    : "A";
  const stage = STAGES.some((item) => item.id === params.get("stage"))
    ? params.get("stage")
    : "cadastro";
  return { variant, stage };
}

function writeRoute(changes) {
  const current = readRoute();
  const next = { ...current, ...changes };
  const params = new URLSearchParams(window.location.search);
  params.set("variant", next.variant);
  params.set("stage", next.stage);
  window.history.replaceState({}, "", `?${params.toString()}`);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function productStages(stage) {
  const outcome = stage === "reativacao"
    ? STAGES.find((item) => item.id === "reativacao")
    : STAGES.find((item) => item.id === "matricula");
  return [
    STAGES.find((item) => item.id === "cadastro"),
    STAGES.find((item) => item.id === "opcoes"),
    STAGES.find((item) => item.id === "espera"),
    STAGES.find((item) => item.id === "oferta"),
    outcome,
  ];
}

function offeredUnitIndex() {
  if (!model.optionOrder.includes(model.offeredUnit)) {
    model.offeredUnit = model.optionOrder[1] ?? model.optionOrder[0] ?? 1;
  }
  return model.offeredUnit;
}

function offeredUnit() {
  return UNITS[offeredUnitIndex()];
}

function offerRank() {
  return model.optionOrder.indexOf(offeredUnitIndex()) + 1;
}

function stageNavigation(stage, className, numbered = false) {
  const visibleStages = productStages(stage);
  const activeIndex = visibleStages.findIndex((item) => item.id === stage);
  return `
    <nav class="${className}" aria-label="Momentos da jornada" style="--step-count: ${visibleStages.length}">
      ${visibleStages.map((item, index) => {
        const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "";
        const label = numbered ? `<span>${index + 1}</span> ${item.short}` : item.short;
        return `
          <button
            type="button"
            class="${state}"
            data-stage="${item.id}"
            ${index === activeIndex ? 'aria-current="step"' : ""}
          >${label}</button>
        `;
      }).join("")}
    </nav>
  `;
}

function brand(light = false) {
  return `
    <div class="brand">
      <span class="brand-mark">RIO</span>
      <span>Vaga Carioca${light ? "" : " · Creche"}</span>
    </div>
  `;
}

function sourceNote() {
  return `
    <div class="source-note">
      <span class="source-chip observed">Catálogo observado</span>
      <span>Nomes e endereços das unidades</span>
      <span class="source-chip demo">Dado demonstrativo</span>
      <span>Criança, rotas, disponibilidade e eventos</span>
    </div>
  `;
}

function mapMarkup(options = {}) {
  const selected = options.selected ?? model.selectedUnit;
  const inactiveOffer = Boolean(options.inactiveOffer);
  return `
    <span class="map-road one"></span>
    <span class="map-road two"></span>
    <span class="map-label" style="top: 13%; left: 52%">Santa Teresa</span>
    <span class="map-label" style="top: 68%; left: 52%">Rio Comprido</span>
    <button class="map-marker home marker-home" type="button" aria-label="Endereço informado">
      <span>⌂</span>
    </button>
    ${UNITS.map((unit, index) => {
      const optionPosition = model.optionOrder.indexOf(index);
      const classes = [
        "map-marker",
        `marker-${index + 1}`,
        optionPosition >= 0 ? "chosen" : "suggestion",
        selected === index ? "selected" : "",
        inactiveOffer && index === offeredUnitIndex() ? "inactive" : "",
      ].filter(Boolean).join(" ");
      return `
        <button
          class="${classes}"
          type="button"
          data-unit="${index}"
          aria-label="${unit.name}"
        ><span>${optionPosition >= 0 ? optionPosition + 1 : "+"}</span></button>
      `;
    }).join("")}
  `;
}

function optionCards(options = {}) {
  const controls = Boolean(options.controls);
  const excludedOffer = Boolean(options.excludedOffer);
  const order = excludedOffer
    ? model.optionOrder.filter((unitIndex) => unitIndex !== offeredUnitIndex())
    : model.optionOrder;

  if (order.length === 0) {
    return `<div class="empty-list">Nenhuma unidade escolhida ainda. Use a busca ou adicione uma sugestão.</div>`;
  }

  return `
    <div class="unit-list">
      ${order.map((unitIndex, position) => {
        const unit = UNITS[unitIndex];
        return `
          <article class="unit-card ${model.selectedUnit === unitIndex ? "is-selected" : ""}" data-unit="${unitIndex}">
            <span class="unit-rank">${excludedOffer ? model.optionOrder.indexOf(unitIndex) + 1 : position + 1}ª</span>
            <div>
              <h3>${unit.name}</h3>
              <p>${unit.address}</p>
              <p><strong>${unit.distance}</strong> · ${unit.travel} · ${unit.shift}</p>
            </div>
            ${controls ? `
              <div class="order-buttons" aria-label="Alterar esta opção">
                <button type="button" data-move="up" data-position="${position}" aria-label="Subir opção">↑</button>
                <button type="button" data-move="down" data-position="${position}" aria-label="Descer opção">↓</button>
                <button type="button" data-remove-unit="${unitIndex}" aria-label="Remover opção">×</button>
              </div>
            ` : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function searchAllUnits() {
  return `
    <div class="unit-search">
      <input aria-label="Buscar em todas as unidades" placeholder="Nome da unidade, bairro ou endereço" />
      <button class="button" type="button" data-action="search">Buscar todas</button>
    </div>
    <p class="muted micro">A busca percorre todas as unidades participantes do processo, não apenas as sugestões ou as mais próximas.</p>
  `;
}

function suggestionCards() {
  const reasons = {
    3: "Sugestão por turno Integral declarado",
    4: "Sugestão por trajeto semelhante",
    5: "Sugestão por combinação de turno e deslocamento",
  };
  const available = [3, 4, 5].filter((unitIndex) => !model.optionOrder.includes(unitIndex));

  if (available.length === 0) {
    return `<div class="empty-list">Todas as sugestões demonstrativas já estão na sua lista. Você ainda pode buscar qualquer outra unidade.</div>`;
  }

  return `
    <div class="unit-list suggestion-list">
      ${available.map((unitIndex) => {
        const unit = UNITS[unitIndex];
        return `
          <article class="unit-card suggestion-card" data-unit="${unitIndex}">
            <span class="suggestion-mark">✦</span>
            <div>
              <h3>${unit.name}</h3>
              <p>${unit.address}</p>
              <p><strong>${reasons[unitIndex]}</strong></p>
              <p>${unit.distance} · ${unit.travel} · ${unit.shift}</p>
            </div>
            <button class="button secondary" type="button" data-add-unit="${unitIndex}">Adicionar</button>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function processTimeline(stage) {
  const visibleStages = productStages(stage);
  const active = visibleStages.findIndex((item) => item.id === stage);
  return `
    <ol class="timeline">
      ${visibleStages.map((item, index) => {
        const state = index < active ? "done" : index === active ? "active" : "";
        const detail = {
          cadastro: "Dados pessoais e critérios",
          opcoes: "Até cinco preferências ordenadas",
          espera: "Participação nas filas das unidades",
          oferta: "Uma única vaga reservada",
          reativacao: "Retorno das opções restantes",
          matricula: "Confirmação presencial pela unidade",
        }[item.id];
        return `<li class="${state}"><strong>${item.label}</strong>${detail}</li>`;
      }).join("")}
    </ol>
  `;
}

function contactCard() {
  return `
    <div class="b-card">
      <div class="b-card-header">
        <div>
          <p class="eyebrow">Contato preferencial</p>
          <h3>WhatsApp ${model.contact}</h3>
          <p class="muted small">Verificado · avisos também na caixa de entrada</p>
        </div>
      </div>
      <button class="plain-link" type="button" data-action="update-contact">Atualizar contato</button>
    </div>
  `;
}

function aAside(stage) {
  const content = {
    cadastro: [
      "Por que pedimos isso?",
      "Os dados identificam a Criança e definem quais critérios precisam de comprovação. Pontos só entram após validação.",
    ],
    opcoes: [
      "Como funciona a ordem?",
      "O sistema tenta primeiro sua 1ª opção. Se não houver vaga, segue para a próxima sem reduzir sua prioridade dentro de cada unidade.",
    ],
    espera: [
      "Nada fica escondido",
      "Você acompanha um único estado da Candidatura. Cada opção mostra se está ativa, suspensa ou encerrada.",
    ],
    oferta: [
      "Oferta não é Matrícula",
      "Responder “Tenho interesse” registra sua intenção e inicia os próximos passos. A unidade ainda precisa efetivar a Matrícula.",
    ],
    reativacao: [
      "Você não começa de novo",
      "A opção recusada sai, mas as demais voltam às filas com a mesma Pontuação de Prioridade.",
    ],
    matricula: [
      "Última etapa",
      "A Direção da Unidade confere os documentos e efetiva a Matrícula. Pendências permitidas ficam visíveis.",
    ],
  }[stage];

  return `
    <aside class="a-aside">
      <p class="eyebrow">Entenda</p>
      <h3>${content[0]}</h3>
      <p>${content[1]}</p>
      <hr style="border:0;border-top:1px solid #e6e1d8;margin:18px 0" />
      <h3>Sempre disponível</h3>
      <ul>
        <li>Ajuda em linguagem simples</li>
        <li>Salvar e continuar depois</li>
        <li>Dados e regras identificados</li>
      </ul>
    </aside>
  `;
}

function renderAContent(stage) {
  if (stage === "cadastro") {
    return `
      <section class="a-card">
        <p class="eyebrow">Etapa 1 de 4 · cerca de 4 minutos</p>
        <h1>Vamos começar pela Criança</h1>
        <p class="muted">Você poderá salvar e continuar depois. Os campos abaixo usam um perfil demonstrativo.</p>
        <div class="completion-bar" aria-label="66% desta etapa concluída"><span></span></div>
        <div class="field-grid">
          <label class="field">Nome da Criança<input value="Luna A. (demonstração)" /></label>
          <label class="field">Data de nascimento<input type="date" value="2024-03-12" /></label>
          <label class="field">Bairro<input value="Santa Teresa" /></label>
          <label class="field">CEP<input inputmode="numeric" value="20241-263" /></label>
        </div>
        <div class="notice" style="margin-top:18px">
          No próximo passo, explicaremos cada critério socioeconômico e quais documentos podem comprová-lo.
        </div>
        ${sourceNote()}
        <div class="button-row mobile-primary-actions" style="margin-top:24px">
          <button class="button" type="button" data-next="opcoes">Continuar para critérios e opções →</button>
          <button class="button ghost" type="button" data-action="save">Salvar e sair</button>
        </div>
      </section>
    `;
  }

  if (stage === "opcoes") {
    return `
      <section class="a-card">
        <p class="eyebrow">Etapa 3 de 4 · escolha até cinco</p>
        <h1>Quais unidades funcionam para vocês?</h1>
        <p class="muted">As recomendações são só sugestões. Você pode buscar e escolher quaisquer cinco unidades participantes, depois definir a ordem de preferência.</p>
        ${searchAllUnits()}
        <div class="a-split">
          <div>
            <div class="list-heading">
              <div><p class="eyebrow">Escolhidas por você</p><h3>Sua lista</h3></div>
              <span class="choice-counter">${model.optionOrder.length} de 5</span>
            </div>
            ${optionCards({ controls: true })}
            <div class="list-heading suggestions-heading">
              <div><p class="eyebrow">Opcional</p><h3>Sugestões para conhecer</h3></div>
            </div>
            <p class="muted micro">Nenhuma sugestão entra na Candidatura até você tocar em “Adicionar”.</p>
            ${suggestionCards()}
          </div>
          <div class="mini-map" aria-label="Mapa demonstrativo das opções">
            ${mapMarkup()}
          </div>
        </div>
        <div class="notice" style="margin-top:16px"><strong>Você está no controle:</strong> proximidade, turno e mapa ajudam a comparar, mas não escondem unidades, não fazem escolhas e não alteram sua ordem.</div>
        ${sourceNote()}
        <div class="button-row mobile-primary-actions" style="margin-top:22px">
          <button class="button" type="button" data-next="espera">Confirmar esta ordem →</button>
          <button class="button ghost" type="button" data-action="compare">Comparar detalhes</button>
        </div>
      </section>
    `;
  }

  if (stage === "espera") {
    return `
      <section class="a-card">
        <span class="status-chip waiting">Aguardando vaga</span>
        <h1 style="margin-top:14px">A candidatura de Luna está ativa</h1>
        <p class="muted">Você não precisa refazer o cadastro. Avisaremos quando houver uma Oferta ou alguma ação necessária.</p>
        <div class="a-split">
          <div>
            <div class="notice success">
              <strong>${model.optionOrder.length} opções participando das filas</strong><br />
              Última atualização demonstrativa: hoje, 10h42.
            </div>
            <h3 style="margin-top:22px">Suas preferências</h3>
            ${optionCards()}
          </div>
          <div>
            <h3>Andamento</h3>
            ${processTimeline(stage)}
          </div>
        </div>
        <div class="button-row mobile-primary-actions" style="margin-top:20px">
          <button class="button secondary" type="button" data-action="update-contact">Atualizar contato</button>
          <button class="button ghost" type="button" data-stage="opcoes">Editar preferências</button>
          <button class="plain-link" type="button" data-stage="oferta">Simular chegada de Oferta →</button>
        </div>
      </section>
    `;
  }

  if (stage === "oferta") {
    return `
      <section class="a-card">
        <div class="offer-summary">
          <p class="eyebrow">Uma vaga foi reservada para Luna</p>
          <h1>${offeredUnit().name}</h1>
          <p class="muted">${offeredUnit().shift} · ${offeredUnit().address} · sua ${offerRank()}ª preferência</p>
          <span class="countdown">Responda em 1 dia e 18 horas · evento demonstrativo</span>
          <div class="button-row mobile-primary-actions">
            <button class="button" type="button" data-action="interest">Tenho interesse</button>
            <button class="button secondary" type="button" data-action="explain">Por que recebi esta Oferta?</button>
          </div>
        </div>
        <div class="a-split" style="margin-top:18px">
          <div>
            <h3>Antes de responder</h3>
            <div class="check-row"><span class="check-icon">✓</span><div><strong>Confira a unidade</strong><p class="muted small">${offeredUnit().address}</p></div></div>
            <div class="check-row"><span class="check-icon">✓</span><div><strong>Veja os documentos</strong><p class="muted small">Identidade do Responsável e documentos da Criança.</p></div></div>
            <div class="check-row"><span class="check-icon pending">!</span><div><strong>Compareça após confirmar</strong><p class="muted small">“Tenho interesse” ainda não efetiva a Matrícula.</p></div></div>
          </div>
          <div class="mini-map" style="min-height:190px" aria-label="Mapa demonstrativo da unidade">
            ${mapMarkup({ selected: 1 })}
          </div>
        </div>
        <div class="button-row mobile-primary-actions" style="margin-top:22px">
          <button class="button danger-ghost" type="button" data-action="decline">Não tenho interesse</button>
          <button class="button ghost" type="button" data-action="extend">Preciso de mais prazo</button>
          <button class="plain-link" type="button" data-action="help">Preciso de ajuda</button>
        </div>
      </section>
    `;
  }

  if (stage === "reativacao") {
    return `
      <section class="a-card">
        <span class="status-chip success">Candidatura reativada</span>
        <h1 style="margin-top:14px">Luna continua participando</h1>
        <p class="muted">A recusa da Casa Maternal foi registrada. As opções restantes voltaram às filas com a mesma prioridade.</p>
        <div class="notice success">
          <strong>Você não precisa fazer um novo cadastro.</strong> A unidade recusada não aparecerá novamente nesta Candidatura.
        </div>
        <h3 style="margin-top:22px">Opções reativadas</h3>
        ${optionCards({ excludedOffer: true })}
        <div class="button-row mobile-primary-actions" style="margin-top:22px">
          <button class="button" type="button" data-action="reaffirm">Confirmar que continuo interessada</button>
          <button class="button ghost" type="button" data-stage="opcoes">Revisar opções</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="a-card">
      <span class="status-chip success">Interesse confirmado</span>
      <h1 style="margin-top:14px">Agora, finalize com a unidade</h1>
      <p class="muted">Sua intenção foi registrada. A Matrícula só termina após a conferência e a efetivação pela Direção da Unidade.</p>
      <div class="a-split">
        <div>
          <h3>Checklist</h3>
          <div class="check-row"><span class="check-icon">✓</span><div><strong>Interesse respondido</strong><p class="muted small">Hoje, 11h08 · evento demonstrativo</p></div></div>
          <div class="check-row"><span class="check-icon pending">!</span><div><strong>Comparecimento à unidade</strong><p class="muted small">Até terça-feira, 16h.</p></div></div>
          <div class="check-row"><span class="check-icon pending">!</span><div><strong>Conferência dos documentos</strong><p class="muted small">Responsabilidade da Direção da Unidade.</p></div></div>
        </div>
        <div class="notice">
          <strong>${offeredUnit().name}</strong><br />
          ${offeredUnit().address}<br /><br />
          <button class="plain-link" type="button" data-action="route">Ver como chegar</button>
        </div>
      </div>
      <div class="button-row mobile-primary-actions" style="margin-top:22px">
        <button class="button secondary" type="button" data-action="documents">Ver documentos necessários</button>
        <button class="button ghost" type="button" data-action="help">Falar com a unidade</button>
      </div>
    </section>
  `;
}

function variantA(stage) {
  return `
    <div class="variant-a">
      <header class="product-header">
        ${brand()}
        <div class="header-actions"><span>Ajuda</span><span>Minhas mensagens</span><span class="avatar">MA</span></div>
      </header>
      ${stageNavigation(stage, "a-stepper")}
      <div class="a-main">
        ${renderAContent(stage)}
        ${aAside(stage)}
      </div>
    </div>
  `;
}

function bPrimary(stage) {
  if (stage === "cadastro") {
    return `
      <section class="b-card">
        <div class="b-card-header"><div><p class="eyebrow">Próxima ação</p><h2>Complete os dados da Criança</h2><p class="muted small">2 de 3 blocos concluídos</p></div><span class="tag">4 min</span></div>
        <div class="task-card"><span class="task-icon">✓</span><div><strong>Responsável e contato</strong><p class="muted small">WhatsApp verificado</p></div><button class="button ghost" type="button">Revisar</button></div>
        <div class="task-card" style="margin-top:10px"><span class="task-icon">2</span><div><strong>Dados da Criança</strong><p class="muted small">Nascimento e endereço</p></div><button class="button" type="button" data-next="opcoes">Continuar</button></div>
        <div class="task-card" style="margin-top:10px"><span class="task-icon">3</span><div><strong>Critérios e comprovação</strong><p class="muted small">Ainda não iniciado</p></div><span class="tag">Depois</span></div>
      </section>
    `;
  }

  if (stage === "opcoes") {
    return `
      <section class="b-card">
        <div class="b-card-header"><div><p class="eyebrow">Escolhidas por você · ${model.optionOrder.length} de 5</p><h2>Compare e defina sua ordem</h2><p class="muted small">Sugestões não limitam a busca e nunca são adicionadas automaticamente.</p></div><button class="button" type="button" data-next="espera">Confirmar ordem</button></div>
        ${searchAllUnits()}
        <div class="table-scroll" role="region" aria-label="Comparação das unidades escolhidas" tabindex="0">
          <table class="comparison-table">
            <thead><tr><th>Ordem</th><th>Unidade</th><th>Deslocamento</th><th>Turno</th><th></th></tr></thead>
            <tbody>
              ${model.optionOrder.map((unitIndex, position) => {
                const unit = UNITS[unitIndex];
                return `<tr><td><strong>${position + 1}ª</strong></td><td>${unit.name}<br /><span class="muted">${unit.address}</span></td><td>${unit.distance}<br /><span class="muted">${unit.travel}</span></td><td>${unit.shift}</td><td><button class="plain-link" type="button" data-remove-unit="${unitIndex}">Remover</button></td></tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
        <div class="list-heading suggestions-heading"><div><p class="eyebrow">Opcional</p><h3>Sugestões para conhecer</h3></div></div>
        <p class="muted micro">São atalhos explicados; você também pode ignorá-los e usar somente a busca.</p>
        ${suggestionCards()}
        ${sourceNote()}
      </section>
    `;
  }

  if (stage === "espera") {
    return `
      <section class="b-card">
        <div class="b-card-header"><div><p class="eyebrow">Resumo atual</p><h2>Sua candidatura está participando</h2><p class="muted small">Última atualização demonstrativa: hoje, 10h42</p></div><span class="status-chip waiting">Aguardando vaga</span></div>
        <div class="metric-row">
          <div class="metric"><strong>${model.optionOrder.length}</strong><span>opções ativas</span></div>
          <div class="metric"><strong>0</strong><span>Ofertas ativas</span></div>
          <div class="metric"><strong>✓</strong><span>contato verificado</span></div>
        </div>
        <h3 style="margin-top:20px">Opções em acompanhamento</h3>
        ${optionCards()}
        <div class="button-row mobile-primary-actions" style="margin-top:18px">
          <button class="button ghost" type="button" data-stage="opcoes">Editar preferências</button>
          <button class="plain-link" type="button" data-stage="oferta">Simular Oferta →</button>
        </div>
      </section>
    `;
  }

  if (stage === "oferta") {
    return `
      <section class="offer-summary">
        <p class="eyebrow">Ação prioritária</p>
        <h2>Uma vaga está reservada para Luna</h2>
        <p>${offeredUnit().name} · ${offeredUnit().shift} · ${offerRank()}ª preferência</p>
        <span class="countdown">1 dia e 18 horas para responder · demonstração</span>
        <div class="button-row mobile-primary-actions">
          <button class="button" type="button" data-action="interest">Tenho interesse</button>
          <button class="button secondary" type="button" data-action="explain">Entender a Oferta</button>
          <button class="button secondary" type="button" data-action="decline">Recusar</button>
        </div>
      </section>
      <section class="b-card">
        <div class="b-card-header"><div><h3>Atividade de contato</h3><p class="muted small">Notificação não é o mesmo que contato estabelecido.</p></div><span class="source-chip demo">Simulado</span></div>
        <div class="check-row"><span class="check-icon">✓</span><div><strong>Notificação enviada</strong><p class="muted small">Hoje, 9h12 · caixa de entrada e WhatsApp</p></div></div>
        <div class="check-row"><span class="check-icon pending">!</span><div><strong>Aguardando sua ação</strong><p class="muted small">Abrir a página sozinho não confirma contato.</p></div></div>
      </section>
    `;
  }

  if (stage === "reativacao") {
    return `
      <section class="b-card">
        <div class="b-card-header"><div><p class="eyebrow">Mudança registrada</p><h2>A candidatura voltou às opções restantes</h2><p class="muted small">A prioridade foi preservada.</p></div><span class="status-chip success">Reativada</span></div>
        <div class="notice success"><strong>Nenhum novo cadastro é necessário.</strong> A opção recusada foi retirada desta Candidatura.</div>
        <h3 style="margin-top:20px">${Math.max(model.optionOrder.length - 1, 0)} opções ativas</h3>
        ${optionCards({ excludedOffer: true })}
        <div class="button-row mobile-primary-actions" style="margin-top:18px"><button class="button" type="button" data-action="reaffirm">Reafirmar interesse</button><button class="button ghost" type="button" data-stage="opcoes">Revisar opções</button></div>
      </section>
    `;
  }

  return `
    <section class="b-card">
      <div class="b-card-header"><div><p class="eyebrow">Próxima ação</p><h2>Compareça à unidade</h2><p class="muted small">Interesse registrado; Matrícula ainda não efetivada.</p></div><span class="status-chip success">Em andamento</span></div>
      <div class="task-card"><span class="task-icon">✓</span><div><strong>Interesse confirmado</strong><p class="muted small">Hoje, 11h08 · demonstração</p></div><span class="tag">Concluído</span></div>
      <div class="task-card" style="margin-top:10px"><span class="task-icon">!</span><div><strong>Leve os documentos</strong><p class="muted small">${offeredUnit().name} · até terça, 16h</p></div><button class="button" type="button" data-action="documents">Ver lista</button></div>
    </section>
  `;
}

function variantB(stage) {
  const title = {
    cadastro: "Complete sua candidatura",
    opcoes: "Defina suas preferências",
    espera: "Tudo certo por enquanto",
    oferta: "Você tem uma Oferta",
    reativacao: "Sua candidatura continua",
    matricula: "Finalize a Matrícula",
  }[stage];

  return `
    <div class="variant-b">
      <div class="b-shell">
        <aside class="b-sidebar">
          ${brand(true)}
          <div class="b-child"><strong>Luna A.</strong><span>Candidatura demonstrativa · Maternal</span></div>
          ${stageNavigation(stage, "b-nav", true)}
        </aside>
        <div class="b-main">
          <header class="b-topbar"><strong>Minha candidatura</strong><div class="header-actions"><span>Ajuda</span><span>Mensagens</span><span class="avatar">MA</span></div></header>
          <div class="b-content">
            <div class="b-status-head">
              <div><p class="eyebrow">Luna A. · processo demonstrativo 2026</p><h1>${title}</h1><p class="muted">Estado: <strong>${STAGE_STATE[stage].canonical}</strong></p></div>
            </div>
            <div class="b-dashboard">
              <div>${bPrimary(stage)}</div>
              <aside>
                <section class="b-card"><div class="b-card-header"><div><h3>Jornada completa</h3><p class="muted small">Um único estado para a Candidatura.</p></div></div>${processTimeline(stage)}</section>
                ${contactCard()}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function cPanel(stage) {
  if (stage === "cadastro") {
    return `
      <p class="eyebrow">Comece pelo lugar que importa</p>
      <h1>Onde vocês estão?</h1>
      <p class="muted">O endereço prepara o mapa. Depois pediremos os dados da Criança e os critérios necessários.</p>
      <label class="field">Endereço ou CEP<input value="20241-263 · Santa Teresa" /></label>
      <div class="route-card" style="margin-top:14px"><span class="route-icon">⌂</span><div><strong>Local encontrado</strong><p class="muted small">Santa Teresa · endereço demonstrativo</p></div></div>
      <div class="notice" style="margin-top:16px">A proximidade ajuda você a comparar, mas não altera a Pontuação de Prioridade.</div>
      <div class="button-row mobile-primary-actions" style="margin-top:20px"><button class="button" type="button" data-next="opcoes">Explorar todas as unidades →</button><button class="button ghost" type="button">Preencher sem mapa</button></div>
      ${sourceNote()}
    `;
  }

  if (stage === "opcoes") {
    return `
      <p class="eyebrow">Sua lista · ${model.optionOrder.length} de 5</p>
      <h1>Monte sua lista</h1>
      <p class="muted">O mapa abre com sugestões, mas você pode buscar qualquer unidade participante. Só entra na lista o que você adicionar.</p>
      ${searchAllUnits()}
      <div class="filter-row"><button class="active" type="button">Todas</button><button type="button" data-action="filter">Integral</button><button type="button" data-action="filter">Até 30 min</button></div>
      <div class="list-heading"><h3>Escolhidas por você</h3><span class="choice-counter">${model.optionOrder.length} de 5</span></div>
      ${optionCards({ controls: true })}
      <div class="list-heading suggestions-heading"><div><p class="eyebrow">Opcional</p><h3>Sugestões para conhecer</h3></div></div>
      ${suggestionCards()}
      <div class="button-row mobile-primary-actions" style="margin-top:18px"><button class="button" type="button" data-next="espera">Confirmar lista →</button><button class="button ghost" type="button" data-action="compare">Comparar</button></div>
    `;
  }

  if (stage === "espera") {
    return `
      <span class="status-chip waiting">Aguardando vaga</span>
      <h1 style="margin-top:13px">${model.optionOrder.length} opções continuam ativas</h1>
      <p class="muted">Os pontos numerados correspondem à ordem das suas preferências.</p>
      ${optionCards()}
      <div class="notice success" style="margin-top:14px"><strong>Nenhuma ação necessária.</strong> Avisaremos pelos canais verificados quando houver mudança.</div>
      <div class="button-row mobile-primary-actions" style="margin-top:18px"><button class="button secondary" type="button" data-action="update-contact">Atualizar contato</button><button class="plain-link" type="button" data-stage="oferta">Simular Oferta →</button></div>
    `;
  }

  if (stage === "oferta") {
    return `
      <span class="status-chip offer">Oferta disponível</span>
      <h1 style="margin-top:13px">Uma vaga perto da sua rota</h1>
      <p class="muted">${offeredUnit().name} · sua ${offerRank()}ª preferência</p>
      <div class="route-card"><span class="route-icon">→</span><div><strong>${offeredUnit().travel}</strong><p class="muted small">${offeredUnit().address}</p></div></div>
      <div class="notice warning" style="margin-top:14px"><strong>1 dia e 18 horas para responder</strong><br />Prazo e evento demonstrativos.</div>
      <button class="plain-link" style="margin:15px 0" type="button" data-action="explain">Entenda por que esta Oferta chegou para você</button>
      <div class="button-row mobile-primary-actions"><button class="button" type="button" data-action="interest">Tenho interesse</button><button class="button danger-ghost" type="button" data-action="decline">Não tenho interesse</button><button class="button ghost" type="button" data-action="help">Preciso de ajuda</button></div>
    `;
  }

  if (stage === "reativacao") {
    return `
      <span class="status-chip success">Opções reativadas</span>
      <h1 style="margin-top:13px">Sua busca continua</h1>
      <p class="muted">O ponto cinza foi recusado. As outras ${Math.max(model.optionOrder.length - 1, 0)} opções voltaram às filas com a mesma prioridade.</p>
      ${optionCards({ excludedOffer: true })}
      <div class="notice success" style="margin-top:14px"><strong>Sem novo cadastro.</strong> Você pode manter ou revisar as opções restantes.</div>
      <div class="button-row mobile-primary-actions" style="margin-top:18px"><button class="button" type="button" data-action="reaffirm">Continuar interessada</button><button class="button ghost" type="button" data-stage="opcoes">Revisar mapa</button></div>
    `;
  }

  return `
    <span class="status-chip success">Matrícula em andamento</span>
    <h1 style="margin-top:13px">Seu próximo destino</h1>
    <p class="muted">A unidade está a ${offeredUnit().travel}. Leve os documentos até terça-feira, 16h.</p>
    <div class="route-card"><span class="route-icon">→</span><div><strong>${offeredUnit().name}</strong><p class="muted small">${offeredUnit().address}</p></div></div>
    <div class="check-row"><span class="check-icon">✓</span><div><strong>Interesse confirmado</strong><p class="muted small">Evento demonstrativo</p></div></div>
    <div class="check-row"><span class="check-icon pending">!</span><div><strong>Comparecer e apresentar documentos</strong><p class="muted small">A unidade efetiva a Matrícula.</p></div></div>
    <div class="button-row mobile-primary-actions" style="margin-top:18px"><button class="button" type="button" data-action="route">Iniciar rota</button><button class="button ghost" type="button" data-action="documents">Ver documentos</button></div>
  `;
}

function variantC(stage) {
  const selected = stage === "oferta" || stage === "matricula" ? offeredUnitIndex() : model.selectedUnit;
  return `
    <div class="variant-c">
      <header class="c-header">
        ${brand(true)}
        ${stageNavigation(stage, "c-journey")}
        <div class="header-actions"><span>Ajuda</span><span class="avatar">MA</span></div>
      </header>
      <div class="c-workspace">
        <section class="large-map" aria-label="Mapa demonstrativo das unidades">
          <div class="map-search"><input aria-label="Buscar em todas as unidades" placeholder="Nome, bairro ou endereço" /><button type="button" data-action="search">Buscar todas</button></div>
          ${mapMarkup({ selected, inactiveOffer: stage === "reativacao" })}
          <div class="map-legend"><strong>⌂ Seu endereço</strong><span>● Escolhida por você</span><span>＋ Sugestão</span><span>Distâncias demonstrativas</span></div>
        </section>
        <aside class="c-panel">${cPanel(stage)}</aside>
      </div>
    </div>
  `;
}

function render() {
  const route = readRoute();
  stageSelect.value = route.stage;
  const state = STAGE_STATE[route.stage];
  let summary = state.summary;
  if (route.stage === "opcoes") summary = `${model.optionOrder.length} Opções de Unidade escolhidas · limite de 5`;
  if (route.stage === "espera") summary = `${model.optionOrder.length} opções ativas · nenhuma Oferta`;
  if (route.stage === "reativacao") summary = `${Math.max(model.optionOrder.length - 1, 0)} opções reativadas · 1 opção recusada`;
  stateSummary.innerHTML = `<strong>Estado exposto:</strong> ${state.canonical} · ${summary}`;
  const variant = VARIANTS.find((item) => item.key === route.variant);
  variantLabel.textContent = `${variant.key} · ${variant.name}`;
  app.innerHTML = route.variant === "A"
    ? variantA(route.stage)
    : route.variant === "B"
      ? variantB(route.stage)
      : variantC(route.stage);
}

function cycleVariant(direction) {
  const current = readRoute();
  const index = VARIANTS.findIndex((item) => item.key === current.variant);
  const nextIndex = (index + direction + VARIANTS.length) % VARIANTS.length;
  writeRoute({ variant: VARIANTS[nextIndex].key });
}

let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function showDialog(content) {
  dialog.innerHTML = content;
  dialog.showModal();
}

function showExplanation() {
  showDialog(`
    <div class="dialog-body">
      <p class="eyebrow">Explicação da Oferta</p>
      <h2>Por que esta unidade?</h2>
      <p>Esta era a <strong>${offerRank()}ª opção</strong> da Candidatura. No Snapshot demonstrativo, as preferências anteriores não tinham capacidade disponível quando chegou a vez de Luna.</p>
      <div class="notice">
        Dentro desta unidade, a ordem respeitou os critérios comprovados, os desempates e a capacidade do Cenário. A distância não alterou a posição.
      </div>
      <p class="small muted" style="margin-top:16px">Conjunto de Regras: 2026-demo-01 · Rodada: R-014 · 30/08/2026, 9h00.</p>
      <span class="source-chip demo">Resultado simulado — não é uma alocação oficial</span>
    </div>
    <div class="dialog-actions"><button class="button" type="button" data-close-dialog>Entendi</button></div>
  `);
}

function showContactForm() {
  showDialog(`
    <form id="contact-form">
      <div class="dialog-body">
        <p class="eyebrow">Vale para toda a Candidatura</p>
        <h2>Atualizar contato</h2>
        <p class="muted small">O novo canal precisará ser verificado antes de entrar no protocolo de Convocação.</p>
        <label class="field">WhatsApp<input name="contact" inputmode="tel" value="(21) 98888-4821" required /></label>
        <label class="field" style="margin-top:12px">Canal preferencial<select><option>WhatsApp</option><option>SMS</option><option>Telefone</option><option>E-mail</option></select></label>
      </div>
      <div class="dialog-actions"><button class="button ghost" type="button" data-close-dialog>Cancelar</button><button class="button" type="submit">Salvar e verificar</button></div>
    </form>
  `);
}

function showUnitCatalog() {
  showDialog(`
    <div class="dialog-body">
      <p class="eyebrow">Busca em todas as unidades participantes</p>
      <h2>Escolha livremente</h2>
      <p class="muted small">Esta janela usa seis registros do catálogo como amostra. No produto, a busca não fica limitada às sugestões, ao bairro ou à distância.</p>
      <div class="unit-list" style="margin-top:16px">
        ${UNITS.map((unit, unitIndex) => {
          const chosen = model.optionOrder.includes(unitIndex);
          return `
            <article class="unit-card">
              <span class="unit-rank">${chosen ? model.optionOrder.indexOf(unitIndex) + 1 : "+"}</span>
              <div><h3>${unit.name}</h3><p>${unit.address}</p><p>${unit.shift} · ${unit.travel}</p></div>
              ${chosen
                ? '<span class="status-chip success">Na sua lista</span>'
                : `<button class="button secondary" type="button" data-add-unit="${unitIndex}">Adicionar</button>`}
            </article>
          `;
        }).join("")}
      </div>
    </div>
    <div class="dialog-actions"><button class="button ghost" type="button" data-close-dialog>Fechar</button></div>
  `);
}

function showDocuments() {
  showDialog(`
    <div class="dialog-body">
      <p class="eyebrow">Checklist demonstrativo</p>
      <h2>Documentos para levar</h2>
      <div class="check-row"><span class="check-icon">1</span><div><strong>Documento do Responsável</strong><p class="muted small">Original com foto.</p></div></div>
      <div class="check-row"><span class="check-icon">2</span><div><strong>Documentos da Criança</strong><p class="muted small">Certidão e comprovantes solicitados.</p></div></div>
      <div class="check-row"><span class="check-icon">3</span><div><strong>Comprovações aplicáveis</strong><p class="muted small">A lista final depende dos critérios declarados e da regra vigente.</p></div></div>
    </div>
    <div class="dialog-actions"><button class="button" type="button" data-close-dialog>Fechar</button></div>
  `);
}

document.querySelector("#previous-variant").addEventListener("click", () => cycleVariant(-1));
document.querySelector("#next-variant").addEventListener("click", () => cycleVariant(1));
stageSelect.addEventListener("change", (event) => writeRoute({ stage: event.target.value }));

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target.matches("input, textarea, select, [contenteditable='true']");
  if (isTyping) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
});

document.addEventListener("click", (event) => {
  const stageButton = event.target.closest("[data-stage]");
  if (stageButton) {
    writeRoute({ stage: stageButton.dataset.stage });
    return;
  }

  const nextButton = event.target.closest("[data-next]");
  if (nextButton) {
    writeRoute({ stage: nextButton.dataset.next });
    return;
  }

  const addUnitButton = event.target.closest("[data-add-unit]");
  if (addUnitButton) {
    const unitIndex = Number(addUnitButton.dataset.addUnit);
    if (model.optionOrder.length >= 5) {
      showToast("Sua lista já tem cinco unidades. Remova uma para adicionar outra.");
      return;
    }
    if (!model.optionOrder.includes(unitIndex)) {
      model.optionOrder.push(unitIndex);
      model.selectedUnit = unitIndex;
      if (dialog.open) dialog.close();
      render();
      showToast("Unidade adicionada por você à sua lista.");
    }
    return;
  }

  const removeUnitButton = event.target.closest("[data-remove-unit]");
  if (removeUnitButton) {
    if (model.optionOrder.length <= 1) {
      showToast("Mantenha pelo menos uma unidade na Candidatura.");
      return;
    }
    const unitIndex = Number(removeUnitButton.dataset.removeUnit);
    model.optionOrder = model.optionOrder.filter((item) => item !== unitIndex);
    if (model.offeredUnit === unitIndex) model.offeredUnit = model.optionOrder[1] ?? model.optionOrder[0];
    if (model.selectedUnit === unitIndex) model.selectedUnit = model.optionOrder[0];
    render();
    showToast("Unidade removida por você. As sugestões continuam opcionais.");
    return;
  }

  const unitButton = event.target.closest("[data-unit]");
  if (unitButton && !event.target.closest("[data-move]")) {
    model.selectedUnit = Number(unitButton.dataset.unit);
    render();
    return;
  }

  const moveButton = event.target.closest("[data-move]");
  if (moveButton) {
    const position = Number(moveButton.dataset.position);
    const targetPosition = moveButton.dataset.move === "up" ? position - 1 : position + 1;
    if (targetPosition >= 0 && targetPosition < model.optionOrder.length) {
      [model.optionOrder[position], model.optionOrder[targetPosition]] = [
        model.optionOrder[targetPosition],
        model.optionOrder[position],
      ];
      render();
      showToast("Ordem atualizada apenas neste protótipo.");
    }
    return;
  }

  if (event.target.closest("[data-close-dialog]")) {
    dialog.close();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "interest") {
    writeRoute({ stage: "matricula" });
    showToast("Interesse registrado. Isso ainda não é a Matrícula.");
  } else if (action === "decline") {
    writeRoute({ stage: "reativacao" });
    showToast("Oferta recusada; as opções restantes foram reativadas.");
  } else if (action === "explain") {
    showExplanation();
  } else if (action === "update-contact") {
    showContactForm();
  } else if (action === "documents") {
    showDocuments();
  } else if (action === "extend") {
    showToast("Solicitação de extensão aberta. A Oferta não expira enquanto a decisão está pendente.");
  } else if (action === "help") {
    showToast("Pedido de ajuda registrado para a Direção da Unidade.");
  } else if (action === "reaffirm") {
    showToast("Interesse reafirmado nas duas opções restantes.");
  } else if (action === "save") {
    showToast("Progresso salvo somente na memória deste protótipo.");
  } else if (action === "compare") {
    showToast("Comparação aberta: turno, deslocamento e ordem de preferência.");
  } else if (action === "route") {
    showToast("A rota é demonstrativa e abriria o aplicativo de mapas do celular.");
  } else if (action === "filter") {
    showToast("Filtro aplicado apenas para explorar esta hipótese de interface.");
  } else if (action === "search") {
    showUnitCatalog();
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "contact-form") return;
  event.preventDefault();
  model.contact = "(21) 9••••-4821";
  dialog.close();
  render();
  showToast("Contato salvo; falta concluir a verificação do canal.");
});

window.addEventListener("popstate", render);
render();
