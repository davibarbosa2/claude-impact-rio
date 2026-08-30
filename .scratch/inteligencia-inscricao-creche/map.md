# Inscrição Creche: uma candidatura, duas faces

## Destination

Chegar a um brief de produto pronto para construção cuja experiência principal é a jornada completa do Responsável, da orientação para o cadastro à Matrícula ou Reativação da Candidatura. Direção da Unidade e Operador da Rede aparecem em visões secundárias, apenas com a profundidade necessária para produzir, explicar e confirmar o que o Responsável vivencia.

O brief final deve fixar métricas e guardrails, regras do simulador, experiências, papel do Claude, contrato de dados, arquitetura, escopo da demo e limites do MVP.

## Notes

- Este mapa produz decisões, não implementação.
- O Responsável é a persona principal da demo e da prioridade de implementação; Direção da Unidade e Operador da Rede são personas secundárias.
- O produto é um simulador de decisão; não executa alocações reais.
- Planejamento, matching e convocação sustentam a jornada, mas não são o centro narrativo da demo.
- A experiência cidadã cobre uma jornada completa, sem reconstruir integralmente o matricula.rio.
- A Candidatura é a entidade central; opções de unidade são preferências ordenadas.
- Uma Candidatura pode ter no máximo uma Oferta de Vaga ativa no cenário proposto.
- Geografia influencia recomendações de forma explicável, sem excluir automaticamente uma opção.
- A prioridade socioeconômica e a auditabilidade são invariantes.
- Dados históricos dão contexto; eventos sintéticos, sempre identificados, suprem a cronologia ausente na demo.
- Regras e prazos devem ser configuráveis quando as fontes divergirem.
- O protótipo demonstra o fluxo completo com dados fornecidos e eventos sintéticos identificados; integrações oficiais entram depois por adaptadores substituíveis.
- Não usar ML opaco para decidir acesso, prioridade ou alocação.
- Em tickets HITL, usar grilling e domain-modeling. Em perguntas de aparência ou comportamento, usar prototype.
- Fontes de partida: repositório CIT-SME-RJ/dadoscreche, briefing da SME, apresentação do desafio, transcrição da SME e Resolução SME nº 542/2025.

## Decisions so far

- **O que os dados conseguem sustentar sobre distância, preferência e cancelamento?** Preferência alta e proximidade territorial por proxy estão associadas a mais confirmações, mas a base não sustenta que distância cause cancelamentos. [Pesquisa e limites](issues/01-dados-distancia-preferencia-cancelamento.md)
- **Quais métricas são calculáveis e quais só podem ser simuladas?** Volumes e estados finais são observáveis; tempos, SLA, conversão real, motivos e capacidade completa exigem eventos sintéticos ou novos dados. [Matriz de métricas](issues/02-metricas-calculaveis-e-simulaveis.md)
- **Quais regras normativas e operacionais precisam permanecer invariantes?** O ciclo precisa de regras versionadas e auditáveis; em 2026, tentativas de contato e prazo de comparecimento são relógios distintos, e distância não é critério geral. [Matriz normativa](issues/03-invariantes-normativas-e-operacionais.md)
- **Qual resultado define sucesso com foco no Responsável?** Maximizar a Taxa de Atendimento Efetivo para a persona principal, usando Creche e Prefeitura como suporte e preservando guardrails de regra, capacidade, oferta única, geografia explicável, auditabilidade e procedência dos dados. [Métrica e guardrails](issues/04-resultado-conjunto-de-sucesso.md)
- **Qual é o modelo de estados da Candidatura do cadastro à matrícula?** Uma Candidatura expõe macroestados simples e coordena processos detalhados de Oferta, Convocação e Matrícula; a solução reativa opções restantes, preserva prioridade e mantém o encerramento oficial como cenário comparativo. [Estados, transições e responsáveis](issues/05-estados-da-candidatura.md)
- **Qual visão mínima da Prefeitura sustenta o primeiro Cenário?** O Operador da Rede configura regras, capacidade e coorte, compara o Cenário-base ao proposto e supervisiona métricas e guardrails sem operar Candidaturas individuais. [Entradas, ações e indicadores mínimos](issues/06-decisoes-do-planejamento.md)
- **Como o matching equilibra prioridade, preferência, capacidade e geografia?** Rodadas determinísticas percorrem as preferências, preservam prioridade e capacidade, reservam uma única Oferta e geram uma explicação compreensível ao Responsável sem usar geografia para reordenar. [Política de matching e explicação](issues/07-politica-de-matching.md)
- **Como a Convocação fecha o ciclo sem perder auditabilidade?** Uma página segura centraliza a Oferta; contato exige resposta explícita, tentativas e relógios ficam separados, atualização cadastral pode reiniciar o protocolo e desfechos ambíguos exigem confirmação humana. [Protocolo de convocação](issues/08-protocolo-de-convocacao.md)
- **Como deve funcionar a jornada do Responsável?** Uma experiência móvel combina cadastro e Oferta focais, mapa dentro da escolha e uma Central depois do envio; sugestões são opcionais e somente as unidades adicionadas e ordenadas pelo Responsável viram suas cinco Opções de Unidade. [Jornada do Responsável](issues/09-jornada-do-responsavel.md)

## Not yet specified

- Dados adicionais que a SME poderia disponibilizar depois do hackathon.
- Modelo de governança e revisão humana em produção.
- Plano de rollout, operação e suporte além do protótipo.

## Out of scope

- Substituir integralmente o matricula.rio ou os sistemas internos da SME.
- Executar decisões reais de elegibilidade, prioridade ou matrícula.
- Enviar mensagens reais para famílias durante este esforço de planejamento.
- Alegar métricas reais da cidade a partir dos dados anonimizados do desafio.
- Construir ou publicar o produto dentro deste mapa.
- Implementar login oficial, escrita no `matricula.rio`, envio por canais oficiais ou sincronização com sistemas da SME; o protótipo apenas prepara seus adaptadores.
