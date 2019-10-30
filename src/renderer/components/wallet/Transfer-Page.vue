<template>
	<AppWrapperWidget>
		<NavWidget activeNav="wallet" activeSubNav="transfer"></NavWidget>
		<ScrollWidget>
			<!-- Transfer JSE -->
			<ContentWidget 
				titleTxt="Transfer JSE" 
				contentPadding="16px 10px 90px 10px" 
				:infoPanelTxt="balance" 
				:infoPanelIcoClassName="{gold:balance >= 1, silver:balance < 1}">

				<!-- Confirm Account -->
				<ConfirmAccountMaskWidget v-if="!confirmed" />
				<!-- xConfirm Account -->

				<!-- Transaction delay display -->
				<LoadingDelayMaskWidget :msg="notificationMsg" />
				<!-- xTransaction delay display -->
				
				<!-- Form Error Msg -->
				<FormErrorDisplayWidget :errorMsg="form.error.msg" v-on:click.native="clearErrorDisplay" />
				<!-- xForm Error Msg -->
				
				<div v-if="!showPin">
					<p><b>Send funds to:</b></p>
					<div class="row" style="display:flex;">
						<!-- Email Input -->
						<InputWidget 
							v-model="form.email.val"
							placeholder="Email *"
							name="email"
							maxlength="254"
							:showLabel="form.email.displayLabel"
							:flag="!form.email.valid || form.email.flag"
							@keyup="keyWatch('email')" />
						<!-- xEmail Input -->
						
						<!-- Amount Input -->
						<InputWidget 
							v-model="form.amount.val"
							placeholder="Amount *"
							name="amount"
							inputType="number"
							:showLabel="form.amount.displayLabel"
							:flag="form.amount.flag"
							:iconClass="{gold:form.amount.val >= 1, silver:form.amount.val < 1}"
							@keyup="keyWatch('amount')" />
						<!-- xAmount Input -->
					</div>
					<div class="row">
						<!-- Reference Input -->
						<InputWidget 
							v-model="form.reference.val"
							placeholder="Reference (optional)"
							name="reference"
							ref="reference"
							maxlength="255"
							:showLabel="form.reference.displayLabel"
							:flag="form.reference.flag"
							@keyup="keyWatch('reference')" />
						<!-- xReference Input -->
					</div>
					<!-- Transfer Funds Button -->
					<ButtonWidget style="margin-top:10px;" :class="{'disable':!confirmed}" :disabled="!confirmed" v-on:click.native="transfer()" buttonTxt="Transfer Funds"/>
					<!-- xTransfer Funds Button -->
				</div>
				<div v-else>
					<form id="JSEA-Pin" @submit.prevent autocomplete="off">
						<Pin v-on:submit-pin="signData">
							
							<p>
								Your pin is 4-12 characters long<br />
								<i>Please make sure you have set it within the web platform interface.</i>
							</p>
						</Pin>
					</form>
				</div>
				<!-- Footer Info Txt -->
				<template slot="footer" v-if="!showPin">
					<p>
						If you would like to test the transfer you can send a small amount to 
						<span class="highlightTxt" v-on:click="updateEmail('charity@jsecoin.com')">charity@jsecoin.com</span> 
						and we will do something good with it after the ICO.
					</p>
				</template>
				<!-- xFooter Info Txt -->
			</ContentWidget>
			<!-- xTransfer JSE -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import LoadingDelayMaskWidget from '@/components/widgets/LoadingDelayMaskWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';
import Pin from '@/components/widgets/Pin.vue';
import ConfirmAccountMaskWidget from '@/components/widgets/ConfirmAccountMaskWidget.vue';

/**
 * @description
 * <p>Allows users to transfer JSE from one account to another and supply a reference.</p>
 */
