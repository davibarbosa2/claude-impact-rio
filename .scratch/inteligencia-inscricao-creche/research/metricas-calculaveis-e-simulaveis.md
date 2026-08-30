# Métricas calculáveis, aproximáveis e simuláveis

## Veredito

Os arquivos fornecidos sustentam bem métricas de **volume, perfil, preferências, distribuição territorial, estoque de matrículas e estado final das opções**. Eles não sustentam métricas históricas de **tempo, fluxo de ofertas, tentativas de contato, SLA, motivo de desistência, ocupação completa da rede ou matrícula efetiva**.

O limite decisivo é temporal: a Query A possui apenas `data_criacao`, que é a data de criação da Candidatura, e uma `situacao` final por Opção de Unidade. Não há horário de seleção, mudança de estado, contato, confirmação, cancelamento ou matrícula. Portanto, apesar de o briefing sugerir que essa tabela serviria para “calcular tempo de espera”, **nenhum tempo de espera ou de convocação é observável nesses arquivos**.

Todos os números históricos abaixo servem apenas para testar método e produto. O próprio repositório alerta que os dados foram anonimizados com aleatorização, generalização e supressão e que indicadores derivados não representam a realidade da cidade.

## Régua de evidência

- **Diretamente calculável:** o numerador e o denominador existem nos arquivos e não exigem inventar eventos.
- **Proxy/aproximação:** a conta existe, mas o nome de negócio depende de uma hipótese que os dados não comprovam.
- **Evento sintético:** calculável apenas dentro de um Cenário explicitamente fictício para demonstrar o produto.
- **Novo dado:** só pode virar métrica histórica real com uma nova fonte ou instrumentação operacional.

## Grãos que não podem ser misturados

| Grão | Chave ou definição | Uso correto |
|---|---|---|
| Candidatura | `(prm_id, plm_id, ipl_id)` | Resultado para a família, cobertura do questionário e uma eventual oferta ativa |
| Opção de Unidade | Candidatura + `opcao` | Pressão sobre uma unidade/fila e ordem de preferência |
| Criança longitudinal | `aluno_anon` | Reaparecimento entre anos, com ressalva de possível colisão quando faltam CPF/DNV/NIS |
| Célula de fila | `(ano, unidade, grupamento, horario)` | Comparações dentro da mesma unidade, faixa e turno |
| Estoque de matrícula | Linha da planilha anual/mensal de públicas ou parceiras | Quantidade observada no recorte daquela planilha; não é fluxo nem, necessariamente, capacidade |

## 1. Diretamente calculáveis

