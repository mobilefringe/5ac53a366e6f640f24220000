<template>
	<div class="row page_content" v-if="dataLoaded">
		<div class="banner_div">
			<div class="home-banner-container">
				<slick ref="slick" :options="slickOptions">
					<div class="" v-for="banner in banners" v-if="banners">
						<!--<div class="home-banner" v-lazy:background-image="banner.image_url"></div>-->
						<div class="home-banner" v-lazy:background-image="'//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1522876174746/Hero Image.png'"></div>
					</div>
				</slick>
			</div>
		</div>
		<div class="site_container">
		    <div>
		      <h3 class="home_page_title caps">{{$t("home_page.explore")}}</h3>
		    </div>
		    <div v-masonry transition-duration="0.3s" item-selector=".grid-item" >
                <div v-masonry-tile class="item" >
                    <div v-for="feature in feature_items" :class="'grid-item ' + feature.masonry_class ">
                    	<div  :class="{ 'ih-item circle effect19' : feature.no_hover_class}"> 
                    	<!--class="ih-item circle effect19"-->
                    		<router-link :to="feature.url">
                    			<img :src="feature.image_url" alt="name">
                    			<div class="info">
                    				<div class="content">
                    					<h3 v-if="locale=='en-ca'"> {{feature.name}} </h3>
                    					<h3 v-else> {{feature.name_2}} </h3>
                    				</div>
                    			</div>
                    		</router-link>
                    	</div>
                    </div>
                </div>
            </div>
            <div>
		      <h3 class="home_page_title caps">{{$t("home_page.our_feed")}}</h3>
		    </div>
		    <div class="insta-feed-container">
                <a v-for="(item, index) in instaFeed" :href="item.link" target="_blank" class="col-xs-6 col-sm-3 no_padding">
                <div class="insta-feed-image "  v-lazy:background-image="item.images.standard_resolution.url">
                    <!--<a :href="item.link" target="_blank"><img :src="item.images.thumbnail.url"/></a>-->
                </div></a>
            </div>
            
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue!today_hours", "vue!search-component", 'vue!vue-slick', 'js-cookie', 'masonry' , 'vue-masonry-plugin', 'vue-lazy-load'], function(Vue, Vuex, TodayHoursComponent, SearchComponent, slick, Cookies, masonry, VueMasonryPlugin, VueLazyload) {
        Vue.use(VueMasonryPlugin.default);
        Vue.use(VueLazyload);
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    suggestionAttribute: 'name',
                    search: '',
                    slickOptions: {
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 6000,
                        cssEase: 'linear',
                        dots: true,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1600
                    },
                    dataLoaded: false,
                    show_popup: false,
                    popup: null,
                    formData : {},
                    instaFeed: null
                }
            },
            created () {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    this.popup = this.$store.state.popups[0];
                    
                    console.log(response);
                    var socialFeed = response[4].data;
                    console.log("socialFeed", socialFeed);
                    var social_feed = socialFeed.social.instagram;
                    this.instaFeed = _.slice(social_feed, [0], [4]);
                    console.log("locale created", this.locale);
                });
            },
            watch : {
                dataLoaded () {
                    var viewed = Cookies.get('popup_viewed');
                    if(this.popup !== null && viewed !== "true") {
                        Cookies.set('popup_viewed', "true");
                        viewed = Cookies.get('popup_viewed');
                        this.show_popup = true;
                        this.popup.image_url = "//mallmaverick.cdn.speedyrails.net" + this.popup.photo_url;
                        document.getElementById('popup_backdrop').style.display = "block";
                    }
                    else {
                        document.getElementById('popup_backdrop').style.display = "none";
                    }
                },
                formData () {
                    this.formData.name = this.formData.firstname + " " + this.formData.lastname; 
                },
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                },
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores'
                ]),
                banners () {
                    return _.orderBy(this.$store.state.banners, ['position'], ['asc']);
                },
                feature_items () {
                    // return this.$store.state.feature_items;
                    var features = this.$store.state.feature_items;
                    _.forEach(features, function(value, key) {
                      
                        if( _.includes([1], key) ) {
                            value.masonry_class = "grid-item--height2";
                        }
                        else if ( _.includes([5], key) ){
                            value.masonry_class = "grid-item--width2";
                        }
                        else {
                            value.masonry_class = " ";
                        }
                        if(value.name === null || value.name === undefined || value.name.length == 0) {
                            value.no_hover_class = false;
                        }
                        else {
                            value.no_hover_class = true;
                        }
                    });
                    return features;
                },
                mobile_feature_items () {
                    var features = this.$store.state.feature_items;
                    _.forEach(features, function(value, key) {
                      
                        if( _.includes([1], key) ) {
                            value.masonry_class = "grid-item--height2";
                        }
                        else if ( _.includes([5], key) ){
                            value.masonry_class = "grid-item--width2";
                        }
                        else {
                            value.masonry_class = " ";
                        }
                        value.mobile_order = key + 1;
                    });
                    features = _.sortBy(features, [function(o) { return o.mobile_order; }]);
                    console.log(features);
                    return features;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData", "feature_items"), this.$store.dispatch("getData", "promotions"), this.$store.dispatch("getData", "popups"), this.$store.dispatch('LOAD_PAGE_DATA', {url: "http://bonniedoon.mallmaverick.com/api/v2/bonniedoon/social.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                closePopup() {
                    this.show_popup = false;
                    document.getElementById('popup_backdrop').style.display = "none";
                }
            }
        })
    })
</script>