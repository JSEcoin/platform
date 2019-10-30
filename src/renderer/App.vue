<template>
	<div id="JSEA-desktop" :class="{'active':!$store.state.app.loading, 'loggedIn':$store.state.user.loggedIn, loading:$store.state.app.loading, night:$store.state.app.theme === 'night', light:$store.state.app.theme === 'light'}">
		<iframe id="JSEA-registerFrame" v-if="registered" src="https://jsecoin.com/pixels.php?conversion=signup" frameborder="0" width="1" height="1"></iframe>
		<!-- Hashrate acc need to remove -->
		<input type="hidden" id="hashrateacceleration" v-model="hashRateAcc" />
		<!-- xHashrate acc need to remove -->
		<!-- App Header -->	
		<header class="draggable-area">
			<i class="fa fa-close" v-on:click="closeWindow()"></i>
			<i class="fa fa-minus" v-on:click="minimiseWindow()"></i>
			<div id="JSEA-loadingDisplay" :style="{width: waitTimer + '%'}"></div>
		</header>
		<!-- xApp Header -->
		<!-- Offline Detection -->
		<div  id="JSEA-offline" v-if="((offline) && (!$store.state.app.loading))">
			<ContentWidget titleTxt="Disconnected from Internet">
				Please Reconnect!
			</ContentWidget>
		</div>
		<!-- xOffline Detection -->
		<!-- App Page Content -->
		<router-view></router-view>
		<!-- xApp Page Content -->
		<!-- QR scanner -->
		<footer v-if="($store.getters.whichPlatform === 'mobile')">
			<ButtonWidget buttonTxt="Cancel"  v-on:click.native="closeQR()" />
		</footer>
		<!-- QR scanner -->
	</div>
</template>

<script>
import { mapState } from 'vuex';
import ContentWidget from './components/widgets/ContentWidget.vue';
import ButtonWidget from './components/widgets/ButtonWidget.vue';

