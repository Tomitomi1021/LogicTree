// https://nuxt.com/docs/api/configuration/nuxt-config
console.log("DEBUG HOGEHOGE");
console.log(`proces.env?.BASE_URL = ${process.env?.BASE_URL}`);
export default defineNuxtConfig({
  app: {
    baseURL: process.env?.BASE_URL,
  }
})
