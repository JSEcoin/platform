<template>
	<AppWrapperWidget>
		<NavWidget activeNav="wallet" activeSubNav="import"></NavWidget>
		<ScrollWidget>
			<!-- Import Coins -->
			<ContentWidget
				titleTxt="Import Coins"
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
						eventaction="initQRImport"
						@initQRImport="initQRImport"
						@keyup="keyWatch('coinCode', $event)" />
				</div>
				<div class="row">
					<ButtonWidget v-if="$store.getters.whichPlatform === 'mobile'" style="margin-top:10px;margin-right:10px;" v-on:click.native="initQRImport()" buttonTxt="Scanner"/>
					<ButtonWidget style="margin-top:10px;" :class="{'disable':!confirmed}" :disabled="!confirmed" v-on:click.native="importCoins()" buttonTxt="Import Coins"/>
				</div>
			</ContentWidget>
			<!-- xImport Coins -->

			<div v-if="confirmed">
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
					:infoPanelTxt="($store.getters.whichPlatform !== 'mobile')?'Generate Booklet':'Share Booklet'"
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
						<tr v-for="(coin, i) in initAvailableCoins" :key="i">
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
						<tr v-for="(coin, i) in importHistory" :key="i">
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
			</div>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import QRious from 'qrious';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import QRCoinCodeWidget from '@/components/widgets/QRCoinCodeWidget.vue';
import GenerateBookletWidget from '@/components/widgets/GenerateBookletWidget.vue';
import CoinCodeWidget from '@/components/widgets/CoinCodeWidget.vue';
import LoadingDelayMaskWidget from '@/components/widgets/LoadingDelayMaskWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';
import GenerateCoinPageWidget from '@/components/widgets/GenerateCoinPageWidget.vue';
import ConfirmAccountMaskWidget from '@/components/widgets/ConfirmAccountMaskWidget.vue';

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
		confirmed: state => state.user.confirmed,
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
		foundQRCode(err, text) {
			const self = this;
			if (err){
				// an error occurred, or the scan was canceled (error code `6`)
				console.error(err);
			} else {
				// The scan completed, display the contents of the QR code:
				console.log(text);
				self.form.coinCode.val = text;
			}
			console.log('destroy scanner');
			//destroy scanner
			document.body.classList.remove('QRScanner');
			QRScanner.cancelScan();
			QRScanner.hide();
			QRScanner.destroy();
		},
		QRInitialised(err, status) {
			const self = this;
			console.log('QRInitialised');
			if (err) {
				// here we can handle errors and clean up any loose ends.
				console.error(err);
			}
			if (status.authorized) {
				console.log('show scanner');
				//show QR Scanner
				document.body.classList.add('QRScanner');
				//enable scanner and callback
				QRScanner.scan(self.foundQRCode);
				QRScanner.show();
			} else if (status.denied) {
				// The video preview will remain black, and scanning is disabled. We can
				// try to ask the user to change their mind, but we'll have to send them
				// to their device settings with
				QRScanner.getStatus((status) => {
					if ((!status.authorized) && (status.canOpenSettings)) {
						self.$swal({
							title: 'Enable QR Scanning?',
							text: 'Would you like to enable QR code scanning? You can allow camera access in your settings.',
							icon: 'info',
							buttons: true,
						}).then((confirmed) => {
							if (confirmed) {
								QRScanner.openSettings();
							}
						});
					}
				});
			} else {
				// we didn't get permission, but we didn't get permanently denied. (On
				// Android, a denial isn't permanent unless the user checks the "Don't
				// ask again" box.) We can ask again at the next relevant opportunity.
			}
		},
		initQRImport() {
			const self = this;
			console.log('init');
			//check scanner obj exists
			if (typeof (QRScanner) !== 'undefined') {
				console.log('prep');
				//make sure the user is ready
				QRScanner.prepare(self.QRInitialised); // show the prompt
			} else {
				console.log('Unable to find QRScanner Lib');
			}
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
							`${self.$store.state.app.jseCoinServer}/account/removecoincode/`,
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
				`${self.$store.state.app.jseCoinServer}/account/myexports/`,
				exportedCoinsReq,
			).then((res) => {
				if (!res.data.fail) {
					self.exportCoinHistory = res.data.reverse();
					self.initAvailableCoins = self.exportCoinHistory.filter(coin => !coin.used);
					self.loading = false;
					self.availableCoinCodes = (self.initAvailableCoins.length > 0);
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
			//post import coin code request
			axios.post(
				`${self.$store.state.app.jseCoinServer}/push/import/`,
				importReq,
			).then((res) => {
				if (res.data.success === 1) {
					const transactionTimeSeconds = Math.ceil((res.data.timeTillConfirmation + 1000)/1000);
					//init waiting time display
					self.$store.commit('delay', transactionTimeSeconds);

					//clear form
					self.form.coinCode = {
						val: '',
						displayLabel: false,
						flag: false,
					};

					//
					self.exportCoinHistory.forEach(function(coin, i) {
						if (coin.coinCode === importReq.coinCode) {
							self.exportCoinHistory.splice(i, 1);
						}
					});

					//
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
