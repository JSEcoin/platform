<template>
	<AppWrapperWidget>
		<NavWidget activeNav="settings"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<Setup2FA v-bind="{twoFACode, secretKey}"
				:class="{'active': showSetup2FA}"
				v-on:exit2FA="exit2FA" />
			<Remove2FA v-bind="{showDisableSetup2FA}"
				:class="{'active': showDisableSetup2FA}"
				v-on:exit2FA="exitDisable2FA" />
			<!-- Settings -->
			<ContentWidget class="settingsPanel" titleTxt="Settings" :infoPanelTxt="`Alpha Release: ${$store.state.app.version}`">
				<!-- Visuals -->
				<OptionsListWrapperWidget titleTxt="Visuals">
					<!-- Toggle Theme -->
					<SettingsItemRowWidget settingName="Toggle Theme" infoDesc="Changes the app display to light or dark mode.">
						<i id="JSEA-themeSelector" v-on:click="toggleTheme" class="fa" :class="{'fa-sun-o':($store.state.app.theme === 'night'),'fa-moon-o':($store.state.app.theme === 'light')}"></i>
					</SettingsItemRowWidget>
					<!-- xToggle Theme -->

					<!-- Notifications -->
					<SettingsItemRowWidget settingName="Notifications" infoDesc="Displays a notification each time a JSE Token is successfully mined.">
						<ToggleSwitchWidget
							v-model="notifications"
							v-bind="{
								name: 'notifications',
							}" />
					</SettingsItemRowWidget>
					<!-- xNotifications -->
				</OptionsListWrapperWidget>
				<!-- xVisuals -->

				<!-- On Boot-->
				<OptionsListWrapperWidget titleTxt="On Boot" v-if="$store.getters.whichPlatform === 'desktop'">
					<!-- Auto Launch -->
					<SettingsItemRowWidget settingName="Auto Launch" infoDesc="On device reboot the app will autolaunch.">
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
				<OptionsListWrapperWidget titleTxt="Mobile" v-if="(($store.getters.whichPlatform === 'mobile') && (!$store.getters.isAppGoogle))">
					<!-- Background Mode -->
					<SettingsItemRowWidget settingName="Background Support" infoDesc="Adds mobile background mining support - if this is disabled mining you will not earn any JSE when you are within another app.">
						<ToggleSwitchWidget
							v-model="mobileBackgroundMode"
							v-bind="{
								name: 'mobileBackgroundMode',
							}" />
					</SettingsItemRowWidget>
					<!-- xBackground Mode -->
					<!-- Silent -->
					<SettingsItemRowWidget settingName="Silent Mode" infoDesc="Hides Androids background running application notification - depending on device can also limit amount of CPU the app has access to mine with.">
						<ToggleSwitchWidget
							v-model="silentMode"
							v-bind="{
								name: 'silentMode',
							}" />
					</SettingsItemRowWidget>
					<!-- xSilent -->
					<!-- Silent -->
					<SettingsItemRowWidget v-if="autoMine" settingName="Only Auto Mine When Power Plugged In" infoDesc="Will only allow device to mine when the power is plugged in.">
						<ToggleSwitchWidget
							v-model="mineWhenpluggedIn"
							v-bind="{
								name: 'mineWhenpluggedIn',
							}" />
					</SettingsItemRowWidget>
					<!-- xSilent -->
				</OptionsListWrapperWidget>
				<!-- xMobile Settings -->

				<!-- Login -->
				<OptionsListWrapperWidget titleTxt="Login" v-if="(($store.getters.whichPlatform === 'desktop') || ($store.getters.whichPlatform === 'mobile') || ($store.getters.whichPlatform === 'web'))">
					<!-- Auto Login -->
					<SettingsItemRowWidget settingName="Auto Login" infoDesc="Enables the app to autologin to your dashboard when it starts up.">
						<ToggleSwitchWidget
							v-model="autoLogin"
							v-bind="{
								name: 'autoLogin',
							}" />
					</SettingsItemRowWidget>
					<!-- xAuto Login -->

					<!-- Auto Mine -->
					<SettingsItemRowWidget settingName="Auto Mine" v-if="((!$store.getters.isAppGoogle) && (confirmed))" infoDesc="Starts the mining process as soon as you login to the platform.">
						<ToggleSwitchWidget
							v-model="autoMine"
							v-bind="{
								name: 'autoMine',
							}" />
					</SettingsItemRowWidget>
					<!-- xAuto Mine -->

					<!-- Remember Username -->
					<SettingsItemRowWidget settingName="Remember Username" infoDesc="Stores and displays your username on the login screen.">
						<ToggleSwitchWidget
							v-model="storeUsername"
							v-bind="{
								name: 'storeUsername',
							}" />
					</SettingsItemRowWidget>
					<!-- Remember Username -->
				</OptionsListWrapperWidget>
				<!-- xLogin -->

				<!-- 2FA -->
				<OptionsListWrapperWidget titleTxt="Security">
					<SettingsItemRowWidget settingName="Two Factor Authentication" infoDesc="Enhances Security and enables Two Factor Authentication.">
						<ToggleSwitchWidget
							v-model="twoFactorAuth"
							v-bind="{
								name: 'twoFactorAuth',
							}" />
					</SettingsItemRowWidget>
				</OptionsListWrapperWidget>
				<!-- x2FA -->

				<!-- Notifications -->
				<OptionsListWrapperWidget titleTxt="Email Notifications">
					<SettingsItemRowWidget settingName="Transactions" infoDesc="Enables or disable email notifications for each transaction oon your account.">
						<ToggleSwitchWidget
							v-model="noEmailTransaction"
							v-bind="{
								name: 'noEmailTransaction',
							}" />
					</SettingsItemRowWidget>
					<SettingsItemRowWidget settingName="Newsletter" infoDesc="Enable of disable newsletter subscriptions.">
						<ToggleSwitchWidget
							v-model="noNewsletter"
							v-bind="{
								name: 'noNewsletter',
							}" />
					</SettingsItemRowWidget>
				</OptionsListWrapperWidget>
				<!-- xNotifications -->
			</ContentWidget>
			<!-- xSettings -->
			<!-- Logout -->
			<div style="text-align:center">
				<ButtonWidget v-on:click.native="logout()" buttonTxt="Logout" style="margin-bottom:20px;"/>
			</div>
			<!-- xLogout -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import OptionsListWrapperWidget from '@/components/widgets/OptionsListWrapperWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import ToggleSwitchWidget from '@/components/widgets/ToggleSwitchWidget.vue';