| Eixo | Métrica que pode ser calculada | Numerador, denominador e ressalva |
|---|---|---|
| Demanda | Candidaturas manifestas por processo, território ou coorte | `COUNT(DISTINCT prm_id, plm_id, ipl_id)`. Para resultado da família, este é o denominador; nunca usar as 837.179 opções como se fossem 837.179 famílias. |
| Demanda | Pressão de preferências por unidade, grupamento e turno | Contagem de Opções de Unidade na célula de fila; pode separar 1ª, 2ª… escolha. Mede escolhas, não crianças sem atendimento. |
| Demanda | Número de opções por Candidatura e concentração das escolhas | Contagem de linhas e de unidades distintas por Candidatura; distribuição por `opcao`, unidade, bairro e CEP. |
| Demanda | Perfil declarado e cobertura de validação socioeconômica | Candidaturas com `resposta = Sim` e, separadamente, com `confirmado = Sim`, por pergunta e ano. Query B deve ser deduplicada no grão da Candidatura, não replicada pelas opções após o join. |
| Demanda | Cobertura geográfica e demográfica | Candidaturas/opções por bairro, CEP, sexo e mês de nascimento. CEP e bairro têm cerca de 2,8% de ausência, gravada como `NULL`; nascimento não contém dia. |
| Capacidade | Alunos ativos e turmas nas unidades públicas | Soma das colunas `Aluno`/`Turma` por unidade e grupamento no recorte de cada `totalalunoscreche`. Em 2021 e 2023–2025 há desagregação por turno; o arquivo de 2022 não a traz. É estoque matriculado, não capacidade autorizada. |
| Capacidade | Meta, alunos, vagas e excedentes nas parceiras | Leitura das colunas explícitas das planilhas `Parceiras20xx`, no recorte temporal do arquivo. O esquema e a regra de abatimentos mudam entre anos; a métrica é direta apenas dentro de cada versão. |
| Matching | Estado final por Opção de Unidade | Participação de cada `situacao` com denominador de opções da mesma coorte. É uma fotografia de estados finais, não um funil de transições. |
| Matching | Preferência da opção confirmada | Entre Candidaturas com uma opção `Confirmado`, distribuição do valor de `opcao`. Mede qual preferência terminou confirmada; não mede quantas ofertas foram feitas antes. |
| Matching | Resultado final por Candidatura | `tem_confirmado`, `tem_lista_espera`, `tem_selecionado` etc., agregando todas as opções antes de contar. Deve permanecer descritivo. |
| Equidade | Estado final por critério, território, grupamento, turno ou sexo | Cruzamento descritivo entre atributos observados e resultado final, sempre no mesmo grão e coorte. Mostra associação, não impacto causal da regra. |
| Qualidade | Inconsistências entre opções da mesma Candidatura | Mais de um `Confirmado`, `Selecionado` junto com `Lista de espera`, unidade repetida, falta de respostas, CEP/bairro ausente e outras invariantes verificáveis. |
| Convocação | Estoque residual em `Selecionado`, `Selecionado da lista` ou `Lista de espera` | Contagem de opções e de Candidaturas no estado final extraído. Sem data do estado, não há idade do estoque nem violação de SLA. |

### Controles observados na extração

- Query A: 837.179 Opções de Unidade, 343.308 Candidaturas, 259.924 códigos de criança e 872 unidades nos processos de 2021–2025.
- As 192.570 linhas `Confirmado` pertencem a 192.570 Candidaturas distintas; nenhuma Candidatura possui mais de uma opção confirmada na extração.
- O efeito do denominador é grande: há 178.731 linhas `Lista de espera`, mas 79.202 Candidaturas com ao menos uma opção nessa situação; 79.192 delas não possuem opção confirmada.
- Cada uma das 343.308 Candidaturas possui um único valor de `data_criacao` repetido entre suas opções. Isso confirma que o campo não marca transições.
- A Query B possui 4.357.119 respostas; 8.162 das 343.308 Candidaturas da Query A não têm resposta registrada. A régua possui 13 perguntas por ano, mas pesos e perguntas mudam entre processos.

Esses controles validam a modelagem da extração, não são indicadores da realidade municipal por causa da anonimização declarada pela fonte.

## 2. Proxies e aproximações

