<template>
	<AppWrapperWidget>
		<!-- Reset Password -->
        <ScrollWidget v-bind="{noNav:true}">
			<!-- Reset Password Page -->
			<div id="JSEA-resetPasswordPage">
				<div id="JSEA-resetWrapper">

					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- register Form -->
					<form id="JSEA-resetPasswordForm" @submit.prevent="emailCode" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" id="JSEA-resetPasswordWrapper">
							<ContentWidget class="resetFormContainer">
								<!-- Register Form -->
								<div>
									<h2 id="JSEA-resetHeader" class="center">Reset Your Password</h2>
									<h4 id="JSEA-resetSubHeader" class="center">Request a security code to create a new password.</h4>
								</div>

								<h4 class="title">(Step 1) Request a security code.</h4>
								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('formSec')" v-if="formSec.error.display" :errorMsg="formSec.error.msg"  style="width: 90%; margin: 10px auto;" />
								<!-- xError display -->
                                <p>
                                    Enter your registered platform account email.<br />
									You will receive an email with your new security code. <br />
                                </p>
								<!-- User Pass register interface -->
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
										<InputWidget
											v-model="formSec.accountEmail.val"
											placeholder="Account Email *"
											name="accountEmail"
											maxlength="254"
											ref="accountEmail"
											:showLabel="formSec.accountEmail.displayLabel"
											:flag="!formSec.accountEmail.valid || formSec.accountEmail.flag"
											@keyup="keyWatch('formSec', 'accountEmail')" />
									</div>
									<!-- xFull Name Input -->
								</div>

								<div class="row buttonRow" style="min-height:60px;">
									<ButtonWidget type="submit" v-on:click.native="emailCode"
										buttonTxt="Email Security Code" style="margin-right:5px; margin-left:15px;" />

									<ButtonWidget type="button"
										buttonTxt="Cancel" style="margin-left:5px; margin-right:15px;" v-on:click.native="cancel" />
								</div>
							</ContentWidget>
						</div>
					</form>
					<form id="JSEA-resetPasswordForm" @submit.prevent="updatePassword" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" id="JSEA-resetPasswordWrapper">

							<ContentWidget class="resetFormContainer">
								<h4 class="title">(Step 2) Create a new password.</h4>
                                <p>
                                    When you have received your security code you will be able to change your password from here:<br />
                                </p>

								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('formPass')" v-if="formPass.error.display" :errorMsg="formPass.error.msg"  style="width: 90%; margin: 10px auto;" />
								<!-- xError display -->
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
										<InputWidget
											v-model="formPass.securityCode.val"
											placeholder="Enter Security Code Received *"
											name="securityCode"
											maxlength="254"
											ref="securityCode"
											:showLabel="formPass.securityCode.displayLabel"
											:flag="!formPass.securityCode.valid || formPass.securityCode.flag"
											@keyup="keyWatch('formPass', 'securityCode')" />
									</div>
									<!-- xFull Name Input -->
								</div>
								<!-- User Pass register interface -->
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
                                        <InputWidget
                                            inputType="password"
                                            newpassword="new-password"
                                            v-bind="{hideShow: true, passwordStrength:true}"
                                            v-model="formPass.password.val"
                                            placeholder="New Password *"
                                            name="password"
                                            maxlength="254"
                                            ref="password"
                                            :showLabel="formPass.password.displayLabel"
                                            :flag="formPass.password.flag"
                                            @keyup="keyWatch('formPass', 'password')" />
									</div>
									<!-- xFull Name Input -->
									<!-- Full Name Input -->
									<div class="row">
                                        <InputWidget
                                            inputType="password"
                                            v-bind="{hideShow: true}"
                                            v-model="formPass.passwordMatch.val"
                                            newpassword="new-password"
                                            placeholder="Re-Type New Password *"
                                            name="password"
                                            maxlength="254"
                                            ref="password"
                                            :showLabel="formPass.passwordMatch.displayLabel"
											:flag="!formPass.passwordMatch.valid || formPass.passwordMatch.flag"
                                            @keyup="keyWatch('formPass', 'passwordMatch')" />
									</div>
									<!-- xFull Name Input -->
								</div>

								<div class="row buttonRow" style="min-height:60px;">
									<ButtonWidget type="submit" v-on:click.native="updatePassword" buttonTxt="Change Password" style="margin-right:5px; margin-left:15px;" />

									<ButtonWidget type="button"
										buttonTxt="Cancel" style="margin-left:5px; margin-right:15px;" v-on:click.native="cancel" />
								</div>

							</ContentWidget>
						</div>
					</form>
					<!-- xregister Form -->
				</div>
			</div>
			<!-- xReset Password Page -->
		</ScrollWidget>
		<!-- xReset Password -->
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

