<template>
	<div id="JSEA-desktop" :class="{'active':!$store.state.app.loading, 'loggedIn':$store.state.user.loggedIn, loading:$store.state.app.loading, night:$store.state.app.theme === 'night', light:$store.state.app.theme === 'light'}">
		<iframe id="JSEA-registerFrame" v-if="registered" src="https://jsecoin.com/pixels.php?conversion=signup" frameborder="0" width="1" height="1"></iframe>
		<!-- Hashrate acc need to remove -->
		<input type="hidden" id="hashrateacceleration" v-model="hashRateAcc" />
		<!-- xHashrate acc need to remove -->
		<!-- Offline Detection -->
		<div  id="JSEA-offline" v-if="((offline) && (!$store.state.app.loading))">
			<ContentWidget titleTxt="Disconnected from Internet">
				Please Reconnect!
			</ContentWidget>
		</div>
		<header id="JSEA-desktopAppHeader" class="draggable-area" v-if="(($store.state.app.platform === 'desktop') && ($route.path !== '/'))">
			<div id="JSEA-headerBar">
				<div id="JSEA-headerBarContainer">
					<i class="fa fa-close" v-on:click="closeWindow()"></i>
					<i class="fa fa-square-o" v-on:click="ExpandWindow()"></i>
					<i class="fa fa-minus" v-on:click="minimiseWindow()"></i>
				</div>
			</div>
		</header>
		<!-- xOffline Detection -->
		<div id="JSEA-appWrapper" :class="{'hideApp':hideApp}">
			<div id="JSEA-sideBar" :class="{'showSideBar':sideBarActive}">
				<div id="JSEA-toggleSideBar" v-intro="'Expand or collapse the side bar'" v-on:click="toggleSideBar">
					<nav>
						<ul>
							<li></li>
							<li></li>
							<li></li>
						</ul>
					</nav>
				</div>
				<router-link v-bind:to="`/dashboard`" tag="a" id="JSEA-sideLogo"></router-link>
				<nav id="JSE-sideNav">
					<ScrollWidget style="top:55px;">
						<ul v-intro="'Your side bar navigation elements'">
							<li><router-link v-if="($store.state.user.loggedIn)" v-bind:to="`/dashboard`" tag="span" id="JSE-overviewButton"><i class="fa fa-home"></i> Account Overview <router-link v-bind:to="`/settings`" tag="i" class="fa fa-cog"></router-link></router-link>
								<ul>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.dashboard}"><span v-on:click="toggleMenu('dashboard')">Dashboard</span>
										<ul>
											<router-link v-bind:to="`/dashboard`" tag="li"><i class="fa fa-columns"></i> Overview</router-link>
											<router-link v-bind:to="`/dashboard/account`" tag="li"><i class="fa fa-user-circle-o"></i> Account</router-link>
											<!--<router-link v-bind:to="`/dashboard/exchange`" tag="li"><i class="fa fa-exchange"></i> Exchange</router-link>-->
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.wallet}"><span v-on:click="toggleMenu('wallet')">Wallet</span>
										<ul>
											<router-link v-bind:to="`/wallet`" tag="li"><i class="fa fa-paper-plane"></i> Transfer</router-link>
											<router-link v-bind:to="`/wallet/export`" tag="li"><i class="fa fa-upload"></i> Export</router-link>
											<router-link v-bind:to="`/wallet/import`" tag="li"><i class="fa fa-download"></i> Import</router-link>
											<router-link v-bind:to="`/wallet/transactions`" tag="li"><i class="fa fa-exchange"></i> Transactions</router-link>
										</ul>
									</li>
									<li :class="{'showMenu':nav.blockchain}"><span v-on:click="toggleMenu('blockchain')">Blockchain Explorer</span>
										<ul>
											<!--<router-link v-bind:to="`/dashboard`" tag="li"><i class="fa fa-search"></i> Search</router-link>-->
											<router-link v-bind:to="`/blockchain`" tag="li"><i class="fa fa-link"></i> Latest</router-link>
											<!--<router-link v-bind:to="`/dashboard`" tag="li"><i class="fa fa-arrows-h"></i> My Transfers</router-link>-->
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.mining}"><span v-on:click="toggleMenu('mining')">Platform Mining</span>
										<ul>
											<router-link v-bind:to="`/mine`" tag="li"><i class="fa fa-keyboard-o"></i> Interface</router-link>
											<router-link v-bind:to="`/mine/earnings`" tag="li"><i class="fa fa-bank"></i> Earnings</router-link>
										</ul>
									</li>
									<!--
									<li :class="{'showMenu':nav.system}"><span v-on:click="toggleMenu('system')">System</span>
										<ul>
											<router-link v-bind:to="`/system`" tag="li"><i class="fa fa-bell"></i> Server Status</router-link>
											<router-link v-bind:to="`/system/stats`" tag="li"><i class="fa fa-globe"></i> JSE Global Stats</router-link>
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.publishers}"><span v-on:click="toggleMenu('publishers')">Publishers</span>
										<ul>
											<router-link v-bind:to="`/publishers`" tag="li"><i class="fa fa-columns"></i> Dashboard</router-link>
											<router-link v-bind:to="`/publishers/setup`" tag="li"><i class="fa fa-globe"></i> Setup New Site</router-link>
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.adTech}"><span v-on:click="toggleMenu('adTech')">AdTech</span>
										<ul>
											<router-link v-bind:to="`/adTech`" tag="li"><i class="fa fa-columns"></i> Dashboard</router-link>
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.merchants}"><span v-on:click="toggleMenu('merchants')">Merchants</span>
										<ul>
											<router-link v-bind:to="`/merchants`" tag="li"><i class="fa fa-columns"></i> Dashboard</router-link>
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" :class="{'showMenu':nav.affiliates}"><span v-on:click="toggleMenu('affiliates')">Affiliates</span>
										<ul>
											<router-link v-bind:to="`/affiliates`" tag="li"><i class="fa fa-columns"></i> Dashboard</router-link>
											<router-link v-bind:to="`/affiliates/resources`" tag="li"><i class="fa fa-exchange"></i> Resources</router-link>
										</ul>
									</li>-->
									<li :class="{'showMenu':nav.developers}"><span v-on:click="toggleMenu('developers')">Developers</span>
										<ul>
											<!--<router-link v-if="($store.state.user.loggedIn)" v-bind:to="`/developers`" tag="li"><i class="fa fa-magic"></i> Dashboard</router-link>-->
											<li v-on:click="openExternalWindow('https://github.com/jsecoin/')"><i class="fa fa-github"></i> Github</li>
											<li v-on:click="openExternalWindow('https://developer.jsecoin.com/')"><i class="fa fa-globe"></i> API Documentation</li>
											<li v-on:click="openExternalWindow('https://jsecoin.com/styleguide/')"><i class="fa fa-paint-brush"></i> Platform UI</li>
										</ul>
									</li>
									<li :class="{'showMenu':nav.support}"><span v-on:click="toggleMenu('support')">Support</span>
										<ul>
											<!--<router-link v-bind:to="`/crypto/tats`" tag="li"><i class="fa fa-magic"></i> stats</router-link>-->
											<!--<router-link v-bind:to="`/crypto/Wall`" tag="li"><i class="fa fa-magic"></i> cryptowall</router-link>-->
											<li v-on:click="siteWizard"><i class="fa fa-magic"></i> Site Wizard</li>
											<!--<router-link v-bind:to="`/dashboard`" tag="li"><i class="fa fa-exchange"></i> Transactions</router-link>
											<router-link v-bind:to="`/dashboard`" tag="li"><i class="fa fa-lock"></i> Authentication</router-link>-->
											<li v-on:click="openExternalWindow('https://jsecoin.com/support')"><i class="fa fa-info-circle"></i> Support Center</li>
											<li v-on:click="openExternalWindow('https://t.me/jsetelegram')"><i class="fa fa-telegram"></i> Telegram</li>
											<!--<li><i class="fa fa-user-circle"></i> Virtual Assistant</li>-->
										</ul>
									</li>
									<li v-if="($store.state.user.loggedIn)" v-on:click="logout()"><span>Log Out</span></li>
									<router-link v-if="(!$store.state.user.loggedIn)" v-bind:to="`/login`" tag="li"><span>Log In</span></router-link>
								</ul>
							</li>
						</ul>
						<div v-intro="'JSEcoin Active Platform release'" id="JSEA-version">v{{$store.state.app.version}}</div>
					</ScrollWidget>
				</nav>
			</div>

			<div id="JSEA-contentWrapper">
				<div id="JSEA-content">
					<!-- Web Header -->
					<header v-if="($store.state.app.platformURL !== '')">
						<router-link v-if="(!sideBarActive)" v-bind:to="`/dashboard`" tag="a" id="JSEA-sideLogoHeader"></router-link>
						<ul id="JSEA-headerItems">
							<li id="JSEA-googleTranslate"><i class="button"></i></li>
							<li><i class="button fa fa-magic" v-on:click="siteWizard"></i></li>
							<li v-intro="'Toggle between themes Night and Light'"><i id="JSEA-themeSelector" v-on:click="toggleTheme" class="fa" :class="{'fa-sun-o':($store.state.app.theme === 'night'),'fa-moon-o':($store.state.app.theme === 'light')}"></i></li>
							<li v-intro="'Share our platform with others in your networks'" :class="{'activeMenu':socialActive}" style="position:relative;"><i v-on:click="toggleSocial" class="button fa" :class="{'fa-share-alt':!socialActive, 'fa-angle-down':socialActive}"></i>
								<social-sharing id="JSEA-socialLinks" url="https://jsecoin.com" title="JSEcoin" description="Digital Currency - Designed for the web 🤖" twitter-user="JSEcoin" hashtags="altcoin, ad-tech, Cryptocurrency, webmasters" inline-template>
									<div>
										<network network="facebook">
											<i class="fa fa-fw fa-facebook"></i>
										</network>
										<network network="googleplus">
											<i class="fa fa-fw fa-google-plus"></i>
										</network>
										<network network="linkedin">
											<i class="fa fa-fw fa-linkedin"></i>
										</network>
										<network network="reddit">
											<i class="fa fa-fw fa-reddit"></i>
										</network>
										<network network="twitter">
											<i class="fa fa-fw fa-twitter"></i>
										</network>
										<network network="vk">
											<i class="fa fa-vk"></i>
										</network>
										<network network="weibo">
											<i class="fa fa-weibo"></i>
										</network>
									</div>
								</social-sharing>
							</li>
							<li v-intro="'Your active profile'" id="JSEA-profileMenu" v-if="($store.state.user.loggedIn)">
								<div id="JSEA-profileWrap">
									<canvas ref="indenticon" width="600" height="600" style="width: 50px; height: 50px; margin-left: -6px; margin-top: 6px;"></canvas>
								</div>
								<div>
									<div id="JSEA-profileUserName">{{user.name}}</div>
									<div id="JSEA-profilePublicKey">{{user.publicKey}}</div>
								</div>
								<i class="fa fa-angle-down"></i>
							</li>
						</ul>
					</header>
					<!-- xWeb Header -->
					<!-- App Header -->
					<header v-if="($store.state.app.platformURL === '')">
						<div id="JSEA-desktopLogo"></div>
						<div id="JSEA-loadingDisplay" :style="{width: waitTimer + '%'}"></div>
					</header>
					<!-- xApp Header -->

					<!-- App Page Content -->
					<router-view></router-view>
					<!-- xApp Page Content -->
				</div>
			</div>
		</div>
		<!-- QR scanner -->
		<footer v-if="($store.getters.whichPlatform === 'mobile')">
			<ButtonWidget buttonTxt="Cancel"  v-on:click.native="closeQR()" />
		</footer>
		<!-- QR scanner -->
	</div>
