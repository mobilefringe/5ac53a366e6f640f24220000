require.config({
    paths: {
        'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue',
        'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min',
        'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
        'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
        'moment-timezone': 'https://momentjs.com/downloads/moment-timezone-with-data-2012-2022.min',
        'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
        'vue': 'https://mmvue.codecloudapp.com/require-vuejs.min',
        'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
        'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
        'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
        'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min',
        'Fuse': 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.4/fuse.min',
        'datastore_mutation_types': 'https://mmvue.codecloudapp.com/datastore_mutation_types',
        'datastore_getters': 'https://mmvue.codecloudapp.com/datastore_getters',
        'datastore_actions': 'https://mmvue.codecloudapp.com/datastore_actions',
        'datastore_mutations': 'https://mmvue.codecloudapp.com/datastore_mutations',
        'datastore': 'https://mmvue.codecloudapp.com/datastore',
        'vue-moment': 'https://mmvue.codecloudapp.com/vue-moment',
        'today_hours': 'https://mmvue.codecloudapp.com/today_hours.vue?noext', //append a dummy query string so requireJS doesn't auto-append .js to the end of the url
        'search-component': 'https://mmvue.codecloudapp.com/search-component.vue?noext',
        'slick': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min',
        'vue-slick': 'https://mmvue.codecloudapp.com/slick.vue?noext',
        'vue-select': 'https://cdn.jsdelivr.net/npm/vue-select@2.3.0/dist/vue-select.min',
        'vue-social-sharing': 'https://cdn.jsdelivr.net/npm/vue-social-sharing@2.3.1/dist/vue-social-sharing.min',
        'vee-validate' : 'https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate',
        'v-calendar': 'https://unpkg.com/v-calendar@0.5.1/lib/v-calendar.min',
        'lightbox': 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.10.0/js/lightbox.min',
        //png-map dependencies
        'smooth-zoom' : 'https://codecloud.cdn.speedyrails.net/sites/59035a6c6e6f645a5b420000/application/x-javascript/1503602727000/smoothZoomA24',
        'png-map' : 'https://preview-mmvue.codecloudapp.com/png-map.vue?noext',
        'vue-simple-spinner': 'https://cdn.jsdelivr.net/npm/vue-simple-spinner@1.2.8/dist/vue-simple-spinner.min',
        'vue-lazy-load': 'https://unpkg.com/vue-lazyload/vue-lazyload',
        'masonry' : 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min',
        'vue-masonry-plugin' : 'https://cdn.jsdelivr.net/npm/vue-masonry@0.10.16/dist/vue-masonry-plugin',
        'vue-paginate': 'https://cdnjs.cloudflare.com/ajax/libs/vue-paginate/3.5.1/vue-paginate',
        'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext',
        'bootstrap-vue' : 'https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue'
    }
});

require(['Vue', 'vuex', 'vue2-filters', 'vue_router', 'routes', 'datastore', 'vue-i18n', 'locales','jquery', 'moment', "vue-meta", "moment-timezone", "vue-moment",'vue-social-sharing','vue-select', "vue!search-component",'vue-simple-spinner','vue!loader.vue', "vue!header.vue", "json!menu_items.json"], function (Vue, Vuex, Vue2Filters, VueRouter, appRoutes, store, VueI18n, messages,$, moment, Meta, tz, VueMoment,SocialSharing, VueSelect, SearchComponent, Spinner, Loader, Header, MenuItems) {
    Vue.use(Meta);
    Vue.use(VueRouter);
    Vue.use(Vue2Filters);
    Vue.use(VueI18n);
    Vue.use(SocialSharing);
    
    /* initialize router */
    const router = new VueRouter({
        mode: 'history',
        routes: appRoutes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    });

    /* initialize i18n */
    const i18n = new VueI18n({
        locale: 'en-ca',
        fallbackLocale: 'en-ca',
        messages,
    });

    Vue.component('v-select', VueSelect.VueSelect);
    /* bootstrap app */
    const vm = new Vue({
        el: '#app',
        data: function() {
            return {
                dataLoaded: false,
                show_mobile_menu: false,
                menu_items: MenuItems,
                search_result : null,
                suggestionAttribute: 'name',
                newsletter_email: "",
                stickyMenu: false,
                isSticky: 700,
                property_logo : "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1522945080899/mmlogo500.png"
            }
        },
        created() {
            this.loadData().then(response => {
                this.dataLoaded = true;
                this.locale = "en-ca";
            });
            window.addEventListener('scroll', this.enableStickyNavbar);
        },
        watch: {
            // watcher to update vue-i18n when the locale has been changed by the user
            locale: function(val, oldVal) {
                this.$i18n.locale = val;
                moment.locale(val);
            },
            $route: function() {
                // hide dropdown when route changes
                _.forEach(this.menu_items, function(value, key) {
                    value.show_sub_menu = false;
                });
                this.show_mobile_menu = false; //close menu when navigating to new page
            },
            show_mobile_menu: function() {
                if(this.show_mobile_menu == true){
                    document.body.classList.add("no-scroll");
                } else if (this.show_mobile_menu == false) {
                    document.body.classList.remove("no-scroll");
                }
            }
        },
        computed: {
            // computed property for locale which returns locale value from data store and also updates the data store with new locale information
            locale: {
                get() {
                    return this.$store.state.locale
                },
                set(value) {
                    this.$store.commit('SET_LOCALE', {
                        lang: value
                    })
                }
            },
            copyright_year() {
                return moment().year();
            },
            ...Vuex.mapGetters([
                'property',
                'timezone',
                'banners',
                'hours',
                'getTodayHours',
                'processedStores',
            ]),
            todays_hours() {
                return this.getTodayHours;
            },
            allStores() {
                return this.processedStores;
            }
        },
        methods: {
            loadData: async function() {
                try {
                    await this.$store.dispatch('initializeApi', {
                        site: "bonniedoon",
                        version: "v4"
                    });
                    await Promise.all([this.$store.dispatch("getData", "property")]);
                    // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                    let results = await Promise.all([this.$store.dispatch("INITIALIZE_LOCALE"), this.$store.dispatch("getData", "hours"), this.$store.dispatch("getData", "stores")]);
                    return results;
                } catch (e) {
                    console.log("Error loading data: " + e.message);
                }
            },
            // utility method to allow user to change locale value
            changeLocale: function(val) {
                this.locale = val; // this will update the data store, which in turn will trigger the watcher to update the locale in the system
                console.log("locale", this.locale);
            },
            onOptionSelect(option) {
                this.search_result = "";
                this.$router.push("/stores/"+option.slug);
            },
            enableStickyNavbar(e) {
                if (window.pageYOffset >= this.isSticky) {
                    this.stickyMenu = true;
                } else {
                    this.stickyMenu = false;
                }

            }
        },
        destroyed: function() {
            window.removeEventListener('scroll', this.enableStickyNavbar);
        },
        router: router,
        store,
        i18n
    });
});