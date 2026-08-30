# Invariantes normativas e operacionais — acesso à creche SME-Rio

Pesquisa encerrada em 30 de agosto de 2026. A fonte normativa de referência para o ciclo de matrícula de 2026 é a Resolução SME nº 542, de 18 de novembro de 2025. O índice oficial de resoluções de 2026 consultado nesta data não apresenta ato que mencione alteração dessa resolução, matrícula ou creche; isso registra o alcance da busca, não substitui validação da assessoria jurídica e da área gestora da SME. Os materiais do hackathon descrevem a operação e suas dores, mas não prevalecem quando divergem da norma.

## Conclusão executiva

O produto pode melhorar planejamento, matching e convocação, mas precisa tratar as regras como configuração versionada por ciclo, e não como uma fórmula universal. Para 2026, o núcleo que deve permanecer invariável é:

- uma candidatura por criança, com até cinco opções ordenadas;
- prioridade por pontuação comprovada, seguida dos desempates oficiais; a ordem de inscrição não conta;
- nenhuma regra territorial geral criada pelo produto; distância pode orientar a família ou compor cenários, sem substituir a regra oficial, ressalvadas prioridades legais de proximidade que a SME ainda precisa traduzir em algoritmo;
- uma única convocação ativa por candidatura e fechamento coerente das demais opções quando a primeira unidade convoca;
- dois relógios distintos: três dias consecutivos de tentativas de contato e, após contato estabelecido, dois dias úteis para comparecimento, prorrogáveis justificadamente por até um dia útil;
- atualização de contato, ordem da fila, tentativas, justificativas e decisões registradas de forma auditável;
- lista consultável durante o ano, com separação entre transparência pública e dados pessoais protegidos;
- confirmação da matrícula não pode ser impedida apenas pela falta momentânea de documentos: há até 30 dias para completar a documentação.

Esses pontos favorecem o modelo já escolhido para o protótipo: uma `Candidatura` canônica alimenta a jornada do Responsável e o cockpit da Rede/Unidade. O sistema deve apoiar e registrar decisões; não deve inventar elegibilidade, reordenar a fila por IA opaca nem excluir automaticamente uma criança por distância.

## Matriz de regras e impactos

