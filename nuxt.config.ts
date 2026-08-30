export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2026-08-30',
  runtimeConfig: {
    public: {
      mapStyleUrl: 'https://tiles.openfreemap.org/styles/positron',
    },
  },
  ui: {
    colorMode: false,
    fonts: false,
  },
  app: {
    head: {
      title: 'Vaga Carioca — protótipo',
      meta: [
        {
          name: 'description',
          content: 'Protótipo mobile da jornada de inscrição em creche no Rio de Janeiro.',
        },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },
})