/**
 * @description
 * <p>Reset Password page</b></p>
 */
export default {
	name: 'Reset-Password-Page',
	components: {
		//VueRecaptcha,
		AppWrapperWidget,
		ContentWidget,
		FormErrorDisplayWidget,
		SpinnerWidget,
		InputWidget,
		ButtonWidget,
		ScrollWidget,
	},
	data() {
		return {
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
			activeForm: '', //[formSec,formPass]
			//form modal
			formSec: {
				required: ['accountEmail'], //required fields
				accountEmail: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
                },
				//form error display
				error: {
					msg: '',		//form error messages
					display: false, //display error message
				},
            },
			//form modal
			formPass: {
				required: ['password', 'passwordMatch', 'securityCode'], //required fields
				password: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
                },
				passwordMatch: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
                },
				securityCode: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
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
					self.form.error.msg = 'Exited Captcha security check - unable to reset password';
					self.loading = false;
				}
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
		keyWatch(form, input) {
			const self = this;
			//console.log(form, input,self[form][input].val);
			//if input value remove placeholder and show label above input
			if (self[form][input].val.length > 0) {
				self[form][input].valid = true;
				self[form][input].flag = false;
				self[form][input].displayLabel = true;
				//if input email check format
				if (input === 'accountEmail') {
					self.checkEmail(input);
				}
				if ((input === 'password') || (input === 'passwordMatch')) {
					if (!window.goodPassword(self[form][input].val)) {
						self[form][input].valid = false;
						self[form][input].flag = true;
					}
				} else {
					//clean strings entered
					setTimeout(() => {
						self[form][input].val = window.cleanString(self[form][input].val);
					},10);
				}
			//no value reset field
			} else {
				self[form][input].displayLabel = false;
				self[form][input].flag = true;
			}
        },
		cancel() {
			const self = this;
			self.$router.push('/login');
		},
		checkEmail(input) {
			const self = this;
			self.formSec.error.display = false;

			//email has value
			if (self.formSec[input].val.length > 0) {
				self.formSec[input].flag = false;
				self.formSec[input].valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(self.formSec[input].val);
				//check against bad domains
				const result = self.badEmailProviders.filter((domain) => {
					if (self.formSec[input].val.indexOf(domain) >= 0) {
						return domain;
					}
					return false;
				});
				if (result.length > 0) {
					self.formSec[input].flag = true;
					self.formSec[input].valid = false;
					self.formSec.error.msg = 'This domain has been blacklisted - please use another email provider.';
					self.formSec.error.display = true;
				}
			//no value reset
			} else {
				self.formSec[input].valid = true;
				self.formSec[input].flag = false;
			}
		},
		emailCode() {
			const self = this;

			//check scrollTo available - customised code
			if (typeof (self.$vuebar.scrollTo) !== 'undefined') {
				const bodyScroll = document.getElementById('JSEA-appBody');
				self.$vuebar.scrollTo(bodyScroll,0);
			}

			//
			self.formSec.error.msg = '';
			self.formSec.error.display = false;

			let checkRequiredFields = true;
			//check required fields have data
			self.formSec.required.forEach(function(value) {
				self.formSec[value].flag = false;
				if (self.formSec[value].val.length === 0) {
					self.formSec[value].flag = true;
					checkRequiredFields = false;
				}
			});

			//if form pass check then submit captcha
			if (checkRequiredFields) {
				self.loading = true;
				self.formSec.error.display = false;
				self.activeForm = 'formSec';
				self.$store.commit('updateAppState', {
					val: true,
					state: 'showCaptcha',
				});//shows jsecoin.com captcha screen
			} else {
				self.formSec.error.msg = 'Please check all highlighted fields are complete.';
				self.formSec.error.display = true;
			}
		},
		updatePassword() {
			const self = this;
			//check scrollTo available - customised code
			if (typeof (self.$vuebar.scrollTo) !== 'undefined') {
				const bodyScroll = document.getElementById('JSEA-appBody');
				self.$vuebar.scrollTo(bodyScroll,0);
			}
			self.formPass.error.msg = '';
			self.formPass.error.display = false;

			let checkRequiredFields = true;
			//check required fields have data
			self.formPass.required.forEach(function(value) {
				self.formPass[value].flag = false;
				if (self.formPass[value].val.length === 0) {
					self.formPass[value].flag = true;
					checkRequiredFields = false;
				}
			});

			if (self.formPass.password.val !== self.formPass.passwordMatch.val) {
				self.status.displayForm = true;
				self.formPass.error.display = true;
				self.loading = false;
				self.formPass.error.msg = 'Passwords do not match!';
				return false;
			}

			//if form pass check then submit captcha
			if (checkRequiredFields) {
				const passwordReset = {
					newPassword: self.formPass.password.val,
					passwordReset: self.formPass.securityCode.val,
					app: self.$store.getters.whichPlatform,
				};

				//post registration params
				axios.post(
					`${self.$store.state.app.jseCoinServer}/password/change/`,
					passwordReset,
				).then((res) => {
					//show form
					self.loading = false;
					self.status.displayForm = true;
					//failed
					if (self.user.fail === 1) {
						self.formPass.error.display = true;
						self.formPass.error.msg = res.data.notification;
						return false;
					}
					self.$router.push('/login');
					return true;
				}).catch((err) => {
					console.log(err);
					self.status.displayForm = true;
					self.formPass.error.display = true;
					self.loading = false;
					if (err.response.data.notification) {
						self.formPass.error.msg = err.response.data.notification;
					} else {
						self.formPass.error.msg = 'Failed to submit form - please check your connection';
					}
				});
			} else {
				self.formPass.error.msg = 'Please check all highlighted fields are complete.';
				self.formPass.error.display = true;
			}
			return false;
		},

		onVerify(response) {
			const self = this;
			const reqSecurityCode = {
				email: self.formSec.accountEmail.val,
				'g-recaptcha-response': response,
				app: self.$store.getters.whichPlatform,
			};

			//post registration params
			axios.post(
				`${self.$store.state.app.jseCoinServer}/password/reset/`,
				reqSecurityCode,
			).then((res) => {
				//show form
				self.loading = false;
				self.status.displayForm = true;
				//failed
				if (self.user.fail === 1) {
					self.formSec.error.display = true;
					self.formSec.error.msg = res.data.notification;
					return false;
				}
				return true;
			}).catch((err) => {
				console.log(err);
				self.status.displayForm = true;
				self.formSec.error.display = true;
				self.loading = false;
				if (err.response.data.notification) {
					self.formSec.error.msg = err.response.data.notification;
				} else {
					self.formSec.error.msg = 'Failed to submit form - please check your connection';
				}
			});
		},
		closeError(form) {
			const self = this;
			self[form].error.msg = '';
			self[form].error.display = false;
		},
    },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#JSEA-resetPasswordForm {
	margin:20px;
}
#JSEA-resetPasswordWrapper {
	margin-top:40px;
    justify-content: center;
    flex-wrap: wrap;
}
.formWrapper {
	border-radius: 8px;
    margin: 10px 0px;
    padding: 16px;
}
/*
.max.light .formWrapper {
	background: #f8fafb;
}

.max.night .formWrapper {
	background: #1c1e28;
}*/
.buttonRow {
	justify-content: center;
	align-items: center;
}

.night #JSEA-registerHeader {
	color:#eee;
}

.light #JSEA-registerHeader {
	color:#3c3c3c;
}

#JSEA-resetHeader {
	margin: 0px;
	padding-bottom:0px;
	font-size:1.1em;
}

.resetFormContainer {
	padding:0px !important;
	border-radius:8px !important;
	margin: 10px 0px 20px 0px !important;
	overflow: hidden !important;
	position: relative !important;
	margin: 10px auto !important;
}

#JSEA-resetSubHeader {
	margin:0px -16px 20px -16px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
	padding-bottom: 16px;
    border-bottom: solid 6px rgba(0,0,0,0.06);
}
</style>