</template>

<script>
import { mapState } from 'vuex';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import ContentWidget from './components/widgets/ContentWidget.vue';
import ButtonWidget from './components/widgets/ButtonWidget.vue';
import ScrollWidget from './components/widgets/ScrollWidget.vue';

export default {
	name: 'Application-Page',
	components: {
		ContentWidget,
		ButtonWidget,
		ScrollWidget,
	},
	data() {
		return {
			hideApp: false,
			offline: false,
			resizeTimer: null,
			nav: {
				dashboard: false,
				wallet: false,
				blockchain: false,
				mining: false,
				system: false,
				publishers: false,
				adTech: false,
				merchants: false,
				affiliates: false,
				developers: false,
				support: false,
			},
			identiconImg: [],
			identiconParts: {
				//background: 9,
				//legs: 6,
				//arms: 8,
				neck: 3,
				hat: 9,
				//body: 7,
				head: 8,
				eyes: 9,
				//logo: 8,
			},
			identiconTotal: 0,
			user: {
				name: '',
				publicKey: '',
			},
			socialActive: false,//social links active
			sideBarActive: true, //sidebar display
		};
	},
	mounted() {
		const self = this;
		//self.$electron.getCurrentWindow().removeAllListeners();
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
		/*window.addEventListener('beforeunload', ()=>{
			self.$electron.getCurrentWindow().removeListener('blur', titlebarBlur);
			self.$electron.getCurrentWindow().removeListener('focus', titlebarFocus);
			self.$electron.getCurrentWindow().removeListener('maximize', maxOrRes);
			self.$electron.getCurrentWindow().removeListener('restore', maxOrRes);
		});*/
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
				val: 'platformDesktop',
				state: 'base',
			});
			//console.log('proc', process.env.NODE_ENV);
			self.$store.commit('updateAppState', {
				val: process.env.NODE_ENV,
				state: 'isDev',
			});
		} else {
			//if small display revert to mobile
			//if (window.innerWidth < 520) {
			//	displayType = 'mobile';
			//}
			const bodyClass = `platformWeb ${displayType} ${self.$store.state.app.theme}`;
			document.body.className = bodyClass;
			//if (typeof (window.process) === 'undefined') {
				window.process = {
					type: displayType, //['mobile','web']
				};
			//} else {
		//		window.process.type = displayType;
			//}
			window.jseTestNet = window.jseTestNet || false;
			self.$store.commit('updateAppState', {
				val: displayType,
				state: 'platform',
			});
			self.$store.commit('updateAppState', {
				val: 'platformWeb',
				state: 'base',
			});
		}
		self.getWindowWidth();
		//check if window resize on mobile/web app and browser
		window.addEventListener('resize', self.getWindowWidth);

		//console.log('set splash landing route ', self.$route, self.$route.name);
		//store initial landing page to redirect - after splash screen loaded.
		self.$store.commit('updateAppState', {
			val: (self.$route.name)?`${self.$route.name}` : '/login',
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

		//notifications
		if (localStorage.getItem('notifications') !== null) {
			self.$store.commit('updateAppState', {
				val: (String(localStorage.getItem('notifications')) === 'true'),
				state: 'notifications',
			});
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
				if (typeof (appVersion) !== 'undefined') {
					//console.log('xx', appVersion);
					self.$store.commit('updateAppState', {
						val: appVersion,
						state: 'version',
					});
					const majorVer = parseInt(appVersion.replace(/\./g,''), 10);
					self.$store.commit('updateAppState', {
						val: majorVer,
						state: 'major',
					});
				}
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

				//generate public key
				self.generateIdenticon(window.user.publicKey);
				self.user.name = window.user.name;
				self.user.publicKey = window.user.publicKey;
				//set update user globals
				self.$store.dispatch({
					type: 'updateUserState',
					twoFactorAuth: (window.user.twoFactorAuth)?window.user.twoFactorAuth:false,
					noNewsletter: (window.user.noNewsletter)?window.user.noNewsletter:false,
					noEmailTransaction: (window.user.noEmailTransaction)?window.user.noEmailTransaction:false,
					txLimit: (window.user.txLimit)?window.user.txLimit:0,
					rewards: (window.user.rewards)?window.user.rewards:{},
					pendingToday: (window.user.pendingToday)?window.user.pendingToday:0,
					publicKey: (window.user.publicKey)?window.user.publicKey:'',
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
			//
			clearTimeout(self.resizeTimer);
			self.resizeTimer = setTimeout(() => {
				let screenType = 'med';
				let platformURL = '';
				if (window.innerWidth < 520) {
					screenType = 'min';
					window.process = {
						type: 'mobile', //['mobile','web','tablet','desktop']
					};
				} else if (window.innerWidth < 1000) {
					screenType = 'med';
				} else {
					screenType = 'max';
					platformURL = '/desktop';
				}

				const bodyClass = `${screenType} ${self.$store.state.app.base} ${self.$store.state.app.platform} ${self.$store.state.app.theme}`;
				document.body.className = bodyClass;
				window.jseTestNet = true;
				self.$store.commit('updateAppState', {
					val: screenType,
					state: 'screen',
				});
				self.$store.commit('updateAppState', {
					val: platformURL,
					state: 'platformURL',
				});
			}, 250);
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
		/**
		 * Expands Window
		 * expands app to fullscreen
		 */
		ExpandWindow() {
			const self = this;
			if (self.$store.getters.whichPlatform === 'desktop') {
				//console.log('d', self.$electron.remote.BrowserWindow.getFocusedWindow().isMaximized());
				if (self.$electron.remote.BrowserWindow.getFocusedWindow().isMaximized()) {
					//self.$electron.remote.BrowserWindow.getFocusedWindow().setFullScreen();
					self.hideApp = true;
					setTimeout(() => {
						self.$electron.remote.BrowserWindow.getFocusedWindow().unmaximize();
					}, 10);
					setTimeout(() => {
						self.hideApp = false;
					}, 400);
				} else {
					self.hideApp = true;
					setTimeout(() => {
						self.$electron.remote.BrowserWindow.getFocusedWindow().maximize();
					}, 10);
					setTimeout(() => {
						self.hideApp = false;
					}, 400);
				}
			}
		},
		/**
		 * toggle Menu
		 * toggles display of ub menu items.
		 */
		toggleMenu(item) {
			const self = this;
			self.nav[item] = !self.nav[item];
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
				const bodyClass = `platformWeb web ${self.$store.state.app.theme} ${self.$store.state.app.screen}`;
				document.body.className = bodyClass;
			}
			//set theme if mobile
			if (self.$store.getters.whichPlatform === 'mobile') {
				const bodyClass = `platformWeb mobile ${self.$store.state.app.theme} ${self.$store.state.app.screen}`;
				document.body.className = bodyClass;
			}
			//set theme if desktop
			if (self.$store.getters.whichPlatform === 'desktop') {
				const bodyClass = `platformDesktop desktop ${self.$store.state.app.theme} ${self.$store.state.app.screen}`;
				document.body.className = bodyClass;
			}
		},
		generateIdenticon(publicKey) {
			const self = this;
			const identiconFiles = [];
			let identCode = 1;
			let tmpCode = 0;

			let charCount = 4; // skip the first few
			Object.entries(self.identiconParts).forEach(([key, value]) => {
				//if (!identiconParts.hasOwnProperty(key)) continue;
				const charCode = window.user.publicKey.charCodeAt(charCount);
				identCode = 1;
				tmpCode = 0;

				// limit identCode to max number of parts via a basic math loop
				while (tmpCode <= charCode) {
					identCode++;
					tmpCode++;
					if (identCode > self.identiconParts[key]) {
						identCode = 1;
					}
				}
				identiconFiles[key] = 'https://jsecoin.com/img/identicons/'+key+identCode+'.png';
				self.identiconImg.push(self.loadImage(identiconFiles[key]));
				charCount++;
			});
			//console.log(identiconFiles);
		},
		loadImage(src) {
			const self = this;
			const img = new Image();
			img.onload = self.updateCanvas;
			img.src = src;
			return img;
		},
		updateCanvas() {
			const self = this;
			self.identiconTotal++;
			if (Object.values(self.identiconParts).length === self.identiconTotal) {
				const canvas = self.$refs.indenticon;
				if (typeof (canvas) !== 'undefined') {
					const ctx = canvas.getContext('2d');
					//console.log('x',self.identiconImg);
					self.identiconImg.forEach((i, k) => {
						//console.log(i);
						ctx.imageSmoothingQuality = 'high';
						ctx.drawImage(i, 0, 0);
					});
				}
			}
		},
		toggleSocial() {
			const self = this;
			self.socialActive = !self.socialActive;
		},
		toggleSideBar() {
			const self = this;
			self.sideBarActive = !self.sideBarActive;
		},
		siteWizard() {
			const self = this;
			console.log(self.$intro());
			//self.$intro().start();
			self.$intro().setOptions({
				helperElementPadding: 0,
				showStepNumbers: false,
				tooltipClass: 'jseaTooltipInfo',
				highlightClass: 'jseaTooltipHelper',
				disableInteraction: true,
			}).start();
		},
		/**
		 * Opens an external browser window and takes the user to the official upgrade forum post
		 * https://jsecoin.com/topic/jsecoin-desktop-mining-app-0-4-0-download/
		 *
		 * @param {string} url Web address to open in a new browser window
		 * @public
		 */
		openExternalWindow(url) {
			const self = this;
			if (self.$store.getters.whichPlatform === 'desktop') {
				this.$electron.shell.openExternal(url);
			} else if (self.$store.getters.whichPlatform === 'mobile'){
				cordova.InAppBrowser.open(url, '_system');
			} else {
				window.open(url);
			}
		},
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
a,
a * {
	cursor: pointer;
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
	height:100%;
}

body {
	/*padding:2px;*/
	font-size: 16px;
	font-family: 'Nunito', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
body.platformWeb.min {
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

body.QRScanner.min footer {
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: 0px;
    border-bottom: none;
}

.hr hr {
	display: none;
}
#JSEA-appWrapper.hideApp {
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

#JSEA-desktopAppHeader {
	height: 20px;
    position: absolute;
    z-index: 2147483647;
    left: 0px;
    right: 0px;
    top: 0px;
    overflow: hidden;
    box-shadow: none;
    background: none;
}
#JSEA-headerBar {
	background-image: url("assets/images/header_loginv2.png");
    background-repeat: no-repeat;
    background-position: center 0px;
    background-size: cover;
    height: 84px;
}

#JSEA-headerBarContainer {
	height:20px;
	background:rgba(0,0,0,0.3);
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
	background:#eaebed;
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
	/*line-height: 40px;*/
	font-size:0.8em;
}
.dataset td {
	text-align:center;
}
.dataset th:first-child,
.dataset td:first-child {
	text-align:left;
}
.platformWeb.min tbody td {
	padding:0px 6px;
}

.night tbody tr:nth-child(even) td {
	background:#14151c;
}
.light tbody tr:nth-child(even) td {
	background:#fff;
}
.night tbody tr:hover td {
	background:#0d0d12;
}
.light tbody tr:hover td {
	background:#f7f9fb;
}
.clickableRow td {
	cursor: pointer;
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
	background-image: url("assets/images/header_loginv2.png");
	background-repeat:no-repeat;
	background-position:  center -20px;
	background-size: cover;
	/*border-bottom: solid 10px #f5f7fb;*/
	height:64px;
	position: relative;
	z-index:100000;
}

.max header {
	height: 55px;
    /*border-bottom: solid 1px #ddd;*/
}
/*
.platformDesktop.max header {
	height:75px;
}*/

.max.light header {
	background:#fff;
	box-shadow:0px 0.5px 0px 0px #ddd !important;
}
.max.night header {
	background:#20222e;
	box-shadow:0px 0.5px 0px 0px #171820 !important;
}

.platformWeb.min header {
    background-position: 0px -4px;
	height: 56px;
}

#JSEA-desktopLogo {
	background-image: url("assets/images/header_desktop_logo.png");
	background-repeat:no-repeat;
	background-position:  center;
	background-size: cover;
	/*border-bottom: solid 10px #f5f7fb;*/
	height:45px;
	width:189px;
	margin:8px auto 0px;
}
.max #JSEA-headerBar {
	background: #010814;
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
	padding:0px;
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
	/*box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.3);*/
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
	/*border-radius: 8px;*/
	overflow: hidden;
	height:648px;
	/*transition: all 0.2s;*/
}

.platformDesktop #JSEA-desktop {
	height:100%;
	padding-top:20px;
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

.platformWeb.min #JSEA-desktop {
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
.platformWeb.max #JSEA-desktop {
	width: auto;
	height: auto;
	top:0px;
	left: 0px;
	right: 0px;
	bottom:0px;
	margin:0px;
	border-radius: 0px;
	/*overflow: auto;*/
	background: #fafbfd;
}

