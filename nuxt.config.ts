export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2026-08-30',
  ui: {
    colorMode: false,
    fonts: false,
  },
  app: {
    head: {
      title: 'Fralda Carioca',
      meta: [
        {
          name: 'description',
          content: 'Jornada de inscrição e acompanhamento de creche no Rio de Janeiro.',
        },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },
})
