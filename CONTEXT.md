# Inscrição Creche

Vocabulário canônico para descrever a jornada de acesso às vagas de creche e a plataforma de decisão que conecta responsáveis, SME, CREs e unidades.

## Language

### Pessoas e papéis

**Responsável**:
A pessoa que cria e acompanha uma candidatura em nome da criança. No produto, mantém dados e preferências, acompanha o andamento e responde à Oferta de Vaga; não calcula prioridade nem administra filas.
_Avoid_: Usuário, família, candidato

**Criança**:
A pessoa para quem a vaga de creche é solicitada e que se torna aluna somente após a matrícula.
_Avoid_: Usuário, inscrição, aluno antes da matrícula

**Operador da Rede**:
O papel agregado da Prefeitura — SME ou CRE — que planeja e acompanha candidaturas e vagas entre várias unidades. No produto, governa regras, compara Cenários, coordena o matching e supervisiona equidade, capacidade e exceções; não executa a rotina local de contato ou Matrícula.
_Avoid_: Gestão, usuário interno

**Direção da Unidade**:
A equipe da creche na ponta local, responsável por capacidade operacional, comprovações, tentativas de contato, Convocação e efetivação da Matrícula. Registra os desfechos e devolve-os à rede; não reordena Candidaturas por critérios próprios.
_Avoid_: Escola quando o sentido for o papel operacional

### Acesso à vaga

**Candidatura**:
A participação de uma criança em um processo seletivo, reunindo sua prioridade e suas opções ordenadas de unidade.
_Avoid_: CPF, cadastro, opção

**Sugestão de Unidade**:
Uma unidade apresentada ao Responsável como atalho informativo para exploração. Não integra a Candidatura nem recebe ordem de preferência até ser escolhida explicitamente, e nunca limita a busca pelas demais unidades participantes.
_Avoid_: Opção de Unidade, pré-seleção, recomendação obrigatória

**Opção de Unidade**:
Uma preferência escolhida explicitamente e ordenada pelo Responsável para uma combinação de unidade e turno.
_Avoid_: Sugestão de Unidade, Candidatura, inscrição independente

**Situação de Origem**:
O valor de situação recebido de uma fonte existente para uma Opção de Unidade, preservado sem reinterpretação para compatibilidade e auditoria.
_Avoid_: Estado atual da Candidatura, motivo do desfecho

**Estado Canônico**:
Uma etapa não ambígua do ciclo de vida da Candidatura ou de um processo associado, usada pelo produto independentemente da Situação de Origem.
_Avoid_: Situação de Origem, rótulo legado

**Vaga**:
Uma unidade de capacidade para uma unidade, um grupamento e um turno específicos.
_Avoid_: Oferta, matrícula

**Pontuação de Prioridade**:
O valor derivado dos critérios socioeconômicos comprovados segundo a régua vigente em um processo.
_Avoid_: Score genérico, vulnerabilidade

**Fila de Unidade**:
A visão ordenada das candidaturas elegíveis a uma unidade e turno, derivada da Pontuação de Prioridade e dos desempates do Conjunto de Regras. A posição da unidade entre as preferências não altera a ordem dentro dessa fila.
_Avoid_: Fila de opções, fila global

**Oferta de Vaga**:
A reserva temporária de uma vaga para uma candidatura; no produto proposto, uma candidatura pode ter no máximo uma oferta ativa.
_Avoid_: Matrícula, vaga confirmada

**Suspensão por Oferta**:
A indisponibilidade temporária das demais Opções de Unidade enquanto uma Oferta de Vaga está ativa, sem cancelar essas preferências.
_Avoid_: Cancelamento, encerramento

**Convocação**:
O protocolo de contato que comunica uma oferta de vaga ao responsável e controla seu prazo.
_Avoid_: Notificação isolada, matrícula

**Notificação**:
Um aviso enviado por um canal de comunicação para informar que há uma mudança ou ação disponível na Candidatura; não comprova contato nem altera sozinha o prazo da Convocação.
_Avoid_: Tentativa de Contato, Contato Estabelecido, Oferta de Vaga

**Tentativa de Contato**:
Uma ação auditável da Direção da Unidade para alcançar o Responsável durante a Convocação, com canal, horário, destino e resultado registrados.
_Avoid_: Notificação não registrada, mensagem presumidamente lida

**Contato Estabelecido**:
O resultado comprovado por uma ação explícita do Responsável, uma resposta válida em canal integrado ou uma interação de mão dupla registrada pela Direção da Unidade.
_Avoid_: Mensagem entregue, e-mail aberto, página visualizada

