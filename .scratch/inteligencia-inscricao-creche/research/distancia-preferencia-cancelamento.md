# Distância, preferência e cancelamento: o que a base sustenta

## Resposta curta

No extrato anonimizado de 2021–2025, opções territorialmente mais próximas **por proxy** — mesmo bairro ou mesmo CEP do endereço do Responsável e da unidade — aparecem com maior frequência nas primeiras preferências e estão associadas a mais registros `Confirmado`. Opções em outro bairro aparecem mais em `Lista de espera` e, dentro de cada ordem de preferência, um pouco mais em `Cancelado na confirmacao`.

Isso **não demonstra que distância causou cancelamento**. A base não contém distância ou tempo de deslocamento, momento e histórico das ofertas, contatos realizados, resposta da família nem motivo do cancelamento. Os nomes de situação são estados de workflow, não motivos.

Além disso, o repositório adverte que os dados foram anonimizados com aleatorização, generalização e supressão e que indicadores calculados **não representam a realidade**. Os números abaixo descrevem apenas o extrato fornecido e servem para validar lógica e desenho de produto, não para publicar KPIs da SME-Rio.

## Método

- Fonte principal: `01_QueryA_InscricoesPorAno.csv.gz`, no commit `057b975e379ba021375c9024339a8cac4af65d28` do repositório da SME-Rio.
- Grão: 837.179 opções de unidade, pertencentes a 343.308 candidaturas, identificadas por `(prm_id, plm_id, ipl_id)`.
- Localização da unidade: junção das 837.179 linhas com `04_UnidadesEscolaresComEndereco.csv` pelo código `unidade`; quando o bairro estava ausente, foi usado o bairro de `Unidades_Unificadas_com_Localizacao.xlsx`.
- Comparação territorial: bairro em maiúsculas, sem acentos e sem pontuação. `Mesmo bairro` significa igualdade textual normalizada; não significa distância curta. CEP foi comparado após manter apenas os oito dígitos.
- Cobertura: 809.990 opções (96,75%) possuíam bairro comparável dos dois lados; 783.951 (93,64%) possuíam CEP comparável.
- Situação: foi usada a situação registrada na extração. Não há timestamp de transição de estado.
- Onze linhas anômalas com `opcao = 6` foram mantidas nos totais gerais e excluídas das tabelas de 1ª a 5ª preferência; nenhuma está `Confirmado`.

## Achados observáveis

### 1. As preferências mais altas são mais locais

Entre as opções com bairro comparável, a proporção no mesmo bairro cai de 60,91% na primeira escolha para 44,06% na quinta.

| Ordem da opção | Mesmo bairro | Opções comparáveis |
| ---: | ---: | ---: |
| 1ª | 60,91% | 333.697 |
| 2ª | 54,91% | 203.274 |
| 3ª | 51,50% | 137.191 |
| 4ª | 47,18% | 82.248 |
| 5ª | 44,06% | 53.573 |

O dado sustenta que bairro e ordem de preferência estão associados. Ele não revela se a família escolheu uma unidade distante por trabalho, rede de apoio, mudança planejada ou falta de alternativa — possibilidades explicitamente mencionadas pela própria SME no briefing oral.

### 2. Mesmo bairro está associado a mais `Confirmado`, inclusive ao comparar a mesma ordem

No conjunto comparável, 27,19% das opções no mesmo bairro estão `Confirmado`, contra 19,31% das opções em outro bairro. A diferença permanece ao separar por ordem de preferência:

| Ordem | `Confirmado`, mesmo bairro | `Confirmado`, outro bairro | `Cancelado na confirmacao`, mesmo bairro | `Cancelado na confirmacao`, outro bairro |
| ---: | ---: | ---: | ---: | ---: |
| 1ª | 42,78% | 33,71% | 10,74% | 13,88% |
| 2ª | 18,11% | 14,70% | 14,85% | 16,73% |
| 3ª | 12,68% | 10,27% | 16,04% | 17,55% |
| 4ª | 9,48% | 7,93% | 16,73% | 17,57% |
| 5ª | 8,33% | 7,27% | 17,17% | 17,83% |

Ao estratificar também por ano, a taxa de `Confirmado` é maior no mesmo bairro em 24 de 25 combinações ano × ordem. A única exceção é a quinta opção de 2023, com diferença de apenas −0,12 ponto percentual. Como proxy territorial mais estrito, opções no mesmo CEP têm 40,61% de `Confirmado`, contra 22,97% nos demais CEPs; somente 4,28% das opções com CEP comparável estão no mesmo CEP.

Essas são associações descritivas. Popularidade da unidade, vagas disponíveis, grupamento, turno, vulnerabilidade/pontuação, regras distintas por ano e seleção feita pela própria família podem explicar parte ou toda a diferença.

