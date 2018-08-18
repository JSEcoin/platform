<template>
	<AppWrapperWidget>
		<!-- login -->
		<iframe id="JSEA-iCaptcha" v-if="showCaptcha" frameborder="0" src="https://jsecoin.com/iCaptcha/iCaptcha.html?x=1"></iframe>
		<ScrollWidget v-bind="{noNav:true}">
			<!-- Login Page -->
			<div id="JSEA-loginPage">
				<div id="JSEA-loginWrapper">
					<!-- Login Headers -->
					
					<div v-if="loading">
						<h2 id="JSEA-loginHeader" class="center">Checking Credentials</h2>
						<h4 id="JSEA-loginSubHeader" class="center">Attempting to log in...</h4>
					</div>
					<div v-else>
						<!-- Login Form -->
						<div v-if="!show2FA_interface">
							<h2 id="JSEA-loginHeader" class="center">Your Cryptocurrency Platform</h2>
							<h4 id="JSEA-loginSubHeader" class="center">Sign in to continue</h4>
						</div>
						<!-- xLogin Form -->
						<!-- 2FA Form -->
						<div v-else>
							<h2 id="JSEA-loginHeader" class="center">Please enter your two factor authentication code</h2>
							<h4 id="JSEA-loginSubHeader" class="center">(Please note there is a 30 second window to submit your code)</h4>
						</div>
						<!-- x2FA Form -->
					</div>
					<!-- xLogin Headers -->
				
					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- Login error display -->
					<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="width: 60%; margin: 10px auto;" />
					<!--<div v-if="form.error.display" class="errorMsg cf" style="width: 60%; margin: 10px auto;">
						<div><b>Error:</b> "{{}}"</div>
					</div>-->
					<!-- xLogin error display -->
					<!-- Login Form -->
					<form id="JSEA-loginForm" @submit.prevent="onSubmit" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" id="JSEA-loginFormWrapper">
							<ContentWidget class="loginFormContainer">
								<!-- User Pass login interface -->
								<div :class="{hidden:show2FA_interface}">
									<!-- User Input -->
									<div class="row">
										<InputWidget 
											v-model="form.email.val"
											placeholder="Email *"
											name="email"
											maxlength="254"
											ref="email"
											:showLabel="form.email.displayLabel"
											:flag="!form.email.valid || form.email.flag"
											@keyup="keyWatch('email')" />
									</div>
									<!-- xUser Input -->
									
									<!-- Password Input -->
									<div class="row">
										<div class="col">
											<InputWidget 
												inputType="password"
												v-bind="{hideShow: true}"
												v-model="form.password.val"
												placeholder="Password *"
												name="password"
												maxlength="254"
												ref="password"
												:showLabel="form.password.displayLabel"
												:flag="form.password.flag"
												@keyup="keyWatch('password')" />
										</div>
									</div>
									<!-- xPassword Input -->
									<!-- Request Password -->
									<div id="JSEA-forgotPass">Forgot Password</div>
									<!-- xRequest Password -->
								</div>
								<!-- xUser Pass login interface -->
								<!-- 2FA interface -->
								<div :class="{hidden:!show2FA_interface}">
									<div class="row">
										<!-- 2FA -->
										<TwoFA v-if="show2FA_interface"
											v-on:key-up="updateKey" 
											v-on:submit-code="submitCode" />
										<!-- X2FA -->
									</div>
									<!-- 2FA Timer -->
									<div id="JSEA-timeout" :style="{width:(timeout*3.34)+'%'}"></div>
									<!-- x2FA Timer -->
								</div>
								<!-- x2FA interface -->
							</ContentWidget>
							
							<div class="row">
								<ButtonWidget type="submit"
									buttonTxt="Login" style="margin-right:5px;"/>

								<ButtonWidget
									buttonTxt="Register" style="margin-left:5px;" v-on:click.native="registerUser"/>
							</div>
						</div>
					</form>				
					<!-- xLogin Form -->
				</div>
			</div>
			<!-- xLogin Page -->
			<!-- Footer -->
			<footer>
				<div class="hr"></div>
				<div class="loginCopy center">Copyright JSECoin.com 2018</div>
			</footer>
			<!-- xFooter -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
//import VueRecaptcha from 'vue-recaptcha';
import axios from 'axios';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import TwoFA from '@/components/widgets/TwoFA.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';

/**
 * @description
 * <p>User Password login form providing:</p>
 * <ul>
 *     <li>Server side captcha protection</li>
 *     <li>2FA Authentication support</li>
 * </ul>
 */