export default {
	name: 'Application-Page',
	components: {
		ContentWidget,
		ButtonWidget,
	},
	data() {
		return {
			offline: false,
		};
	},
	/**
	 * Created
	 * on app init
	 * - Setup Event Listener for user obj updates
	 * - Check user session still works and login user
	 * - Display loading splash screen until session redirects to login or dashboard page
	 */
	created() {
		const self = this;

		//confirm if server needs to change as may be blocked
		window.addEventListener('jseServerUpdate', (e) => {
			self.$store.commit('updateAppState', {
				val: e.detail,
				state: 'jseCoinServer',
			});
		});

		//set theme
		if (localStorage.getItem('theme') !== null) {
			self.$store.commit('updateAppState', {
				val: localStorage.getItem('theme'),
				state: 'theme',
			});
		}

		//build for google
		self.$store.commit('updateAppState', {
			val: (typeof (process.env.ISGOOGLE) !== 'undefined')? process.env.ISGOOGLE : false,
			state: 'isGoogle',
		});

		//define if mobile
		let displayType = 'web';
		if (typeof (cordova) !== 'undefined') {
			displayType = 'mobile';
			//console.log(self.$cordova.cordova);
			document.addEventListener('deviceready', () => {
				self.onDeviceReady();
			}, false);
		}

		//define platform
		if ((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined')) {
			const bodyClass = `platformDesktop desktop ${self.$store.state.app.theme}`;
			document.body.className = bodyClass;
			self.$store.commit('updateAppState', {
				val: 'desktop',
				state: 'platform',
			});
			self.$store.commit('updateAppState', {
				val: process.env.NODE_ENV,
				state: 'isDev',
			});
		} else {
			//if small display revert to mobile
			if (window.innerWidth < 520) {
				displayType = 'mobile';
			}
			const bodyClass = `platformWeb ${displayType} ${self.$store.state.app.theme}`;
			document.body.className = bodyClass;
			window.process = {
				type: displayType, //['mobile','web']
			};
			window.jseTestNet = window.jseTestNet || false;
			self.$store.commit('updateAppState', {
				val: displayType,
				state: 'platform',
			});
			//check if window resize on mobile/web app and browser
			window.addEventListener('resize', self.getWindowWidth);
		}

		//console.log('set splash landing route ', self.$route, self.$route.name);
		//store initial landing page to redirect - after splash screen loaded.
		self.$store.commit('updateAppState', {
			val: self.$route.name || '/login',
			state: 'initLander',
		});
		//on app load redirect to splash screen to regenerate and redirect to login or dashboard
		self.$router.push('/');

		//should app auto launch
		if (localStorage.getItem('autoLaunch') !== null) {
			self.$store.commit('updateAppState', {
				val: (String(localStorage.getItem('autoLaunch')) === 'true'),
				state: 'autoLaunch',
			});

			//
			if (self.$store.getters.whichPlatform === 'desktop') {
				self.$electron.ipcRenderer.send('autoLaunch', {
					start: self.$store.state.app.autoLaunch,
				});
			}
		}

		//mobile background mining support - silent mode
		if (localStorage.getItem('silentMode') !== null) {
			self.$store.commit('updateAppState', {
				val: ((String(localStorage.getItem('silentMode')) === 'true') && (!process.env.ISGOOGLE)),
				state: 'silentMode',
			});
		}
		//mobile background mining support
		if (localStorage.getItem('mobileBackgroundMode') !== null) {
			self.$store.commit('updateAppState', {
				val: ((String(localStorage.getItem('mobileBackgroundMode')) === 'true') && (!process.env.ISGOOGLE)),
				state: 'mobileBackgroundMode',
			});

			if ((String(localStorage.getItem('mobileBackgroundMode')) === 'true') && (!process.env.ISGOOGLE)) {
				console.log('enabling background mode');
				cordova.plugins.backgroundMode.enable();
			}
		}

		//should app auto mine
		if (localStorage.getItem('autoMine') !== null) {
			self.$store.commit('updateAppState', {
				val: ((String(localStorage.getItem('autoMine')) === 'true') && (!process.env.ISGOOGLE)),
				state: 'autoMine',
			});
		}

		//should app auto mine only when plugged in
		if (localStorage.getItem('mineWhenpluggedIn') !== null) {
			self.$store.commit('updateAppState', {
				val: ((String(localStorage.getItem('mineWhenpluggedIn')) === 'true') && (!process.env.ISGOOGLE) && (String(localStorage.getItem('autoMine')) === 'true')),
				state: 'mineWhenpluggedIn',
			});
		}

		//should app autologin
		if (localStorage.getItem('autoLogin') !== null) {
			self.$store.commit('updateAppState', {
				val: (String(localStorage.getItem('autoLogin')) === 'true'),
				state: 'autoLogin',
			});
		}

		//should we track username of login for faster login
		if (localStorage.getItem('storeUsername') !== null) {
			self.$store.commit('updateAppState', {
				val: (String(localStorage.getItem('storeUsername')) === 'true'),
				state: 'storeUsername',
			});
		}

		if (self.$store.getters.whichPlatform === 'desktop') {
			//Get app version
			self.$electron.ipcRenderer.send('getAppVersion');
			//Set app version
			self.$electron.ipcRenderer.on('updateAppVersion', (event, appVersion) => {
				self.$store.commit('updateAppState', {
					val: appVersion,
					state: 'version',
				});
				const majorVer = parseInt(appVersion.replace(/\./g,''), 10);
				self.$store.commit('updateAppState', {
					val: majorVer,
					state: 'major',
				});
			});

			//tray menu can pass dynamic paths
			self.$electron.ipcRenderer.on('route', (event, pathName) => {
				if (self.$store.state.user.loggedIn) {
					self.$router.push(pathName);
				}
			});
			//tray logout req
			self.$electron.ipcRenderer.on('logoutApp', (event, pathName) => {
				self.$store.dispatch({
					type: 'logoutUser',
				});
			});
			//miner start/stop
			self.$electron.ipcRenderer.on('miner', (event, req) => {
				if (req.action === 'start') {
					if (quitMining) {
						self.$store.dispatch({
							type: 'startPlatformMining',
						});
					}
				} else {
					self.$store.dispatch({
						type: 'stopPlatformMining',
					});
				}
			});
			//enable chart display
			self.$electron.ipcRenderer.on('enableMiningChart', (event, req) => {
				//console.log('enable');
				self.$store.commit('updateMinerState', {
					val: true,
					state: 'showChart',
				});
			});
			//disable chart display
			self.$electron.ipcRenderer.on('disableMiningChart', (event, req) => {
				//console.log('disable');
				self.$store.commit('updateMinerState', {
					val: false,
					state: 'showChart',
				});
			});
		}

		//
		window.addEventListener('online', () => {
			console.log('online');
			self.offline = false;
		});
		window.addEventListener('offline', () => {
			console.log('offline');
			self.offline = true;
		});
		//help prevent mem leak on chart..
		document.addEventListener('addHashInterval', () => {
			self.$store.commit('updateHashInterval');
		});
		document.addEventListener('miningLogUpdate', (e) => {
			//update overlay graph message
			if ((e.detail.indexOf('Data Received') >= 0) || (e.detail.indexOf('Connected!') >= 0)) {
				self.$store.dispatch({
					type: 'connectedToPlatformMining',
				});
			}
			self.$store.dispatch({
				type: 'updatePlatformMiningDisplay',
				consoleMsg: e.detail,
			});
		}, false);

		//on app initialise when socket connection is made start mining
		//clear event only needed on init connection
		if (self.$store.state.app.autoMine) {
			//check if cordova
			if (typeof (cordova) !== 'undefined') {
				//start mining if automine enabled and minewhenpluggedin is disabled
				//else allow events to to start mining when device plugged in.
				if ((!self.$store.state.app.mineWhenpluggedIn) && (!process.env.ISGOOGLE)) {
					self.initSocketConnection();
				}
			//desktop / browser make connection
			} else {
				self.initSocketConnection();
			}
		}

		//set timer to refresh updates from when user obj last updated
		self.$store.commit('updateFromNow');

		//401 err
		document.addEventListener('ajaxCredentialsError', (e) => {
			//update global msg
			self.$store.commit('updateUserStateValue', {
				val: 'Credential Error: Duplicate active sessions!',
				state: 'globalErrMsg',
			});
			//if loggedIn logout user
			if (self.$store.state.user.loggedIn) {
				self.$store.dispatch({
					type: 'logoutUser',
				});
			}
		});

		//Update key app globals when user data object is refreshed
		document.addEventListener('userDataRefresh', (e) => {
			//if newer release then redirect to force user too upgrade app
			if (window.user) {
				if (window.user.appReleaseSupport > self.$store.state.app.major) {
					//clear user globals
					self.$store.dispatch({
						type: 'resetUserState',
					});
					//redirect to app upgrade page.
					self.$router.push('upgradeApp');
					return;
				}

				//update Pending rewards system user obj
				if (typeof (window.calculatePendingTotal) === 'function') {
					window.calculatePendingTotal();
				}

				//set update user globals
				self.$store.dispatch({
					type: 'updateUserState',
					txLimit: (window.user.txLimit)?window.user.txLimit:0,
					rewards: (window.user.rewards)?window.user.rewards:{},
					pendingToday: (window.user.pendingToday)?window.user.pendingToday:0,
					pendingNextPayment: (window.user.pendingNextPayment)?window.user.pendingNextPayment:0,
					pendingTotal: (window.user.pendingTotal)?window.user.pendingTotal:0,
					pendingSelfMining: (window.user.pendingSelfMining)?window.user.pendingSelfMining:0,
					pendingPublisherMining: (window.user.pendingPublisherMining)?window.user.pendingPublisherMining:0,
					pendingReferrals: (window.user.pendingReferrals)?window.user.pendingReferrals:0,
					confirmed: (window.user.confirmed)?window.user.confirmed:false,
					balance: (window.user.balance)?window.user.balance:0,
					todaysEarnings: (window.user.statsToday)?window.user.statsToday.c:0,
					minedLifetime: ((window.user.statsTotal) && (window.user.statsTotal.c))?window.user.statsTotal.c:0,
					registrationDate: (window.user.registrationDate)?window.user.registrationDate:'',
					session: window.user.session,
					miningHistory: (window.user.mining)?Object.values(window.user.mining).slice().reverse().filter(hist => ((hist.command === 'mining') && (hist.siteid === 'Platform Mining'))):[],
					importHistory: (window.user.history)?Object.values(window.user.history).slice().reverse().filter(hist => (hist.command === 'import')):[],
				});
			}
		}, false);
	},
	/**
	 * Computed
	 * */
	computed: mapState({
		waitTimer: state => ((100/state.user.countDownFrom) * state.user.waitTimer),
		hashRateAcc: state => state.miner.hashRateAcc,
		silentMode: state => state.app.silentMode,
		registered: state => state.user.registered,
	}),
	/**
	 * Global App Functions
	 */
	methods: {
		initSocketConnection() {
			const self = this;
			const socketConnectionMade = () => {
				console.log('#######Socket connection init!');
				self.$store.dispatch({
					type: 'startPlatformMining',
				});
				document.removeEventListener('socketConnectionMade', socketConnectionMade, false);
			};
			document.addEventListener('socketConnectionMade', socketConnectionMade, false);
		},
		getWindowWidth(e) {
			const self = this;

			let displayType = 'web';
			if (window.innerWidth < 520) {
				displayType = 'mobile';
			}

			const bodyClass = `platformWeb ${displayType} ${self.$store.state.app.theme}`;
			document.body.className = bodyClass;
			window.process = {
				type: displayType, //['mobile','web']
			};
			window.jseTestNet = true;
			self.$store.commit('updateAppState', {
				val: displayType,
				state: 'platform',
			});
		},
		closeQR() {
			document.body.classList.remove('QRScanner');
			QRScanner.cancelScan();
			QRScanner.hide();
			QRScanner.destroy();
		},
		onDeviceReady() {
			const self = this;
			window.addEventListener('batterystatus', (status) => {
				//confirm user is logged in
				if (self.$store.state.user.loggedIn) {
					//if automine enabled & only mine when plugged in is enabled
					if ((String(localStorage.getItem('mineWhenpluggedIn')) === 'true') && (!process.env.ISGOOGLE) && (String(localStorage.getItem('autoMine')) === 'true')) {
						//check if device is plugged in and start mining
						if (status.isPlugged) {
							self.$store.dispatch({
								type: 'startPlatformMining',
							});
						//else stop
						} else {
							self.$store.dispatch({
								type: 'stopPlatformMining',
							});
						}
					}
				}
			}, false);
			// Handle the device ready event.
			document.addEventListener('pause', self.onPause, false);
			document.addEventListener('resume', self.onResume, false);
			if (device.platform === 'Android') {
				document.addEventListener('backbutton', self.onBackKeyDown, false);
			}

			if (typeof (cordova.plugins) === 'undefined') {
				console.log('Error: Plugins not defined..');
				return;
			}

			//background mode
			cordova.plugins.backgroundMode.on('activate', () => {
				console.log('activate - disable web optimisations - silent', self.silentMode);
				//timeout required or disable optimisation ignored when autosleep set
				setTimeout(() => {
					cordova.plugins.backgroundMode.disableWebViewOptimizations();
				}, 5000);
				cordova.plugins.backgroundMode.disableWebViewOptimizations();
			});
			cordova.plugins.backgroundMode.on('enable', () => {
				cordova.plugins.backgroundMode.setDefaults({
					title: 'JSECoin Mobile',
					text: 'Altcoin Miner app',
					silent: self.silentMode,
				});
			});
			cordova.plugins.backgroundMode.on('disable', () => {
				console.log('disable');
			});
			cordova.plugins.backgroundMode.on('deactivate', () => {
				console.log('deactivate');
			});
			cordova.plugins.backgroundMode.on('failure', () => {
				console.log('failure');
			});
		},
		onPause() {
			// Handle the pause lifecycle event.
			console.log('pause');
		},
		onResume() {
			// Handle the resume lifecycle event.
			// SetTimeout required for iOS.
			setTimeout(() => {
				console.log('resume');
			}, 0);
		},
		onBackKeyDown() {
			// Handle the back-button event on Android. By default it will exit the app.
			//navigator.app.exitApp();
		},
		/**
		 * Close Window
		 * Hides electron in tray
		 */
		closeWindow() {
			const self = this;
			//this.$electron.remote.app.quit();
			if (self.$store.getters.whichPlatform === 'desktop') {
				//stop chart if hiding app - would cause app to freeze on some devices.
				self.$store.commit('updateMinerState', {
					val: false,
					state: 'showChart',
				});
				self.$electron.ipcRenderer.send('hideApp');
			}
		},
		/**
		 * Minimise Window
		 * Minimises app to taskbar
		 */
		minimiseWindow() {
			const self = this;
			if (self.$store.getters.whichPlatform === 'desktop') {
				//stop chart if hiding app - would cause app to freeze on some devices.
				self.$store.commit('updateMinerState', {
					val: false,
					state: 'showChart',
				});
				self.$electron.remote.BrowserWindow.getFocusedWindow().minimize();
			}
		},
	},
};
</script>

<style>
/* Load in icons and base font */
@import './assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
/*@import url('https://fonts.googleapis.com/css?family=Nunito');*/
/* latin */
@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 200;
  src: local('Nunito ExtraLight Italic'), local('Nunito-ExtraLightItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN5MZ9vKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 300;
  src: local('Nunito Light Italic'), local('Nunito-LightItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN4oZNvKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 400;
  src: local('Nunito Italic'), local('Nunito-Italic'), url(./assets/fonts/nunito/XRXX3I6Li01BKofIMNaDRs4.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 600;
  src: local('Nunito SemiBold Italic'), local('Nunito-SemiBoldItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN5cYtvKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 700;
  src: local('Nunito Bold Italic'), local('Nunito-BoldItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN44Y9vKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 800;
  src: local('Nunito ExtraBold Italic'), local('Nunito-ExtraBoldItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN4kYNvKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: italic;
  font-weight: 900;
  src: local('Nunito Black Italic'), local('Nunito-BlackItalic'), url(./assets/fonts/nunito/XRXQ3I6Li01BKofIMN4AYdvKUT8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 200;
  src: local('Nunito ExtraLight'), local('Nunito-ExtraLight'), url(./assets/fonts/nunito/XRXW3I6Li01BKofA-seUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 300;
  src: local('Nunito Light'), local('Nunito-Light'), url(./assets/fonts/nunito/XRXW3I6Li01BKofAnsSUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  src: local('Nunito Regular'), local('Nunito-Regular'), url(./assets/fonts/nunito/XRXV3I6Li01BKofINeaB.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 600;
  src: local('Nunito SemiBold'), local('Nunito-SemiBold'), url(./assets/fonts/nunito/XRXW3I6Li01BKofA6sKUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  src: local('Nunito Bold'), local('Nunito-Bold'), url(./assets/fonts/nunito/XRXW3I6Li01BKofAjsOUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 800;
  src: local('Nunito ExtraBold'), local('Nunito-ExtraBold'), url(./assets/fonts/nunito/XRXW3I6Li01BKofAksCUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 900;
  src: local('Nunito Black'), local('Nunito-Black'), url(./assets/fonts/nunito/XRXW3I6Li01BKofAtsGUYevI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
.c3 svg{font:10px sans-serif;-webkit-tap-highlight-color:transparent}.c3 line,.c3 path{fill:none;stroke:#000}.c3 text{-webkit-user-select:none;-moz-user-select:none;user-select:none}.c3-bars path,.c3-event-rect,.c3-legend-item-tile,.c3-xgrid-focus,.c3-ygrid{shape-rendering:crispEdges}.c3-chart-arc path{stroke:#fff}.c3-chart-arc rect{stroke:#fff;stroke-width:1}.c3-chart-arc text{fill:#fff;font-size:13px}.c3-grid line{stroke:#aaa}.c3-grid text{fill:#aaa}.c3-xgrid,.c3-ygrid{stroke-dasharray:3 3}.c3-text.c3-empty{fill:grey;font-size:2em}.c3-line{stroke-width:1px}.c3-circle._expanded_{stroke-width:1px;stroke:#fff}.c3-selected-circle{fill:#fff;stroke-width:2px}.c3-bar{stroke-width:0}.c3-bar._expanded_{fill-opacity:1;fill-opacity:.75}.c3-target.c3-focused{opacity:1}.c3-target.c3-focused path.c3-line,.c3-target.c3-focused path.c3-step{stroke-width:2px}.c3-target.c3-defocused{opacity:.3!important}.c3-region{fill:#4682b4;fill-opacity:.1}.c3-brush .extent{fill-opacity:.1}.c3-legend-item{font-size:12px}.c3-legend-item-hidden{opacity:.15}.c3-legend-background{opacity:.75;fill:#fff;stroke:#d3d3d3;stroke-width:1}.c3-title{font:14px sans-serif}.c3-tooltip-container{z-index:10}.c3-tooltip{border-collapse:collapse;border-spacing:0;background-color:#fff;empty-cells:show;-webkit-box-shadow:7px 7px 12px -9px #777;-moz-box-shadow:7px 7px 12px -9px #777;box-shadow:7px 7px 12px -9px #777;opacity:.9}.c3-tooltip tr{border:1px solid #ccc}.c3-tooltip th{background-color:#aaa;font-size:14px;padding:2px 5px;text-align:left;color:#fff}.c3-tooltip td{font-size:13px;padding:3px 6px;background-color:#fff;border-left:1px dotted #999}.c3-tooltip td>span{display:inline-block;width:10px;height:10px;margin-right:6px}.c3-tooltip td.value{text-align:right}.c3-area{stroke-width:0;opacity:.2}.c3-chart-arcs-title{dominant-baseline:middle;font-size:1.3em}.c3-chart-arcs .c3-chart-arcs-background{fill:#e0e0e0;stroke:#fff}.c3-chart-arcs .c3-chart-arcs-gauge-unit{fill:#000;font-size:16px}.c3-chart-arcs .c3-chart-arcs-gauge-max{fill:#777}.c3-chart-arcs .c3-chart-arcs-gauge-min{fill:#777}.c3-chart-arc .c3-gauge-value{fill:#000}.c3-chart-arc.c3-target g path{opacity:1}.c3-chart-arc.c3-target.c3-focused g path{opacity:1}

/* Globals */
* {
	outline:none;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
	-webkit-tap-highlight-color: transparent;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
	user-select: none;
	cursor: default;
}

.draggable-area {
    -webkit-app-region: drag;
}
/*
.tooltip-content {
	word-break:break-all;
	font-size: 0.8em;
	user-select:all;
}*/
/*Fixes clipboard issue*/
input,
textarea {
	user-select:all;
}


html, body {
	background:transparent;
	margin:0px;
	padding:0px;
	overflow: hidden;
}

body {
	padding:2px;
	font-size: 16px;
	font-family: 'Nunito', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
body.platformWeb.mobile {
	font-size:12px;
}

body.QRScanner {
	background:transparent !important;
}

body.QRScanner #JSEA-desktop {
	background: transparent !important;
}
body.QRScanner #JSEA-wrapper {
	display: none;
}

p {
	color:#676666;
	font-size:0.8em;
}

footer {
	display: none;
}
.hide {
	display: none;
}

body.QRScanner footer {
	display:block;
	background:#052a79;
	padding:4px 8px;
	position: fixed;
	z-index:1000;
    bottom: 5px;
    left: 4px;
    right: 4px;
    border-radius: 0px 0px 4px 4px;
    border-bottom: solid 1px #000;
}

body.QRScanner.mobile footer {
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: 0px;
    border-bottom: none;
}

.hr hr {
	display: none;
}

/*iframe*/
#JSEA-iCaptcha {
	position: absolute;
	top:0px;
	left: 0px;
	bottom:0px;
	right:0px;
	width: 100%;
    height: 100%;
	z-index:10000000;
}
#JSEA-registerFrame {
	position: absolute;
	bottom:0px;
	left: -1px;
	bottom:0px;
	width: 1px;
    height: 1px;
	z-index:10000000;
}

/* Global Table Format */
.night table {
	background:#171820;
}
.light table {
	background:#fbfcfd;
}
table {
	width: 100%;
	background:#171820;
	padding:0px;
	border-radius: 6px;
	border:0px;
	border-collapse: collapse;
	overflow: hidden;
}
.night thead {
	background:#101219;
	border-radius: 6px 6px 0px 0px;
}
.night thead th {
	color:#fff;
}

.light thead {
	background:#fff;
	color:#606060;
}

.light thead th {
	color:#606060;
}

thead th {
	height: 40px;
	line-height:40px;
	padding:0px 16px;
	font-size:0.8em;
    /*text-align: center;*/
}
tbody td {
	padding:0px 12px;
	height:40px;
	line-height: 40px;
	font-size:0.8em;
}
.platformWeb.mobile tbody td {
	padding:0px 6px;
}

.night tbody tr:nth-child(even) td {
	background:#14151c;
}
.light tbody tr:nth-child(even) td {
	background:#fff;
}
/* xGlobal Table Format */

/* HR */
.night .hr {
	background-color:#101219;
}
.light .hr {
	background-color:#e6ecf0;
}
.hr {
	height: 1px;
	margin: 20px 20px 6px 20px;
}
/* xHR */

.hidden {
	display: none;
}

.center {
	text-align:center;
}
.loading header {
	display:none;
}

header {
	background-image: url("assets/header_login.png");
	background-repeat:no-repeat;
	background-position:  center;
	background-size: cover;
	/*border-bottom: solid 10px #f5f7fb;*/
	height:84px;
	position: relative;
	z-index:1000000;
}

.platformWeb.mobile header {
     background-position: 0px -4px;
	height: 56px;
}

.cf:before,
.cf:after {
    content: " "; /* 1 */
    display: table; /* 2 */
}

.cf:after {
    clear: both;
}

/* xGlobals*/

/* Slider */

.vue-slider-component .vue-slider-dot {
	background:none;
	border:0px;
	box-shadow: none;
}
.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap {
	/*display: none !important;*/
	opacity: 1;
	transition:opacity 0.2s;
	cursor: pointer;
}
.sliderWrapper:hover .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap {
	/*display: block !important;*/
	opacity: 1;
}
.vue-slider-component.vue-slider-horizontal {
}
.vue-slider-component .vue-slider-piecewise-dot,
.vue-slider-component.vue-slider-horizontal .vue-slider-process {
	border-radius: 0px;
	cursor: pointer;
}
.night .vue-slider-component .vue-slider {
	background:#1c1e28;
}
.light .vue-slider-component .vue-slider {
	background:#fafafa;
}
.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom {
	bottom:18px !important;
	font-size:0.8em;
}
.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before {
	top:-11px;
	display:none;
}
.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before,
.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before {
	border-width: 6px;
}
.night .vue-slider-component .vue-slider-tooltip {
	background:#171820 !important;
	border-color: #171820 !important;
	border-radius: 50px;
	width:32px;
	text-align:center;
	color:#676666;
	cursor: pointer;
	font-weight: bold;
    font-size: 0.9em;
}
.light .vue-slider-component .vue-slider-tooltip {
	/*background:#2d384d  !important;
	border-color: #2d384d  !important;*/
	background:#fff !important;
	border-color: #eaebed !important;
	border-radius: 50px;
	width:32px;
	text-align:center;
	color:#163457;
	cursor: pointer;
	font-weight: bold;
    font-size: 0.9em;
}
/* xSlider */


/* Template */
#JSEA-offline {
	background:rgba(0,0,0,0.6);
	position: fixed;
    top: 86px;
	left: 0px;
	right:0px;
	bottom:0px;
	z-index:1000000000;
    margin: 0px 4px 8px 4px;
    border-radius: 0px 0px 4px 4px;
}
/* xTemplate*/


#JSEA-desktop.loading,
#JSEA-desktop.loading.light,
#JSEA-desktop.loading.night {
	background: transparent;
	box-shadow: none !important;
}
#JSEA-desktop.light {
	background:#fff;
}
#JSEA-desktop.night {
	background: #171820;
}
#JSEA-desktop {
	display:none;
	background:#fff;
	box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.3);
	border-radius: 4px;
	overflow: hidden;
	height:648px;
}
.platformWeb {
	background: #000812;
}
.platformWeb.night {
	background:#000;
}
.platformWeb.light {
	background:#fff;
}
.platformWeb.desktop.night,
.platformWeb.desktop.light {
	background:transparent;
}

.platformDesktop #JSEA-desktop {
	display: block;
}
.platformWeb #JSEA-desktop {
	display: block;;
	position: absolute;
	top:50%;
	left:50%;
	margin-left:-251px;
	width:502px;
	margin-top:-324px;
}

.platformWeb.mobile #JSEA-desktop {
	width: auto;
	height: auto;
	top:0px;
	left: 0px;
	right: 0px;
	bottom:0px;
	margin:0px;
	border-radius: 0px;
	overflow: auto;
}

#JSEA-offline dl {
	top: 50%;
    margin-top: -100px;
	box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 3px 0px;
}
#JSEA-desktop.active {
	background:#fff;
}
#JSEA-desktop.active.loggedIn {
	background:#fafbfd;
}

.platformWeb header i {
	display:none;
}
header .fa-close {
	background:#001757;
	border-radius: 50px;
	color:#fff;
	text-align: center;
    height: 20px;
    width: 20px;
    line-height: 20px;
    font-size: 0.7em;
	position: absolute;
	z-index:1000;
	top:5px;
	right:5px;
	cursor: pointer;
	display: block;
	-webkit-app-region: no-drag;
	transition:background 0.2s;
}

header .fa-close:hover {
	background:#e81123;
}

header .fa-minus {
	background:#001757;
	border-radius: 50px;
	color:#fff;
	text-align: center;
    height: 20px;
    width: 20px;
	line-height: 21px;
    padding-left: 1px;
    font-size: 0.7em;
	position: absolute;
	z-index:1000;
	top:5px;
	right:30px;
	cursor: pointer;
	display: block;
	-webkit-app-region: no-drag;
	transition:background 0.2s, color 0.2s;
}

header .fa-minus:hover {
	background:#e5e5e5;
	color:#666;
}


.night .loadingDelayMask {
    background: rgba(0,0,0,0.5);
}
.light .loadingDelayMask {
    background: rgba(255,255,255,0.5);
}
.loadingDelayMask {
	position: absolute;
    top: -2px;
    left: 0px;
    right: 0px;
    bottom: 0px;
	z-index:10;
}

.night .statusDisplay {
    background: #101219;
    color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.8), inset 0px 0px 0px 1px rgba(255,255,255,0.3);
}
.light .statusDisplay {
    background: #fff;
    color: #101219;
    box-shadow: 0px 1px 2px 0px rgba(25,112,199,0.6);
	border:solid 1px rgba(53,152,219,0.7);
	font-weight:bold;
}

