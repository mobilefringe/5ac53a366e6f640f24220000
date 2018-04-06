<template>
    <div class="sticky">
    	<!--<div class="top_bar">-->
    	<!--	<div class="site_container">-->
    	<!--		<div class="row top_bar_wrapper">-->
    	<!--			<div class="col-sm-6">-->
    	<!--				<div class="mobile_site_logo visible_phone">-->
    	<!--				    <router-link to="/"><img :src="property_logo" alt="Property Logo"/></router-link>-->
    	<!--			    </div>-->
    	<!--				<div id="home_hours_container" class="hidden_phone" v-if="todays_hours">-->
    	<!--					<p class="open_now"><span v-if="todays_hours.is_closed == null || !todays_hours.is_closed ">{{$t("header.open_today")}}</span><span v-else>{{$t("header.closed")}}</span> <span v-if="todays_hours.is_closed == null || !todays_hours.is_closed "><span style="margin:0 20px">|</span> {{todays_hours.open_time | moment("h:mma", timezone)}} - {{todays_hours.close_time | moment("h:mma", timezone)}} </span></p>-->
    	<!--				</div>-->
    	<!--			</div>-->
    	<!--			<div class="col-sm-6 hidden_phone text-right">-->
    	<!--				<div class="header_social">-->
    	<!--				    <social-links></social-links>-->
    	<!--				</div>-->
    	<!--				<router-link id="signup" to="/newsletter">{{$t("header.sign_up")}}</router-link>-->
    	<!--				<span> <span @click="changeLocale('en-ca')"> en</span> | <span @click="changeLocale('fr-ca')">fr</span></span>-->
    	<!--			</div>-->
    
    				<!--<div class="mobile_nav_container visible_phone">-->
    				<!--    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">-->
    				<!--		<nav id="mobile_nav" v-show="show_mobile_menu">-->
    				<!--			<ul>-->
    				<!--				<div class="mobile_menu_site_logo">-->
    				<!--					<router-link to="/"><img :src="property_logo" alt="Property Logo"/></router-link>-->
    				<!--				</div>-->
    				<!--				<li v-for="(item,key) in menu_items" class="menu_item">-->
    				<!--			        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>-->
    				<!--			        <div v-else>-->
    				<!--			            <b-card no-body class="mb-1">-->
        <!--                                        <b-card-header header-tag="header" class="p-1" role="tab">-->
        <!--                                            <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">-->
        <!--                                                {{$t(item.name)}}-->
        <!--                                                <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>-->
        <!--                                                <i v-else  class="fa fa-plus"></i>-->
        <!--                                            </b-btn>-->
        <!--                                        </b-card-header>-->
        <!--                                        <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">-->
        <!--                                            <b-card-body v-for="sub_menu in item.sub_menu">-->
        <!--                                                <p class="card-text"><router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link></p>-->
        <!--                                            </b-card-body>-->
        <!--                                        </b-collapse>-->
        <!--                                    </b-card>-->
    				<!--			        </div>-->
    							        
    				<!--			    </li>-->
    				<!--			</ul>-->
    				<!--			<div class="small_hr"></div>-->
    				<!--			<div class="tel_num" v-if="property">-->
        <!--                            <a :href="'tel:'+property.contact_phone">{{property.contact_phone}}</a>-->
        <!--                        </div>-->
        <!--                        <div v-if="property">-->
        <!--                           <p style="display:block"> {{property.address1}}</p>-->
        <!--                            <p style="display:block">{{property.city}}, {{property.postal_code}} {{property.province_state}}</p>-->
        <!--                        </div>-->
    				<!--			<div class="header_social">-->
    				<!--			    <social-links></social-links>-->
    				<!--			</div>-->
    				<!--			<div class="small_hr"></div>-->
    				<!--		</nav>-->
    				<!--	</transition>-->
    				<!--</div>-->
    	<!--		</div>-->
    	<!--	</div>-->
    	<!--</div>-->
    	<div class="menu_bar">
    		<div class="site_container">
    			<div class="nav_container">
    				<div class="site_logo">
    					<router-link to="/"><img :src="property_logo" alt="Property Logo"/></router-link>
    				</div>
    				<div class="row top_nav hidden_phone">
    					<nav id="primary_nav">
    						<ul>
    						    <li v-for="item in menu_items" class="menu_item">
    						        <router-link :to="item.href">{{$t(item.name)}}</router-link>
    						        <ul v-if="item.sub_menu">
    						            <li v-for="sub_menu in item.sub_menu" class="dropdown_item">
    						                <router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link>
    						            </li>
    								</ul>
    						    </li>
    						</ul>
    					</nav>
    				</div>
					<div id="menu-icon" @click="show_mobile_menu = !show_mobile_menu" :class="{ open: show_mobile_menu}">
    					<span></span>
    					<span></span>
    					<span></span>
    					<span></span>
    				</div>
					<div class="mobile_nav_container visible_phone">
    				    <transition name="custom-classes-transition" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    						<nav id="mobile_nav" v-show="show_mobile_menu">
    							<ul>
    								<!--<div class="mobile_menu_site_logo">-->
    								<!--	<router-link to="/"><img :src="property_logo" alt="Property Logo"/></router-link>-->
    								<!--</div>-->
    								<li v-for="(item,key) in menu_items" class="menu_item">
    							        <router-link :to="item.href" v-if="item.sub_menu == undefined">{{$t(item.name)}}</router-link>
    							        <div v-else>
    							            <b-card no-body class="mb-1">
                                                <b-card-header header-tag="header" class="p-1" role="tab">
                                                    <b-btn block @click="item.show_sub_menu = !item.show_sub_menu" :class="item.show_sub_menu ? 'collapsed' : null" :aria-controls="$t(item.name)" :aria-expanded="item.show_sub_menu ? 'true' : 'false'">
                                                        {{$t(item.name)}}
                                                        <i v-if="item.show_sub_menu"  class="fa fa-minus"></i>
                                                        <i v-else  class="fa fa-plus"></i>
                                                    </b-btn>
                                                </b-card-header>
                                                <b-collapse v-model="item.show_sub_menu" :id="$t(item.name)" :visible="item.show_sub_menu" :accordion="$t(item.name)" role="tabpanel" class="accordion_body">
                                                    <b-card-body v-for="sub_menu in item.sub_menu">
                                                        <p class="card-text"><router-link :to="sub_menu.href">{{$t(sub_menu.name)}}</router-link></p>
                                                    </b-card-body>
                                                </b-collapse>
                                            </b-card>
    							        </div>
    							        
    							    </li>
    							</ul>
    							<div class="small_hr"></div>
    							<div class="tel_num" v-if="property">
                                    <a :href="'tel:'+property.contact_phone">{{property.contact_phone}}</a>
                                </div>
                                <div v-if="property">
                                   <p style="display:block"> {{property.address1}}</p>
                                    <p style="display:block">{{property.city}}, {{property.postal_code}} {{property.province_state}}</p>
                                </div>
    							<div class="header_social">
    							    <social-links></social-links>
    							</div>
    							<div class="small_hr"></div>
    						</nav>
    					</transition>
    				</div>
    			</div>
    		</div>
    	</div>
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