# Como deve funcionar a jornada do Responsável?

Type: prototype
Status: resolved
Blocked by: 05, 07, 08
Parent: [Inscrição Creche: uma candidatura, duas faces](../map.md)

## Question

Qual experiência principal da demo permite ao Responsável entender o processo, cadastrar a Criança, declarar critérios, explorar o mapa, comparar e ordenar opções viáveis, acompanhar o Estado Canônico, atualizar contato, responder a uma Oferta e compreender uma eventual Reativação com clareza?

## Answer

### Pergunta testada

Qual estrutura torna a jornada inteira mais compreensível para o Responsável no celular, do cadastro ao desfecho alternativo de Matrícula ou Reativação?

### Artefato

[Protótipo descartável com três variantes](../prototypes/jornada-responsavel/README.md)

Como o workspace não possui repositório Git, o conjunto completo de variantes permanece em `.scratch` como fonte primária da decisão, em vez de uma branch descartável.

As variantes compartilham os mesmos seis cenários de teste:

1. Cadastro;
2. escolha e ordenação de Opções de Unidade;
3. acompanhamento em `Aguardando vaga`;
4. resposta a uma Oferta;
5. Reativação das opções restantes depois de recusa;
6. Matrícula em andamento depois do aceite.

Reativação e Matrícula são ramos alternativos depois da Oferta, nunca etapas obrigatórias em sequência.

### Variantes

- **A — Passo a passo:** uma decisão principal por tela, explicação contextual e avanço linear;
- **B — Central da candidatura:** Estado Canônico, próxima ação, histórico e preferências reunidos em uma home persistente;
- **C — Mapa como ponto de partida:** descoberta espacial dominante, com lista e ações em painel associado.

### Critério principal

Celular é a experiência-base para cadastro, acompanhamento e resposta à Oferta. Desktop é secundário. A comparação deve priorizar:

- leitura e ação com uma mão;
- alvos de toque e ação principal evidentes;
- uma coluna quando o conteúdo for denso;
- nenhuma dependência de hover;
- mapa como painel associado, sem esconder a lista;
- Estado Canônico e procedência dos dados sempre compreensíveis.

### Autonomia na escolha das unidades

- o Responsável pode pesquisar todo o catálogo de unidades participantes do processo e escolher até cinco;
- Sugestões de Unidade são atalhos opcionais e explicados, nunca filtros do catálogo;
- nenhuma sugestão é pré-selecionada, adicionada ou ordenada automaticamente;
- uma unidade só vira Opção de Unidade quando o Responsável executa a ação explícita de adicionar;
- o Responsável pode adicionar, remover e ordenar suas Opções de Unidade;
- proximidade, turno e outros sinais podem organizar as sugestões para exploração, mas não escondem unidades, não restringem a escolha e não alteram prioridade ou matching;
- o mapa distingue unidades escolhidas de sugestões e preserva uma busca textual por nome, bairro ou endereço.

### Composição escolhida

A jornada usa a estrutura **A** durante cadastro e resposta urgente à Oferta, a estrutura **B** como home depois do envio e a estrutura **C** somente dentro da etapa de escolha das unidades.

Na etapa de escolha, o mapa apresenta Sugestões de Unidade como apoio, enquanto a lista `Escolhidas por você` é a única fonte das Opções de Unidade enviadas. Depois do envio, a Central da Candidatura mantém Estado Canônico, próxima ação, contato e preferências visíveis. Oferta, Matrícula e Reativação voltam a uma experiência focal, com uma decisão principal por tela.

### Verificação do protótipo

- adicionar uma sugestão exige ação explícita e aumenta o contador;
- a sexta unidade é bloqueada pelo limite de cinco;
- remover uma unidade devolve espaço à lista;
- a busca abre uma amostra do catálogo independentemente das sugestões;
- A, B e C foram verificadas em 390 px sem overflow horizontal;
- todos os botões visíveis no cenário móvel possuem pelo menos 40 px; os controles principais usam 44 px.