| Métrica desejada | Proxy possível | Por que não deve receber o nome da métrica real |
|---|---|---|
| Demanda potencial por território | Nascidos vivos por bairro e coorte etária | Nascimento não equivale a procura por creche; faltam migração, elegibilidade, rede privada, data de corte e informação de completude de 2026. |
| Distância/viabilidade da escolha | Distância aproximada entre centroide do CEP/bairro do responsável e coordenada/endereço da unidade | Origem familiar é generalizada; distância em linha reta não mede rota, tempo, custo, trabalho do responsável ou barreiras urbanas. |
| Cancelamento por distância | Associação entre distância estimada, ordem da opção e `situacao` | Não existe motivo de cancelamento. A associação não identifica causalidade e os tipos de cancelamento têm significados operacionais diferentes. |
| Pontuação da Candidatura | Soma dos pesos anuais para respostas `Sim`; uma segunda versão pode exigir também `confirmado = Sim` | A base não contém pontuação oficial calculada, rank, regra completa de confirmação nem execução dos desempates. Tratar como reconstrução auditável, não verdade de produção. |
| Posição na fila | Ordenação pela pontuação reconstruída dentro de unidade/grupamento/turno | Faltam score/rank oficial, critérios completos de desempate, capacidade ofertada e histórico das entradas/saídas da fila. |
| Demanda não atendida | Candidaturas sem `Confirmado` e com ao menos uma `Lista de espera` na fotografia final | Não há prova de que a criança permaneceu demandante, não foi atendida fora do módulo ou não envelheceu para outra etapa. |
| Conversão em matrícula | Candidaturas com uma opção `Confirmado` / total de Candidaturas | `Confirmado` é um estado do IC; não há vínculo individual com a matrícula ativa do sistema acadêmico. Nome seguro: **taxa de confirmação final da extração**. |
| Ocupação da rede pública | Alunos ativos / capacidade inferida por turmas ou histórico | As planilhas públicas trazem alunos e turmas, não capacidade autorizada ou vagas abertas. Alunos ativos não podem ser usados como denominador de si mesmos. |
| Pressão demanda/oferta | Opções ou Candidaturas por aluno ativo, meta ou vaga da planilha mais próxima | Inscrição, matrícula e planilha de vagas têm recortes, escopos e esquemas diferentes; não há uma tabela única de vagas ofertadas por unidade, grupamento, turno e vigência. |
| Espera crônica | Reaparecimento do mesmo `aluno_anon` em anos sucessivos | Reaparecer não prova espera contínua; pode haver nova necessidade, mudança territorial, atendimento intermediário ou colisão do identificador anonimizado. |

## 3. Métricas possíveis somente em Cenários com eventos sintéticos

Essas métricas são adequadas para comparar políticas no protótipo, desde que a interface marque claramente **“simulação”** e nunca as apresente como desempenho histórico da SME.

| Família de métrica | Eventos/parâmetros sintéticos mínimos |
|---|---|
| Tempo até primeira oferta, tempo de resposta e tempo total até confirmação | `vaga_aberta`, `oferta_criada`, `familia_respondeu`, `oferta_confirmada/expirada`, todos com `occurred_at` |
| Dias de vaga ociosa e tempo para preencher | Identificador da Vaga, abertura, reservas sucessivas e confirmação/matrícula |
| Cumprimento de SLA e idade das pendências | `deadline_at`, extensão, calendário configurado e timestamps de cada transição |
| Tentativas por confirmação, taxa de contato e desempenho por canal | Uma linha por tentativa com canal, horário, resultado e vínculo à Oferta de Vaga |
| Número de ofertas concorrentes evitadas | Linha do tempo de ofertas por Candidatura e invariante de no máximo uma oferta ativa |
| Fill rate, preferência atendida e ofertas por matrícula sob outra política | Capacidade inicial do Cenário, fila, score, preferências, regra determinística e eventos de aceite/recusa/expiração |
| Efeito do planejamento sobre fila e ociosidade | Parâmetros de capacidade por unidade/grupamento/turno e demanda do Cenário; o resultado é contrafactual, não previsão observada |
| Guardrails de equidade entre políticas | Resultados simulados por faixa de prioridade/critério e território, comparados ao baseline do mesmo Cenário |

## 4. Métricas históricas que exigem novos dados

| Métrica real desejada | Dado mínimo que falta |
|---|---|
| Tempo real de espera e tempo em cada estado | Log imutável de transições com Candidatura, Opção, estado anterior/novo, ator e timestamp |
| Tempo real de vaga ociosa e time-to-fill | Vaga identificável, unidade, grupamento, turno, data de abertura, reserva e ocupação |
| Conversão oferta → aceite → matrícula → permanência | `oferta_id` e vínculo pseudonimizado com matrícula acadêmica, cancelamento posterior e vigência |
| Taxa de contato, tentativas e canal eficaz | Log de cada contato, canal, resultado, consentimento e versão do dado cadastral usado |
| SLA vencido, extensão e motivo | Prazo calculado, calendário, extensão autorizada, justificativa e timestamps |
| Motivo de recusa/desistência/cancelamento | Taxonomia de `reason_code` registrada no evento; hoje `situacao` não informa causa |
| Capacidade, oferta e ocupação comparáveis em toda a rede | Snapshot versionado por unidade, gestão, grupamento, turno e vigência com capacidade autorizada, vagas ofertadas, matrículas e bloqueios |
| Fidelidade da classificação | Score oficial, rank, regras versionadas, desempates aplicados e trilha da execução |
| Distância operacional real | Origem geográfica com nível de precisão e governança aprovados, mais matriz de rota/tempo no horário relevante |

