

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  //devtools: { enabled: true }
  modules:[
    'nuxt-mongoose',
  ],
  
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
  },

  app:{
    baseURL: '/'
  },
})