#JSEA-offline dl {
	top: 50%;
    margin-top: -100px;
	box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 3px 0px;
}
#JSEA-desktop.active {
	background:#fafbfd;
}
#JSEA-desktop.active.loggedIn {
	background:#fafbfd;
}

.platformWeb header i {
	display:none;
}
header .fa-close {
	color:#999;
	text-align: center;
    height: 20px;
    width: 20px;
    line-height: 20px;
    font-size: 0.7em;
	position: absolute;
	z-index:1000;
	top:0px;
	right:0px;
	cursor: pointer;
	display: block;
	-webkit-app-region: no-drag;
	transition:background 0.2s;
}

header .fa-close:hover {
	color:#fff;
	background:#e81123;
}

header .fa-minus {
	right:40px;
}
header .fa-square-o  {
	right:20px;
}
header .fa-minus,
header .fa-square-o {
	color:#999;
	text-align: center;
    height: 20px;
    width: 20px;
	line-height: 21px;
    padding-left: 1px;
    font-size: 0.7em;
	position: absolute;
	z-index:1000;
	top:0px;
	cursor: pointer;
	display: block;
	-webkit-app-region: no-drag;
	transition:background 0.2s, color 0.2s;
}

header .fa-minus:hover,
header .fa-square-o:hover {
	background:rgba(255,255,255,0.1);
	color:#fff;
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
	margin-top:8px;
	position: relative;
	height:562px;
	flex:1;
}


