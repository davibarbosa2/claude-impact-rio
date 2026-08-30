# Como o matching equilibra prioridade, preferência, capacidade e geografia?

Type: grilling
Status: resolved
Blocked by: 01, 03, 04, 05
Parent: [Inscrição Creche: uma candidatura, duas faces](../map.md)

## Question

Qual política determinística deve produzir no máximo uma Oferta de Vaga ativa por Candidatura, preservando prioridade socioeconômica, ordem de preferência e capacidade, tratando geografia como sinal explicável e gerando uma justificativa compreensível para o Responsável?

## Answer

O produto usa **Matching por Rodadas de Preferência**, sem otimização opaca ou previsão de aceite.

### Entradas elegíveis

Participam apenas Candidaturas em `Aguardando vaga`, sem Oferta ativa ou Matrícula, com elegibilidade e Pontuação de Prioridade calculadas pelo Conjunto de Regras. Cada Opção de Unidade precisa estar ativa e ser compatível com unidade, grupamento e turno do Snapshot de Capacidade.

O matching nunca adiciona uma unidade que o Responsável não escolheu. Geografia pode orientar e explicar a seleção de preferências antes da rodada, mas não remove opções, altera pontuação ou reordena a Fila de Unidade. Prioridades legais de proximidade permanecem fora do algoritmo até a SME fornecer sua tradução operacional.

### Política por rodadas

1. Cada Candidatura tenta sua primeira Opção de Unidade ativa.
2. Cada célula de unidade, grupamento e turno mantém, até sua capacidade, as Candidaturas com maior Pontuação de Prioridade.
3. Dentro da célula aplicam-se, na ordem, os desempates do Conjunto de Regras.
4. Quem não é retido avança para a preferência seguinte.
5. As rodadas continuam até não haver nova movimentação ou opções disponíveis.
6. Cada Candidatura retida produz no máximo uma Oferta de Vaga.

A ordem de preferência define onde a Candidatura tenta primeiro. Dentro de uma unidade, prevalecem prioridade e desempates: escolher uma unidade como primeira preferência não coloca uma Candidatura de menor prioridade à frente de outra de maior prioridade.

Quando persistir empate depois dos critérios oficiais conhecidos, o protótipo usa um **Desempate Simulado** determinístico, reproduzível por uma semente pública do Cenário e claramente identificado. Ele não é apresentado como mecanismo oficial da SME.

### Reserva e capacidade

- criar a Oferta reserva temporariamente uma Vaga e suspende atomicamente as outras opções da Candidatura;
- a Direção da Unidade confirma a disponibilidade operacional antes da Convocação;
- Matrícula efetivada transforma a reserva em ocupação definitiva;
- indisponibilidade da unidade, recusa, falta de contato ou não comparecimento liberam a Vaga conforme o modelo de estados;
- nunca se excede a capacidade da célula nem se mantém mais de uma Oferta ativa por Candidatura.

### Rodadas ao longo do ciclo

- **Rodada inicial:** processa a Coorte de Demanda e a capacidade configurada para o início do processo.
- **Rodada incremental:** é acionada quando surge ou é liberada uma Vaga e considera apenas Candidaturas atualmente em `Aguardando vaga`.

Uma nova rodada não desfaz Ofertas ativas nem Matrículas.

Depois de recusa ou impedimento da unidade, a Reativação preserva Pontuação de Prioridade e devolve a Candidatura a todas as opções ainda ativas, inclusive preferências superiores que antes não tinham capacidade. Ficam excluídas a unidade recusada, opções removidas pelo Responsável, opções que perderam elegibilidade e qualquer unidade já associada a Oferta ou Matrícula.

### Explicação para o Responsável

A Explicação da Oferta possui duas camadas.

Resumo:

> Você recebeu uma oferta na sua 2ª preferência. Sua 1ª preferência não possuía vaga disponível para sua posição nesta rodada.

Detalhes:

- preferência da unidade ofertada;
- critérios comprovados e Pontuação de Prioridade;
- desempates aplicados;
- capacidade considerada para unidade, grupamento e turno;
- motivo de cada preferência anterior não ter produzido Oferta;
- versão do Conjunto de Regras e data da Rodada de Matching;
- identificação de capacidade, evento ou desempate simulado.

Qualquer posição exibida é uma fotografia daquela rodada. A explicação nunca revela dados pessoais de outras famílias e nunca é produzida por um modelo de linguagem a partir de regras implícitas: ela deriva da trilha determinística do matching.

### Invariantes

- mesma entrada, mesmo Conjunto de Regras e mesma semente produzem o mesmo resultado;
- uma alteração cria nova versão do Cenário, sem reescrever a rodada anterior;
- propensão prevista de aceite, distância geral, canal de contato ou comportamento passado não alteram prioridade;
- nenhuma intervenção manual pode escolher uma Candidatura ou mudar sua posição sem uma exceção formal, registrada e autorizada fora do fluxo normal.
