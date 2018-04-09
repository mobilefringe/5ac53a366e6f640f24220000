<template>
	<div class="page_container store_dets_container" v-if="dataLoaded" id="store_dets_container">
		<div class="page_header" v-if="pageBanner" v-lazy:background-image="pageBanner.image_url">
			<!--http://via.placeholder.com/1920x300-->
			<div class="site_container">
				<div class="header_content">
					<!--<h1>{{$t("stores_page.store_directory")}}</h1>-->
                    <h1 class="event_store_name caps" v-if="locale=='en-ca'">{{currentStore.name}}</h1>
					<h1 class="event_store_name caps" v-else>{{currentStore.name_2}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container">
			<div class="row">
				<div class="col-sm-4 promo_logo_container hidden_phone">
					<div class="image_container">
						<img v-lazy="currentStore.store_front_url_abs" class="image"/>
					</div>
				</div>
				<div class="col-sm-8 promo_image_container text-left">
					<div class="col-sm-12 no_padding">
						<png-map ref="pngmapref" v-bind:png-map-url="getPNGurl" :initial-position="'700 450'" :height="_.toNumber('625')" @updateMap="updatePNGMap"></png-map>
					</div>
				</div>
			</div>
			<!--<hr class="green_hr">-->
			<div class="row margin_tb_30">
				<div class="col-sm-4">
					<div class="text-center">
					 <!--   <h4 class="event_store_name caps" v-if="locale=='en-ca'">{{currentStore.name}}</h4>-->
						<!--<h4 class="event_store_name caps" v-else>{{currentStore.name_2}}</h4>-->
						<h4 v-if="currentStore.phone" class="store_dets_title"> <a :href="'tel:'+currentStore.phone">{{currentStore.phone}}</a></h4>
						<h4 v-if="currentStore.website" class="store_dets_title store_website_btn"> <a :href="'//'+currentStore.website" target="_blank">{{$t("stores_page.store_website")}}</a></h4>
						<!--<h4 v-if="storeHours.length > 0 " class="store_dets_title">{{$t("stores_page.store_hours")}}</h4>-->
						<!--<ul class="store_hours_list">-->
						<!--	<li v-if="storeHours" v-for="hour in storeHours" class="col-xs-12">-->
						<!--	    <span class="col-xs-6 text-left">{{hour.day_of_week | moment("dddd", timezone)}}</span>-->
						<!--		<span v-if="hour.is_closed" class="col-xs-6 text-left">Closed</span>-->
						<!--		<span v-else class="col-xs-6 text-left">{{hour.open_time | moment("h A", timezone)}} - {{hour.close_time | moment("h A", timezone)}}</span>-->
						<!--	</li>-->
						<!--</ul>-->
					</div>
				</div>
				<div class="col-sm-8 text-left">
					<h4 v-if="currentStore.rich_description" class="store_dets_title caps about_us_btn"> {{$t("stores_page.about_us")}}</h4>
					<div class="text-left promo_description">
						<p v-if="locale=='en-ca'" v-html="currentStore.rich_description"></p>
						<p v-else v-html="currentStore.rich_description_2"></p>
					</div>
					<div class="store_promo_container" v-if="promotions.length > 0">
						<div class="promo_container_title text-left caps"></div>
						<h4 v-if="currentStore.rich_description" class="store_dets_title caps margin_30">{{$t("promos_page.promotions")}}</h4>
						<div class="row store_promo_dets text-left" v-for="promo in promotions"  :key="promo.id">
							<div class="col-sm-6 no_padding" >
								<div class="promo_div_image">
									<img v-lazy="promo.image_url" class="image" alt=""/>
								</div>
								<div class="store_promo_dets_container padding_tb_20">
								    <p class="promo_div_name" v-if="locale=='en-ca'">{{promo.name}}</p>
								    <p class="promo_div_name" v-else>{{promo.name_2}}</p>
    								<p class="promo_div_date"><i class="fa fa-calendar"></i>{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
    								<div class="text-center">
    								    <span class="store_dets_btn">
        									<router-link :to="'/promotions/'+promo.slug" class="" >{{$t("promos_page.read_more")}}</router-link>
        								</span>
    								</div>
    								
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
	#png_map{
	    width:1310px;
		height: 983px;
		min-width:1310px;
		min-height: 983px;
	}
</style>
<script>
    define(['Vue', 'vuex', 'moment', "jquery", "smooth-zoom", "vue!png-map", 'vue-lazy-load'], function(Vue, Vuex, moment, $, smoothZoom, PNGMapComponent, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentStore: null,
                    promotions : [],
                    jobs:[],
                    dataLoaded: false,
                    pageBanner : null ,
                    storeHours :[]
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.currentStore = this.findStoreBySlug(to.params.id);
                if (this.currentStore === null || this.currentStore === undefined){
                    this.$router.replace('/');
                }
                next();
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.updateCurrentStore(this.id);
                    var temp_repo = this.findRepoByName('Stores Banner');
                    if(temp_repo) {
                        // this.pageBanner = temp_repo.images[0];
                        this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030030796/store_dets_inside_banner.png"
                    }
                    this.pageBanner = this.pageBanner;
                });
                 console.log("locale created", this.locale);
            },
            watch: {
                currentStore: function() {
                    if ( _.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.store_front_url_abs = "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1518554684072/bonniedoonlogo.png";
                    }
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        current_promo.description_short = _.truncate(current_promo.description, {
                            'length': 70
                        });
                        temp_promo.push(current_promo);
                    });
                    _.forEach(this.currentStore.jobs, function(value, key) {
                        var current_job = vm.findJobById(value);
                        current_job.description_short = _.truncate(current_job.description, {
                            'length': 70
                        });
                        temp_job.push(current_job);

                    })
                    this.promotions = temp_promo;
                    this.jobs = temp_job;
                    
                    var storeHours = [];
                    var vm = this;
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        var hour = vm.findHourById(value);
                        if(hour.day_of_week === 0){
                            hour.order = 7;
                        }
                        else {
                            hour.order = hour.day_of_week;
                        }
                        storeHours.push(hour);
                    });
                        this.storeHours = _.sortBy(storeHours, [function(o) { return o.order; }]);
                    // setTimeout(function() {
                    //     vm.addLandmark(vm.currentStore);
                    // }, 500);
                },
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                },
            },
            
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'findStoreBySlug',
                    'findPromoById',
                    'findJobById',
                    'findRepoByName',
                    'findHourById'
                ]),
                getPNGurl () {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                pngMapRef() {
                    return this.$refs.pngmapref;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData", "jobs"),this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore (id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined){
                        this.$router.replace('/');
                    }
                },
                // updateSVGMap(map) {
                //     this.map = map;
                // },
                addLandmark(store) {
                    this.pngMapRef.addMarker(store);
                },
                updatePNGMap(map) {
                    this.map = map;
                    console.log("in updatepng");
                    this.addLandmark(this.currentStore);
                },
            }
        });
    });
</script>