.max #JSEA-wrapper {
	margin-top:0px;
}

/* Night Theme */

.light header {
	box-shadow: 0px 8px 0px 0px #ecf1f5;
}
.night header {
    /*border-bottom: solid 10px #171820;*/
	box-shadow: 0px 8px 0px 0px rgba(0,0,0,0.4);
}

#JSEA-desktop.active.night {
	background:#171820;
	box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.6);
}
#JSEA-desktop.active.light {
	/*box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.6);*/
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
}

.platformDesktop #JSEA-desktop.active.night,
.platformDesktop #JSEA-desktop.active.light {
	box-shadow: none;
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

.platformWeb.min .popupHeader {
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
.platformWeb.min .popupContent {
	margin:6px;
}
#JSEA-QRBGImage {
	background-image: url('assets/images/QR_logo3.png');
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
.platformWeb.min #JSEA-coinCode {
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
.platformWeb.min #JSEA-QRMask > div {
	/*width:340px;
	margin-left:-170px;*/

    top: 0px;
    bottom: 0px;
    margin: 0px !important;
    left: 0px;
    right: 0px;
    width: auto;
    border-radius: 0px;
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
.platformWeb.min .swal-modal {
	width:338px;
}
.platformWeb.min .swal-icon:first-child {
	margin:22px auto 0px auto;
}
.platformWeb.min .swal-title {
	font-size:20px;
}

.platformWeb.min .popupMessage {
	font-size:0.9em;
}

.platformWeb.min .infoBox {
	word-wrap: break-word;
}
.sliderWrapper .vue-slider-component .vue-slider-dot {
	box-shadow: none !important;
}

#JSEA-appWrapper {
	display: flex;
	height:100%;
}
#JSEA-sideBar {
	display:none;
	position:relative;
}

