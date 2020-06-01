export default {
    mode: "universal",
    // serverMiddleware: ["~/api/index.js"],

    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || "",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || ""
            }
        ],
        link: [
            {
                rel: "icon",
                type: "image/x-icon",
                href:
                    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚔️</text></svg>"
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
            },
            {
                rel: "stylesheet",
                href:"https://unpkg.com/nes.css@2.3.0/css/nes.min.css"
            }
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: { color: "#fff" },
    /*
     ** Global CSS
     */
    css: ["~/assets/main.css"],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: ["~/plugins/vue-fragments"],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [],
    /*
     ** Nuxt.js modules
     */
    modules: [
        "@nuxtjs/axios",
        "nuxt-socket-io"
    ],
    io: {
        sockets: [
            {
                name: "local",
                url: "https://battlemasters-sockets-server.herokuapp.com/",
                default: true, 
                vuex: {
                    mutations: [
                        { news: "testingSockets" }, 
                        { startgame: "startGame" },
                        { allExtraPiecesAddedToBoard: "allExtraPiecesAddedToBoard"},
                        { finishMove: "finishMove"},
                        { updateUnitPosition: "updateUnitPosition"},
                        { currentCard: "currentCard" }
                    ]
                }
            },
            {
                name: "heroku",
                url: "localhost:8080",
                default: true, 
                vuex: {
                    mutations: [
                        { startgame: "startGame" },
                        { allExtraPiecesAddedToBoard: "allExtraPiecesAddedToBoard"},
                        { finishMove: "finishMove"},
                        { updateUnitPosition: "updateUnitPosition"},
                        { currentCard: "currentCard" }
                    ]
                }
            }
        ]
    },
    generate: {
        routes: function() {
            const routes =  ["/", "/welcome"];
            for (let i = 1; i < 9; i++) {
                routes.push('/2p/room' + i);
            }
            return routes;
        }
    },
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
