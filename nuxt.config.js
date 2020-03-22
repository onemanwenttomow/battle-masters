export default {
    mode: "universal",
    serverMiddleware: ["~/api/index.js"],

    /*
   ** Headers of the page
   */
    head: {
        title: process.env.npm_package_name || "",
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || ""
            }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚔️</text></svg>" }]
    },
    /*
   ** Customize the progress-bar color
   */
    loading: { color: "#fff" },
    /*
   ** Global CSS
   */
    css: [],
    /*
   ** Plugins to load before mounting the App
   */
    plugins: ['~/plugins/vue-fragments'],
    /*
   ** Nuxt.js dev-modules
   */
    buildModules: [],
    /*
   ** Nuxt.js modules
   */
    modules: [
        '@nuxtjs/axios',
    ],
    /*
   ** Build configuration
   */
    build: {
    /*
     ** You can extend webpack config here
     */
        extend(config, ctx) {}
    }
};
