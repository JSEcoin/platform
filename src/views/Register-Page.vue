<template>
	<AppWrapperWidget>
		<!-- register -->
		<ScrollWidget v-bind="{noNav:true}">
			<!-- register Page -->
			<div id="JSEA-registerPage">
				<div id="JSEA-registerWrapper">

					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- register error display -->
					<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="width: 60%; margin: 10px auto;" />
					<!-- xregister error display -->

					<!-- register Form -->
					<form id="JSEA-registerForm" @submit.prevent="onSubmit" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" id="JSEA-registerFormWrapper">
							<ContentWidget class="registerFormContainer">
								<!-- Register Form -->
								<div>
									<h2 id="JSEA-registerHeader" class="center">Registration</h2>
									<h4 id="JSEA-registerSubHeader" class="center">Setup your account</h4>
								</div>
								<h4 class="title">Account Details</h4>
								<!-- User Pass register interface -->
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
										<InputWidget
											v-model="form.fullName.val"
											placeholder="Full Name *"
											name="fullName"
											maxlength="254"
											ref="fullName"
											:showLabel="form.fullName.displayLabel"
											:flag="!form.fullName.valid || form.fullName.flag"
											@keyup="keyWatch('fullName')" />
									</div>
									<!-- xFull Name Input -->
									<!-- email Input -->
									<div class="row" style="flex-wrap: wrap;">
										<div class="col">
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
										<div class="col">
											<InputWidget
												v-model="form.confirmEmail.val"
												placeholder="Confirm Email *"
												name="confirmEmail"
												maxlength="254"
												ref="confirmEmail"
												:showLabel="form.confirmEmail.displayLabel"
												:flag="!form.confirmEmail.valid || form.confirmEmail.flag"
												@keyup="keyWatch('confirmEmail')" />
										</div>
									</div>
									<!-- xemail Input -->
									<!-- Password Input -->
									<div class="row">
										<div class="col">
											<InputWidget
												inputType="password"
												newpassword="new-password"
												v-bind="{hideShow: true, passwordStrength:true}"
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
								</div>
							</ContentWidget>

							<ContentWidget class="registerFormContainer">
								<h4 class="title">Address Information</h4>

								<div class="formWrapper">
									<!-- Postal Address Line 1 Input -->
									<div class="row">
										<InputWidget
											v-model="form.addressLine1.val"
											placeholder="Address Line 1"
											name="Address Line 1"
											maxlength="254"
											ref="addressLine1"
											:showLabel="form.addressLine1.displayLabel"
											:flag="!form.addressLine1.valid || form.addressLine1.flag"
											@keyup="keyWatch('addressLine1')" />
									</div>
									<!-- xPostal Address Line 1 Input -->
									<!-- Postal Address Line 2 Input -->
									<div class="row">
										<InputWidget
											v-model="form.addressLine2.val"
											placeholder="Address Line 2"
											name="addressLine2"
											maxlength="254"
											ref="addressLine2"
											:showLabel="form.addressLine2.displayLabel"
											:flag="!form.addressLine2.valid || form.addressLine2.flag"
											@keyup="keyWatch('addressLine2')" />
									</div>
									<!-- xPostal Address Line 2 Input -->
									<!-- Postal City Town Input -->
									<div class="row">
										<InputWidget
											v-model="form.cityTown.val"
											placeholder="City / Town"
											name="cityTown"
											maxlength="254"
											ref="cityTown"
											:showLabel="form.cityTown.displayLabel"
											:flag="!form.cityTown.valid || form.cityTown.flag"
											@keyup="keyWatch('cityTown')" />
									</div>
									<!-- xPostal City Town Input -->
									<div class="row" style="flex-wrap: wrap;">
										<div class="col">
											<!-- Postal State Province Region Input -->
											<InputWidget
												v-model="form.stateProvinceRegion.val"
												placeholder="State / Province / Region"
												name="stateProvinceRegion"
												maxlength="254"
												ref="stateProvinceRegion"
												:showLabel="form.stateProvinceRegion.displayLabel"
												:flag="!form.stateProvinceRegion.valid || form.stateProvinceRegion.flag"
												@keyup="keyWatch('stateProvinceRegion')" />
											<!-- xPostal State Province Region Input -->
										</div>
										<div class="col">
											<!-- Postal Zip Postal Code Input -->
											<InputWidget
												v-model="form.zipPostalCode.val"
												placeholder="Zip / Postal Code"
												name="zipPostalCode"
												maxlength="254"
												ref="zipPostalCode"
												:showLabel="form.zipPostalCode.displayLabel"
												:flag="!form.zipPostalCode.valid || form.zipPostalCode.flag"
												@keyup="keyWatch('zipPostalCode')" />
											<!-- xPostal Zip Postal Code Input -->
										</div>
									</div>
									<!-- Country Input -->
									<div class="row">
										<InputWidget
											inputFieldType="select"
											v-model="form.country.val"
											placeholder="Country"
											name="country"
											maxlength="254"
											ref="country"
											@input="updateCountryCodeVal"
											v-bind="{showLabel:true}"
											:flag="!form.country.valid || form.country.flag" />
									</div>
									<!-- xCountry Input -->
								</div>
								<!-- xUser Pass register interface -->
							</ContentWidget>

							<ContentWidget class="registerFormContainer">
								<h4 class="title">Terms of use</h4>
								<SettingsItemRowWidget style="border-radius:8px;" settingName="I agree by the terms and policy outlined on the JSEcoin Official Website.">
									<ToggleSwitchWidget
										v-model="acceptTerms"
										v-bind="{
											type: 'accept',
											name: 'autoLogin',
										}" />
								</SettingsItemRowWidget>
								<div class="hr" style="margin:10px;"></div>
								<ButtonWidget
									type="button"
									v-bind="{isSmall:true}"
									style="width:100%"
									class="cancel"
									buttonTxt="View Terms and Policy" v-on:click.native="openExternalWindow('https://jsecoin.com/en/legal/privacyPolicy')" />
							</ContentWidget>

							<div class="row buttonRow" style="min-height:60px;">
								<ButtonWidget :class="{'disable':!acceptTerms}" :disabled="!acceptTerms" type="submit"
									buttonTxt="Register Account" style="margin-right:5px; margin-left:15px;" />

								<ButtonWidget type="button"
									buttonTxt="Cancel" style="margin-left:5px; margin-right:15px;" v-on:click.native="cancelRegister" />
							</div>
						</div>
					</form>
					<!-- xregister Form -->
				</div>
			</div>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import axios from 'axios';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ToggleSwitchWidget from '@/components/widgets/ToggleSwitchWidget.vue';
