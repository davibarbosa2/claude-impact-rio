# Como a Convocação fecha o ciclo sem perder auditabilidade?

Type: grilling
Status: resolved
Blocked by: 03, 04, 05, 07
Parent: [Inscrição Creche: uma candidatura, duas faces](../map.md)

## Question

Como Oferta de Vaga, tentativas de contato, atualização cadastral, aceite, prazo, extensão, recusa, impossibilidade de contato e liberação da Vaga devem funcionar no Cenário?

## Answer

### Início e fonte de verdade

A Convocação começa depois que o matching reserva uma única Oferta de Vaga e a Direção da Unidade confirma sua disponibilidade operacional.

A página segura da Oferta é a fonte de verdade para o Responsável. WhatsApp, SMS, e-mail, telefone e caixa de entrada do produto são canais de aviso e contato; não mantêm versões independentes de prazo ou decisão. Mensagens externas exibem apenas o mínimo necessário e um link seguro, sem pontuação, critérios socioeconômicos ou outros dados sensíveis.

### Canais e tentativas

- o Responsável escolhe um canal preferencial e canais de apoio, que precisam ser verificados;
- a caixa de entrada do produto sempre recebe a Notificação;
- a Direção da Unidade começa pelo canal preferencial e alterna canais e horários enquanto não houver Contato Estabelecido;
- no cenário de 2026, há no mínimo uma Tentativa de Contato por dia durante três dias consecutivos, em horários diferentes;
- uma Notificação automática não conta sozinha como Tentativa de Contato;
- conta a ação iniciada ou validada pela Direção da Unidade que registre canal, horário, destino e resultado;
- as tentativas param imediatamente quando o Contato é estabelecido.

### Contato Estabelecido

Somente uma destas evidências estabelece contato:

- ação explícita do Responsável na página segura;
- resposta válida em canal integrado;
- interação de mão dupla registrada pela Direção da Unidade.

Entrega ou leitura de mensagem, abertura de e-mail e visualização passiva da página não bastam.

### Página da Oferta

O Responsável encontra:

- unidade, endereço, mapa, grupamento e turno;
- posição da unidade entre suas preferências;
- Explicação da Oferta;
- prazo atual e contagem regressiva;
- próximos passos e documentos;
- ações `Tenho interesse`, `Não tenho interesse`, `Preciso de mais prazo`, `Meus dados de contato estão incorretos` e `Preciso de ajuda`.

`Tenho interesse` estabelece contato, encerra as tentativas e move a Candidatura para `Matrícula em andamento`; é uma intenção registrada, não a Matrícula. `Não tenho interesse` registra recusa explícita, libera a Vaga, remove aquela unidade e Reativa as opções restantes. `Preciso de ajuda` estabelece contato e cria uma tarefa urgente para a Direção da Unidade, sem significar aceite.

### Atualização cadastral

- contato e canais podem ser atualizados a qualquer momento e valem para toda a Candidatura;
- o novo canal precisa ser verificado antes de entrar no protocolo;
- se a atualização ocorrer antes do Contato Estabelecido, o protocolo de três dias reinicia uma única vez por Oferta;
- tentativas anteriores permanecem na trilha e o reinício registra seu motivo;
- depois do Contato Estabelecido, atualizar contato não reinicia o prazo de comparecimento.

O reinício é política proposta do produto e deve ser diferenciado da regra oficial quando apresentado.

### Prazo e extensão

- Contato Estabelecido inicia dois dias úteis para comparecimento no cenário de 2026;
- a Solicitação de Extensão precisa ocorrer antes do vencimento e conter justificativa;
- enquanto uma solicitação tempestiva aguarda decisão, a Oferta não expira — salvaguarda proposta do produto;
- a Direção da Unidade aprova ou recusa com motivo registrado;
- no cenário de 2026, há no máximo uma extensão de um dia útil;
- não comparecimento só pode ser concluído depois do prazo aplicável e de qualquer extensão válida.

### Liberação e Reativação

| Desfecho | Efeito |
|---|---|
| Recusa explícita | Libera imediatamente a Vaga, remove a unidade recusada e Reativa as opções restantes. |
| Indisponibilidade informada pela unidade | Libera imediatamente a Vaga e Reativa as opções restantes. |
| Impossibilidade de contato | Libera a Vaga e move a Candidatura para `Ação necessária`; exige atualização de contato e reafirmação de interesse para Reativação. |
| Não comparecimento | Libera a Vaga e move a Candidatura para `Ação necessária`; exige reafirmação para Reativação. |
| Matrícula efetivada | Ocupa definitivamente a Vaga e encerra as demais opções. |

Impossibilidade de contato e não comparecimento são ações de alto impacto. O sistema prepara a transição, mas a Direção da Unidade confirma depois de verificar o protocolo. Recusa explícita e indisponibilidade da unidade podem produzir o efeito imediatamente porque já possuem ator e motivo inequívocos.

### Auditoria e demo

Cada evento preserva, quando aplicável: instante, ator, canal, destino mascarado, versão do contato, versão da mensagem, resultado de entrega, resultado do contato, prazo anterior e novo, justificativa, decisão, motivo de desfecho e indicador de dado sintético.

Os eventos são acrescentados à trilha, nunca sobrescritos. Na demo, envio, entrega e resposta são simulados e identificados; a experiência e o protocolo funcionam sem alegar integração real com canais oficiais.
