# Vaga Carioca

Protótipo mobile-first para tornar mais clara a jornada de inscrição e acompanhamento de vagas em creches da cidade do Rio de Janeiro.

O projeto foi iniciado para um hackathon apoiado pela Secretaria Municipal de Educação do Rio. A demo prioriza a experiência do responsável: cadastro de crianças, critérios socioeconômicos, endereço assistido por CEP, comparação de unidades e montagem da ordem de preferência.

> Este ambiente é uma demonstração. Ele não cria inscrições oficiais, não reserva vagas e não representa disponibilidade atual.

## Tecnologias

- Nuxt 4
- Nuxt UI 4
- TypeScript
- MapLibre GL
- Vitest

## Executar localmente

Requisitos: Node.js 22+ e pnpm.

```bash
pnpm install
pnpm dev
```

Verificações do projeto:

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Dados

O catálogo demonstrativo é derivado das bases anonimizadas do projeto público [CIT-SME-RJ/dadoscreche](https://github.com/CIT-SME-RJ/dadoscreche). Indicadores de unidades, critérios e resultados são históricos e devem ser substituídos por integrações oficiais antes de qualquer uso real.

Os artefatos gerados necessários para executar a demo já estão versionados. Para sincronizar novamente a partir do protótipo do time:

```bash
DADOSCRECHE_ONBOARDING_DIR=/caminho/para/onboarding pnpm data:sync
```

## Documentação

- [Especificação de requisitos](./SPEC.md)
- [Contexto do domínio](./CONTEXT.md)
- [Mapa de decisões e pesquisa](./.scratch/inteligencia-inscricao-creche/map.md)
