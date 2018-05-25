<template>
	<AppWrapperWidget>
		<NavWidget activeNav="wallet" activeSubNav="import"></NavWidget>
		<ScrollWidget>
			<!-- Import Coins -->
			<ContentWidget 
				titleTxt="Import Coins" 
				:infoPanelTxt="balance" 
				:infoPanelIcoClassName="{gold:balance >= 1, silver:balance < 1}">
				<!-- Transaction delay display -->
				<LoadingDelayMaskWidget />
				<!-- xTransaction delay display -->

				<!-- Form Error Msg -->
				<FormErrorDisplayWidget :errorMsg="form.error.msg" v-on:click.native="clearErrorDisplay" />
				<!-- xForm Error Msg -->
				<p><b>Import Coins with code:</b></p>
				<div class="row" style="display:flex;">
					<InputWidget 
						v-model="form.coinCode.val"
						placeholder="Coin Code *"
						name="coinCode"
						maxlength="64"
						:showLabel="form.coinCode.displayLabel"
						:flag="form.coinCode.flag"
						:iconClass="{'coincode': true}"
						@keyup="keyWatch('coinCode', $event)" />
				</div>
				<div>
					<ButtonWidget style="margin-top:10px;" v-on:click.native="importCoins()" buttonTxt="Import Coins"/>
				</div>
			</ContentWidget>
			<!-- xImport Coins -->
			
			<!-- Animation to display during server requests -->
			<SpinnerWidget :class="{active:loading}"/>

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

			<!-- Available Coin Codes -->
			<ContentWidget 
				v-if="exportCoinHistory.length > 0" 
				v-bind="{
					infoPanelTypeButton: true,
					bookletData: initAvailableCoins,
				}"
				titleTxt="Available Coin Codes" 
				infoPanelTxt="Generate Booklet"
				:infoPanelIcoClassName="{booklet: true}">

				<!-- Header Button -->
				<template slot="headerButton">
					<GenerateBookletWidget
						v-bind="{
							bookletData: initAvailableCoins
						}"/>
				</template>
				<!-- xHeader Button -->
			
				<table>
				<thead>
					<tr>
						<th>JSE</th>
						<th align="left">Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="coin.used === false" v-for="(coin, i) in exportCoinHistory">
						<td>
							<CoinCodeWidget 
								v-on:click.native="showQRCode(coin, i)"
								v-bind="{
									coin,
									showQR: true,
								}" />
						</td>
						<td>{{ new Date(coin.ts) | moment("DD/MM/YY HH:mm:ss")}}</td>
						<td>										
							<div class="row buttonActions">
								<!-- Copy Coin Code -->
								<ButtonWidget 
									iconClassName="fa fa-copy" 
									v-on:click.native="copyCoinCode(coin.coinCode)"
									title="Copy Coin Code"
									class="small"/>
								<!-- xCopy Coin Code -->
								
								<!-- Import Coin Code -->
								<ButtonWidget 
									iconClassName="fa fa-download" 
									v-on:click.native="importCoins(coin.coinCode)"
									title="Import Coin Code"
									:class="{disable: (initTransaction)}"
									class="small"/>
								<!-- xImport Coin Code -->
								
								<!-- Remove Coin Code -->
								<ButtonWidget 
									iconClassName="fa fa-close" 
									v-on:click.native="removeCoin(coin)"
									title="Remove Coin Code"
									class="small"/>
								<!-- xRemove Coin Code -->
							</div>
						</td>
					</tr>
				</tbody>
				</table>
			</ContentWidget>
			<!-- xAvailable Coin Codes -->
			
			<!-- Imported Coin History -->
			<ContentWidget 
				v-if="importHistory.length > 0" 
				titleTxt="Imported Coin History">
				<table>
				<thead>
					<tr>
						<th align="left" style="text-align:left;padding-left:22px;">JSE</th>
						<th width="50%">Imported</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(coin, i) in importHistory">
						<td>
							<CoinCodeWidget
								v-bind="{
									coin,
									showQR: false,
								}" />
						</td>
						<td style="text-align:center;">{{ new Date(coin.ts) | moment("DD/MM/YY HH:mm:ss")}}</td>
					</tr>
				</tbody>
				</table>	
			</ContentWidget>
			<!-- xImported Coin History -->

			<!-- Listener -->
			<GenerateCoinPageWidget v-bind="{autoGenerate:true, coinData:genCoin}" />
			<!-- xListener -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import QRious from 'qrious';
