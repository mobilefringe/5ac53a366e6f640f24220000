<template>
    <div v-if="currentPage">
        <div v-if="pageBanner" class="page_header" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
			<!--http://via.placeholder.com/1920x300-->
			<div class="site_container">
				<div class="header_content">
					<h1 v-if="locale=='en-ca'">{{currentPage.title}}</h1>
					<h1 v-else>{{currentPage.title_2}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container inside_page_content">
            <div class="margin_side_20" >
                <div class="page_body description_text text_left" v-if="locale=='en-ca'" v-html="currentPage.body"></div>
                <div class="page_body description_text text_left" v-else v-html="currentPage.body_2"></div>
            </div>
        </div>
        <div style="padding:20px 0;"></div>
    </div>
    <!--Pages Banner-->
</template>
<style>
    .page_title {
        /*border-top:1px solid #aea99e;*/
        border-bottom:1px solid #aea99e;
        height: 35px;
        line-height: 35px;
    }
    #pages_container img{
        width: 100%;
        height: auto;
    }
</style>
<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("page-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    success_subscribe: false,
                    currentPage: null,
                    pageBanner : null
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.updatePageData(to.params.id);
                next();
            },
            created(){
               this.updatePageData(this.id);
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function(id) {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        console.log("this.id", this.id);
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/" + id + ".json"}),this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updatePageData (id) {
                    this.loadData(id).then(response => {
                        if(response == null || response == undefined) {
                            this.$router.replace('/');
                        }
                        this.currentPage = response[0].data;
                        var temp_repo = this.findRepoByName('Pages Banner');
                        if(temp_repo) {
                            // this.pageBanner = temp_repo.images[0];
                            this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030133826/hours_inside_banner.png"
                        }
                        this.pageBanner = this.pageBanner;
                    });
                }
            }
        });
    });
</script>