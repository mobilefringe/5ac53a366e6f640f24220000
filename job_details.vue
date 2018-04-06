<template>
	<div class="promo_dets_container" v-if="currentJob">
		<div class="page_header" v-if="jobBanner" v-bind:style="{ backgroundImage: 'url(' + jobBanner.image_url + ')' }">
			<div class="site_container">
				<div class="header_content caps">
					<h1>{{$t("jobs_page.jobs")}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container">
			<div class="row">
				<div class="col-sm-12 promo_image_container text-left">
					<router-link to="/jobs"><i class="fa fa-angle-left"></i> &nbsp;{{$t("jobs_page.back_to_jobss")}}</router-link>
					<h3 class="promo_name" style="margin: 20px auto 0px;"  v-if="locale=='en-ca'">{{currentPromo.name}}</h3>
					<h3 class="promo_name" style="margin: 20px auto 0px;"  v-else>{{currentPromo.name_2}}</h3>
					<div class="row">
					    <p class="promo_store_name caps" v-if="locale=='en-ca'">{{currentPromo.store.name}}</p>
					 </div>
					 <div class="row">
	        		    <p class="promo_store_name caps" v-else>{{currentPromo.store.name_2}}</p>
						<p class="promo_div_date pull-left">{{currentPromo.start_date | moment("MMM D", timezone)}} - {{currentPromo.end_date | moment("MMM D", timezone)}}</p>
						<social-sharing :url="shareURL(currentPromo.slug)" :title="currentPromo.title" :description="currentPromo.body" :quote="_.truncate(currentPromo.description, {'length': 99})" twitter-user="EastgateSquare" :media="currentPromo.image_url" inline-template >
							<div class="blog-social-share pull-right">
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
					<div class="col-sm-12 no_padding">
						<div class="text-left promo_description">
							<p v-if="locale=='en-ca'" v-html="currentJob.rich_description"></p>
							<p v-else v-html="currentJob.rich_description_2"></p>
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
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            data: function() {
                return {
                    currentJob: null,
                    storeJobs : null,
                    storeHours : null,
                    jobBanner : null
                }
            },
            props:['id', 'locale'],
            beforeRouteUpdate(to, from, next) {
                this.currentJob = this.findJobBySlug(to.params.id);
                    if (this.currentJob === null || this.currentJob === undefined){
                        this.$router.replace('/');
                    }
                next();
            },
            created(){
                this.loadData().then(response => {
                    this.updateCurrentJob(this.id);
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        this.jobBanner = temp_repo.images[0];
                    }
                    console.log(this.jobBanner);
                    this.jobs = this.job;
                });
            },
            watch: {
                currentJob : function (){
                    if(this.currentJob != null) {
                        console.log(this.currentJob.store);
                        if (this.currentJob.store != null && this.currentJob.store != undefined && _.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                            this.currentJob.store.store_front_url_abs = "http://via.placeholder.com/400x400/757575";
                        }
                        else if (this.currentJob.store == null || this.currentJob.store == undefined) {
                            this.currentJob.store = {};
                            this.currentJob.store.store_front_url_abs =  "http://via.placeholder.com/400x400/757575";
                        }
                        var vm = this;
                        var temp_job = [];
                        var current_id =_.toNumber(this.currentJob.id);
                        _.forEach(this.currentJob.store.jobs, function(value, key) {
                            if(_.toNumber(value) != current_id){
                                var current_promo = vm.findJobById(value);
                                current_promo.description_short = _.truncate(current_promo.description, {'length': 70});
                                temp_job.push(current_promo);
                            }
                        });
                        this.storeJobs = temp_job;
                    }
                    if(this.currentJob.store) {
                        var storeHours = [];
                        var vm = this;
                        _.forEach(this.currentJob.store.store_hours, function (value, key) {
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
                    'processedJobs',
                    'findJobBySlug',
                    'findJobById',
                    'timezone',
                    'findRepoByName',
                    'findHourById'
                ]),
                allJobs() {
                    return this.processedJobs;
                },
            },
            methods: {
                updateCurrentJob (id) {
                    this.currentJob = this.findJobBySlug(id);
                    if (this.currentJob === null || this.currentJob === undefined){
                        this.$router.replace('/');
                    }
                },
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                shareURL(slug){
                    var share_url = "http://mallmaverick.ca/jobs/" + slug;
                    return share_url;
                },
            }
        });
    });
</script>