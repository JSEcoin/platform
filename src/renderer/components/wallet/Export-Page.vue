<template>
	<AppWrapperWidget>
		<NavWidget activeNav="wallet" activeSubNav="export"></NavWidget>
		<ScrollWidget>
			<!-- Export Coins -->
			<ContentWidget 
				titleTxt="Export Coins" 
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
					<p><b>Generate Export Coin Code:</b></p>
					<div class="row" style="display:flex;">
						<InputWidget 
							v-model="form.amount.val"
							placeholder="Amount *"
							name="amount"
							inputType="number"
							:showLabel="form.amount.displayLabel"
							:flag="form.amount.flag"
							:iconClass="{gold:form.amount.val >= 1, silver:form.amount.val < 1}"
							@keyup="keyWatch('amount')" />
					</div>
					<div>
						<ButtonWidget style="margin-top:10px;" :class="{'disable':!confirmed}" :disabled="!confirmed" v-on:click.native="exportCoins()" buttonTxt="Export Coins"/>
					</div>
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
			</ContentWidget>
			<!-- xExport Coins -->
			
			<div v-if="confirmed">
				<!-- Animation to display during server requests -->
				<SpinnerWidget :class="{active:loading}"/>
				<!-- xAnimation to display during server requests -->

				<!-- QR Display Coin Code-->
				<QRCoinCodeWidget 
					v-on:click.native="hideQRCode()"
					v-bind="{
						initActiveCode,
						initActiveCodeValue,
						initActiveCodeExportDate,
						initCoinCodePos,
						initCoinData,
						initAvailableCoins,
					}"
					:class="{active: showQR}" />
				<!-- xQR Display Coin Code-->

				<!-- Export History -->
				<ContentWidget 
					v-if="exportCoinHistory.length > 0" 
					v-bind="{
						infoPanelTypeButton:true,
						bookletData: initAvailableCoins,
					}"
					titleTxt="Export History" 
					infoPanelTxt="Generate Booklet" 
					:infoPanelIcoClassName="{booklet: true}">

					<!-- Header Button -->
					<template slot="headerButton">
						<GenerateBookletWidget 
							v-bind="{
								bookletData: initAvailableCoins,
							}"/>
					</template>
					<!-- xHeader Button -->

					<!-- Coin Data Table -->
					<table>
					<thead>
						<tr>
							<th>JSE</th>
							<th align="left">Date</th>
							<th align="left">Status</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(coin, i) in exportCoinHistory">
							<td>
								<CoinCodeWidget 
									v-on:click.native="showQRCode(coin, i)"
									v-bind="{
										coin,
										showQR: !coin.used,
									}" />
							</td>
							<td>{{ new Date(coin.ts) | moment("DD/MM/YY HH:mm:ss")}}</td>
							<td>
								<CoinStatusWidget
									v-bind="{
										coin,
									}" />
							</td>
						</tr>
					</tbody>
					</table>
					<!-- xCoin Data Table -->
				</ContentWidget>
				<!-- xExport History -->
			</div>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import QRious from 'qrious';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import QRCoinCodeWidget from '@/components/widgets/QRCoinCodeWidget.vue';