import SettingsItemRowWidget from '@/components/widgets/SettingsItemRowWidget.vue';
import Setup2FA from '@/components/widgets/Setup2FA.vue';
import Remove2FA from '@/components/widgets/Remove2FA.vue';

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
		Setup2FA,
		Remove2FA,
	},
	//data
	data() {
		return {
			showSetup2FA: false,
			showDisableSetup2FA: false,
			twoFACode: '',
			secretKey: '',
		};
	},
	/**
	 * Computed
	 * */
	computed: {
		confirmed: {
			get() {
				return this.$store.state.user.confirmed;
			},
		},
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
		notifications: {
			get() {
				return this.$store.state.app.notifications;
			},
			set(val) {
				const setNotification = () => {
					this.$store.commit('updateAppState', {
						val,
						state: 'notifications',
					});
					localStorage.setItem('notifications', val);
				};
				if (!('Notification' in window)) {
					console.log('Support disabled for notification');
					return;
				}
				if (Notification.permission !== 'granted') {
					Notification.requestPermission().then((permission) => {
						if (permission === 'denied') {
							console.log('Permission wasn\'t granted. Allow a retry.');
							return;
						}
						if (permission === 'default') {
							console.log('The permission request was dismissed.');
							return;
						}
						setNotification();
					});
				} else {
					setNotification();
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
		mineWhenpluggedIn: {
			get() {
				return this.$store.state.app.mineWhenpluggedIn;
			},
			set(val) {
				this.$store.commit('updateAppState', {
					val,
					state: 'mineWhenpluggedIn',
				});
				localStorage.setItem('mineWhenpluggedIn', val);
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
				/*cordova.plugins.backgroundMode.setDefaults({
					title: 'JSEcoin Mobile',
					text: 'Altcoin Miner app',
					silent: val,
				});*/
				console.log('silent', val);
				//cordova.plugins.backgroundMode.setDefaults({ silent: val });
				cordova.plugins.backgroundMode.configure({ silent: val });
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
		twoFactorAuth: {
			get() {
				return this.$store.state.user.twoFactorAuth;
				//console.log('get', this.$store.state.user.twoFactorAuth);
			},
			set(val) {
				const self = this;
				/*self.$store.commit('updateAppState', {
					val,
					state: 'twoFactorAuth',
				});*/

				self.$store.commit('updateUserStateValue', {
					val,
					state: 'twoFactorAuth',
				});

				if (val) {
					//toggle newsletter
					const enable2FA = {
						session: self.$store.state.user.session,
					};

					//toggle newsletter notification
					axios.post(
						`${self.$store.state.app.jseCoinServer}/twofa/setup2fa/`,
						enable2FA,
					).then((res) => {
						//
						console.log(res.data.authuri);
						self.twoFACode = res.data.authuri;
						self.secretKey = self.twoFACode.split('secret=')[1].split('&')[0];
						self.showSetup2FA = true;
					}).catch((err) => {
						self.$store.commit('ajaxError', err.response);
					});
				} else {
					self.showDisableSetup2FA = true;
				}
			},
		},
		noNewsletter: {
			get() {
				return !this.$store.state.user.noNewsletter;
			},
			set(val) {
				const self = this;
				self.$store.commit('updateAppState', {
					val,
					state: 'noNewsletter',
				});

				//toggle newsletter
				const toggleNewsletter = {
					session: self.$store.state.user.session,
				};

				//toggle newsletter notification
				axios.post(
					`${self.$store.state.app.jseCoinServer}/toggleemail/newsletter/`,
					toggleNewsletter,
				).then((res) => {
					//
				}).catch((err) => {
					self.$store.commit('ajaxError', err.response);
				});
			},
		},
		noEmailTransaction: {
			get() {
				return !this.$store.state.user.noEmailTransaction;
			},
			set(val) {
				const self = this;
				self.$store.commit('updateAppState', {
					val,
					state: 'noEmailTransaction',
				});

				//toggle newsletter
				const toggleTransactionNotification = {
					session: self.$store.state.user.session,
				};

				//toggle email transaction notification
				axios.post(
					`${self.$store.state.app.jseCoinServer}/toggleemail/transaction/`,
					toggleTransactionNotification,
				).then((res) => {
					//
				}).catch((err) => {
					self.$store.commit('ajaxError', err.response);
				});
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

			document.body.classList.remove('night');
			document.body.classList.remove('light');
			document.body.classList.add(self.$store.state.app.theme);
			//set theme if web
			if (self.$store.getters.whichPlatform === 'web') {
				//const bodyClass = `platformWeb web ${self.$store.state.app.theme}`;
				//document.body.className = bodyClass;
			}
			//set theme if mobile
			if (self.$store.getters.whichPlatform === 'mobile') {
				//const bodyClass = `platformWeb mobile ${self.$store.state.app.theme}`;
				//document.body.className = bodyClass;
			}
			//set theme if desktop
			if (self.$store.getters.whichPlatform === 'desktop') {
				//const bodyClass = `platformDesktop desktop ${self.$store.state.app.theme}`;
				//document.body.className = bodyClass;
			}
		},
		exit2FA() {
			const self = this;
			self.showSetup2FA = false;
			self.twoFACode = '';
			self.secretKey = '';
		},
		exitDisable2FA() {
			const self = this;
			self.showDisableSetup2FA = false;
			self.twoFACode = '';
			self.secretKey = '';
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
	width: 34px;
	height: 34px;
	text-align:center;
	line-height:34px;
	border-radius: 76px;
	cursor: pointer;
	transition: background 0.2s;
}


.platformWeb.min #JSEA-themeSelector {
	width: 24px;
	height: 24px;
	line-height:24px;
}

.max .settingsPanel {
	width:760px;
	margin:40px auto 16px;
}
</style>
<style>

.max .settingsPanel dd {
	display: flex;
	flex-wrap: wrap;
}
.max .settingsPanel fieldset {
	min-width: 360px;
}
.fa-info-circle {
	font-size:1.5em;
}
</style>