import SettingsItemRowWidget from '@/components/widgets/SettingsItemRowWidget.vue';

/**
 * @description
 * <p>User registration page</b></p>
 */
export default {
	name: 'Register-Page',
	components: {
		//VueRecaptcha,
		AppWrapperWidget,
		ContentWidget,
		FormErrorDisplayWidget,
		SpinnerWidget,
		InputWidget,
		ButtonWidget,
		ScrollWidget,
		ToggleSwitchWidget,
		SettingsItemRowWidget,
	},
	data() {
		return {
			captchaResponse: '',		//store captcha response
			acceptTerms: false,
			loading: false,	//communicating with the server.
			badEmailProviders: [
				'cobin2hood.com',
				'mailinator',
				'inboxalias',
				'maildrop.cc',
				'guerrillamail',
				'tm2mail.com',
				'muimail.com',
				'hitbts.com',
				'minex-coin.com',
				'c1oramn.com',
				'balanc3r.com',
				'c1oramn.com',
				'letsmail9.com',
				'crymail2.com',
				'ax80mail.com',
			],
			//form modal
			form: {
				required: ['fullName', 'email', 'confirmEmail', 'password'], //required fields
				fullName: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
				},
				email: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
				},
				confirmEmail: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
				},
				password: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
					score: 0,
				},
				addressLine1: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				addressLine2: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				cityTown: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				stateProvinceRegion: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				zipPostalCode: {
					val: '',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				country: {
					val: 'US',
					displayLabel: false,
					valid: true,			//valid value
					flag: false,
				},
				//form error display
				error: {
					msg: '',		//form error messages
					display: false, //display error message
				},
			},
			status: {
				displayForm: true,		//display register form
				submittedForm: false,	//form succesfully submitted
				error: false,			//error detected
			},
		};
	},
	/**
	 * Created
	 * on app init
	 * - make sure loggedIn flag is off
	 */
	created() {
		//console.log('register init');
		const self = this;
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
	 * Register Functions
	 */
	methods: {
		/**
		 * Processes captcha iframe response success/fail from the server
		 * https://jsecoin.com/iCaptcha/iCaptcha.html?JSE=alpha
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
					//self.showCaptcha = false;
					self.$store.commit('updateAppState', {
						val: false,
						state: 'showCaptcha',
					});
					//verify and login
					self.onVerify(self.captchaResponse);
				} else if ((e.data) && (e.data.closeCaptcha)) {
					self.$store.commit('updateAppState', {
						val: false,
						state: 'showCaptcha',
					});
					self.form.error.display = true;
					self.form.error.msg = 'Exited Captcha security check - unable to register';
					self.loading = false;
				}
			}
		},
		onSubmit() {
			const self = this;

			//check scrollTo available - customised code
			if (typeof (self.$vuebar.scrollTo) !== 'undefined') {
				const bodyScroll = document.getElementById('JSEA-appBody');
				self.$vuebar.scrollTo(bodyScroll,0);
			}

			//
			self.form.error.msg = '';
			self.form.error.display = false;
			if (!self.acceptTerms) {
				self.form.error.msg = 'You must review and accept the JSEcoin terms before registering your account.';
				self.form.error.display = true;
				return;
			}

			let checkRequiredFields = true;
			//check required fields have data
			self.form.required.forEach(function(value) {
				self.form[value].flag = false;
				if (self.form[value].val.length === 0) {
					self.form[value].flag = true;
					checkRequiredFields = false;
				}
			});

			//if form pass check then submit captcha
			if (checkRequiredFields) {
				//store email for quick login
				localStorage.setItem('email', self.form.email.val);

				self.loading = true;
				self.form.error.display = false;
				self.$store.commit('updateAppState', {
					val: true,
					state: 'showCaptcha',
				});//shows jsecoin.com captcha screen
			} else {
				self.form.error.msg = 'Please check all highlighted fields are complete.';
				self.form.error.display = true;
			}
		},
		onVerify(response) {
			const self = this;
			const localTime = new Date();
			const localTS = localTime.getTime();
			const address = `${self.form.addressLine1.val}, ${self.form.addressLine2.val}, ${self.form.cityTown.val}, ${self.form.stateProvinceRegion.val}, ${self.form.zipPostalCode.val}`;

			const registerUserInfo = {
				name: self.form.fullName.val,
				email: self.form.email.val,
				address,
				country: self.form.country.val,
				'g-recaptcha-response': response,
				password: self.form.password.val,
				app: self.$store.getters.whichPlatform,
				preRegHashes: 0,
				localTS,
				timeOffset: localTime.getTimezoneOffset(),
				regTime: localTS - window.scriptLoadTS,
				language: window.navigator.userLanguage || window.navigator.language,
				screen: (window.screen.width+'x'+window.screen.height) || 'unknown',
				userAgent: window.navigator.userAgent || self.$store.getters.whichPlatform || 'unknown',
			};
			//check cookies
			if (document.cookie.indexOf('utmSource') > -1) { registerUserInfo.source = window.getCookie('utmSource'); }
			if (document.cookie.indexOf('utmCampaign') > -1) { registerUserInfo.campaign = window.getCookie('utmCampaign'); }
			if (document.cookie.indexOf('utmContent') > -1) { registerUserInfo.content = window.getCookie('utmContent'); }
			//check localstorage
			if (localStorage.getItem('utmSource') !== null) { registerUserInfo.source = localStorage.getItem('utmSource'); }
			if (localStorage.getItem('utmCampaign') !== null) { registerUserInfo.campaign = localStorage.getItem('utmCampaign'); }
			if (localStorage.getItem('utmContent') !== null) { registerUserInfo.content = localStorage.getItem('utmContent'); }
			if (localStorage.getItem('jseUnique') !== null) { registerUserInfo.jseUnique = localStorage.getItem('jseUnique'); }
			// check get variables
			if (window.get.utm_source) { registerUserInfo.source = window.get.utm_source; }
			if (window.get.utm_campaign) { registerUserInfo.campaign = window.get.utm_campaign; }
			if (window.get.utm_content) { registerUserInfo.content = window.get.utm_content; }

			//post registration params
			axios.post(
				`${self.$store.state.app.jseCoinServer}/register/`,
				registerUserInfo,
			).then((res) => {
				self.user = res.data;
				//show form
				self.loading = false;
				//failed
				if (self.user.fail === 1) {
					self.form.error.display = true;
					self.form.error.msg = res.data.notification;
					return false;
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

				//mark user as registered enable tracker
				self.$store.commit('updateUserStateValue', {
					val: true,
					state: 'registered',
				});

				//check if new user display PIN requirements form
				if (self.user.requirePin) {
					self.$router.push('/enterSecurityPin');
				//else redirect to dashboard
				} else {
					self.$router.push('/dashboard');
				}
				return true;
			}).catch((err) => {
				console.log(err);
				self.status.displayForm = true;
				self.form.error.display = true;
				self.loading = false;
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Failed to submit form - please check your connection';
				}
			});
		},
		checkEmail(input) {
			const self = this;
			self.form.error.display = false;

			//email has value
			if (self.form[input].val.length > 0) {
				self.form[input].flag = false;
				self.form[input].valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.form[input].val);
				//check against bad domains
				const result = self.badEmailProviders.filter((domain) => {
					if (self.form[input].val.indexOf(domain) >= 0) {
						return domain;
					}
					return false;
				});
				if (result.length > 0) {
					self.form[input].flag = true;
					self.form[input].valid = false;
					self.form.error.msg = 'This domain has been blacklisted - please use another email provider.';
					self.form.error.display = true;
				}
			//no value reset
			} else {
				self.form[input].valid = true;
				self.form[input].flag = false;
			}
		},
		cancelRegister() {
			const self = this;
			self.$router.push('/login');
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
				self.form[input].valid = true;
				self.form[input].flag = false;
				self.form[input].displayLabel = true;
				//if input email check format
				if ((input === 'email') || (input === 'confirmEmail')) {
					self.checkEmail(input);
					if ((self.form.email.val.length > 0) && (self.form.confirmEmail.val.length > 0)) {
						if (self.form.email.val !== self.form.confirmEmail.val) {
							self.form.email.flag = true;
							self.form.confirmEmail.flag = true;
						} else {
							self.form.email.flag = false;
							self.form.confirmEmail.flag = false;
						}
					}
				}
				if (input === 'password') {
					if (!window.goodPassword(self.form[input].val)) {
						self.form[input].valid = false;
						self.form[input].flag = true;
					}
				} else {
					//clean strings entered
					setTimeout(() => {
						self.form[input].val = window.cleanString(self.form[input].val);
					},10);
				}
			//no value reset field
			} else {
				self.form[input].displayLabel = false;
				self.form[input].flag = true;
			}
		},
		closeError() {
			const self = this;
			self.form.error.msg = '';
			self.form.error.display = false;
		},
		updateCountryCodeVal(val) {
			const self = this;
			self.form.country.val = val;
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
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


#JSEA-registerWrapper {
    align-self: center;
    width: 100%;
}

.platformWeb.min #JSEA-registerWrapper {
    align-self: inherit;
	margin-top: 20px;
}

.night #JSEA-registerHeader {
	color:#eee;
}

.light #JSEA-registerHeader {
	color:#3c3c3c;
}

#JSEA-registerHeader {
	margin:0px;
	padding-bottom:0px;
	font-size:1.1em;
}


#JSEA-registerSubHeader {
	margin:0px -16px 20px -16px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
	padding-bottom: 16px;
    border-bottom: solid 6px rgba(0,0,0,0.06);
}

#JSEA-registerForm {
	margin:20px;
}

#JSEA-registerForm h4.title {
	margin:0px 8px;
}

.platformWeb.min #JSEA-registerForm {
	width:90%;
}
/*
.night .registerFormContainer {
	background: #20222e;
}

.light .registerFormContainer {
	background: #f8fafb;
}*/


.max.light .registerFormContainer {
    background: #fff;
    box-shadow: rgba(210, 214, 217,1) 0px 1px 3px 0px !important;
    border-radius: 10px !important;
}
.max.night .registerFormContainer {
    background: #20222e;
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.6) !important;
    border-radius: 10px !important;
}
.max .registerFormContainer {
    margin: 10px auto !important;
}

.registerFormContainer {
	padding:0px !important;
	border-radius:8px !important;
	margin: 10px 0px 20px 0px !important;
	overflow: hidden !important;
	position: relative !important;
	/*overflow: hidden !important;
	box-shadow:none !important;*/
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

.night .registerCopy {
	color:#666;
}

.light .registerCopy {
	color:#939393;
}

.registerCopy {
	font-size:0.7em;
}

#JSEA-forgotPass:hover {
	color:#042a7a;
}
select {
	border: 0px;
    /* border-bottom: solid 1.5px #30c1ea; */
    color: #a5a5a5;
    padding: 4px 8px;
    height: 32px;
    line-height: 32px;
    font-size: 1em;
    flex-grow: 1;
	margin: 26px 6px 8px;
    color: #666;
    border-radius: 3px;
    cursor: text;
}
.light select {
    background: #fff;
    border-bottom: solid 1px #ddd;
}
.night select {
	background: #101219;
    border-bottom: solid 1px #444;
}

#JSEA-registerFormWrapper {
	margin-top:40px;
}

.max #JSEA-registerFormWrapper .buttonRow {
	justify-content: center;
	align-items: center;
}

.formWrapper {
	border-radius: 8px;
    margin: 10px 0px;
    padding: 16px;
}

.light .formWrapper {
	background: #f8fafb;
}

.night .formWrapper {
	background: #1c1e28;
}
</style>