export default {
	name: 'Login-Page',
	components: {
		//VueRecaptcha,
		AppWrapperWidget,
		ContentWidget,
		FormErrorDisplayWidget,
		SpinnerWidget,
		InputWidget,
		ButtonWidget,
		TwoFA,
		ScrollWidget,
	},
	data() {
		return {
			showCaptcha: false, 		//show iframe captcha
			showPass: false,			//password input set eye icon
			passDisplay: 'password',	//password input type ['password','text']
			TwoFaInterval: false,		//2FA 30 second countdown : setInterval ();
			timeout: 0,					//TwoFaInterval interval 30 second countdown
			user: {},					//loggedin User Obj
			captchaResponse: '',		//store captcha response for use if 2FA is setup
			show2FA_interface: false,	//enable/disable 2FA interface
			loading: false,				//communicating with the server.
			//form modal
			form: {
				required: ['email', 'password'], //required fields
				email: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
				},
				password: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				authCode: {
					val1: 0,
					val2: 0,
					val3: 0,
					val4: 0,
					val5: 0,
					val6: 0,
				},
				//form error display
				error: {
					msg: '',		//form error messages
					display: false, //display error message
				},
			},
			status: {
				displayForm: true,		//display login form
				submittedForm: false,	//form succesfully submitted
				error: false,			//error detected
			},
			sitekey: '6Lfl8S8UAAAAAAWfKHLDyRbcanMwKKSBckVYuQLZ', //captcha key TODO:move out into global conf
		};
	},
	/**
	 * Created
	 * on app init
	 * - make sure loggedIn flag is off
	 */
	created() {
		const self = this;
		self.$store.commit('loggedIn', false);
		self.$store.commit('loading', false);

		//check if there is a global err Msg and display here.
		if (self.$store.state.user.globalErrMsg.length > 0) {
			self.form.error.msg = self.$store.state.user.globalErrMsg;
			self.form.error.display = true;
			//clear global msg
			self.$store.commit('updateUserStateValue', {
				val: '',
				state: 'globalErrMsg',
			});
		}

		//listen to messages from iframe
		window.addEventListener('message', self.captureMsg);
	},
	/**
	 * before leaving remove event listeners
	 */
	beforeDestroy() {
		const self = this;
		window.removeEventListener('message', self.captureMsg);
	},
	/**
	 * mounted
	 */
	mounted() {
		const self = this;
		if ((localStorage.getItem('email')) && (self.$store.state.app.storeUsername)) {
			self.form.email.val = localStorage.getItem('email');
			self.form.email.displayLabel = true;
			self.$refs.password.focus();
		} else {
			localStorage.removeItem('email');
			self.$refs.email.focus();
		}
	},
	/**
	 * Login Functions
	 */
	methods: {
		/**
		 * Redirect users to registration screen
		 *
		 * @returns nothing
		 * @public
		 */
		registerUser() {
			const self = this;
			self.$router.push('register');
		},
		/**
		 * Processes captcha iframe response success/fail from the server
		 * https://jsecoin.com/iCaptcha/iCaptcha.html?x=1
		 * and initialises verification method to display 2FA or proceed and authenticate
		 *
		 * @param {object} e - Event response from captcha message listener
		 * @param {object} e.data - Captcha data obj response
		 * @param {string} e.data.token - Captcha token
		 * @returns nothing
		 * @public
		 */
		captureMsg(e) {
			const self = this;
			if (-1*e.origin.indexOf('https://jsecoin.com') <= 0) {
				if ((e.data) && (e.data.token)) {
					//store token
					self.captchaResponse = e.data.token;
					//hide iframe
					self.showCaptcha = false;
					//verify and login
					self.onVerify(self.captchaResponse);
				}
			}
		},
		/**
		 * Shows the display form - allows easy swap from 2FA UI to Login form UI
		 * @returns nothing
		 * @public
		 */
		displayForm() {
			const self = this;
			self.status.displayForm = true;
			self.status.submittedForm = false;
		},
		/**
		 * Update authcode on enter
		 * @param {object} codes - object of codes to update dataset with
		 * @public
		 */
		submitCode(codes) {
			const self = this;
			self.form.authCode = codes;
			self.onSubmit();
		},
		/**
		 * Maps 2FA Keys to form.authCode dataset from key-up event
		 * Check to make sure only 1 character returned
		 * @param {string} ref - authcode ref
		 * @param {string} val - autcode val
		 * @public
		 */
		updateKey(ref, val) {
			const self = this;
			//check value returned
			if (typeof (val) === 'undefined') {
				self.form.authCode[ref] = '0';
				return;
			}
			//val returned check length returned
			const inputVal = String(val);
			if (inputVal.length > 1) {
				self.form.authCode[ref] = inputVal.substring(inputVal.length - 1);
			} else {
				self.form.authCode[ref] = val;
			}
		},
		/**
		 * onKeyUp set field display and check field value is correct (email etc)
		 * TODO - tidy up and replace with ButtonWidget
		 *
		 * @param {string} input - data authcode reference
		 * @returns nothing
		 * @public
		 */
		keyWatch(input) {
			const self = this;
			//if input value remove placeholder and show label above input
			if (self.form[input].val.length > 0) {
				self.form[input].flag = false;
				self.form[input].displayLabel = true;
				//if input email check format
				if (input === 'email') {
					self.checkEmail();
				}
			//no value reset field
			} else {
				self.form[input].displayLabel = false;
				self.form[input].flag = true;
			}
		},
		closeError() {
			const self = this;
			self.form.error.display = '';
		},
		/**
		 * Confirms email is in a valid format
		 * (Better approach than htm5 input email type)
		 *
		 * @returns nothing
		 * @public
		 */
		checkEmail() {
			const self = this;
			//email has value
			if (self.form.email.val.length > 0) {
				self.form.email.valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.form.email.val);
			//no value reset
			} else {
				self.form.email.valid = true;
			}
		},
		/**
		 * Submit Login form
		 * - Check all required fields have value
		 * - show captcha form if not processed else Submit with captcha code
		 *
		 * @returns nothing
		 * @public
		 */
		onSubmit() {
			const self = this;
			let checkRequiredFields = true;
			//check required fields have data
			self.form.required.forEach(function(value) {
				self.form[value].flag = false;
				if (self.form[value].val.length === 0) {
					self.form[value].flag = true;
					checkRequiredFields = false;
				}
			});

			//store email for quick login
			localStorage.setItem('email', self.form.email.val);

			//if form pass check then submit captcha
			if (checkRequiredFields) {
				self.loading = true;
				self.form.error.display = false;
				//skip recaptcha already done checking 2fa
				if (self.user.msg2fa) { // dont do recaptcha again for 2fa login
					self.onVerify();
				//run recaptcha.
				} else {
					self.showCaptcha = true; //shows jsecoin.com captcha screen
					//self.$refs.invisibleRecaptcha.execute();
				}
			} else {
				self.form.error.display = true;
				self.form.error.msg = 'Failed to submit form - please check all required fields';
			}
		},
		/**
		 * Captcha responded with hash
		 * - check if user has 2FA enabled and display interface
		 * - mark user as logged in
		 * - redirect to dashboard page
		 *
		 * @param {string} response - captcha response code
		 * @returns nothing
		 * @public
		 */
		onVerify(response) {
			const self = this;
			//clear 2FA interval
			clearInterval(self.TwoFaInterval);

			//login data post
			const loginInfo = {
				email: self.form.email.val,
				initial: 1,
				jseUnique: localStorage.getItem('jseUnique'),
				password: self.form.password.val,
				app: self.$store.getters.whichPlatform,
			};

			//if captcha then send captcha else must be 2fa
			if (typeof (response) !== 'undefined') {
				self.captchaResponse = response;
				loginInfo['g-recaptcha-response'] = response;
			} else {
				const AC = self.form.authCode;
				const completeAuthCode = AC.val1+AC.val2+AC.val3+AC.val4+AC.val5+AC.val6;
				loginInfo.authCode = completeAuthCode;
				loginInfo['g-recaptcha-response'] = self.captchaResponse;
			}

			axios.post(
				`${self.$store.state.app.jseCoinServer}/login/`,
				loginInfo,
			).then((res) => {
				self.user = res.data;
				//show form
				self.loading = false;

				//if user has 2fa enabled display model window prevent redirect
				if (typeof (self.user.msg2fa) !== 'undefined') {
					//reset previous authcode vals
					self.form.authCode.val1 = '0';
					self.form.authCode.val2 = '0';
					self.form.authCode.val3 = '0';
					self.form.authCode.val4 = '0';
					self.form.authCode.val5 = '0';
					self.form.authCode.val6 = '0';
					//reset 2FA display counter
					self.timeout = 0;
					//show 2FA interface
					self.show2FA_interface = true;
					//initialise countdown
					self.TwoFaInterval = setInterval(function(){
						self.timeout++;
						//counter reached 30seconds reset form to login
						if (self.timeout >= 30) {
							clearInterval(self.TwoFaInterval);
							self.show2FA_interface = false;
						}
					}, 1000);

					return false;
				}
				//disable 2FA interface if enabled
				self.show2FA_interface = false;

				// No 2fa required
				if (!self.user.confirmed) {
					//alert('You need to confirm your email address using the link provided in the registration email<br><br><a href="self.$store.state.app.jseCoinServer/resendwelcome/'+user.uid+'/'+user.email+'/" target="_blank">Resend Welcome Email</a>');
				}

				//self.$store.state.user.session = user.session;
				window.user = self.user;

				//load dashboard route
				self.$store.commit('loggedIn', true);

				//user session accepted update key app globals
				const event = new Event('userDataRefresh');
				document.dispatchEvent(event, window.user);

				//start mining if user has background mining enabled and user loggedin
				if (self.$store.state.user.loggedIn) {
					//initialise socket connection
					window.startSocketIOConnection();
				}

				//add tray options
				if (self.$store.getters.whichPlatform === 'desktop') {
					self.$electron.ipcRenderer.send('login');
				}

				//redirect to dashboard
				self.$router.push('dashboard');
				return true;
			}).catch((err) => {
				console.log(err);
				//2fa reset
				if (err.response.data.resetForm === 1) {
					self.user = {};
				}

				self.status.displayForm = true;
				self.form.error.display = true;
				self.show2FA_interface = false;
				self.loading = false;
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Failed to submit form - please check your connection';
				}
			});
		},
		/**
		 * Captcha code expired return to login screen
		 *
		 * @returns nothing
		 * @public
		 */
		onExpired() {
			const self = this;
			self.loading = false;
			self.show2FA_interface = false;
		},
		/**
		 * Reset Captcha request
		 *
		 * @returns nothing
		 * @public
		 */
		resetRecaptcha() {
			const self = this;
			self.$refs.recaptcha.reset(); // Direct call reset method
			self.loading = false;
			self.show2FA_interface = false;
		},
		/**
		 * Reset ReCaptcha
		 * Reset google captcha
		 */
		onRender(x) {},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
