<template>
	<AppWrapperWidget>
		<!-- Restore 2FA -->
		<iframe id="JSEA-iCaptcha" v-if="showCaptcha" frameborder="0" src="https://jsecoin.com/iCaptcha/iCaptcha.html?x=2"></iframe>
        <ScrollWidget v-bind="{noNav:true}">
			<!-- Restore 2FA Page -->
			<div id="JSEA-restore2FAPage">
				<div id="JSEA-restore2FAWrapper">

					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- register Form -->
					<form id="JSEA-restore2FAPasswordForm" @submit.stop.prevent="onSubmit" :class="{hide:loading}" autocomplete="off">
						<div v-if="status.displayForm" id="JSEA-restore2FAPasswordWrapper">
							<ContentWidget class="restore2FAFormContainer">
								<!-- Register Form -->
								<div>
									<h2 id="JSEA-restore2FAHeader" class="center">Restore Two Factor Authentication</h2>
									<h4 id="JSEA-restore2FASubHeader" class="center">
										Generate 2FA QR Setup Code.
									</h4>
								</div>

								<h4 class="title">To restore your 2FA</h4>

								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('error1')" v-if="form.error.display" :errorMsg="form.error.msg"  style="width: 60%; margin: 10px auto;" />
								<!-- xError display -->
                                <p>
                                    Enter your platform account email and your backup key that was generated when you setup your 2FA.<br />
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
									<!-- Full Name Input -->
									<div class="row">
										<InputWidget
											v-model="form.backupKey.val"
											placeholder="2FA Backup Key *"
											name="backupKey"
											maxlength="254"
											ref="backupKey"
											:showLabel="form.backupKey.displayLabel"
											:flag="!form.backupKey.valid || form.backupKey.flag"
											@keyup="keyWatch('backupKey')" />
									</div>
									<!-- xFull Name Input -->
								</div>

								<div class="row buttonRow" style="min-height:60px;">
									<ButtonWidget type="submit" v-on:click.native="emailCode"
										buttonTxt="Generate QR Code" style="margin-right:5px; margin-left:15px;" />

									<ButtonWidget type="button"
										buttonTxt="Cancel" style="margin-left:5px; margin-right:15px;" v-on:click.native="cancel" />
								</div>
							</ContentWidget>
						</div>
					</form>
					<!-- xregister Form -->
				</div>
			</div>
			<!-- xRestore 2FA Page -->
		</ScrollWidget>
		<!-- xRestore 2FA -->
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
 * <p>Restore 2FA page</b></p>
 */
export default {
	name: 'Restore2FA-Page',
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
				backupKey: {
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
                //clean strings entered
                setTimeout(() => {
                    self.form[input].val = window.cleanString(self.form[input].val);
                },10);
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
#JSEA-restore2FAPasswordForm {
	margin:20px;
}
#JSEA-restore2FAPasswordWrapper {
	margin-top:40px;
    justify-content: center;
    flex-wrap: wrap;
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

#JSEA-restore2FAHeader {
	margin: 0px;
	padding-bottom:0px;
	font-size:1.1em;
}

#JSEA-restore2FASubHeader {
	margin:0px -16px 20px -16px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
	padding-bottom: 16px;
    border-bottom: solid 6px rgba(0,0,0,0.06);
}
.restore2FAFormContainer {
	padding:0px !important;
	border-radius:8px !important;
	margin: 10px 0px 20px 0px !important;
	overflow: hidden !important;
	position: relative !important;
	margin: 10px auto !important;
}
</style>