import GenerateBookletWidget from '@/components/widgets/GenerateBookletWidget.vue';
import CoinCodeWidget from '@/components/widgets/CoinCodeWidget.vue';
import CoinStatusWidget from '@/components/widgets/CoinStatusWidget.vue';
import LoadingDelayMaskWidget from '@/components/widgets/LoadingDelayMaskWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';
import Pin from '@/components/widgets/Pin.vue';
import ConfirmAccountMaskWidget from '@/components/widgets/ConfirmAccountMaskWidget.vue';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
	name: 'Export-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
		ButtonWidget,
		SpinnerWidget,
		QRCoinCodeWidget,
		GenerateBookletWidget,
		CoinCodeWidget,
		CoinStatusWidget,
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
			loading: true,
			showQR: false,
			form: {
				required: ['amount'],
				amount: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				error: {
					msg: '',
					display: false,
				},
			},
			exportCoinHistory: [],
			initActiveCode: '',
			initActiveCodeValue: '',
			initActiveCodeExportDate: '',
			initCoinCodePos: 0,
			initCoinData: {},
			initAvailableCoins: [],
		};
	},
	created() {
		const self = this;
		self.getMiningHistory();
	},
	computed: mapState({
		balance: state => state.user.balance,
		confirmed: state => state.user.confirmed,
		waitTimer: state => state.user.waitTimer,
	}),
	methods: {
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
			self.notificationMsg = 'Initiating Export';

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
					self.getMiningHistory();
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
		showQRCode(coin, i) {
			const self = this;
			if (!coin.used) {
				self.initActiveCode = coin.coinCode;
				self.initActiveCodeValue = `${coin.value}`;
				self.initActiveCodeExportDate = moment(coin.ts).format('DD/MM/YY HH:mm:ss');
				self.initCoinCodePos = self.initAvailableCoins.indexOf(coin);
				self.initCoinData = coin;
				self.showQR = true;
			}
		},
		hideQRCode() {
			const self = this;
			self.initActiveCode = '';
			self.initActiveCodeValue = '';
			self.initActiveCodeExportDate = '';
			self.initCoinCodePos = null;
			self.initCoinData = {};
			self.showQR = false;
		},
		clearErrorDisplay() {
			const self = this;
			self.form.error.msg = '';
		},
		getMiningHistory() {
			const self = this;
			const exportedCoinsReq = {
				session: self.$store.state.user.session,
			};
			axios.post(
				`${self.$store.state.app.jseCoinServer}/myexports/`,
				exportedCoinsReq,
			).then((res) => {
				self.exportCoinHistory = res.data.reverse();
				self.initAvailableCoins = self.exportCoinHistory.filter(coin => !coin.used);
				self.loading = false;
			}).catch((err) => {
				self.$store.commit('ajaxError', err.response);
			});
		},
		exportCoins() {
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
			self.form.error.msg = '';

			if (!checkRequiredFields) {
				self.form.error.msg = 'Please check amount.';
				return;
			}

			//notification message
			self.notificationMsg = 'Initiating Request';

			//init transaction flag started
			self.$store.commit('updateUserStateValue', {
				val: true,
				state: 'initTransaction',
			});

			//export request dataset
			const exportReq = {
				session: self.$store.state.user.session,
				exportAmount: self.form.amount.val,
			};
			//clear form
			self.form.amount = {
				val: '',
				displayLabel: false,
				flag: false,
			};
			//post export request
			axios.post(
				`${self.$store.state.app.jseCoinServer}/push/requestexport/`,
				exportReq,
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
		keyWatch(input) {
			const self = this;
			//if text remove placeholder and show above input
			if (this.form[input].val.length > 0) {
				this.form[input].flag = false;
				this.form[input].displayLabel = true;
				if (input === 'amount') {
					const regex = /[^\d.]|\.(?=.*\.)/g;
					const subst = '';
					//strip any invalid chars
					this.form.amount.val = this.form.amount.val.replace(regex, subst);
					//convert string to int for val checks
					let amountVal = Number(this.form.amount.val);
					//constrain to 6 dp
					if ((this.form.amount.val.indexOf('.') >= 0) && (this.form.amount.val.split('.')[1].length > 6)) {
						this.form[input].val = amountVal.toFixed(6);
					}

					//cleanup user input if 0001 entered
					if (this.form.amount.val.indexOf('.') === -1) {
						this.form[input].val = amountVal.toFixed(0);
					} else {
						const decCheck = this.form.amount.val.split('.');
						this.form.amount.val = Number(decCheck[0]).toFixed(0)+'.'+decCheck[1];
					}

					//if gt current balance fix to balance amount
					amountVal = Number(this.form.amount.val);
					if (amountVal > self.$store.state.balance) {
						this.form.amount.val = self.$store.state.balance;
					}

					//make sure min value is set to 0.000001
					if ((amountVal > 0) && (amountVal < 0.000001)) {
						this.form[input].val = 0.000001;
					} else if (this.form[input].val === '0.000000') {
						this.form[input].val = 0.000001;
					}
				}
			} else {
				this.form[input].displayLabel = false;
				this.form[input].flag = true;
			}
		},
	},
};
</script>