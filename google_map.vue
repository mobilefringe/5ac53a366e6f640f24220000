<template>
    <div class="" id="map">
    </div>
</template>

<script>
    define(["Vue", "vuex", 'vue!social_links.vue', "bootstrap-vue", "json!menu_items.json"], function (Vue, Vuex, SocialLinks, BootstrapVue, MenuItems) {
        Vue.use(BootstrapVue);
        return Vue.component("header-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    dataLoaded: false,
                    show_mobile_menu: false,
                    property_logo: "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1522945080899/mmlogo500.png",
                    menu_items: MenuItems
                }
            },
            created () {
              console.log("MenuItems", MenuItems)  
            },
            watch: {
                $route: function() {
                    // hide dropdown when route changes
                    _.forEach(this.menu_items, function(value, key) {
                        value.show_sub_menu = false;
                    });
                    this.show_mobile_menu = false; //close menu when navigating to new page
                },
                show_mobile_menu: function() {
                    if(this.show_mobile_menu === true){
                        document.body.classList.add("no-scroll");
                    } else if (this.show_mobile_menu === false) {
                        document.body.classList.remove("no-scroll");
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getTodayHours'
                ]),
                todays_hours() {
                    return this.getTodayHours;
                }
            },
            
        });
    });
</script>