import AppWrapperWidget from '../widgets/AppWrapperWidget.vue';
import NavWidget from '../widgets/NavWidget.vue';
import ScrollWidget from '../widgets/ScrollWidget.vue';
import ContentWidget from '../widgets/ContentWidget.vue';
import ButtonWidget from '../widgets/ButtonWidget.vue';
import SpinnerWidget from '../widgets/SpinnerWidget.vue';
import QRCoinCodeWidget from '../widgets/QRCoinCodeWidget.vue';
import GenerateBookletWidget from '../widgets/GenerateBookletWidget.vue';
import CoinCodeWidget from '../widgets/CoinCodeWidget.vue';
import LoadingDelayMaskWidget from '../widgets/LoadingDelayMaskWidget.vue';
import FormErrorDisplayWidget from '../widgets/FormErrorDisplayWidget.vue';
import InputWidget from '../widgets/InputWidget.vue';
import GenerateCoinPageWidget from '../widgets/GenerateCoinPageWidget.vue';

export default {
	name: 'Import-Page',
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
		LoadingDelayMaskWidget,
		FormErrorDisplayWidget,
		InputWidget,
		GenerateCoinPageWidget,
	},
	data() {
		return {
			loading: true,
			showQR: false,
			form: {
				required: ['coinCode'],
				coinCode: {
					val: '',
					displayLabel: false,
					flag: false,
				},
				error: {
					msg: '',
					display: false,
				},
			},
			availableCoinCodes: false,
			exportCoinHistory: [],
			initActiveCode: '',
			initActiveCodeValue: '',
			initActiveCodeExportDate: '',
			initCoinCodePos: 0,
			initCoinData: {},
			initAvailableCoins: [],
			genCoin: {},
		};
	},
	computed: mapState({
		balance: state => state.user.balance,
		waitTimer: state => state.user.waitTimer,
		importHistory: state => state.user.importHistory,
		initTransaction: state => state.user.initTransaction,
	}),
	created() {
		const self = this;
		self.getExportHistory();
	},
	methods: {
		removeCoin(coin) {
			const self = this;
			const msg = document.createElement('div');
			msg.innerHTML = `<div>
				<div class="popupMessage">
					Once you remove this coin code from your account there will be no way to retrieve it!
				</div>
				<div class="infoBox">
					<b>Important:</b><br/>
					Please make sure to store the coin code by writing it down or printing it off. 
					<u style="color:#888;">Before you remove it!</u>
				</div>
				<div class="infoBox" style="font-size:0.63em; font-family: courier;font-weight: bold;">${coin.coinCode}</div>
			</div>`;

			self.$swal({
				title: 'Are you sure?',
				content: msg,
				icon: 'warning',
				buttons: {
					test: {
						text: 'Print Code',
						value: 'print',
						visible: true,
						closeModal: false,
					},
					confirm: {
						text: 'Remove Code',
						value: 'remove',
						visible: true,
						closeModal: true,
					},
					cancel: {
						text: 'Cancel',
						value: 'cancel',
						visible: true,
						closeModal: true,
					},
				},
				dangerMode: true,
			}).then((option) => {
				switch (option) {
					case 'print': {
						//
						self.initCoinCodePos = self.initAvailableCoins.indexOf(coin);
						self.genCoin = coin;
						//self.generatePDFCoinPage();
						//self.showQRCode(coin);
						break;
					}
					case 'remove': {
						const removeCoinsReq = {
							session: self.$store.state.user.session,
							coinCode: coin.coinCode,
						};
						axios.post(
							`${self.$store.state.app.jseCoinServer}/removecoincode/`,
							removeCoinsReq,
						).then((res) => {
							self.$swal('Your coin code has been removed and is no longer displayed on your account.', {
								icon: 'success',
							});
							self.getExportHistory();
						}).catch((err) => {
							self.$store.commit('ajaxError', err.response);
						});
						break;
					}
					default: {
						//
						self.$swal('Your coin code has not been removed and is still visible in your account.');
					}
				}
			});
		},
		showQRCode(coin) {
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
		getExportHistory() {
			const self = this;
			const exportedCoinsReq = {
				session: self.$store.state.user.session,
			};
			axios.post(
				`${self.$store.state.app.jseCoinServer}/myexports/`,
				exportedCoinsReq,
			).then((res) => {
				if (!res.data.fail) {
					self.exportCoinHistory = res.data.reverse();
					self.initAvailableCoins = self.exportCoinHistory.filter(coin => !coin.used);
					self.loading = false;
					self.exportCoinHistory.forEach(function(coin, i) {
						if (!coin.used) {
							self.availableCoinCodes = true;
							return false;
						}
						return true;
					});
				}
			}).catch((err) => {
				self.$store.commit('ajaxError', err.response);
			});
		},
		clearErrorDisplay() {
			const self = this;
			self.form.error.msg = '';
		},
		copyCoinCode(coinCode) {
			const self = this;
			self.form.coinCode.val = coinCode;
			this.$copyText(self.form.coinCode.val).then(function (e) {
				console.log('You just copied: ' + e.text);
			}, function (e) {
				console.error('Can not copy', e);
			});
		},
		importCoins(coinCode) {
			const self = this;
			//transaction in progress.
			if (self.$store.state.user.initTransaction) {
				return;
			}
			if (coinCode) {
				self.form.coinCode.val = coinCode;
			}
			//coincode must be 64 chars
			if ((self.form.coinCode.val.length < 64) || (self.form.coinCode.val.length > 64)) {
				self.form.error.msg = 'Invalid Coin Code.';
				return;
			}
			self.form.error.msg = '';
			let checkRequiredFields = true;
			//check required fields have data
			self.form.required.forEach(function(value) {
				self.form[value].flag = false;
				if (self.form[value].val.length === 0) {
					self.form[value].flag = true;
					checkRequiredFields = false;
				}
			});

			if (!checkRequiredFields) {
				return;
			}

			//init transaction flag started
			self.$store.commit('updateUserStateValue', {
				val: true,
				state: 'initTransaction',
			});
			//export request dataset
			const importReq = {
				session: self.$store.state.user.session,
				coinCode: self.form.coinCode.val,
			};
			//clear form
			self.form.coinCode = {
				val: '',
				displayLabel: false,
				flag: false,
			};
			//post import coin code request
			axios.post(
				`${self.$store.state.app.jseCoinServer}/push/import/`,
				importReq,
			).then((res) => {
				if (res.data.success === 1) {
					const transactionTimeSeconds = Math.ceil((res.data.timeTillConfirmation + 1000)/1000);
					//init waiting time display
					self.$store.commit('delay', transactionTimeSeconds);

					self.exportCoinHistory.forEach(function(coin, i) {
						if (coin.coinCode === importReq.coinCode) {
							self.exportCoinHistory.splice(i, 1);
						}
					});
					window.refreshUser(function() {});
					self.getExportHistory();
				}
			}).catch((err) => {
				self.$store.commit('clearDelay');
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Unknown Error';
				}
			});
		},
		keyWatch(input, e) {
			const self = this;
			//if text remove placeholder and show above input
			if (this.form[input].val.length > 0) {
				this.form[input].flag = false;
				this.form[input].displayLabel = true;
				if (input === 'coinCode') {
					const regex = /[^0-9a-z]/gi;
					const subst = '';
					this.form.coinCode.val = this.form.coinCode.val.replace(regex, subst);
				}
			} else {
				this.form[input].displayLabel = false;
				this.form[input].flag = false;
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#JSEA-importHistory .coin,
#JSEA-availableCoinCodes .coin { 
	width:20px;
	height:20px;
	margin-right: 6px;
}

.row.buttonActions {
	justify-content: center;
}

.infoBox {
	position: relative;
    min-height: 1em;
    margin: 1em 0;
    background: #f8f8f9;
    padding: 1em 1.5em;
    line-height: 1.4285em;
    color: rgba(0,0,0,.87);
	font-size:0.8em;
	text-align:left;
	box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.1), inset 0px 0px 0px 1px rgba(34,36,38,.22);
	border-radius: 4px;
}
.popupMessage {
	border-bottom:solid 1px #eee;
	border-top:solid 1px #eee;
	padding-bottom:10px;
	margin-bottom:10px;
	padding-top:10px;
	margin-top:10px;
}

/*
.swal-overlay {
	font-size:1em;
}
.swal-title {
	position: absolute;
	top:0px;
	left: 0px;
	right: 0px;
	height: 44px;
	padding: 12px 18px;
	font-weight: bold;
    font-size: 0.8em;
    letter-spacing: 1px;
	text-align:left;
	border-bottom:solid 1px #eee;
}*/
.swal-button--cancel:focus,
.swal-button:focus {
	box-shadow:none;
}
.swal-footer {
	text-align:center;
	background:#fafafa;
	padding: 6px 8px;

}
.swal-text:first-child {
	margin-top: 25px;
}

.swal-button {
	background-color: #3598db;
	transition:background 0.2s;
}
.swal-button:hover {
	background-color: #1970c7;
}
.swal-button--danger {
	background-color:#fe6963;
	transition:background 0.2s;
}
.swal-button--danger:hover {
	background-color:#fe504b;
}
.swal-button--cancel {
	background-color:#eaebed;
	transition:background 0.2s;
}
.swal-button--cancel:hover {
	background-color:#d7d9dc;
}
</style>
