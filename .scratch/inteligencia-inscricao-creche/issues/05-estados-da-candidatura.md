# Qual é o modelo de estados da Candidatura do cadastro à matrícula?

Type: grilling
Status: resolved
Blocked by: 03
Parent: [Inscrição Creche: uma candidatura, duas faces](../map.md)

## Question

Quais estados, transições, responsáveis, prazos e exceções descrevem uma única Candidatura desde o cadastro até a Matrícula ou encerramento, sem voltar a fragmentá-la em inscrições independentes?

## Answer

### Duas camadas de estado

Os valores existentes (`Ativo`, `Lista de espera`, `Selecionado`, `Confirmado` e os diferentes `Cancelado`) permanecem como **Situação de Origem** de cada Opção de Unidade. Eles não viram automaticamente estados da Candidatura: são fotografias finais, por opção, e não demonstram a cronologia nem a Matrícula.

O produto usa **Estados Canônicos**. O Responsável vê um macroestado simples da Candidatura, enquanto a Creche vê os subestados operacionais de comprovação, Oferta, Convocação e Matrícula.

### Estados da Candidatura

```text
Cadastro em andamento
→ Comprovação pendente
→ Aguardando vaga
→ Oferta disponível
→ Matrícula em andamento
→ Matriculada
```

Dois desvios completam o modelo:

- **Ação necessária:** estado recuperável após falta de contato ou não comparecimento; aguarda atualização de contato e reafirmação de interesse.
- **Encerrada:** estado terminal de insucesso, sempre acompanhado de motivo explícito.

### Oferta e Convocação

```text
Oferta reservada pelo sistema
→ Vaga confirmada pela Creche
→ Convocação em andamento
→ Contato estabelecido
→ Confirmação do Responsável
→ Matrícula em andamento
→ Matrícula efetivada
```

- A reserva suspende, mas não cancela, as demais opções.
- Indisponibilidade informada pela Creche libera a Vaga e reativa automaticamente as opções restantes.
- Recusa explícita remove apenas a unidade recusada e reativa automaticamente as opções restantes.
- Falta de contato ou não comparecimento libera a Vaga e move a Candidatura para `Ação necessária`; não há reentrada automática até o Responsável atualizar o contato e reafirmar interesse.
- Matrícula efetivada encerra todas as demais opções.
- A Confirmação digital registra intenção e encerra as tentativas de contato, mas não substitui a efetivação da Matrícula pela Creche.

O produto demonstra como política principal a reentrada nas opções restantes. O comportamento oficial de 2026, que descontinua a participação após uma oferta malsucedida, permanece disponível como Cenário-base comparativo e deve ser identificado como regra vigente.

Resultado inicial e convocação contínua usam o mesmo modelo; a Oferta registra seu tipo e aplica o calendário correspondente. A demo aprofunda a convocação contínua, onde se concentram as dores de comunicação.

### Donos das transições

| Ator | Transições sob sua responsabilidade |
|---|---|
| Responsável | Enviar a Candidatura; atualizar contato; alterar preferências quando permitido; confirmar ou recusar a Oferta; reafirmar interesse; desistir. |
| Sistema | Calcular prioridade; inserir nas filas; reservar uma única Oferta; suspender e reativar opções; controlar prazos e alertas. |
| Direção da Unidade | Validar comprovações; confirmar disponibilidade da Vaga; registrar contatos; conceder extensão justificada; informar impedimento; efetivar a Matrícula. |
| Operador da Rede | Configurar regras e capacidade; supervisionar o fluxo; atuar em uma Candidatura somente como exceção auditada. |

### Prazos do Cenário 2026

- comprovação inicial: usa o calendário versionado do processo, sem prazo universal fixado no formulário;
- Convocação: no mínimo uma tentativa por dia durante três dias consecutivos, em horários diferentes;
- após contato estabelecido: dois dias úteis para comparecimento, com extensão justificada de até um dia útil;
- pendências documentais: até 30 dias depois da confirmação da Matrícula;
- `Ação necessária`: permanece até a Reativação da Candidatura ou o encerramento do ciclo anual.

### Alterações depois do envio

- contato e canais de comunicação podem ser atualizados a qualquer momento;
- preferências podem ser alteradas em `Aguardando vaga` ou `Ação necessária`, nunca durante uma Oferta ativa;
- critérios socioeconômicos só mudam mediante nova comprovação e revalidação;
- toda alteração preserva autor, data e valor anterior;
- mudar preferências provoca novo processamento das filas;
- Reativação preserva a Pontuação de Prioridade e nunca devolve a Candidatura à unidade recusada.

### Desfechos terminais

- Matrícula efetivada;
- desistência geral solicitada pelo Responsável;
- inelegibilidade;
- ausência de opções restantes;
- encerramento do ciclo anual;
- substituição por versão posterior da mesma Candidatura;
- encerramento exigido pelo RuleSet oficial quando esse Cenário estiver ativo.

`Cancelado` isoladamente nunca é um motivo suficiente. Dados históricos, estados calculados e eventos sintéticos devem permanecer identificados separadamente.