| Área | Regra aplicável ao ciclo 2026 | Fonte primária | Impacto/limite para o produto |
|---|---|---|---|
| Escopo e idade | Creche atende crianças de 6 meses completos até 31/03/2026 a 3 anos e 11 meses completos até essa data, incluindo crianças com deficiência. | [R542], Anexo I, art. 5º | O ciclo, a data-base e o grupamento precisam ser parametrizados; não inferir elegibilidade apenas pelo ano-mês anonimizado da base histórica. |
| Identificação | CPF é obrigatório na inscrição; são pedidos CPF da criança e de uma filiação/responsável. Matrículas ativas simultâneas da mesma criança são vedadas. | [R542], Anexo I, arts. 1º, §§1º–3º, e 6º, §1º | A identidade da candidatura deve ser a criança, não o CPF do responsável. Um responsável pode representar mais de uma criança. |
| Unicidade da candidatura | Cada candidato pode ser inscrito uma vez; se houver duplicidade, vale a última inscrição e as demais são canceladas. Gemelares têm inscrições independentes e vinculadas. | [R542], Anexo I, art. 6º, §§6º e 12 | Modelar uma `Candidatura` por criança/ciclo, preservar histórico de substituição e vínculo entre gemelares. Não apagar silenciosamente versões anteriores. |
| Opções e preferência | A família seleciona até cinco unidades públicas e/ou parceiras por ordem de preferência. O grupamento é indicado pelo sistema a partir da data de nascimento. | [R542], Anexo I, art. 6º, §1º, IX–X, e §2º | Preservar a ordem declarada e explicar disponibilidade. A norma registra preferência, mas não descreve um algoritmo global que garanta a primeira opção; o produto não deve prometer isso. |
| Prioridade | A posição decorre da soma dos critérios classificatórios declarados e comprovados; a tabela vigente está detalhada abaixo. | [R542], Anexo I, art. 6º, §4º | Motor determinístico e versionado, com memória da fonte, evidência e valor aplicado a cada critério. Nada de score produzido por modelo de IA. |
| Comprovação | Critérios de prioridade precisam de documentos emitidos por órgãos competentes no local e na data informados no comprovante. Critério não comprovado perde sua pontuação. | [R542], Anexo I, arts. 6º, §4º, e 7º | Separar `declarado`, `validado`, `não validado` e origem da validação. Cruzamento de base pode auxiliar, mas não deve ser tratado como substituto normativo sem confirmação da SME. |
| Ordem e desempate | A ordem de inscrição não é usada. Em empate de pontos, aplicam-se sucessivamente: irmão matriculado na rede pública/parceira; responsável menor de 18 anos; persistindo, ordenação eletrônica pelo sistema. | [R542], Anexo I, art. 6º, §§5º, 8º e 9º | Exibir trilha de ordenação. “Ordenação eletrônica” não autoriza assumir sorteio ou regra aleatória; mecanismo/seed precisam ser confirmados pela SME. |
| Resultado inicial | O Responsável consulta no `matricula.rio` a unidade reservada ou sua classificação; contemplados confirmam presencialmente nas datas do calendário. Perda do prazo inicial não admite recurso. | [R542], Anexo I, art. 9º e Anexo II | Não confundir a janela fixa de confirmação do resultado inicial com o protocolo contínuo de convocação da lista de espera. |
| Lista por unidade | Depois da confirmação inicial, a lista é ordenada por unidade e a convocação segue a disponibilidade de vagas e a ordem estabelecida. Candidatos não atendidos inicialmente podem ser chamados durante o ano. | [R542], Anexo I, arts. 11 e 14, I | Toda oferta precisa apontar qual vaga/unidade/grupamento abriu e qual regra levou ao próximo candidato. Não “pular” a fila sem motivo explícito e autorizado. |
| Uma convocação ativa | A primeira unidade que convocar define onde a matrícula será realizada; o candidato não pode permanecer nas listas das demais unidades. | [R542], Anexo I, art. 6º, §3º | A transição de convocação precisa ser atômica em nível de candidatura: reservar uma oferta e encerrar/suspender as outras opções de forma consistente. O momento exato de “convocar” requer confirmação operacional da SME. |
| Tentativas de contato | A direção da unidade realiza no mínimo uma tentativa por dia durante três dias consecutivos, em horários diferentes, pelos meios informados (telefone, e-mail, WhatsApp ou SMS). | [R542], Anexo I, art. 14, II, `a` | Registrar data/hora, canal, destino, operador e desfecho. Automação pode disparar/lembrar, mas o sistema só pode concluir “impossibilidade de contato” após satisfazer o protocolo. |
| Prazo após contato | Uma vez estabelecido o contato, o Responsável tem dois dias úteis para comparecer. Pode pedir, com justificativa dentro do prazo original, extensão de até um dia útil. | [R542], Anexo I, art. 14, II, `b` | SLA padrão de 2026 é `2 dias úteis + até 1`, não `3 + 1`. Registrar início do relógio, calendário de dias úteis, pedido, justificativa e decisão. |
| Desistência/descontinuidade | Não comparecimento ou falta de justificativa caracteriza desistência. Recusa, não comparecimento no prazo ou impossibilidade de contato descontinuam a participação nas listas, e a vaga segue ao próximo. | [R542], Anexo I, art. 14, II, `c`, e §1º | É uma ação de alto impacto: exigir evidência do protocolo e confirmação humana antes de fechar a candidatura; manter evento imutável para auditoria. A exigência de confirmação humana é salvaguarda de produto, não texto expresso da resolução. |
| Atualização cadastral | A direção deve permitir alteração de dados da ficha quando solicitada. O Responsável deve atualizar telefone/e-mail junto às unidades nas quais tenha inscrição ativa. | [R542], Anexo I, arts. 11, parágrafo único, e 15 | Oferecer atualização única na candidatura, com propagação controlada às opções ativas, data, autor e valor anterior. Isso corrige uma lacuna operacional relatada sem mudar a regra. |
| Transparência e acompanhamento | A lista fica disponível no `matricula.rio` durante todo o ano letivo; a unidade deve monitorar/controlar listas e garantir transparência. O processamento e a publicação obedecem à LGPD. A página de transparência da SME publica capacidade, matriculados e fila por unidade, com atualização prevista mensalmente. | [R542], Anexo I, arts. 11, parágrafo único, 17 e 34; [Transparência Creches] | Separar visão pública pseudonimizada, visão autenticada da família e cockpit interno. Mostrar data de atualização; não apresentar snapshot mensal como dado em tempo real. |
| Documentos da matrícula | Na confirmação são solicitados certidão de nascimento, CPFs, vacinação, endereço, identificação do responsável, origem escolar e NIS se houver. A falta momentânea de documento não impede confirmar; pendências podem ser entregues em até 30 dias. | [R542], Anexo I, art. 10 | Não misturar “prova de prioridade” com “documentação de matrícula”. A interface deve permitir matrícula confirmada com pendência documental e prazo próprio. |
| Vigência da lista | A participação na lista vale apenas para o ano letivo; não atendidos fazem nova inscrição no ciclo seguinte. Em 2026, matrículas ordinárias vão até 29/10/2026, com exceções posteriores previstas na norma. | [R542], Anexo I, arts. 16, 28 e 29 | Não carregar automaticamente posição/pontos de um ano para outro. Regras, datas e fila pertencem a um ciclo específico. |
| Proximidade protegida | A resolução considera leis que asseguram prioridade na unidade pública mais próxima para aluno com deficiência e para aluno cujo responsável tenha deficiência ou 60 anos ou mais, além de prioridade específica para deficiência locomotora permanente. O corpo operativo da resolução não explicita como isso entra no matching da creche. | [R542], considerandos (Leis municipais nº 6.649/2019, 8.808/2025 e 8.160/2023) | Não transformar distância em exclusão geral. Antes de implementar prioridade geográfica para grupos protegidos, a SME precisa fornecer a tradução operacional: universo de unidades, disponibilidade, desempate e prova. |

