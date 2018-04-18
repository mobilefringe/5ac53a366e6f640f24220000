<template>
	<div class="event_dets_container" v-if="currentEvent">
		<div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
			<div class="site_container">
				<div class="header_content caps">
					<h1>{{$t("events_page.events")}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container">
			<div class="row">
				<div class="col-sm-12 promo_image_container text-left">
					<router-link to="/events"><i class="fa fa-angle-left"></i> &nbsp; {{$t("events_page.back_to_events")}}</router-link>
					<h3 class="promo_name" style="margin: 20px auto 0px;"  v-if="locale=='en-ca'">{{currentEvent.name}}</h3>
					<h3 class="promo_name" style="margin: 20px auto 0px;"  v-else>{{currentEvent.name_2}}</h3>
					<div class="row">
						<p class="promo_div_date pull-left">{{currentEvent.start_date | moment("MMM D", timezone)}} - {{currentEvent.end_date | moment("MMM D", timezone)}}</p>
						<social-sharing :url="shareURL(currentEvent.slug)" :title="currentEvent.title" :description="currentEvent.body" :quote="_.truncate(currentEvent.description, {'length': 99})" twitter-user="EastgateSquare" :media="currentEvent.image_url" inline-template >
							<div class="blog-social-share pull-right" style="margin: 15px auto;">
								<div class="social_share">
									<network network="facebook">
										<i class="fa fa-facebook social_icons" aria-hidden="true"></i>
									</network>
									<network network="twitter">
										<i class="fa fa-twitter social_icons" aria-hidden="true"></i>
									</network>
								</div>
							</div>
						</social-sharing>
					</div>
					<div class="col-sm-12 no_padding text-center promo_dets_desc">
						<img v-if="!_.includes(currentEvent.image_url, 'missing')" v-lazy="currentEvent.image_url" class="image"/>
						<div class="text-left promo_description">
							<p v-if="locale=='en-ca'" v-html="currentEvent.rich_description"></p>
							<p v-else v-html="currentEvent.rich_description_2"></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    define(['Vue', 'vuex', 'moment', 'vue-lazy-load'], function(Vue, Vuex, moment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("event-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentEvent: null,
                    storeEvents : null,
                    storeHours : null,
                    pageBanner : null
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.currentEvent = this.findEventBySlug(to.params.id);
                    if (this.currentEvent === null || this.currentEvent === undefined){
                        this.$router.replace('/');
                    }
                next();
            },
            created(){
                this.loadData().then(response => {
                    this.updatecurrentEvent(this.id);
                    var temp_repo = this.findRepoByName('Events Banner');
                    if(temp_repo) {
                        this.pageBanner = temp_repo.images[0];
                        // this.pageBanner = {};
                        // this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030051721/promos_inside_banner.png"
                    }
                    this.events = this.event;
                });
            },
            watch: {
                currentEvent : function (){
                    if(this.currentEvent != null) {
                        console.log(this.currentEvent.store);
                        if (this.currentEvent.store != null && this.currentEvent.store != undefined && _.includes(this.currentEvent.store.store_front_url_abs, 'missing')) {
                            this.currentEvent.store.store_front_url_abs = this.property.default_logo;
                        }
                        else if (this.currentEvent.store == null || this.currentEvent.store == undefined) {
                            this.currentEvent.store = {};
                            this.currentEvent.store.store_front_url_abs =  "//codecloud.cdn.speedyrails.net/sites/5a6a54eb6e6f647da51e0100/image/png/1518554684072/bonniedoonlogo.png";
                        }
                        var vm = this;
                        var temp_event = [];
                        var current_id =_.toNumber(this.currentEvent.id);
                        _.forEach(this.currentEvent.store.event, function(value, key) {
                            if(_.toNumber(value) != current_id){
                                var current_event = vm.findEventById(value);
                                current_event.description_short = _.truncate(current_event.description, {'length': 70});
                                temp_event.push(current_event);
                            }
                        });
                        this.storeEvents = temp_event;
                    }
                    if(this.currentEvent.store) {
                        var storeHours = [];
                        var vm = this;
                        _.forEach(this.currentEvent.store.store_hours, function (value, key) {
                            var hour = vm.findHourById(value);
                            if(hour.day_of_week === 0){
                                hour.order = 7;
                            }
                            else {
                                hour.order = hour.day_of_week;
                            }
                            storeHours.push();
                        });
                        this.storeHours = _.sortBy(storeHours, [function(o) { return o.order; }]);;
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'processedEents',
                    'findEventBySlug',
                    'findEventById',
                    'timezone',
                    'findRepoByName',
                    'findHourById'
                ]),
                allEvents() {
                    return this.processedEvents;
                },
            },
            methods: {
                updatecurrentEvent (id) {
                    this.currentEvent = this.findEventBySlug(id);
                    if (this.currentEvent === null || this.currentEvent === undefined){
                        this.$router.replace('/');
                    }
                },
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "events"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                shareURL(slug){
                    var share_url = "http://mallmaverick.ca/event/" + slug;
                    return share_url;
                },
            }
        });
    });
</script>