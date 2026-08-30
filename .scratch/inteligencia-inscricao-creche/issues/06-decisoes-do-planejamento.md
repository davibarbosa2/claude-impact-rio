# Qual visão mínima da Prefeitura sustenta o primeiro Cenário?

Type: grilling
Status: resolved
Blocked by: 02, 04
Parent: [Inscrição Creche: uma candidatura, duas faces](../map.md)

## Question

Quais entradas de regras e capacidade e quais indicadores mínimos o Operador da Rede precisa configurar ou acompanhar para sustentar as jornadas do Responsável e da Direção da Unidade, sem transformar o cockpit da Prefeitura no foco do MVP?

## Answer

O Operador da Rede é uma persona secundária. Sua visão existe para preparar e comparar Cenários, supervisionar guardrails e investigar explicações; comunicação, convocação, documentação e Matrícula permanecem nas experiências primárias do Responsável e da Direção da Unidade.

### Entradas mínimas

| Entrada | Conteúdo | Limite |
|---|---|---|
| Conjunto de Regras | Ciclo, critérios, pontuação, desempates, prazos e política de encerramento ou reentrada. | É versionado; não permite editar a pontuação ou posição de uma criança individualmente. |
| Snapshot de Capacidade | Vagas ofertáveis por unidade, grupamento e turno em uma vigência. | No protótipo é uma premissa identificada do Cenário, pois a base pública não contém capacidade autorizada uniforme e atual. |
| Coorte de Demanda | Candidaturas históricas ou sintéticas incluídas na execução. | O denominador e os filtros ficam explícitos; Opções de Unidade nunca são contadas como famílias. |

As Queries A–C, o catálogo geográfico de unidades e as planilhas históricas alimentam contexto e validação do método. Alunos ativos das unidades públicas não são tratados como capacidade; esquemas anuais das parceiras não são combinados sem harmonização.

### Ações permitidas

- importar e validar dados;
- selecionar a Coorte de Demanda;
- escolher o Conjunto de Regras oficial ou proposto;
- ajustar capacidade hipotética no Snapshot de Capacidade;
- executar, duplicar e comparar Cenários;
- consultar a explicação de uma Oferta de Vaga;
- exportar resultados e trilhas de auditoria.

O Operador da Rede não reordena filas manualmente, não altera status individuais e não executa comunicação ou Matrícula nessa visão.

### Resumo mínimo

- Taxa de Atendimento Efetivo;
- Candidaturas atendidas e ainda aguardando;
- atendimento na primeira e nas três primeiras preferências;
- utilização das vagas simuladas;
- cobertura por território e faixa de prioridade;
- violações de guardrails;
- gargalos de Convocação recebidos das unidades.

O drill-down existe para explicar um resultado, não para sobrescrevê-lo.

### Escala da demonstração

- a visão histórica pode resumir toda a base fornecida;
- a simulação detalhada usa um território ou pequeno conjunto de unidades para manter a história compreensível e auditável;
- o Cenário-base oficial de 2026 e o Cenário proposto usam a mesma Coorte de Demanda e o mesmo Snapshot de Capacidade;
- a comparação isola a política proposta: uma Oferta ativa por Candidatura e Reativação das opções restantes;
- toda capacidade assumida, todo evento sintético e toda métrica simulada recebem rótulo visível.
