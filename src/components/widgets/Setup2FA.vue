<template>
	<div id="JSEA-QRMask" v-if="twoFACode">
		<div>
			<div class="popupHeader">
				Setup Two Factor Authentication
				<i class="fa fa-close" v-on:click="exit2FA(true)"></i>
			</div>
			<div class="popupContent">
				<div style="position:relative;">
					<div id="JSEA-QRBGImage"></div>
					<qriously v-if="twoFACode" v-bind="{foregroundAlpha:1, backgroundAlpha:0}" :value="twoFACode" foreground="#0d152c" :size="250" />
				</div>
				<p style="margin-top:0px;">
					Scan with <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en" target="_Blank">Google Authenticator</a>
					or
					<a href="https://authy.com/download/" target="_Blank">Authy</a>
					App
				</p>
				<div class="warningInfo">
					<div class="warningInfoIcon">
						<i class="fa fa-warning"></i>
					</div>
					<div>
						<p>
							Please make a note of your back up key:<br />
							<b id="JSEA-secretKey">{{secretKey}}</b>
						</p>
					</div>
				</div>
				<div>
					<!-- error display -->
					<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="margin: 10px 20px;" />

					<TwoFA id="JSEA-2FA"
						v-on:key-up="updateKey"
						v-on:submit-code="submitCode" />

					<ButtonWidget style="width:auto" buttonTxt="Setup Two Factor Authentication" v-on:click.native="onSubmit" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import QRious from 'qrious';
import axios from 'axios';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import TwoFA from '@/components/widgets/TwoFA.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';

/**
 * @description
 * 2FA QR generator
 */
export default {
	name: 'Setup2FA',
	inheritAttrs: false,
	props: {
		/**
		 * 2FA code to generate as QR
		 */
		twoFACode: {
			type: String,
			default: '',
		},
		/**
		 * secretKey
		 */
		secretKey: {
			type: String,
			default: '',
		},
	},
	components: {
		ButtonWidget,
		TwoFA,
		FormErrorDisplayWidget,
	},
	data() {
		return {
			form: {
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
		};
	},
	methods: {
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
		closeError() {
			const self = this;
			self.form.error.display = false;
		},
		/**
		 * Submit 2fa setup req
		 *
		 * @returns nothing
		 * @public
		 */
		onSubmit() {
			const self = this;
			const AC = self.form.authCode;
			const completeAuthCode = AC.val1+AC.val2+AC.val3+AC.val4+AC.val5+AC.val6;
			const TwoFA = {
				authCode: completeAuthCode,
				session: self.$store.state.user.session,
			};
			self.form.error.display = false;

			//enable2FA test
			axios.post(
				`${self.$store.state.app.jseCoinServer}/twofa/test2fa/`,
				TwoFA,
			).then((res) => {
				//
				self.$store.commit('updateUserStateValue', {
					val: true,
					state: 'twoFactorAuth',
				});
				self.exit2FA();
			}).catch((err) => {
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Unknown Error';
				}
				self.form.error.display = true;
				self.$store.commit('ajaxError', err.response);
			});
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
		exit2FA(keep2FADisabled) {
			const self = this;
			if (keep2FADisabled) {
				self.$store.commit('updateUserStateValue', {
					val: false,
					state: 'twoFactorAuth',
				});
			}
			self.$emit('exit2FA');
		},
	},
};
</script>

<style scoped>
#JSEA-2FA {
    margin: 10px 20px;
    border: solid 1px #ddd;
    border-radius: 6px;
    position: relative;
    padding: 8px;
    box-shadow: 0px 2px 1px 0px rgba(0,0,0,0.1);
}
#JSEA-secretKey {
    letter-spacing: 1.6px;
}
a {
	cursor:pointer;
}

.warningInfo {
    box-shadow: 0 0 0 1px #a9d5de inset, 0 0 0 0 transparent;
    background-color: #f8ffff;
    color: #276f86;
    border-radius: 6px;
    position: relative;
    padding: 0px 10px;
    margin: 10px 20px;
    text-align: left;
    display: flex;
}
.warningInfoIcon {
    align-self: center;
    font-size: 2.6em;
    padding: 0px 10px;
}
</style>