### Contrato mínimo recomendado para instrumentar o protótipo

Um log de eventos deve incluir, no mínimo: `event_id`, `candidatura_id`, `opcao_id`, `vaga_id`, `oferta_id`, `event_type`, `occurred_at`, `actor_type`, `channel`, `result`, `reason_code`, `deadline_at`, `scenario_id` e `is_synthetic`. A capacidade precisa de uma tabela separada com `unidade`, `grupamento`, `turno`, `valid_from`, `valid_to`, `capacidade_autorizada`, `vagas_ofertadas`, `matriculas_ativas` e `vagas_bloqueadas`.

## Regras de denominador para o brief

1. **Resultado da família:** uma linha por Candidatura; agregar opções antes de contar.
2. **Pressão sobre a unidade:** uma linha por Opção de Unidade; declarar que uma família contribui para até cinco filas.
3. **Preferência atendida:** denominador = Candidaturas com opção `Confirmado`; numerador = confirmadas na preferência `k`.
4. **Taxa de confirmação final:** denominador = Candidaturas elegíveis na coorte explicitada; não chamar de matrícula sem o vínculo acadêmico.
5. **Fila remanescente:** distinguir opções em espera de Candidaturas únicas em espera.
6. **Cancelamentos:** nunca somar automaticamente `Cancelado na confirmacao`, `Cancelado pelo sistema` e `Cancelado` como desistência da família.
7. **Capacidade:** não usar alunos ativos como capacidade; não combinar públicas e parceiras antes de harmonizar código, vigência, grupamento e turno.
8. **Tempo e SLA:** nenhuma métrica temporal histórica deve ser exibida a partir da Query A; usar evento sintético rotulado ou coletar o log real.

## Reprodutibilidade e fontes

Análise feita sobre o commit `057b975e379ba021375c9024339a8cac4af65d28` do repositório oficial do desafio:

- [README e aviso de anonimização](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/README.md)
- [Dicionário das Queries A–D](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/Bases%20IC_%20ClassificadoseFila/README_dicionario_dados.md)
- [Nota de origem e periodicidade das planilhas de oferta/matrícula](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/OferecimentosEvagas/LEIAME_OFERECIMENTOSPARCEIRASEPUBLICAS.txt)
- [Nascidos vivos por bairro](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/NascidosvivosRJ.xlsx)
- Planilhas binárias `Parceiras2021–2025.xlsx`, `totalalunoscreche2021–2025.xlsx` e `Unidades_Unificadas_com_Localizacao.xlsx` no mesmo commit.
- Briefing SME fornecido à equipe (arquivo de referência não versionado).
- Apresentação SME fornecida à equipe (arquivo de referência não versionado).

Arquivos centrais verificados por hash SHA-256:

```text
Query A  5cad1e9e7cbb381770e353c4c1ebd52d045c80149dcc4329abd1d19301af21c4
Query B  0f716829cfa717106f5a75c7a383d094bc592fb4cdbfd84b812e0c51a286012d
Query C  26eaddcfe114d938db1d62b9f4dcb2f685b3462ce73aa6515bedfc5b8d88840a
Query D  261a7e9f13846bbd730429035e2aac63e57503661decb085c2af22d7a9372ee9
```

Os controles foram reproduzidos com leitura CSV `;`, codificação `utf-8-sig`, tratamento literal de `NULL` e agregação da Query A primeiro pela chave de Candidatura. As planilhas foram lidas em seus cabeçalhos originais; não se presumiu um esquema comum entre anos.
