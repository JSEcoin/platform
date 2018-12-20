<template>
	<AppWrapperWidget>
		<!-- Restore 2FA -->
        <ScrollWidget v-bind="{noNav:true}">
			{{twoFACode}}
			<div id="JSEA-QRMask" class="active" v-if="(twoFACode)">
				<div>
					<div class="popupHeader">
						Setup Two Factor Authentication
						<i class="fa fa-close" v-on:click="exit2FA"></i>
					</div>
					<div class="popupContent">
						<ScrollWidget style="top:50px;">
							<div style="padding: 20px;">
								<div style="position:relative;">
									<div id="JSEA-QRBGImage"></div>
									<qriously v-if="twoFACode" v-bind="{foregroundAlpha:1, backgroundAlpha:0}" :value="twoFACode" foreground="#0d152c" :size="250" />
								</div>
								<p class="subInfo" style="margin-top:0px;">
									<b>Step 2.</b> Scan with <a v-on:click="openExternalWindow('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en')">Google Authenticator</a>
									or
									<a v-on:click="openExternalWindow('https://authy.com/download/')">Authy</a>
									App
								</p>
							</div>
							<div>
								<ButtonWidget style="width:auto" buttonTxt="Close" v-on:click.native="exit2FA" />
							</div>
						</ScrollWidget>
					</div>
				</div>
			</div>
			<!-- Restore 2FA Page -->
			<div id="JSEA-restore2FAPage">
				<div id="JSEA-restore2FAWrapper">

					<!-- Animation to display during server requests -->
					<SpinnerWidget :class="{active:loading}"/>
					<!-- xAnimation to display during server requests -->

					<!-- register Form -->
					<form id="JSEA-restore2FAPasswordForm" @submit.prevent="reset2FA" :class="{hide:loading}" autocomplete="off">
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
                                <p>
								    Enter your platform account email and your backup key that was generated when you setup your 2FA.
								</p>
                                <p class="subInfo">
									<b>Step 1.</b> You will be able to scan and re-setup 2FA with Google Authenticator or Authy on generating a QR code.
                                </p>

								<!-- Error display -->
								<FormErrorDisplayWidget v-on:click.native="closeError('error')" v-if="form.error.display" :errorMsg="form.error.msg" style="margin: 10px auto;" />
								<!-- xError display -->
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
									<ButtonWidget type="submit"
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
            badEmailProviders: [
				'jsecoin.com',
				'jsecoins.com',
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
				required: ['accountEmail', 'backupKey'], //required fields
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
			twoFACode: '', //otpauth://totp/JSEcoin:[email]?secret=[key]&issuer=JSEcoin&algorithm=SHA1&digits=6&period=30
			status: {
				displayForm: true,		//display register form
				submittedForm: false,	//form succesfully submitted
				error: false,			//error detected
			},
		};
    },
	/**
	 * Register Functions
	 */
	methods: {
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
		reset2FA() {
			const self = this;
			//check scrollTo available - customised code
			if (typeof (self.$vuebar.scrollTo) !== 'undefined') {
				const bodyScroll = document.getElementById('JSEA-appBody');
				self.$vuebar.scrollTo(bodyScroll,0);
			}

			//
			self.form.error.msg = '';
			self.form.error.display = false;

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
				self.form.error.display = false;
				self.twoFACode = `otpauth://totp/JSEcoin:${self.form.accountEmail}?secret=${self.form.backupKey}&issuer=JSEcoin&algorithm=SHA1&digits=6&period=30`;
			} else {
				self.form.error.msg = 'Please check all highlighted fields are complete.';
				self.form.error.display = true;
			}
		},
		updatePassword() {

		},
		closeError(field) {
			const self = this;
			self.form[field].msg = '';
			self.form[field].display = false;
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
		exit2FA() {
			const self = this;
			self.twoFACode = '';
			self.form.accountEmail.val = '';
			self.form.accountEmail.displayLabel = false;
			self.form.backupKey.val = '';
			self.form.backupKey.displayLabel = false;
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