.max #JSEA-sideBar {
	display:block;
	min-width:0px;
	/*border-right: solid 1px #ddd;*/
}
.max #JSEA-sideBar.showSideBar {
	min-width:200px;
	/*border-right: solid 1px #ddd;*/
}
.max.light #JSEA-sideBar {
	background:#fff;
	box-shadow: inset -0.5px 0px 0px 0px #ebecec;
}
.max.night #JSEA-sideBar {
	background:#20222e;
	box-shadow: inset -0.5px 0px 0px 0px #171820;
}

#JSEA-contentWrapper {
	flex:1;
}
#JSEA-content {
	display:flex;
	flex-direction: column;
	height:100%;
}

.max .card {
	width:420px;
}
.max .card .card {
	width: 100%;
}
.max .hr.split {
	display: none;
}
#JSEA-sideLogoHeader {
	height:55px;
	background-repeat: no-repeat;
	background-size:70%;
	background-position: 20px center;
	display: block;
	cursor: pointer;
	width:200px;
    float: left;
    margin-left: 14px;
}
.max.light #JSEA-sideLogoHeader {
	background-image: url("assets/images/jseLogo.svg");
}

.max.night #JSEA-sideLogoHeader {
	background-image: url("assets/images/jseLogo_night.svg");
}
#JSEA-sideLogo {
	height:55px;
	background-repeat: no-repeat;
	background-size:70%;
	background-position: 20px center;
	display: block;
	cursor: pointer;
}
.max.light #JSEA-sideLogo {
	background-image: url("assets/images/jseLogo.svg");
	box-shadow: inset 0px -0.5px 0px 0px #ddd, inset -0.5px 0px 0px 0px #ddd;
}