## Pontuação e desempate de 2026

| Critério classificatório | Pontos |
|---|---:|
| Família inscrita no CadÚnico | 51 |
| Criança público da Educação Especial | 15 |
| Família beneficiária do Bolsa Família | 5 |
| Criança público do Programa Pequenos Cariocas | 5 |
| Criança e/ou familiar de convívio diário vítima de violência doméstica | 5 |
| Família monoparental | 5 |
| Pai/mãe/responsável com deficiência | 3 |
| Criança ou integrante do núcleo familiar com doença crônica grave | 3 |
| Integrante do núcleo familiar com uso abusivo de drogas e/ou álcool | 2 |
| Integrante do núcleo familiar presidiário | 2 |
| Criança refugiada | 2 |
| Criança que aguardou na fila de 2025 sem atendimento | 2 |

Fonte: [R542], Anexo I, art. 6º, §4º. Em pontuação idêntica, os desempates são aplicados na ordem descrita na matriz; persistindo o empate, ocorre ordenação eletrônica ([R542], art. 6º, §§8º–9º).

## Divergências entre norma e materiais do desafio

### 1. Prazo “3 + 1” versus “2 + 1”

- A apresentação, o briefing e a transcrição dizem que a família tem três dias úteis para comparecer, com mais um dia de extensão.
- A [R542], art. 14, separa dois eventos: a unidade tenta contato por três dias consecutivos; **depois do contato estabelecido**, a família tem **dois dias úteis**, prorrogáveis por até um dia útil.

Decisão segura para o protótipo: modelar os dois relógios separadamente e parametrizar o SLA por ciclo. Para uma demonstração rotulada “regras de 2026”, usar `3 dias consecutivos de tentativas` e `2 dias úteis + até 1` após contato.

### 2. Até cinco ofertas simultâneas versus primeira convocação única

- Apresentação e transcrição relatam que a classificação ocorre por opção/unidade e o sistema pode ofertar até cinco vagas ao mesmo CPF ao mesmo tempo.
- A [R542], art. 6º, §3º, estabelece que a primeira unidade a convocar define a unidade de matrícula e que a criança não permanece nas outras listas.

