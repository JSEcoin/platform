<template>
	<AppWrapperWidget>
		<NavWidget activeNav="settings"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<!-- Settings -->
			<ContentWidget id="JSEA-settingsPanel" titleTxt="Settings" :infoPanelTxt="`Alpha Release: ${$store.state.app.version}`">
				<!-- Visuals -->
				<OptionsListWrapperWidget titleTxt="Visuals">
					<!-- Toggle Theme -->
					<SettingsItemRowWidget settingName="Toggle Theme">
						<i id="JSEA-themeSelector" v-on:click="toggleTheme" class="fa" :class="{'fa-sun-o':($store.state.app.theme === 'night'),'fa-moon-o':($store.state.app.theme === 'light')}"></i>
					</SettingsItemRowWidget>
					<!-- xToggle Theme -->
				</OptionsListWrapperWidget>
				<!-- xVisuals -->

				<!-- On Boot-->
				<OptionsListWrapperWidget titleTxt="On Boot" v-if="$store.getters.whichPlatform === 'desktop'">
					<!-- Auto Launch -->
					<SettingsItemRowWidget settingName="Auto Launch">
						<ToggleSwitchWidget
							v-model="autoLaunch"
							v-bind="{
								name: 'autoLaunch',
							}" />
					</SettingsItemRowWidget>
					<!-- xAuto Launch -->
				</OptionsListWrapperWidget>
				<!-- xOn Boot -->

				<!-- Mobile Settings-->
				<OptionsListWrapperWidget titleTxt="Mobile" v-if="$store.getters.whichPlatform === 'mobile'">
					<!-- Background Mode -->
					<SettingsItemRowWidget settingName="Background Support">
						<ToggleSwitchWidget
							v-model="mobileBackgroundMode"
							v-bind="{
								name: 'mobileBackgroundMode',
							}" />
					</SettingsItemRowWidget>
					<!-- xBackground Mode -->
					<!-- Silent -->
					<SettingsItemRowWidget settingName="Silent Mode">
						<ToggleSwitchWidget
							v-model="silentMode"
							v-bind="{
								name: 'silentMode',
							}" />
					</SettingsItemRowWidget>
					<!-- xSilent -->
				</OptionsListWrapperWidget>
				<!-- xMobile Settings -->

				<!-- Login -->
				<OptionsListWrapperWidget titleTxt="Login"  v-if="(($store.getters.whichPlatform === 'desktop') || ($store.getters.whichPlatform === 'mobile'))">
					<!-- Auto Login -->
					<SettingsItemRowWidget settingName="Auto Login">
						<ToggleSwitchWidget
							v-model="autoLogin"
							v-bind="{
								name: 'autoLogin',
							}" />
					</SettingsItemRowWidget>
					<!-- xAuto Login -->
					
					<!-- Auto Mine -->
					<SettingsItemRowWidget settingName="Auto Mine">
						<ToggleSwitchWidget
							v-model="autoMine"
							v-bind="{
								name: 'autoMine',
							}" />
					</SettingsItemRowWidget>
					<!-- xAuto Mine -->

					<!-- Remember Username -->
					<SettingsItemRowWidget settingName="Remember Username">
						<ToggleSwitchWidget
							v-model="storeUsername"
							v-bind="{
								name: 'storeUsername',
							}" />
					</SettingsItemRowWidget>
					<!-- Remember Username -->
				</OptionsListWrapperWidget>
				<!-- xLogin -->
				
				<!-- Logout -->
				<ButtonWidget v-on:click.native="logout()" buttonTxt="Logout"/>
				<!-- xLogout -->
			</ContentWidget>
			<!-- xSettings -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import AppWrapperWidget from '../widgets/AppWrapperWidget.vue';
import NavWidget from '../widgets/NavWidget.vue';
import ScrollWidget from '../widgets/ScrollWidget.vue';
import ContentWidget from '../widgets/ContentWidget.vue';
import OptionsListWrapperWidget from '../widgets/OptionsListWrapperWidget.vue';
import ButtonWidget from '../widgets/ButtonWidget.vue';
import ToggleSwitchWidget from '../widgets/ToggleSwitchWidget.vue';
import SettingsItemRowWidget from '../widgets/SettingsItemRowWidget.vue';

