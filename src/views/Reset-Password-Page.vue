<template>
	<AppWrapperWidget>
		<!-- Reset Password -->
		<iframe id="JSEA-iCaptcha" v-if="showCaptcha" frameborder="0" src="https://jsecoin.com/iCaptcha/iCaptcha.html?x=2"></iframe>
        <ScrollWidget v-bind="{noNav:true}">
			<!-- Reset Password Page -->
			<div id="JSEA-resetPasswordPage">
				<div id="JSEA-resetWrapper">
					<!-- Register Form -->
					<div>
						<h2 id="JSEA-resetHeader" class="center">Reset Your Password</h2>
						<h4 id="JSEA-resetSubHeader" class="center">Request a security code to create a new password.</h4>
					</div>

					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- register Form -->
					<form id="JSEA-resetPasswordForm" @submit.stop.prevent="onSubmit" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" class="row" id="JSEA-resetPasswordWrapper">
							<ContentWidget class="resetFormContainer">
								<h4 class="title">(Step 1) Request a security code.</h4>
								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('error1')" v-if="form.error1.display" :errorMsg="form.error1.msg"  style="width: 60%; margin: 10px auto;" />
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
											v-model="form.accountEmail.val"
											placeholder="Account Email *"
											name="accountEmail"
											maxlength="254"
											ref="accountEmail"
											:showLabel="form.accountEmail.displayLabel"
											:flag="!form.accountEmail.valid || form.accountEmail.flag"
											@keyup="keyWatch('accountEmail')" />
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

							<ContentWidget class="resetFormContainer">
								<h4 class="title">(Step 2) Create a new password.</h4>
                                <p>
                                    When you have received your security code you will be able to change your password from here:<br />
                                </p>

								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('error2')" v-if="form.error2.display" :errorMsg="form.error2.msg"  style="width: 60%; margin: 10px auto;" />
								<!-- xError display -->
								<!-- User Pass register interface -->
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
                                        <InputWidget
                                            inputType="password"
                                            newpassword="new-password"
                                            v-bind="{hideShow: true, passwordStrength:true}"
                                            v-model="form.password.val"
                                            placeholder="New Password *"
                                            name="password"
                                            maxlength="254"
                                            ref="password"
                                            :showLabel="form.password.displayLabel"
                                            :flag="form.password.flag"
                                            @keyup="keyWatch('password')" />
									</div>
									<!-- xFull Name Input -->
									<!-- Full Name Input -->
									<div class="row">
                                        <InputWidget
                                            inputType="password"
                                            v-bind="{hideShow: true}"
                                            v-model="form.passwordMatch.val"
                                            newpassword="new-password"
                                            placeholder="Re-Type New Password *"
                                            name="password"
                                            maxlength="254"
                                            ref="password"
                                            :showLabel="form.passwordMatch.displayLabel"
											:flag="!form.passwordMatch.valid || form.passwordMatch.flag"
                                            @keyup="keyWatch('passwordMatch')" />
									</div>
									<!-- xFull Name Input -->
								</div>
								<div class="formWrapper">
									<!-- Full Name Input -->
									<div class="row">
										<InputWidget
											v-model="form.securityCode.val"
											placeholder="Enter Security Code Received *"
											name="securityCode"
											maxlength="254"
											ref="securityCode"
											:showLabel="form.securityCode.displayLabel"
											:flag="!form.securityCode.valid || form.securityCode.flag"
											@keyup="keyWatch('securityCode')" />
									</div>
									<!-- xFull Name Input -->
								</div>

                                <ButtonWidget type="submit" v-on:click.native="updatePassword" buttonTxt="Change Password" />
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
			showCaptcha: false,
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
				//required: ['fullName', 'email', 'confirmEmail', 'password'], //required fields
				accountEmail: {
					val: '',				//field value
					displayLabel: false,	//field label
					valid: true,			//valid value
					flag: false,			//has value length
                },
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
				error1: {
					msg: '',		//form error messages
					display: false, //display error message
				},
				error2: {
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
				if (input === 'accountEmail') {
					self.checkEmail(input);
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
		cancel() {
			const self = this;
			self.$router.push('/login');
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
		emailCode() {

		},
		updatePassword() {

		},
		closeError(field) {
			const self = this;
			self.form[field].msg = '';
			self.form[field].display = false;
		},
    },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#JSEA-resetPasswordWrapper {
    justify-content: center;
    flex-wrap: wrap;
}
.max .formWrapper {
	border-radius: 8px;
    margin: 10px 0px;
    padding: 16px;
}
.max.light .formWrapper {
	background: #f8fafb;
}

.max.night .formWrapper {
	background: #1c1e28;
}
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
	margin-bottom:0px;
	padding-bottom:0px;
	font-size:1.1em;
}

.max #JSEA-resetHeader {
	margin-top: 40px;
}

#JSEA-resetSubHeader {
	margin:0px 0px 20px 0px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
}
</style>
