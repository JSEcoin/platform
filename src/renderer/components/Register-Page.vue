<template>
	<AppWrapperWidget>
		<ScrollWidget v-bind="{noNav:true}">
			<!-- register Page -->
			<div id="JSEA-registerPage">
				<div id="JSEA-registerWrapper">
					<!-- Register Form -->
					<div>
						<h2 id="JSEA-registerHeader" class="center">Your Cryptocurrency Platform</h2>
						<h4 id="JSEA-registerSubHeader" class="center">Sign in to continue</h4>
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
									<!-- xemail Input -->
									<!-- ConfirmEmail Input -->
									<div class="row">
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
									<!-- xConfirmEmail Input -->
									
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
									
									<!-- Postal Address Input -->
									<div class="row">
										<InputWidget 
											v-model="form.postalAddress.val"
											placeholder="Postal Address *"
											name="postalAddress"
											maxlength="254"
											ref="postalAddress"
											:showLabel="form.postalAddress.displayLabel"
											:flag="!form.postalAddress.valid || form.postalAddress.flag"
											@keyup="keyWatch('confirmEmail')" />
									</div>
									<!-- xPostal Address Input -->
									<!-- Country Input -->
									<div class="row">
										<InputWidget 
											v-model="form.country.val"
											placeholder="Country *"
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
						
							<ButtonWidget type="submit"
								buttonTxt="Register" />
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
	},
	data() {
		return {
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
				},
				postalAddress: {
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
	width:60%;
	margin:10px auto;
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