.max.night #JSEA-sideLogo {
	background-image: url("assets/images/jseLogo_night.svg");
	box-shadow: inset 0px -0.5px 0px 0px #171820, inset -0.5px 0px 0px 0px #171820;
}

#JSE-sideNav {
	font-size: 12.5px;
}
#JSE-sideNav ul {
	margin:0px;
	padding:0px;
	padding-right:0.5px;
}

.light #JSE-sideNav ul {
	box-shadow: inset 0px -0.5px 0px 0px #ddd;
}
.night #JSE-sideNav ul {
	box-shadow: inset 0px -0.5px 0px 0px #171820;
}
#JSE-sideNav ul ul {
	border:0px;
}
#JSE-sideNav li {
	list-style:none;
}

.light #JSE-sideNav li {
	background:#fff;
	color:#929292;
}
.night #JSE-sideNav li {
	background:#20222e;
	color:#929292;

}

.light #JSE-sideNav li.showMenu,
.light #JSE-sideNav li.showMenu li {
	background: #fbfcfd;
}

.night #JSE-sideNav li.showMenu,
.night #JSE-sideNav li.showMenu li {
	background: #1c1e28;
}

.light #JSE-sideNav li.showMenu span {
	color:#666;
}
.night #JSE-sideNav li.showMenu span {
	color:#fff;
}
#JSE-sideNav li.showMenu li {
	display: flex;
}