Isso parece uma lacuna entre sistema atual e regra pretendida, não autorização para múltiplas convocações. O produto deve operar sobre uma candidatura canônica e impedir mais de uma convocação ativa. A SME precisa confirmar qual evento — seleção sistêmica, primeiro disparo ou contato efetivo — produz o fechamento das demais opções.

### 3. Contato “não editável” versus dever de permitir atualização

- A transcrição relata que o telefone/WhatsApp não pode ser alterado no sistema; atualizações ficam, por vezes, em cadernos da unidade.
- A [R542], arts. 11 e 15, atribui ao Responsável o dever de atualizar telefone/e-mail e à direção o dever de permitir a alteração.

Logo, atualização auditável de contato é aderência normativa e solução de uma dor operacional. Ainda precisa ser definido se a alteração em uma unidade deve propagar automaticamente às demais listas ativas.

### 4. Pontuação histórica de 2025 versus regra vigente de 2026

- O briefing e a base histórica registram, para 2025, CadÚnico com 51 pontos, Educação Especial com 25, Bolsa Família/Cartão Carioca com 2 e outros pesos próprios daquele processo.
- Em 2026, a [R542] traz Educação Especial com 15, Bolsa Família com 5 e inclui Pequenos Cariocas com 5, entre outras mudanças.
- O [Dados Creche] declara que a extração cobre 2021–2025 e exclui o processo vigente de 2026.

Portanto, a base histórica não deve ser usada como se validasse a política atual. Toda simulação precisa declarar qual tabela de pontos está aplicando e separar “replay histórico” de “cenário 2026”.

### 5. “Uma inscrição ativa por CPF” é ambíguo

- A transcrição usa a expressão “uma inscrição ativa por CPF”.
- A [R542] exige CPF da criança e do responsável, mas define unicidade por **candidato** e proíbe simultaneidade de matrícula da mesma criança.

O modelo não deve usar apenas o CPF do Responsável como chave, pois uma pessoa pode inscrever irmãos. A unidade correta é criança + ciclo, mantendo o Responsável como ator associado.

### 6. Comprovação “no dia seguinte” versus data do comprovante

- A fala operacional diz que a família comparece no dia seguinte a uma das unidades.
- A [R542], art. 7º, determina local e data informados no comprovante; o Anexo II estabelece uma janela de comprovação para o processo inicial.

O produto deve exibir o compromisso efetivamente configurado no comprovante/calendário, sem fixar “dia seguinte” como regra universal.

### 7. Três critérios validados versus doze critérios pontuados

- Em um trecho da transcrição, a fala sugere “três critérios” e destaca validações automáticas de CadÚnico, Bolsa Família e Pequenos Cariocas.
- A [R542], art. 6º, §4º, contém doze critérios pontuados.

A interpretação mais prudente é que “três” se refere aos cruzamentos automáticos destacados, não ao total da régua. O motor precisa representar todos os critérios vigentes e a procedência de cada validação.

### 8. Distância é dor operacional, não critério geral vigente

- Briefing, apresentação e [Desafio do hackathon] associam opções territorialmente inviáveis a cancelamentos e sugerem georreferenciamento.
- A parte operativa da [R542] não inclui distância entre os critérios gerais de pontuação ou desempate; ela apenas registra prioridades legais de proximidade para grupos protegidos nos considerandos.

Assim, distância pode ser explicação, recomendação e variável de cenário. Não pode rebaixar, excluir ou reordenar automaticamente candidatos como se fosse a regra atual, até haver validação normativa e operacional da SME.

### 9. Irmão “na mesma unidade” versus “na rede”

- O considerando da [R542] menciona a proteção legal de preferência para irmãos no mesmo estabelecimento.
- O texto operativo do desempate, art. 6º, §8º, fala em irmão matriculado na rede pública ou parceira, sem restringir expressamente à unidade pretendida.