.statusDisplay {
	position: absolute;
    top: 24px;
    /* margin: 0px auto; */
    width: 200px;
    left: 50%;
    margin-left: -100px;
    padding: 8px 16px;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.8em;
	font-weight:bold;
    border-radius: 6px;
    letter-spacing: 1px;
}



.tableListDisplay {
	margin:0px;
	padding:0px;
}

.tableListDisplay li {
	list-style:none;
	padding:10px 20px;
	background:#171820;
	margin-bottom:10px;
	border-radius: 6px;
	overflow: hidden;
}
.night .tableListDisplay li {
	background:#171820;
}
.light .tableListDisplay li {
	background:#fafafa;
}

.row {
	display:flex;
}

.tableListDisplay .row label {
	display:block;
	margin:0px;
	min-width:160px;
}

.tableListDisplay .row span {
	display:block;
	flex-grow:1;
}
.col {
    position: relative;
    flex-grow: 1;
}
#JSEA-wrapper {
	position: relative;
	height:562px;
}

/* Night Theme */

.light header,
.night header {
    /*border-bottom: solid 10px #171820;*/
	box-shadow: inset 0px -8px 0px 0px rgba(0,0,0,0.4);
}

#JSEA-desktop.active.night {
	background:#171820;
	box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.6);
}
#JSEA-desktop.active.light {
	box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.6);
}