#JSE-sideNav li span {
	padding:10px 8px;
	display: block;
	position: relative;
	display: flex;
	cursor: pointer;
	transition: background 0.2s;
}

.light #JSE-sideNav li #JSE-overviewButton {
	box-shadow: inset 0px -0.5px 0px 0px #ddd;
}
.night #JSE-sideNav li #JSE-overviewButton {
	box-shadow: inset 0px -0.5px 0px 0px #171820;
}

.light #JSE-sideNav li span:hover {
	background:#fbfcfd;
}
.night #JSE-sideNav li span:hover {
	background:#1c1e28;
}
#JSE-sideNav .fa {
	font-size:1.4em;
	margin-right:6px;
}


#JSE-sideNav li li .fa {
	font-size:1em;
	align-self: center;
}

#JSE-sideNav .fa.fa-cog {
	position: absolute;
	right:10px;
	font-size:1.3em;
    padding-left: 10px;
	cursor:pointer;
	transition:color 0.2s;
}

.light #JSE-sideNav .fa.fa-cog {
    border-left: solid 1px #eee;
}
.night #JSE-sideNav .fa.fa-cog {
    border-left: solid 1px #171820;
}
.light #JSE-sideNav .fa-cog:hover {
	color:#000e35;
}
.night #JSE-sideNav .fa-cog:hover {
	color:#fff;
}

.light #JSE-sideNav li li {
	/*background:#fbfcfd;*/
}

.night #JSE-sideNav li li {
	background:#20222e;
}


#JSE-sideNav li li span {
	font-size:1.1em;
	font-weight:bold;
	background:transparent;
	border:0px;
	box-shadow: unset;
	padding-left:18px;
}
#JSE-sideNav li li {
	padding-bottom:10px;
}
.light #JSE-sideNav li li {
	box-shadow: inset 0px -0.5px 0px 0px #ddd;
	/*border-bottom:solid 1px #ddd;*/
	background:#fff;
}
.night #JSE-sideNav li li {
	box-shadow: inset 0px -0.5px 0px 0px #171820;
	/*border-bottom:solid 1px #ddd;*/
	/*background:#1c1e28;*/
}
#JSE-sideNav li li li {
	border:0px;
	padding:6px 6px 6px 20px;
	cursor: pointer;
	transition: background 0.4s;
	display:none;
}

.light #JSE-sideNav li li li,
.night #JSE-sideNav li li li {
	box-shadow: unset;
}


.light #JSE-sideNav li li li:hover {
	background:#e4f5f2;
	color:#666;
}
.night #JSE-sideNav li li li:hover {
	background:#181a23;
	color:#666;
}

.light #JSE-sideNav li li li.active,
.light #JSE-sideNav li li li.router-link-exact-active {
	background:#1bb394;
	color:#fff;
}

.night #JSE-sideNav li li li.active,
.night #JSE-sideNav li li li.router-link-exact-active {
	background:#101219;
	color:#fff;
}

#JSEA-headerItems {
	margin:0px;
	padding:0px;
	height:55px;
	float:right;
	display: none;
}
.platformWeb.max #JSEA-headerItems,
.platformDesktop.max #JSEA-headerItems {
	display: flex;
}


#JSEA-headerItems li {
	list-style: none;
	height:100%;
	min-width:55px;
	/*border-left:solid 1px #ddd;*/
	display: flex;
	align-items: center;
	position: relative;
    z-index: 100000;
}


.light #JSEA-headerItems li {
	box-shadow:inset -0.5px 0px 0px 0px #ddd;
}
.night #JSEA-headerItems li {
	box-shadow:inset -0.5px 0px 0px 0px #171820;
}

#JSEA-headerItems li i {
	height:35px;
	width:35px;
	margin:0px auto;
	border-radius: 4px;
	color:#fff;
	display: block;
	cursor:pointer;
	line-height: 35px;
    font-size: 1.2em;
	text-align: center;
}

.light #JSEA-headerItems li i {
	background-color: #2ba7fe;
}

.night #JSEA-headerItems li i {
	background-color: #13151c;
}

#JSEA-headerItems li i:hover {
	background-color:#1970c7;
}
#JSEA-version {
	padding:10px 20px;
}
.light #JSEA-version {
	color:#ddd;
}
.night #JSEA-version {
	color:#666;
}

#JSEA-profileWrap {
	background-size: 40px;
	min-width:40px;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0px 10px;
	overflow:hidden;
}
.light #JSEA-profileWrap {
	background-image: url("assets/images/profile_wrap.svg");
}
.night #JSEA-profileWrap {
	background-image: url("assets/images/profile_wrap_night.svg");
}

#JSEA-profileMenu {
	display:flex;
	max-width:300px;
	padding-right:10px;
	overflow: hidden;
	color:#afafaf;
	box-shadow: unset !important;
	cursor: pointer;
}
#JSEA-profileMenu * {
	cursor: pointer;
}

.light #JSEA-profileMenu:hover {
	background:#fbfcfd;
}
.night #JSEA-profileMenu:hover {
	background:#1c1e28;
}
#JSEA-profileUserName {
	font-weight:bold;
}
#JSEA-profilePublicKey {
	font-size:0.7em;
	overflow: hidden;
	white-space: nowrap;
  	text-overflow: ellipsis;
	max-width: 200px;
	opacity:0.7;
}
#JSEA-profileMenu .fa {
    margin: 0px;
    height: 20px;
    line-height: 20px;
	min-width:35px;
}

