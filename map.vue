<template>
	<div v-if="dataloaded">
	    <div class="page_header" v-if="pageBanner" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
			<!--http://via.placeholder.com/1920x300-->
			<div class="site_container">
				<div class="header_content">
					<h1>{{$t("stores_page.map")}}</h1>
				</div>
			</div>
		</div>
		<div class="site_container page_content">
			<div class="col-sm-4   padding_top_20">
                <div class="map_directory text-center hidden_phone">
                    <h3 class="map_title caps">{{$t("stores_page.find_store")}}</h3>
                    <div id="stores_container" class="directory_list text-left">
                        <li v-for="store in filteredStores" class="pointer">
							<p class="directory_store_name caps" v-on:click="addLandmark(store)">{{store.name}}</p>
						</li>
                    </div>
                </div>
                <div class="visible_phone">
                    <p class="text_left">Find Store :</p>
					<div class="alphabet-dd visible_phone" >
					    <v-select :options="allStores" label="name" :searchable="false" :on-change="addLandmark" id="mobile_alpha_list" :placeholder="$t('stores_page.select_a_store')"></v-select>
				    </div>
                </div>
            </div>
            <div class="col-sm-8">
            <div class="padding_top_20 map light_border">
				<png-map ref="pngmap_ref" :png-map-url="getPNGurl" :initial-position="'700 450'" @updateMap="updatePNGMap"></png-map>
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
    define(["Vue", "vuex", "vue-select", "jquery", "smooth-zoom", "vue!png-map", "vue!search-component"], function(Vue, Vuex, VueSelect, $, smoothZoom, PNGMapComponent, SearchComponent) {
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    listMode: "alphabetical",
                    selectedCat: null,
                    selectedAlpha: "All",
                    alphabet: ["All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                    filteredStores: null,
                    dataloaded: false,
                    mobile_store: false,
                    windowWidth: 0,
                    pageBanner : null,
                    search_result : null,
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataloaded = true;
                    this.filteredStores = this.allStores;
                    
                    // this.storeBanner = this.findRepoByName('Stores Banner').images[0];
                    var temp_repo = this.findRepoByName('Map Banner');
                    if(temp_repo) {
                        // this.pageBanner = temp_repo.images[0];
                        this.pageBanner = {};
                        this.pageBanner.image_url = "//codecloud.cdn.speedyrails.net/sites/5ac53a366e6f640f24220000/image/png/1523030098919/map_inside_banner.png"
                    }
                    this.$on('updateMap', this.updatePNGMap);
                });
            },
            watch: {
                windowWidth: function() {
                    if (this.windowWidth <= 768) {
                        this.mobile_store = true;
                    } else {
                        this.mobile_store = false;
                    }
                },
            },
            mounted() {
                // this.filteredStores = this.allStores;
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findRepoByName'

                ]),
                allStores() {
                    console.log(this.processedStores);
                    return this.processedStores;
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.map(this.processedCategories, 'name');
                    cats.unshift('All');
                    return cats;
                },
                storeNames () {
                    return _.map(this.processedStores, 'name');
                },
                getPNGurl() {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                svgMapRef() {
                    return _.filter(this.$children, function(o) {
                        return (o.$el.className == "svg-map")
                    })[0];
                },
                getStoreById(){
                    
                },
                filterStores() {
                    letter = this.selectedAlpha;
                    if (letter == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var filtered = _.filter(this.allStores, function(o, i) {
                            return _.lowerCase(o.name)[0] == _.lowerCase(letter);
                        });
                        this.filteredStores = filtered;
                    }
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(category_id).id;
                    }

                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {

                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
                        });
                    
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                        console.log(el.classList);
                    }
                    
                },
                
            },
            methods: {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                changeMode(mode) {
                    this.listMode = mode;
                },
                updatePNGMap(map) {
                    this.map = map;
                    console.log("in updatepng")
                },
                addLandmark(store) {
                    this.svgMapRef.addMarker(store);
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/"+option.slug);
                },
            },
            
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            },
        });
    });
</script>