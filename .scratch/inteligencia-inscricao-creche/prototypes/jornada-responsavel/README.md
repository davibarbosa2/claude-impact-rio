# Protótipo descartável — Jornada do Responsável

> Pergunta: qual estrutura torna a jornada inteira mais compreensível para o Responsável, do cadastro à Matrícula ou à Reativação?

Três variantes da mesma jornada, alternáveis por `?variant=`:

- `A`: assistente passo a passo;
- `B`: central da candidatura;
- `C`: exploração pelo mapa.

Cada variante pode ser testada nos momentos `cadastro`, `opcoes`, `espera`, `oferta`, `reativacao` e `matricula` pelo seletor superior ou pelo parâmetro `?stage=`.

## Executar

Na raiz do workspace:

```bash
bash .scratch/inteligencia-inscricao-creche/prototypes/jornada-responsavel/serve.sh
```

Depois, abrir `http://localhost:4173/?variant=A&stage=cadastro`.

## Limites deliberados

- Código descartável, sem persistência ou backend.
- Criança, distância, disponibilidade, prazos e eventos são demonstrativos.
- Nomes e endereços das unidades vêm do catálogo `04_UnidadesEscolaresComEndereco.csv` do repositório `CIT-SME-RJ/dadoscreche`.
- A barra preta superior e o seletor inferior são o aparato de teste, não partes do produto.
- O protótipo não executa alocação, não envia mensagens e não representa integração real com a SME.

## Decisão capturada

A solução final combina as três estruturas:

- **A** para cadastro, Oferta e seus desfechos;
- **C** dentro da escolha das unidades;
- **B** para acompanhamento depois do envio.

Na escolha, Sugestões de Unidade são opcionais. O Responsável pode buscar todo o catálogo participante e somente ações explícitas de adicionar formam sua lista ordenada de até cinco Opções de Unidade.