Não é seguro escolher silenciosamente uma das leituras. O protótipo pode exibir a regra como parâmetro pendente e pedir à SME a interpretação oficial antes de usá-la em ordenação real.

### 10. Transparência contínua versus fotografia mensal

- A [R542] manda manter a lista consultável durante o ano.
- A página oficial [Transparência Creches] informa que suas listas públicas de capacidade, matriculados e espera são fotografias atualizadas mensalmente.

São produtos de transparência distintos. O painel deve mostrar claramente a data/hora de atualização e não apresentar uma publicação mensal como fila operacional em tempo real.

## Pontos que exigem decisão formal da SME antes de produção

1. Qual evento constitui “primeira convocação” e fecha as outras opções: seleção, disparo ou contato efetivo?
2. Qual é o algoritmo da “ordenação eletrônica” após os dois desempates e como torná-lo reproduzível em auditoria?
3. Como as prioridades legais de unidade mais próxima entram no processo da creche e como se comprovam?
4. O desempate por irmão considera qualquer unidade da rede ou especificamente a unidade escolhida?
5. Uma atualização de contato feita em uma unidade deve valer imediatamente para todas as opções da candidatura?
6. Quais validações por bases integradas substituem documento, quais apenas sinalizam conferência e qual precedência vale em divergência?
7. O que conta como contato estabelecido, tentativa válida, impossibilidade de contato e justificativa aceitável para extensão?
8. Qual dado identificador pode aparecer na lista pública e qual deve ficar apenas na área autenticada, em conformidade com a LGPD?

## Requisitos de produto derivados, não novas regras

- `RuleSet` versionado por ano/processo, com vigência, fonte oficial e histórico de alterações.
- cálculo determinístico de pontuação/desempate, exibindo critério, evidência e motivo da posição;
- `Candidatura` como agregado da criança, com opções ordenadas e no máximo uma `Oferta/Convocação` ativa;
- máquina de estados que diferencie resultado inicial, lista de espera, tentativa de contato, contato estabelecido, prazo de confirmação, extensão, confirmação, desistência e matrícula;
- registro imutável de tentativa, canal, operador, horário, resposta, justificativa e transição de fila;
- atualização cadastral com trilha de auditoria e sincronização explícita;
- simulador de geografia tratado como recomendação explicável, com comparação “regra vigente” versus “cenário proposto”;
- visão pública, visão autenticada da família e visão interna com políticas de dados distintas;
- rótulos visíveis para dado histórico, dado sintético e regra normativa atual.

## Fontes

- [R542]: [Resolução SME nº 542, de 18 de novembro de 2025 — regulamento de matrícula de 2026](https://educacao.prefeitura.rio/wp-content/uploads/sites/42/2025/11/RESOLUCAO-SME-N%C2%B0-542-DE-18-DE-NOVEMBRO-DE-2025-1.pdf)
- [Índice oficial de Resoluções SME 2025](https://educacao.prefeitura.rio/resolucoes-2025/)
- [Índice oficial de Resoluções SME 2026](https://educacao.prefeitura.rio/resolucoes-2026/)
- [Transparência Creches — capacidade, matriculados e fila de espera](https://educacao.prefeitura.rio/transparenciacreches/)
- [Desafio do hackathon](https://github.com/taicor-ai/claude-impact-lab-rio-2)
- [Dados Creche — repositório e dicionário oficial do conjunto 2021–2025](https://github.com/CIT-SME-RJ/dadoscreche)
- Briefing SME fornecido à equipe (arquivo de referência não versionado)
- Apresentação SME fornecida à equipe (arquivo de referência não versionado)
- Transcrição dos áudios fornecida à equipe (arquivo de referência não versionado)

[R542]: https://educacao.prefeitura.rio/wp-content/uploads/sites/42/2025/11/RESOLUCAO-SME-N%C2%B0-542-DE-18-DE-NOVEMBRO-DE-2025-1.pdf
[Transparência Creches]: https://educacao.prefeitura.rio/transparenciacreches/
[Desafio do hackathon]: https://github.com/taicor-ai/claude-impact-lab-rio-2
[Dados Creche]: https://github.com/CIT-SME-RJ/dadoscreche
