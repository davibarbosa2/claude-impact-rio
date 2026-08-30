# Fralda Carioca

Protótipo mobile-first de uma jornada mais clara para inscrição e acompanhamento de vagas em creches da cidade do Rio de Janeiro.

O projeto foi criado para um hackathon apoiado pela Secretaria Municipal de Educação do Rio. A experiência guia o responsável desde o cadastro das crianças até a geração de um protocolo demonstrativo, com regras explicadas no contexto e liberdade para comparar e ordenar unidades.

> [!IMPORTANT]
> Esta é uma demonstração. Ela não cria inscrições oficiais, não reserva vagas e não apresenta disponibilidade atual. Protocolos, envios e estados de acompanhamento são simulados.
>
> Video: https://www.loom.com/share/b659f61bbcdd464a891090eb375ad4e3

## O que a demo oferece

- cadastro de até cinco crianças em uma mesma jornada;
- rascunho salvo no navegador e retomada do último passo;
- identificação do grupamento por idade e turno desejado;
- critérios socioeconômicos, pontuação estimada e documentos necessários;
- preenchimento de endereço assistido por CEP, sem bloquear a edição manual;
- busca, comparação e mapa de unidades historicamente compatíveis;
- até cinco preferências ordenadas de forma independente por criança;
- revisão completa antes do envio;
- protocolo sintético e tela de acompanhamento da candidatura.

As sugestões de unidades são separadas por proximidade, taxa histórica de atendimento, menor disputa e tentativas anteriores. Elas servem como apoio à decisão: nenhuma sugestão é adicionada automaticamente às preferências.

## Tecnologias

- [Nuxt 4](https://nuxt.com/)
- [Vue 3](https://vuejs.org/) e TypeScript
- [Nuxt UI 4](https://ui.nuxt.com/)
- [MapLibre GL](https://maplibre.org/maplibre-gl-js/docs/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)

## Executar localmente

### Pré-requisitos

- Node.js 22+
- [pnpm](https://pnpm.io/)

```bash
pnpm install
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

Não há variáveis de ambiente obrigatórias: o catálogo necessário para a demo já está versionado em `shared/data`, e o mapa usa o estilo público configurado em `nuxt.config.ts`.

## Comandos

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera a aplicação para produção |
| `pnpm preview` | Executa localmente o build de produção |
| `pnpm test` | Roda os testes de domínio com Vitest |
| `pnpm test:watch` | Roda os testes em modo interativo |
| `pnpm typecheck` | Verifica os tipos TypeScript e Vue |
| `pnpm data:sync` | Sincroniza os dados gerados do protótipo de origem |

Antes de enviar mudanças, rode:

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Como o projeto está organizado

```text
app/
├── components/       # progresso da jornada, cards e mapa de unidades
├── composables/      # rascunho local e acesso ao catálogo
├── config/           # passos e conteúdo do formulário
└── pages/            # inscrição, protocolo e acompanhamento
server/api/
├── address/          # consulta de CEP pelo ViaCEP
├── applications.post.ts
└── units/            # catálogo histórico pesquisável
shared/
├── data/             # catálogo e regras gerados, versionados
├── domain/           # validação, pontuação, geografia e seleção
└── types/            # contratos compartilhados
tests/                # testes das regras de domínio
```

O navegador mantém o rascunho em `localStorage`. O envio passa por uma API do próprio Nuxt, mas não é persistido em banco: a resposta gera somente um protocolo sintético. A consulta de CEP acontece no servidor por meio do [ViaCEP](https://viacep.com.br/), com preenchimento manual disponível em caso de falha.

## Dados demonstrativos

O catálogo é derivado das bases anonimizadas do projeto público [CIT-SME-RJ/dadoscreche](https://github.com/CIT-SME-RJ/dadoscreche). Indicadores de unidades, critérios e resultados são históricos e precisam ser substituídos por integrações oficiais antes de qualquer uso real.

Os artefatos necessários para executar a demo já estão no repositório. Para regenerá-los a partir do protótipo do time, informe a pasta `onboarding`, que deve conter `src/data/criterios.json`, `meta.json` e `unidades.json`:

```bash
DADOSCRECHE_ONBOARDING_DIR=/caminho/para/onboarding pnpm data:sync
```

## Limites do protótipo

- não há autenticação, banco de dados ou sincronização entre dispositivos;
- não há comunicação real por e-mail, WhatsApp, SMS ou push;
- o mapa usa uma origem aproximada por bairro, não o endereço exato da família;
- indicadores históricos não representam vagas abertas, probabilidade garantida ou classificação oficial;
- regras, prazos e integrações precisam ser validados com a SME para uso em produção.

## Documentação

- [Especificação funcional](./SPEC.md)
- [Vocabulário e contexto do domínio](./CONTEXT.md)
- [Mapa de decisões e pesquisa](./.scratch/inteligencia-inscricao-creche/map.md)

## Origem do projeto

Além da base pública da SME, o enquadramento do produto e o contexto do hackathon partem do [Claude Impact Lab Rio](https://github.com/taicor-ai/claude-impact-lab-rio-2).