export default {
	name: 'Transfer-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
		ButtonWidget,
		LoadingDelayMaskWidget,
		FormErrorDisplayWidget,
		InputWidget,
		Pin,
		ConfirmAccountMaskWidget,
	},
	data() {
		return {
			showPin: false, //show pin display
			transferRes: {}, //store transfer response obj
			notificationMsg: '', //message to display during interaction request
			form: {
				required: ['email', 'amount'],
				email: {
					val: '',
					displayLabel: false,
					valid: true,
					flag: false,
				},
				amount: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				reference: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				error: {
					msg: '',
					display: false,
				},
			},
		};
	},
	computed: mapState({
		confirmed: state => state.user.confirmed,
		balance: state => state.user.balance,
		txLimit: state => state.user.txLimit,
	}),
	created() {
		this.user = window.user;
	},
	methods: {
		/**
		 * Clears any error message display
		 *
		 * @returns nothing
		 * @public
		 */
		clearErrorDisplay() {
			const self = this;
			self.form.error.msg = '';
		},
		/**
		 * Initialises JSE transfer request to server
		 *
		 * @returns nothing
		 * @public
		 */
		transfer() {
			const self = this;
			let checkRequiredFields = true;

			self.transferRes = {};
			self.form.error.msg = '';
			//check required fields have data
			self.form.required.forEach(function(value) {
				self.form[value].flag = false;
				if (self.form[value].val.length === 0) {
					self.form[value].flag = true;
					checkRequiredFields = false;
				}
			});

			//not all fields correctly populated display warning msg
			if (!checkRequiredFields) {
				self.form.error.msg = 'Check all fields are populated correctly.';
				return;
			}

			//transfer request dataset
			const transferReq = {
				session: self.$store.state.user.session,
				toAmount: self.form.amount.val,
				toReference: self.form.reference.val,
				toUser: self.form.email.val,
			};

			//clear form
			self.form.email = {
				val: '',
				displayLabel: false,
				valid: true,
				flag: false,
			};
			self.form.amount = {
				val: '',
				displayLabel: false,
				flag: false,
			};
			self.form.reference = {
				val: '',
				displayLabel: false,
				flag: false,
			};

			//notification message
			self.notificationMsg = 'Initiating Request';

			//init transaction flag started
			self.$store.commit('updateUserStateValue', {
				val: true,
				state: 'initTransaction',
			});

			//post transfer request
			axios.post(
				`${self.$store.state.app.jseCoinServer}/push/requesttransfer/`,
				transferReq,
			).then((res) => {
				self.transferRes = res;
				self.showPin = true;
				//init transaction flag started
				self.$store.commit('updateUserStateValue', {
					val: false,
					state: 'initTransaction',
				});
			}).catch((err) => {
				self.$store.commit('clearDelay');
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Unknown Error';
				}
				self.$store.commit('ajaxError', err.response);
			});
		},
		/**
		 * Sign data - apply pin and session info and make requests to initiate transfer
		 *
		 * @param {object} transferRes - transfer response Obj
		 * @returns nothing
		 * @public
		 */
		signData(pin) {
			const self = this;
			self.showPin = false;

			//no pin provided
			if (!pin) {
				return;
			}

			//notification message
			self.notificationMsg = 'Initiating Transaction';

			//init transaction flag started
			self.$store.commit('updateUserStateValue', {
				val: true,
				state: 'initTransaction',
			});

			window.signData(JSON.stringify(self.transferRes.data), window.user, function(signed) {
				self.transferRes = {};
				signed.pin = pin;
				signed.session = self.$store.state.user.session;
				axios.post(
					`${self.$store.state.app.jseCoinServer}/push/data/`,
					signed,
				).then((res) => {
					const transactionTimeSeconds = Math.ceil((res.data.timeTillConfirmation + 1000)/1000);
					//init waiting time display
					self.$store.commit('delay', transactionTimeSeconds);

					window.refreshUser(function() {});
				}).catch((err) => {
					self.$store.commit('clearDelay');
					if (err.response.data.notification) {
						self.form.error.msg = err.response.data.notification;
					} else {
						self.form.error.msg = 'Unknown Error';
					}
					self.$store.commit('ajaxError', err.response);
				});
			});
		},
		/**
		 * Charity donation option - autopopulates form fields to allow user to donate to JSECoin Charity Fund.
		 *
		 * @param {string} val - email to populate on form field
		 * @returns nothing
		 * @public
		 */
		updateEmail(val) {
			const self = this;

			self.form.email = {
				val,
				displayLabel: true,
				valid: true,
				flag: false,
			};
			self.form.amount = {
				val: '200',
				displayLabel: true,
				flag: false,
			};
			self.form.reference = {
				val: 'Donating to JSE Charity Scheme',
				displayLabel: true,
				flag: false,
			};

			//focus on reference field
			this.$refs.reference.focus();
		},
		/**
		 * onKeyUp set field display and check field value is correct (email, amount etc)
		 * TODO - tidy up duplicate func
		 *
		 * @param {string} input - data reference
		 * @returns nothing
		 * @public
		 */
		keyWatch(input) {
			const self = this;
			self.form.error.msg = '';
			//if text remove placeholder and show above input
			if (this.form[input].val.length > 0) {
				this.form[input].flag = false;
				this.form[input].displayLabel = true;
				if (input === 'email') {
					this.checkEmail();
				}
				if (input === 'amount') {
					const regex = /[^\d.]|\.(?=.*\.)/g;
					const subst = '';
					//strip any invalid chars
					this.form.amount.val = this.form.amount.val.replace(regex, subst);
					//convert string to int for val checks
					let amountVal = Number(this.form.amount.val);
					//constrain to 6 dp
					if ((this.form.amount.val.indexOf('.') >= 0) && (this.form.amount.val.split('.')[1].length > 6)) {
						this.form.amount.val = amountVal.toFixed(6);
					}

					//cleanup user input if 0001 entered
					if (this.form.amount.val.indexOf('.') === -1) {
						this.form.amount.val = amountVal.toFixed(0);
					} else {
						const decCheck = this.form.amount.val.split('.');
						this.form.amount.val = Number(decCheck[0]).toFixed(0)+'.'+decCheck[1];
					}

					//if gt current balance fix to balance amount
					amountVal = Number(this.form.amount.val);
					//console.log(self.$store.state.user.txLimit);
					if (amountVal > self.$store.state.user.txLimit) {
						this.form.amount.val = String(self.$store.state.user.txLimit);
						self.form.error.msg = `Daily transaction limit set: ${self.$store.state.user.txLimit} JSE`;
					}

					//make sure min value is set to 0.000001
					if ((amountVal > 0) && (amountVal < 0.000001)) {
						this.form.amount.val = 0.000001;
					} else if (this.form.amount.val === '0.000000') {
						this.form.amount.val = 0.000001;
					}
				}
			} else {
				this.form[input].displayLabel = false;
				this.form[input].flag = false;
			}
		},
		/**
		 * Confirms email is in a valid format
		 * (Better approach than htm5 input email type)
		 *
		 * @returns nothing
		 * @public
		 */
		checkEmail() {
			if (this.form.email.val.length > 0) {
				this.form.email.valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.form.email.val);
			} else {
				this.form.email.valid = true;
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.highlightTxt {
	color:#3598db;
	cursor: pointer;
}
/*
#JSEA-balance {

}
#JSEA-balanceContent {
	align-self:center;
	padding-left:10px;
	font-size:2em;
	color:#3598db;
	font-weight:bold;
}

#JSEA-balanceContent span {
	color:#1bb394;
	font-size:0.6em;
}
#JSEA-topLvlNav {
	background:#fff;
	border-bottom:solid 2px #3598db;
}
#JSEA-topLvlNav ul {
	margin:0px;
	padding:0px;
}
#JSEA-topLvlNav li {
	list-style: none;
	color:#3598db;
	text-transform: uppercase;
	float: left;
	padding:8px 18px;
	cursor: pointer;
	font-weight: bold;
	font-size:0.8em;
	letter-spacing: 1px;
}
#JSEA-topLvlNav li:hover,
#JSEA-topLvlNav li.active {
	background:#3598db;
	color:#fff;
}

.coin {
	background-repeat:no-repeat;
	background-size:contain;
	width:55px;
	height:55px;
}
.coin.gold {
	background-image:url('../../assets/coin_gold.png');
}
.coin.silver {
	background-image:url('../../assets/coin_silver.png');
}

*/
/*
dl .inputLabel {
	left:8px;
}
dl input {
	margin: 26px 6px 8px;
}

*/
.col {
	flex-grow: 1;
	position: relative;
}
</style>
