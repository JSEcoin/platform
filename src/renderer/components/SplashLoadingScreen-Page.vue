<template>
	<SplashAnimation v-if="show"
		v-bind="{showWidget: splashWidget.activeAppIco, animateTxt: splashWidget.activeTxt}"
		:textDisplay="splashWidget.splashTxt"></SplashAnimation>
</template>

<script>
import axios from 'axios';
import SplashAnimation from '@/components/widgets/SplashV2.vue';

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
		SplashAnimation,
	},
	data() {
		return {
			show: true, //show/hide splashanimation
			route: '/login', //route to take - dash/login/register
			checkSizeInterval: false,
			splashWidget: {
				activeAppIco: false, //fadeIn Animation flag
				activeTxt: false, //text animation flag
				splashTxt: 'LOADING INTERFACE', //text to display
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
		//console.log('splash init');
		const self = this;

		//allow splash screen to be movable
		if (self.$store.getters.whichPlatform === 'desktop') {
			self.$electron.remote.getCurrentWindow().setMovable(true);
		}

		//set initial window size
		self.setWindowSize(true);

		//reset store settings
		self.$store.commit('loading', true);
		self.$store.commit('loggedIn', false);

		//controll callback issues with setInterval\
		if (self.$store.getters.whichPlatform === 'desktop') {
			document.addEventListener('checkSizeInterval', function() {
				if (self.$electron.remote.getCurrentWindow().getSize()[0] < 500) {
					self.routeDelay(self.route);
				} else {
					clearInterval(self.checkSizeInterval);
					//detect resize and force correct size
					self.$electron.remote.getCurrentWindow().on('resize',() => {
						if (self.$electron.remote.getCurrentWindow().getSize()[0] < 500) {
							self.setWindowSize(false, true);
						}
					});
					//app loading complete
					self.$store.commit('loading', false);
					//redirect to [dashboard,login] page
					self.$router.push(self.route);
					self.$electron.remote.getCurrentWindow().setMovable(true);
				}
			});
		}
		document.addEventListener('connectionInterval', function() {
			self.splashWidget.splashTxt = `CONNECTION FAILED<br />RETRYING IN ${self.offline.connectionCounter} SEC`;
			self.offline.connectionCounter--;
			if (self.offline.connectionCounter <= 0) {
				clearInterval(self.offline.connectionInterval);
				self.offline.connectionCounter = 30;
				self.splashWidget.splashTxt = 'LOADING INTERFACE';
				self.getLogin();
			}
		});

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
		//console.log(self.$route);

		//check if user session exists try to login
		if (localStorage.getItem('userSession') !== null) {
			//attempt to login
			self.getLogin();
		} else {
			//mark user as not loggedIn
			self.$store.commit('loggedIn', false);
			//add scripts
			self.addScripts();
			//reset user obj
			window.user = {};
			//check route
			if (self.$store.getters.whichLandingPage !== 'splash') {
				self.route = self.$store.getters.whichLandingPage;
			}
			setTimeout(() => {
				self.routeDelay(self.route);
			}, 5000);
		}
	},
	methods: {
		/**
		 * If mouse down delay route redirect
		 *
		 * @returns nothing
		 * @private
		 */
		routeDelay(route) {
			const self = this;

			if (self.$store.getters.whichPlatform === 'desktop') {
				self.route = route;
				//disable moving capability during route and screensize change
				self.$electron.remote.getCurrentWindow().setMovable(false);
				//hide animation transition to dash
				self.show = false;
				//add delay to hide splash animation and transition to page
				setTimeout(() => {
					//resize window splash page
					self.setWindowSize(false);
					//confirm window resize worked and redirect else retry
					self.checkSizeInterval = setInterval(() => {
						const event = new Event('checkSizeInterval');
						document.dispatchEvent(event);
					}, 500);
				}, 100);
			} else {
				//app loading complete
				self.$store.commit('loading', false);
				//console.log('splash to', route);
				//redirect to [dashboard,login] page
				self.$router.push(route);
			}
		},
		/**
		 * Sets app size of window
		 *
		 * @param {boolean} val - app initialised show small loading box window else show large window
		 * @returns nothing
		 * @public
		 */
		setWindowSize(init, disableCenter) {
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
				if (typeof (disableCenter) === 'undefined') {
					appWindow.center();
				}
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
			self.offline.connectionInterval = setInterval(() => {
				const event = new Event('connectionInterval');
				document.dispatchEvent(event);
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
					//mark user as loggedIn
					self.$store.commit('loggedIn', true);

					//add scripts
					self.addScripts();

					//add tray options
					if (self.$store.getters.whichPlatform === 'desktop') {
						self.$electron.ipcRenderer.send('login');
					}

					//redirect to dashboard if mouse up or delay until up
					self.routeDelay('/dashboard');

					//user session accepted update key app globals
					const event = new Event('userDataRefresh');
					document.dispatchEvent(event, window.user);
				}, 4000);
			}).catch((err) => {
				//failed login attempt;
				if ((err.response) && (typeof (err.response.data.fail) !== 'undefined')) {
					//
					setTimeout(function() {
						//mark user as loggedIn
						self.$store.commit('loggedIn', false);
						//add scripts
						self.addScripts();
						//reset user obj
						window.user = {};
						//redirect to login if mouse up or delay until up
						self.routeDelay('/login');
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
					if (self.$store.state.user.loggedIn) {
						//initialise socket connection
						window.startSocketIOConnection();
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