### 3. Ordem de preferência está fortemente associada à situação

Em todas as 837.179 opções, `Confirmado` cai de 38,34% na primeira escolha para 7,48% na quinta. Entre as 192.570 candidaturas que possuem um `Confirmado`, a opção confirmada é a primeira em 68,35% dos casos, a segunda em 17,55%, a terceira em 8,23%, a quarta em 3,71% e a quinta em 2,16%.

Cada candidatura tem zero ou exatamente um `Confirmado` no extrato. Isso permite medir qual opção terminou confirmada, mas não permite reconstruir quais vagas foram efetivamente oferecidas antes dela nem se uma preferência superior estava disponível.

### 4. “Cancelado” não é sinônimo de “família recusou”

O cruzamento das opções da mesma candidatura mostra que os rótulos se comportam como estados operacionais:

| Situação da opção | Linhas | Linhas em candidatura que também tem um `Confirmado` |
| --- | ---: | ---: |
| `Cancelado pelo sistema` | 326.316 | 249.282 (76,39%) |
| `Cancelado na confirmacao` | 118.816 | 25.817 (21,73%) |
| `Cancelado` | 18.722 | 28 (0,15%) |

A forte coexistência de `Cancelado pelo sistema` com outra opção `Confirmado` é compatível com fechamento automático das alternativas após uma confirmação, mas o extrato não registra o evento que produziria essa conclusão. Já `Cancelado na confirmacao` pode estar associado a uma falha ou desistência na etapa de confirmação, porém não informa o motivo. Somar essas categorias como “recusas”, ou atribuí-las à distância, seria incorreto.

## Inferências que devem ser rejeitadas

- **“Distância causa cancelamento.”** Não há distância, rota, tempo de viagem ou motivo de cancelamento.
- **“Outro bairro significa opção inviável.”** Bairro residencial não é necessariamente a origem do deslocamento; trabalho e rede de apoio podem tornar uma opção distante desejável.
- **“Todo cancelamento representa uma oferta recusada.”** Muitos cancelamentos coexistem com uma confirmação na mesma candidatura, e não há log de ofertas.
- **“`Confirmado` equivale comprovadamente a matrícula efetivada.”** A base encerra na situação da opção e não possui vínculo individual com matrícula posterior.
- **“As taxas são KPIs reais da cidade.”** O aviso de anonimização do conjunto proíbe essa leitura.
- **“A comparação entre anos mede evolução.”** A régua socioeconômica e as condições de oferta mudaram; uma série temporal bruta mistura mecanismos diferentes.

## Uso seguro no protótipo e dado que falta

Geografia pode entrar como **sinal suave, explicável e controlado pela família**: exibir bairro/estimativa de deslocamento, ordenar sugestões sem excluir unidades e pedir confirmação explícita de viabilidade. Não deve virar barreira automática nem prova de propensão a aceitar.

Para testar causalidade ou otimizar convocação, o produto precisaria registrar, por `Oferta de Vaga`: unidade e preferência, instante da oferta, capacidade disponível, posição/pontuação aplicável, tentativas e canais de contato, resposta e instante da resposta, motivo padronizado de recusa/desistência, confirmação e matrícula posterior. Origem/destino geocodificados ou tempo de transporte consentido seriam necessários para falar em distância real.

## Referências e reprodução

- [README e aviso de anonimização do conjunto](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/README.md)
- [Dicionário da Query A e das situações](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/Bases%20IC_%20ClassificadoseFila/README_dicionario_dados.md)
- [Query A, uma linha por opção](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/Bases%20IC_%20ClassificadoseFila/01_QueryA_InscricoesPorAno.csv.gz)
- [Endereços das unidades](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/Bases%20IC_%20ClassificadoseFila/04_UnidadesEscolaresComEndereco.csv)
- [Localização e coordenadas das unidades](https://github.com/CIT-SME-RJ/dadoscreche/blob/057b975e379ba021375c9024339a8cac4af65d28/OferecimentosEvagas/Unidades_Unificadas_com_Localizacao.xlsx)
- Briefing SME fornecido à equipe (arquivo de referência não versionado)
- Transcrição completa dos áudios, especialmente o Áudio 5 (arquivo de referência não versionado)

Reprodução: ler a Query A com separador `;` e UTF-8 BOM; agrupar candidatura pela chave tripla; juntar unidade após remover zeros à esquerda do código; normalizar bairro como descrito; calcular contagens por `opcao`, igualdade territorial e `situacao`. Para a tabela de coexistência, marcar cada candidatura que possui `Confirmado` e contar as demais linhas por situação. Nenhuma imputação, geocodificação de CEP, teste causal ou inferência estatística foi aplicada.
