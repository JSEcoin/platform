<template>
	<AppWrapperWidget>
		<NavWidget activeNav="dashboard" activeSubNav="overview"></NavWidget>
		<ScrollWidget>
			<div id="FB-dynamicContentRegion">
				<!-- Balance -->
				<ContentWidget 
					titleTxt="Balance" 
					:infoPanelTxt="`Updated ${fromNow}`"
					style="padding-bottom:50px;">
					<OverviewCoinDispayWidget class="dashCoinTotalDisplay" style="font-size:0.8em;" 
						:coinTotal="`${balance}`"
						:coinClass="{gold:balance >= 1, silver:balance < 1}"></OverviewCoinDispayWidget>
					<template slot="footer">
						<div class="row" style="justify-content:center;">
							<ButtonWidget v-if="icoActive()" class="small" style="margin:10px 5px;" buttonTxt="Buy" v-on:click.native="openExternalWindow('https://jsecoin.com/ico/?utm_source=platformapp&utm_campaign=platformapppBtInAction&utm_content=platform');"/>
							<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Transfer" v-on:click.native="goto('/wallet');"/>
							<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Export" v-on:click.native="goto('/wallet/export');"/>
							<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Import" v-on:click.native="goto('/wallet/import');"/>
						</div>
					</template>
				</ContentWidget>
				<!-- xBalance -->

				<!-- Rewards Pending -->
				<ContentWidget 
					titleTxt="Rewards Pending"
					:infoPanelTxt="`${pendingTotal}`"
					:infoPanelIcoClassName="{gold:pendingTotal >= 1, silver:pendingTotal < 1}">
					<RewardPanelWidget />
				</ContentWidget>
				<!-- xRewards Pending -->

				<!-- Mining Overview -->
				<ContentWidget 
					titleTxt="Mining Overview"
					:infoPanelTxt="`Registered ${registrationDate}`">
					<MinerPanelWidget />
				</ContentWidget>
				<!-- Mining Overview -->

				<div>
					<!-- Payment Overview -->
					<ContentWidget 
						titleTxt="Payment Overview"
						:infoPanelTxt="`${pendingNextPayment}`"
						:infoPanelIcoClassName="{gold:pendingNextPayment >= 1, silver:pendingNextPayment < 1}">
						<RewardPaymentPanelWidget />
					</ContentWidget>
					<!-- xPayment Overview -->
				</div>
			</div>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import OverviewCoinDispayWidget from '@/components/widgets/OverviewCoinDispayWidget.vue';
import RewardPanelWidget from '@/components/widgets/RewardPanelWidget.vue';
import MinerPanelWidget from '@/components/widgets/MinerPanelWidget.vue';
import RewardPaymentPanelWidget from '@/components/widgets/RewardPaymentPanelWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';

/**
 * @description
 * <p>Overview split into 3 sections:</p>
 * <ul>
 *     <li>User Balanace</li>
 *     <li>Earnings Today</li>
 *     <li>Mined Lifetime</li>
 * </ul>
 */
export default {
	name: 'Overview-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
		OverviewCoinDispayWidget,
		RewardPanelWidget,
		MinerPanelWidget,
		RewardPaymentPanelWidget,
		ButtonWidget,
	},
	computed: mapState({
		balance: state => state.user.balance,
		todaysEarnings: state => state.user.todaysEarnings,
		minedLifetime: state => state.user.minedLifetime,
		pendingNextPayment: state => state.user.pendingNextPayment,
		pendingTotal: state => state.user.pendingTotal,
		statsReset: state => state.user.statsReset,
		fromNow: state => state.user.fromNow,
		registrationDate: state => state.user.registrationDate,
	}),
	data() {
		return {
			endDate: '',
			bonusDate: '1539259200',
			days: 0,
			hrs: 0,
			mins: 0,
			seconds: 0,
		};
	},
	created() {
		const self = this;
		if (self.icoActive) {
			self.endDate = moment.unix(self.bonusDate).format('MMMM Do YYYY');
			setInterval(() => {
				const endICO = moment.unix(self.bonusDate);
				const currentTime = moment();

				let days = endICO.diff(currentTime, 'days');
				if (days < 10) {
					days = `0${days}`;
				}
				self.days = days;
				if (self.days < 0) {
					self.hrs = 0;
					self.mins = 0;
					self.seconds = 0;
				} else {
					const EOD = moment().endOf('day');
					const EOH = moment().endOf('hour');
					const EOM = moment().endOf('minute');

					let hrs = EOD.diff(moment(), 'hours');
					if (days === '00') {
						hrs = endICO.diff(moment(), 'hours');
					}
					if (hrs < 10) {
						hrs = `0${hrs}`;
					}
					let mins = EOH.diff(moment(), 'minutes');
					if (mins < 10) {
						mins = `0${mins}`;
					}
					let seconds = EOM.diff(moment(), 'seconds');
					if (seconds < 10) {
						seconds = `0${seconds}`;
					}

					self.hrs = hrs;
					self.mins = mins;
					self.seconds = seconds;
				}
			}, 1000);
		}
	},
	methods: {
		goto(route) {
			const self = this;
			self.$router.push(`${self.$store.state.app.platformURL}${route}`);
		},
		icoActive() {
			return !moment().isAfter(moment.unix(1539259200));
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
	},
};
</script>

<style scoped>
.hr-divider {
	background:#eee;
	height:4px;
	border-radius: 4px;
	margin:20px 0px;
}
.hr-divider hr {
	display: none;
}

.icoEnding {
	background: #101219;
	border-radius: 100px;
	margin: 0px 20px;
	padding:1px 20px;
	height: 70px;
}
.platformWeb.min .icoEnding {
	margin: 0px 10px;
	padding:1px 14px;
	height:65px;
}
.platformWeb.min .icoEnding dd {
	padding-top:4px;
}
.icoEnding dl {
	border-radius:4px;
	margin:8px 0px;
}
.icoEnding dt {
	font-size:0.8em;
	border-radius:20px;
	float: left;
	clear: both;
	padding:2px 8px;
	display:block;
}

.icoEnding dd {
	margin:0px;
	padding:0px 8px;
	font-size:0.8em;
	clear: both;
	color: #afafaf;
}
.night .icoEnding {
	background: #101219;
}
.night .icoEnding dt {
	color:#fff; 
	background:#000;
}
	
.light .icoEnding {
	background: #3598db;
}
	
.light .icoEnding dt {
	color:#fff;
	background:rgba(255,255,255,0.4);
}
.light .icoEnding dd {
	color: rgba(255,255,255,0.75);
}

.hr.split {
	height:8px;
	border-radius: 8px;
	width:40px;
	margin: 0px auto;
}

.dashCoinTotalDisplay {
	margin:0px auto;
	border-radius: 30px;
	padding-right:20px;
}

.night .dashCoinTotalDisplay {
	background: #1c1e28;
}
	
.light .dashCoinTotalDisplay {
	background: #fafafa;
}

.max #FB-dynamicContentRegion {
	width: 880px;
	margin:0px auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
	padding-top:40px;
}

.max dl {
	margin: 16px 10px;
}
</style>