/* xNight Theme */



/* display container */

#JSEA-loadingDisplay {
	background:#000e35;
	height: 8px;
	position: absolute;
	bottom: 0px;
	left: 0px;
	width:20px;
	opacity:0.8;
    transition: width 0.2s;
}



.clickable,
.clickable * {
	cursor: pointer;
}
.popupHeader {
	height: 44px;
	border-bottom:solid 1px #eee;
	margin-bottom:20px;
    font-weight: bold;
    font-size: 0.8em;
    letter-spacing: 1px;
	position: relative;
	display: flex;
    align-items: center;
    justify-content: center;
}

.platformWeb.mobile .popupHeader {
	height:30px;
	margin-bottom:0px;
}

.popupHeader i {
	position: absolute;
	top:4px;
	right:6px;
	cursor: pointer;
	font-size:1.4em;
}
.popupHeader i:hover {
	color:red;
}
.popupContent {
	margin:10px;
}
.platformWeb.mobile .popupContent {
	margin:6px;
}
#JSEA-QRBGImage {
	background-image: url('./assets/images/QR_logo2.png');
	background-repeat:no-repeat;
	background-size:12%;
	background-position: center;
	position: absolute;
	top:0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
}
.coinInfoLabel {
	font-size:0.8em;
	text-align: left;
	background: #fafafa;
	border-radius: 4px;
	border:solid 1px #eee;
	margin:10px 0px;
	display: flex;
    align-items: center;
}
.coinInfoLabel b {
	background:#eee;
	padding:0px 8px;
	display: inline-block;
	min-width:100px;
	margin-right:10px;
}

