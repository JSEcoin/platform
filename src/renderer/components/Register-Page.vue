<template>
	<AppWrapperWidget>
		<ScrollWidget v-bind="{noNav:true}">
			<!-- register Page -->
			<div id="JSEA-registerPage">
				<div id="JSEA-registerWrapper">
					<!-- Register Form -->
					<div>
						<h2 id="JSEA-registerHeader" class="center">Registration</h2>
						<h4 id="JSEA-registerSubHeader" class="center">Setup your account</h4>
					</div>
					
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
								<h4 class="title">Account Details</h4>
								<!-- User Pass register interface -->
								<div>
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
								<div>
									<h4 class="title">Address Information</h4>
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
											v-model="form.country.val"
											placeholder="Country"
											name="country"
											maxlength="254"
											ref="country"
											:showLabel="form.country.displayLabel"
											:flag="!form.country.valid || form.country.flag"
											@keyup="keyWatch('country')" />
									</div>
									<!-- xCountry Input -->
								</div>
								<!-- xUser Pass register interface -->
							</ContentWidget>	

							<ContentWidget class="registerFormContainer">
								<h4 class="title">Terms of use</h4>	
								<SettingsItemRowWidget style="margin:0px 8px;" settingName="I agree by the terms and policy outlined on the JSEcoin Official Website.">
									<ToggleSwitchWidget
										v-model="acceptTerms"
										v-bind="{
											type: 'accept',
											name: 'autoLogin',
										}" />
								</SettingsItemRowWidget>
								<div class="hr" style="margin:10px;"></div>
								<ButtonWidget 
									v-bind="{isSmall:true}"
									buttonTxt="View Terms and Policy" />
							</ContentWidget>			
							
							<div class="row">
								<ButtonWidget :class="{'disable':!acceptTerms}" type="submit"
									buttonTxt="Register Account" style="margin-right:5px; margin-left:15px;" v-on:click.native="registerAccount" />

								<ButtonWidget
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
			acceptTerms: false,
			loading: false,	//communicating with the server.
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
					val: '',
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
	 * Register Functions
	 */
	methods: {
		registerAccount() {
			const self = this;
			//
			self.form.error.msg = '';
			self.form.error.display = false;
			if (!self.acceptTerms) {
				self.form.error.msg = 'You must review and accept the JSEcoin terms before registering your account.';
				self.form.error.display = true;
				//return;
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
		checkEmail(input) {
			const self = this;
			//email has value
			if (self.form[input].val.length > 0) {
				self.form[input].valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.form[input].val);
			//no value reset
			} else {
				self.form[input].valid = true;
			}
		},
		cancelRegister() {
			const self = this;
			self.$router.push('login');
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
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


#JSEA-registerWrapper {
    align-self: center;
    width: 100%;
}

.platformWeb.mobile #JSEA-registerWrapper {
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
	margin-bottom:0px;
	padding-bottom:0px;
	font-size:1.1em;
}

#JSEA-registerSubHeader {
	margin:0px 0px 20px 0px;
	padding:0px;
	color:#bababa;
	font-size:0.9em;
}

#JSEA-registerForm {
	margin:20px;
}

#JSEA-registerForm h4.title {
	margin:0px 8px;
}

.platformWeb.mobile #JSEA-registerForm {
	width:90%;
}

.night .registerFormContainer {
	background: #20222e;
}

.light .registerFormContainer {
	background: #f8fafb;
}

.registerFormContainer {
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
</style>
