<template>
	<splashAnimation 
		v-bind="{showWidget: splashWidget.activeAppIco, animateTxt: splashWidget.activeTxt}"
		:textDisplay="splashWidget.splashTxt"></splashAnimation>
</template>

<script>
import axios from 'axios';
import splashAnimation from './widgets/Splash.vue';

/**
 * @description
 * <p>On App load initialise splash loading screen.</p>
 *
 * <p>This checks connectivity session information before:</p>
 * <ul>
 *  <li>Loading required external scripts</li>
 *  <li>Redirecting user to login or dashboard page.</li>
 * </ul>
 */
export default {
	name: 'SplashLoadingScreen-Page',
	components: {
		splashAnimation,
	},
	data() {
		return {
			splashWidget: {
				activeAppIco: false, //fadeIn Animation flag
				activeTxt: false, //text animation flag
				splashTxt: 'LOADING MINING<br/>INTERFACE', //text to display
			},
			offline: {
				connectionCounter: 30, //counter when user offline
				connectionInterval: false, //js interval ref
			},
		};
	},
	/**
	 * Created
	 * on app init set default config
	 */
	created() {
		const self = this;

		//set initial window size
		self.setWindowSize(true);

		//reset store settings
		self.$store.commit('loading', true);
		self.$store.commit('loggedIn', false);

		//splash animation intro setup
		setTimeout(function(){
			self.splashWidget.activeAppIco = true;
			setTimeout(function(){
				self.splashWidget.activeTxt = true;
			},500);
		},100);

		//if not autologin clear usersession
		if (!self.$store.state.app.autoLogin) {
			localStorage.removeItem('userSession');
		}

		//attempt to login
		self.getLogin();
	},
	methods: {
		/**
		 * Sets app size of window
		 *
		 * @param {boolean} val - app initialised show small loading box window else show large window
		 * @returns nothing
		 * @public
		 */
		setWindowSize(init) {
			const self = this;
			if (self.$store.getters.whichPlatform === 'desktop') {
				//setup window
				const appWindow = self.$electron.remote.getCurrentWindow();

				//set size
				if (init) {
					appWindow.setSize(216, 216);
				} else {
					appWindow.setSize(510, 656);
				}
				//centerise
				appWindow.center();
			}
		},
		/**
		 * Connection Error - Countdown 30 seconds and try to access JSECoin again
		 *
		 * @returns nothing
		 * @public
		 */
		connectionErr() {
			const self = this;
			self.connectionInterval = setInterval(function() {
				self.splashWidget.splashTxt = `CONNECTION FAILED<br />RETRYING IN ${self.offline.connectionCounter} SEC`;
				self.offline.connectionCounter--;
				if (self.offline.connectionCounter <= 0) {
					clearInterval(self.offline.connectionInterval);
					self.offline.connectionCounter = 30;
					self.splashWidget.splashTxt = 'LOADING MINING<br/>INTERFACE';
					self.getLogin();
				}
			},1000);
		},
		/**
		 * Get Login
		 * Attempt to login
		 * Success
		 *  - redirect to dashboard page
		 * Fail
		 *  - check users connection
		 *    - if offline stay on splash animation.
		 *    - if online redirect to login page.
		 *
		 * @returns nothing
		 * @public
		 */
		getLogin() {
			const self = this;
			//session obj
			const loginSession = {
				session: localStorage.getItem('userSession'),
				app: self.$store.getters.whichPlatform,
			};
			//attempt login
			axios.post(
				`${self.$store.state.app.jseCoinServer}/login/`,
				loginSession,
			).then((res) => {
				//store user info in global user obj
				window.user = res.data;
				//wait 4 seconds
				setTimeout(function() {
					//add scripts
					self.addScripts();

					//mark user as loggedIn
					self.$store.commit('loggedIn', true);

					//add tray options
					if (self.$store.getters.whichPlatform === 'desktop') {
						self.$electron.ipcRenderer.send('login');
					}
					//redirect to dashboard page
					self.$router.push('dashboard');
					//resize window splash page
					self.setWindowSize(false);

					//user session accepted update key app globals
					const event = new Event('userDataRefresh');
					document.dispatchEvent(event, window.user);
				}, 4000);
			}).catch((err) => {
				//failed login attempt;
				if ((err.response) && (typeof (err.response.data.fail) !== 'undefined')) {
					//
					setTimeout(function() {
						//add scripts
						self.addScripts();
						//reset user obj
						window.user = {};
						//redirect to login page
						self.$router.push('login');
						//resize window splash page
						self.setWindowSize(false);
					}, 4000);
				} else {
					self.connectionErr();
				}
			});
		},
		/**
		 * Add Scripts
		 * Inject remote platform scripts to load.
		 *
		 * @returns nothing
		 * @public
		 */
		addScripts() {
			const self = this;
			self.$store.commit('loading', false);
			//server & connection is up - load required scripts
			if (document.getElementById('JSEW-coincode') === null) {
				const t = document.createElement('script');
				const s = document.getElementsByTagName('script')[0];

				//generate unique string to clear cache for any core updates
				const d = new Date();
				const n = d.getTime();

				//script attrs
				t.async = true;
				t.defer = true;
				t.crossorigin = 'anonymous';
				t.id = 'JSEW-coincode';
				//on script load start mining if mining enabled.
				t.onload = function() {
					//start mining if user has background mining enabled and user loggedin
					if ((self.$store.state.user.loggedIn) && (self.$store.state.app.autoMine)) {
						//check jsecoin global var if mining has started.
						if (window.quitMining) {
							self.$store.dispatch({
								type: 'startPlatformMining',
							});
						} else {
							self.$store.dispatch({
								type: 'stopPlatformMining',
							});
						}
					}
				};
				t.src = `https://platform.jsecoin.com/js/jsecoin.min.js?${n}`;
				/* no longer used
				const t1 = document.createElement('script');

				t1.async = true;
				t1.defer = true;
				t1.src = 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit';
				*/
				const t2 = document.createElement('script');

				t2.async = true;
				t2.defer = true;
				t2.crossorigin = 'anonymous';
				t2.src = `https://platform.jsecoin.com/js/jsecrypto.js?${n}`;

				//inject
				s.parentNode.insertBefore(t, s);
				//s.parentNode.insertBefore(t1, s);
				s.parentNode.insertBefore(t2, s);
			}
		},
	},
};
</script>