.coinInfoLabel .coin {
	width:20px;
	height:20px;
	margin-right: 6px;
}

#JSEA-coinCode {
    font-size: 0.65em;
    background: #fafafa;
    padding: 4px 8px;
    border-radius: 4px;
    border: solid 1px #eee;
    font-family: courier;
    font-weight: bold;
}
.platformWeb.mobile #JSEA-coinCode {
    font-size: 0.6em;
}

.platformWeb #JSEA-QRMask {
	top:0px;
	bottom:0px;
	left: 0px;
	right:0px;
}

#JSEA-QRMask {
	background:rgba(0,0,0,0.6);
	position: fixed;
	top: 90px;
	left: 4px;
	right: 4px;
	bottom: 4px;
	border-radius: 0px 0px 4px 4px;
	z-index:10000000000;
	display:none;
}

#JSEA-QRMask.active {
	display:block;
}

#JSEA-QRMask > div {
	position: absolute;
	text-align: center;
	width:440px;
	top:42%;
	left:50%;
	margin-left:-220px;
	margin-top:-222px;
	background:#fff;
	border-radius:4px;
}
.platformWeb.mobile #JSEA-QRMask > div {
	width:340px;
	margin-left:-170px;
}

.popupContent .fa-angle-right,
.popupContent .fa-angle-left {
	position: absolute;
	color: #000;
	font-size: 4em;
	top: 40%;
	font-weight: bold;
	opacity:0.1;
	cursor: pointer;
	z-index:10;
}

.popupContent .fa-angle-left {
	left: 10px;
}
.popupContent .fa-angle-right {
	right: 10px;
}

.popupContent .fa-angle-left:hover,
.popupContent .fa-angle-right:hover {
	opacity:1;
}

.platformWeb .swal-overlay {
	top:0px;
	bottom:0px;
	left: 0px;
	right:0px;
     z-index: 10000000;
}
.swal-overlay {
	top:90px;
	bottom:4px;
	left: 4px;
	right: 4px;
    overflow-y: hidden;
	border-radius: 0px 0px 4px 4px;
}
.swal-overlay--show-modal .swal-modal {
	-webkit-animation:none;
	animation:none;
}
.swal-modal {
	width:458px;
}
.platformWeb.mobile .swal-modal {
	width:338px;
}
.platformWeb.mobile .swal-icon:first-child {
	margin:22px auto 0px auto;
}
.platformWeb.mobile .swal-title {
	font-size:20px;
}

.platformWeb.mobile .popupMessage {
	font-size:0.9em;
}

.platformWeb.mobile .infoBox {
	word-wrap: break-word;
}
.sliderWrapper .vue-slider-component .vue-slider-dot {
	box-shadow: none !important;
}
</style>