**Solicitação de Extensão**:
O pedido justificado feito pelo Responsável antes do prazo de comparecimento, sujeito à decisão registrada da Direção da Unidade e aos limites do Conjunto de Regras.
_Avoid_: Extensão automática, novo prazo presumido

**Liberação da Vaga**:
O fim da reserva temporária de uma Vaga, que devolve sua capacidade a uma Rodada de Matching sem, por si só, cancelar a Candidatura.
_Avoid_: Cancelamento da Candidatura, Matrícula

**Confirmação**:
A manifestação do responsável que aceita a oferta e inicia sua conversão em matrícula.
_Avoid_: Seleção, convocação

**Reativação da Candidatura**:
O retorno das Opções de Unidade restantes às filas, preservando a Pontuação de Prioridade, depois de uma recusa explícita, de um impedimento da unidade ou da reafirmação de interesse exigida após falta de contato ou não comparecimento.
_Avoid_: Nova candidatura, nova pontuação, retorno à unidade recusada

**Ação Necessária**:
O Estado Canônico recuperável no qual a Candidatura aguarda atualização de contato e reafirmação de interesse pelo Responsável depois de falta de contato ou não comparecimento; suas opções permanecem suspensas.
_Avoid_: Cancelamento, Lista de espera, nova inscrição

**Desfecho da Candidatura**:
O resultado terminal `Matriculada` ou `Encerrada`, acompanhado da causa explícita e da regra que autorizou a transição.
_Avoid_: Cancelado sem motivo, Situação de Origem

**Matrícula**:
O vínculo efetivado entre a criança e a unidade após a confirmação e os procedimentos exigidos.
_Avoid_: Oferta, candidatura

**Matrícula com Pendências**:
Uma Matrícula já efetivada cujo checklist documental ainda precisa ser completado dentro do prazo aplicável; não é um estado de insucesso da Candidatura.
_Avoid_: Matrícula recusada, Oferta pendente

### Decisão

**Cenário**:
Um conjunto não vinculante de premissas de planejamento, matching e convocação usado para comparar resultados sem alterar o processo real.
_Avoid_: Decisão executada, previsão

**Conjunto de Regras**:
A configuração versionada de um processo ou Cenário que reúne elegibilidade, pontuação, desempates, calendários e a política aplicável às transições da Candidatura.
_Avoid_: Regra implícita, decisão do Claude, ajuste individual

**Snapshot de Capacidade**:
A descrição com vigência e procedência das vagas ofertáveis por unidade, grupamento e turno usadas em um Cenário.
_Avoid_: Alunos ativos, capacidade atual sem data, previsão

**Coorte de Demanda**:
O conjunto explicitamente delimitado de Candidaturas que participa de um Cenário e forma seu denominador de análise.
_Avoid_: Opções de Unidade, toda a base por padrão

**Cenário-base**:
O Cenário que aplica o Conjunto de Regras oficial e serve de referência para comparar uma política proposta sob a mesma Coorte de Demanda e o mesmo Snapshot de Capacidade.
_Avoid_: Verdade histórica, produção

**Matching por Rodadas de Preferência**:
A política determinística em que cada Candidatura tenta suas Opções de Unidade na ordem declarada e cada unidade mantém, até sua capacidade, as candidaturas de maior prioridade; candidaturas não retidas avançam para a preferência seguinte.
_Avoid_: Otimização opaca, fila global, previsão de aceite

**Rodada de Matching**:
Uma execução imutável do Matching por Rodadas de Preferência sobre uma Coorte de Demanda, um Snapshot de Capacidade, um Conjunto de Regras e uma semente identificados.
_Avoid_: Processo contínuo sem versão, resultado editável

**Explicação da Oferta**:
A justificativa derivada da trilha determinística de uma Rodada de Matching que informa preferência, prioridade, desempates, capacidade e motivo de preferências anteriores não produzirem Oferta, sem expor outras famílias.
_Avoid_: Texto inventado pelo Claude, justificativa genérica

**Desempate Simulado**:
A ordenação determinística e reproduzível usada apenas quando persistem empates depois dos critérios conhecidos, identificada como premissa do Cenário e não como mecanismo oficial da SME.
_Avoid_: Desempate oficial, sorteio oculto, decisão do Claude

### Métricas

**Taxa de Atendimento Efetivo**:
A proporção de Candidaturas elegíveis de um Cenário que terminam em Matrícula em uma Opção de Unidade escolhida e mantida como aceitável pelo Responsável.
_Avoid_: Taxa histórica de matrícula, ocupação de vagas, taxa de confirmação da extração