/**
 * @description
 * <p>Displays application release and configuration options:</p>
 * <ul>
 *     <li>
 *         Visuals
 *         <ul>
 *             <li>Toggle Theme - switch between light and night themes</li>
 *         </ul>
 *     </li>
 *     <li>
 *         On Boot
 *         <ul>
 *             <li>Auto Launch - Launch application on computer startup</li>
 *         </ul>
 *     </li>
 *     <li>
 *         Login
 *         <ul>
 *             <li>Auto Login - Bypass login screen and login</li>
 *             <li>Auto Mine - Begin mining when user has logged in</li>
 *             <li>Remember Username - Display username in login screen</li>
 *         </ul>
 *     </li>
 * </ul>
 * <p>Allows the user to logout of the application.</p>
 */
export default {
	name: 'Settings-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
		OptionsListWrapperWidget,
		ButtonWidget,
		ToggleSwitchWidget,
		SettingsItemRowWidget,
	},
	/**
	 * Computed
	 * */
	computed: {
		autoLaunch: {
			get() {
				return this.$store.state.app.autoLaunch;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'autoLaunch',
				});
				localStorage.setItem('autoLaunch', val);
				//
				if (this.$store.getters.whichPlatform === 'desktop') {
					this.$electron.ipcRenderer.send('autoLaunch', {
						start: val,
					});
				}
			},
		},
		autoMine: {
			get() {
				return this.$store.state.app.autoMine;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'autoMine',
				});
				localStorage.setItem('autoMine', val);
			},
		},
		mobileBackgroundMode: {
			get() {
				return this.$store.state.app.mobileBackgroundMode;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'mobileBackgroundMode',
				});
				localStorage.setItem('mobileBackgroundMode', val);
				//
				if (this.$store.getters.whichPlatform === 'mobile') {
					if (val) {
						cordova.plugins.backgroundMode.enable();
					} else {
						cordova.plugins.backgroundMode.disable();
					}
				}
			},
		},
		silentMode: {
			get() {
				return this.$store.state.app.silentMode;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'silentMode',
				});
				localStorage.setItem('silentMode', val);
				cordova.plugins.backgroundMode.setDefaults({
					title: 'JSECoin Mobile',
					text: 'Altcoin Miner app',
					silent: val,
				});
			},
		},
		appQuitLogout: {
			get() {
				return this.$store.state.app.appQuitLogout;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'appQuitLogout',
				});
				localStorage.setItem('appQuitLogout', val);
			},
		},
		autoLogin: {
			get() {
				return this.$store.state.app.autoLogin;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'autoLogin',
				});
				localStorage.setItem('autoLogin', val);
			},
		},
		storeUsername: {
			get() {
				return this.$store.state.app.storeUsername;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'storeUsername',
				});
				localStorage.setItem('storeUsername', val);
			},
		},
	},
	methods: {
		/**
		 * Logout and redirect to login screen
		 *
		 * @returns nothing
		 * @public
		 */
		logout() {
			const self = this;
			self.$store.dispatch({
				type: 'logoutUser',
			});
			//load login route
			//self.$router.push('login');
		},
		/**
		 * Toggle theme (light,night) modes
		 *
		 * @returns nothing
		 * @public
		 */
		toggleTheme() {
			const self = this;
			const updateThemeTo = (self.$store.state.app.theme === 'night')? 'light' : 'night';
			this.$store.commit('updateAppState', {
				val: updateThemeTo,
				state: 'theme',
			});
			localStorage.setItem('theme', updateThemeTo);

			//set theme if web
			if (self.$store.getters.whichPlatform === 'web') {
				const bodyClass = `platformWeb web ${self.$store.state.app.theme}`;
				document.body.className = bodyClass;
			}
			//set theme if web
			if (self.$store.getters.whichPlatform === 'mobile') {
				const bodyClass = `platformWeb mobile ${self.$store.state.app.theme}`;
				document.body.className = bodyClass;
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.night #JSEA-themeSelector {
	background: #3598db;
	color:#fff;
}

.night #JSEA-themeSelector:hover {
	background: #1970c7;
}
.light #JSEA-themeSelector {
	background: #2d384d;
	color:#fff;
}

.light #JSEA-themeSelector:hover {
	background: #000;
}
#JSEA-themeSelector {
	width: 40px;
	height: 40px;
	text-align:center;
	line-height:40px;
	border-radius: 10px;
	margin-right:20px;
	cursor: pointer;
	transition: background 0.2s;
}

.platformWeb.mobile #JSEA-themeSelector {
	width: 34px;
	height: 34px;
	line-height:34px;
}
</style>
