<template>
	<div v-if="dataloaded">
		<div class="page_header" v-if="pageBanner" v-lazy:background-image="pageBanner.image_url">
			<!--http://via.placeholder.com/1920x300-->
			<div class="site_container">
				<div class="header_content caps">
					<h1>{{$t("promos_page.promotions")}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container page_content">
			<div id="events_container" v-if="promotions.length > 0">
				<paginate name="promos" v-if="promos" :list="promos" class="paginate-list margin-60" :per="4">
					<div class="row event_container" v-for="(promo,index) in paginated('promos')" :class="{ 'last': index === (paginated('promos').length - 1) }"  :key="promo.id">
					    <router-link :to="'/promotions/'+ promo.slug" class="event_learn_more pull-left">
						<div class="col-sm-6 col-md-4 event_image_container">
							<router-link :to="'/promotions/'+ promo.slug" class="event_learn_more">
								<img v-lazy="promo.store.image_url"  class="event_image image" alt=""/>
							</router-link>
						</div>
						<div class="col-sm-6 col-md-8 event_dets_container">
							<h4 class="event_name caps" v-if="locale=='en-ca'">{{promo.name}}</h4>
							<h4 class="event_name caps" v-else>{{promo.name_2}}</h4>
							<div v-if="promo.promotionable_type == 'Store'">
							    <h4 class="event_store_name caps" v-if="locale=='en-ca'">{{promo.store.name}}</h4>
							    <h4 class="event_store_name caps" v-else>{{promo.store.name_2}}</h4>
							</div>
							
							<div class="event_thick_line"></div>
							<p class="event_dates">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
							<p class="event_desc"  v-if="locale=='en-ca'" >{{promo.description_short}}</p>
							<p class="event_desc" v-else>{{promo.description_short_2}}</p>
						
							<!--<div class="text-right  col-sm-6" v-if="promo" style="padding:0">-->
								
								   
							    
							<!--</div>-->
						</div>
						</router-link>
						<div class="col-sm-12">
							<hr>
						</div>
					</div>
				</paginate>
			</div>
			<div id="no_events" class="row" v-else>
				<div class="col-md-12">
					<p>{{$t("promos_page.no_promo_message")}}</p>
				</div>
			</div>
			<div class="row margin-60">
				<div class="col-md-12">
					<paginate-links for="promos" :async="true" :limit="5" :show-step-links="true"></paginate-links>
					<!--<paginate-links for="currentSelection" :async="true" :simple="{ next: 'Next »', prev: '« Back' }"></paginate-links>-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "vue-lazy-load", "vue-paginate"], function(Vue, Vuex, moment, tz, VueMoment, Meta, VueLazyload, VuePaginate) {
        Vue.use(Meta);
        Vue.use(VueLazyload);
        Vue.use(VuePaginate);
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    selectedDate: null,
                    filteredPromos:[],
                    dataloaded: false,
                    pageBanner: null,
                    paginate: ['promos'],
                    promos : null
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataloaded = true;
                    
                    var temp_repo = this.findRepoByName('Promos Banner');
                    if(temp_repo) {
                        // this.pageBanner = temp_repo.images[0];
                        this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030051721/promos_inside_banner.png"
                    }
                    console.log(this.pageBanner);
                    this.promos = this.promotions;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'timezone',
                    'processedPromos',
                    'findRepoByName',
                ]),
                promotions() {
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        today = moment().tz(vm.timezone);
                        webDate = moment(value.show_on_web_date).tz(vm.timezone);
                        if (today >= webDate) {
                            value.description_short = _.truncate(value.description, {
                                'length': 150
                            });
                            value.description_short_2 = _.truncate(value.description_2, {
                                'length': 150
                            });
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1518554684072/bonniedoonlogo.png";
                            }
                            else if (value.store == null || value.store == undefined) {
                                value.store = {};
                                value.store.image_url =  "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1518554684072/bonniedoonlogo.png";
                            }
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "http://via.placeholder.com/400x400/757575";
                            }
                            // value.image_url = "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1516652189884/ES_logo_red2.png";
                            
                            temp_promo.push(value);
                        }
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "promotions"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                shareURL(slug){
                    var share_url = "http://mallmaverick.ca/promotions/" + slug;
                    return share_url;
                },
            }
        });
    });
</script>