iframe {
	position: absolute;
	top:0px;
	left: 0px;
	bottom:0px;
	right:0px;
	width: 100%;
    height: 100%;
	z-index:10000000;
}
#JSEA-loginPage {
	position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    display: flex;
}
#JSEA-loginWrapper {
    align-self: center;
    width: 100%;
}
.platformWeb.mobile #JSEA-loginWrapper {
    align-self: inherit;
	margin-top: 20px;
}

.night #JSEA-loginHeader {
	color:#eee;
}
.light #JSEA-loginHeader {
	color:#3c3c3c;
}
#JSEA-loginHeader {
	margin-bottom:0px;
	padding-bottom:0px;
	font-size:1.1em;
}

#JSEA-loginSubHeader {
	margin:0px 0px 20px 0px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
}

#JSEA-loginForm {
	width:60%;
	margin:10px auto;
}


.platformWeb.mobile #JSEA-loginForm {
	width:90%;
}

.night .loginFormContainer {
	background: #20222e;
}
.light .loginFormContainer {
	background: #f8fafb;
}
.loginFormContainer {
	padding:0px !important;
	border-radius:8px !important;
	margin: 10px 0px 20px 0px !important;
	overflow: hidden !important;
	position: relative !important;
	overflow: hidden !important;
	box-shadow:none !important;
}

#JSEA-timeout {
	position: absolute;
	bottom:0px;
	left: 0px;
	width:0%;
	height: 10px;
	background:#042a7a;
	transition: width 0.2s;
}

.night .loginCopy {
	color:#666;
}
.light .loginCopy {
	color:#939393;
}
.loginCopy {
	font-size:0.7em;
}

.inputLabel {
	position: absolute;
    top: 0;
    left: 20px;
}

.col {
	position: relative;
	flex-grow:1;
}
.grecaptcha-badge {
	display:none!important;
}


footer {
	position: absolute;
	bottom: 12px;
	left: 0px;
	right: 0px;
}


#JSEA-forgotPass {
	font-weight:bold;
	text-align:center;
	color:#30c1ea;
	font-size:0.9em;
	padding:10px 8px;
	cursor: pointer;
	float:right;
}


#JSEA-forgotPass:hover {
	color:#042a7a;
}

</style>