#JSEA-socialLinks {
	position: absolute;
    top: 55px;
    left: 0px;
    right: 0px;
    box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.3);
	padding-bottom:10px;
	display:none;
}
.light #JSEA-socialLinks {
    background: #fff;
}
.night #JSEA-socialLinks {
    background: #20222e;
}

.activeMenu #JSEA-socialLinks {
	display:block;
}

.activeMenu .fa-angle-down {
	background:#1970c7 !important;
}
#JSEA-socialLinks i {
	margin-top:10px !important;
}
#JSEA-toggleSideBar {
    position: absolute;
    right: -22px;
    z-index: 100001;
    top: 0px;
    width: 22px;
	transition: height 0.4s;
	height:56px;
}
/*
.platformDesktop #JSEA-toggleSideBar {
	top:20px;
}*/

#JSEA-toggleSideBar * {
	cursor: pointer;
}

#JSEA-toggleSideBar nav {
	width:4px;
    height: 100%;
    display: flex;
    /*align-items: center;*/
}
.light #JSEA-toggleSideBar nav {
    background: #2ba7fe;
}
.night #JSEA-toggleSideBar nav {
    background: #13151c;
}
#JSEA-toggleSideBar ul {
	margin:0px;
    /* width: 14px; */
    /* margin-right: 5px; */
    padding: 8px 8px 8px 10px;
    border-radius: 0px 4px 4px 0px;
    height: 36px;
    margin-top: 10px;
}

.light #JSEA-toggleSideBar ul {
	background: #2ba7fe;
}
.night #JSEA-toggleSideBar ul {
	background: #13151c;
}
#JSEA-toggleSideBar li {
	background: #fff;
	border-radius:10px;
	width:4px;
	height:4px;
	list-style: none;
    margin: 2px 0px;
}
.light #JSEA-toggleSideBar:hover nav,
.light #JSEA-toggleSideBar:hover ul {
	background: #1970c7;
}
.night #JSEA-toggleSideBar:hover nav,
.night #JSEA-toggleSideBar:hover ul {
	background: #1970c7;
}
#JSEA-toggleSideBar:hover {
	bottom:0px;
	height:100%;
}
.filterTabs li.active,
.filterTabs li:hover {
	color:#fff;
}
.light .filterTabs li.active,
.light .filterTabs li:hover {
	box-shadow: inset 0px -4px 0px 0px #1970c7;
	background:#1970c7;
	color:#fff;
}
.night .filterTabs li.active,
.night .filterTabs li:hover {
	box-shadow: inset 0px -4px 0px 0px #000;
	background:#000;
	color:#fff;
}

.filterTabs li {
	cursor: pointer;
	list-style:none;
	padding:4px 8px;
	text-align:center;
	min-height:30px;
	line-height:30px;
}
.light .filterTabs li {
	box-shadow: inset 0px -2px 0px 0px #1970c7;
	color: #3598db;
}
.night .filterTabs li {
	box-shadow: inset 0px -2px 0px 0px #000;
	color: #3598db;
}

.filterTabs li:last-child {
	border-right:0px;
}
#FB-block {
    width: 880px;
    margin: 0px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.filterTabs {
	margin:0px;
	padding:0px;
	display: flex;
}
.filterTabs li {
	flex:1;
    text-transform: uppercase;
    font-size: 0.7em;
    font-weight: bold;
}


.summaryPanel div {
	padding:8px 20px;
	display: flex;
	color:#8e8e8e;
}

.summaryPanel label {
	min-width:100px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: hidden;
	font-weight: bold;
}

.light .summaryPanel div:nth-child(odd) {
	background: #fbfcfd;
}
.night .summaryPanel div:nth-child(odd) {
	background: #171820;
}

.tree-view-wrapper {
	padding:10px 20px;
}

.tree-view-item-root {
	background:#282b2e;
	border-radius: 6px;
	padding:16px;
	overflow:auto;
}

.tree-view-item-node {
	color:#cc7832;
}
.tree-view-item-key {
	color:#6A8759;
}
.tree-view-item-value-string {
	color:#a9b7c6;
}

.tree-view-item-value-number {
	color:#6897BB;
}

.tree-view-item-key-with-chevron:before {
	color:#ffa !important;
}
.tree-view-item {
	margin-left:36px !important;
}

.hasConnectedFilter {
	border-radius: 0px 0px 6px 6px;
}

.hasConnectedFilter thead {
	border-radius: 0px;
}

.infoPanel {
	border-radius: 6px;
    margin: 20px;
    padding: 20px;
    text-align: center;
}
.light .infoPanel {
	background:#fbfcfd;
}
.night .infoPanel {
	background:#171820;
}

.jseaTooltipInfo {
	border-radius: 0px;
}
.jseaTooltipHelper {
	border-radius: 0px;
	border:0px;
}
#JSEA-googleTranslate i {
	background-image: url("assets/images/google_translate_logo.svg");
	background-repeat:no-repeat;
	background-size:60%;
	background-position:center;
}
</style>
