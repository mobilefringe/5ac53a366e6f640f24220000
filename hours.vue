<template>
    <div v-if="pageBanner"> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <div class="page_header" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
			<div class="site_container">
				<div class="header_content caps">
					<h1>{{$t("hours_page.hours")}}</h1>
				</div>
			</div>
		</div>  
        <div class="site_container">
            <div class="all_hours_container">
                <div class="row">
                    <div class="col-sm-12">
                        <h3 class="hours_heading text-left caps" >{{$t("hours_page.reg_hours")}}</h3>
                        <div id="hours_container" class="hours_container">
                            <div class="hours_div text-left" v-for="hour in hours">
                                <span>{{hour.day_of_week | moment("dddd", timezone)}} : </span>
                                <span>{{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}</span>
                            </div>
                        </div>
                        
                        <p>*Some stores, restaurants and entertainment venues hours will vary.
</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 ">
                        <div class="padding_top_20"></div>
                        
                        <h3 class="hours_heading text-left caps">{{$t("hours_page.holiday_hours")}}</h3>
                        <div id="holidays_hours_container" class="hours_container">
                            <div class="hours_div text-left"  v-for="hour in reducedHolidays">
                                <span>
                                    <span v-if="locale=='en-ca'">{{hour.holiday_name}}</span>
                                    <span v-else>{{hour.holiday_name_2}}</span>
                                    ({{hour.holiday_date | moment("MMM D YYYY", timezone)}})
                                </span>
                                <span>{{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}</span>
                            </div>
                        </div>
                        
                        <div class="padding_top_20"></div>
                        
                        <h3 class="hours_heading text-left caps">{{$t("hours_page.holiday_closures")}}</h3>
                        <div id="closed_hours_container" class="hours_container">
                            <div class="hours_div text-left" v-for="hour in closeHolidays">
                                <span>
                                    <span v-if="locale=='en-ca'">{{hour.holiday_name}}</span>
                                    <span v-else>{{hour.holiday_name_2}}</span>
                                    ({{hour.holiday_date | moment("MMM D YYYY", timezone)}})
                                </span>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="padding_top_40"></div>
            </div>
        </div >
    </div>
</template>
<style>
    .hours_page_container .row{
        margin-left:inherit;
    }
</style>
<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta"], function(Vue, Vuex, moment, tz, VueMoment, Meta) {
        Vue.use(Meta);
        return Vue.component("hours-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    pageBanner : null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Hours Banner');
                    if(temp_repo) {
                        // this.pageBanner = temp_repo.images[0];
                        this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030133826/hours_inside_banner.png"
                    }
                });
                
            },
            watch : {
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                },
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'findRepoByName'
                ]),
                hours () {
                    return this.getPropertyHours;
                },
                holidayHours () {
                    return this.getPropertyHolidayHours;
                },
                reducedHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.filter(holidayHours, function(o) { return !o.is_closed; });
                },
                closeHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.sortBy(_.filter(holidayHours, function(o) { return o.is_closed; }), [function(o) { return o.holiday_date; }]);
                }
            },
            methods : {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>
