<template>
	<AppWrapperWidget>
		<NavWidget activeNav="dashboard" activeSubNav="overview"></NavWidget>
		<ScrollWidget>
			
			<div style="margin-top:10px;">
				<div class="icoEnding" v-if="icoActive()">
					<p>
						<b>ICO ending soon!</b><br />
						Help support the JSEcoin project by investing and buying JSE Tokens.
					</p>
				</div> 
				<ButtonWidget v-if="icoActive()" class="small green" style="margin:-16px auto 10px auto; border-radius:20px;" buttonTxt="Buy JSE Tokens" v-on:click.native="goto('/wallet');"/>
			</div>
			<div v-if="icoActive()" class="hr split"><hr /></div>
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
						<ButtonWidget v-if="icoActive()" class="small" style="margin:10px 5px;" buttonTxt="Buy" v-on:click.native="goto('/wallet');"/>
						<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Transfer" v-on:click.native="goto('/wallet');"/>
						<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Export" v-on:click.native="goto('/wallet/export');"/>
						<ButtonWidget class="small" style="margin:10px 5px;" buttonTxt="Import" v-on:click.native="goto('/wallet/import');"/>
					</div>
				</template>
			</ContentWidget>
			<!-- xBalance -->

			<!-- Earnings Today
			<ContentWidget 
				v-if="(todaysEarnings > 0)" titleTxt="Mined Today" 
				:infoPanelTxt="`Reset ${statsReset} Hrs Ago`">
				<OverviewCoinDispayWidget 
					:coinTotal="`${todaysEarnings}`"
					:coinClass="{gold:todaysEarnings >= 1, silver:todaysEarnings < 1}"></OverviewCoinDispayWidget>
			</ContentWidget>
			xEarnings Today -->
			
			<!-- Mined Lifetime
			<ContentWidget 
				v-if="(minedLifetime > 0)" 
				titleTxt="Mined Lifetime" 
				:infoPanelTxt="`Registered ${registrationDate}`">
				<OverviewCoinDispayWidget 
					:coinTotal="`${minedLifetime}`"
					:coinClass="{gold:minedLifetime >= 1, silver:minedLifetime < 1}"></OverviewCoinDispayWidget>
			</ContentWidget>
			 xMined Lifetime -->


			<div class="hr split"><hr /></div>

			<!-- Mining Overview -->
			<ContentWidget 
				v-if="(minedLifetime > 0)" 
				titleTxt="Mining Overview"
				:infoPanelTxt="`Registered ${registrationDate}`">
				<MinerPanelWidget />
			</ContentWidget>
			<!-- Mining Overview -->

			<div class="hr split"><hr /></div>

			<!-- Rewards Pending -->
			<ContentWidget 
				v-if="(pendingTotal > 0)" 
				titleTxt="Rewards Pending"
				:infoPanelTxt="`${pendingTotal}`"
				:infoPanelIcoClassName="{gold:pendingTotal >= 1, silver:pendingTotal < 1}">
				<RewardPanelWidget />
			</ContentWidget>
			<!-- xRewards Pending -->

			<div class="hr split"><hr /></div>

			<!-- Payment Overview -->
			<ContentWidget 
				v-if="(pendingTotal > 0)" 
				titleTxt="Payment Overview"
				:infoPanelTxt="`${pendingNextPayment}`"
				:infoPanelIcoClassName="{gold:pendingNextPayment >= 1, silver:pendingNextPayment < 1}">
				<RewardPaymentPanelWidget />
			</ContentWidget>
			<!-- xPayment Overview -->
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
	methods: {
		goto(route) {
			const self = this;
			self.$router.push(route);
		},
		icoActive() {
			return !moment().isAfter(moment.unix(1539259200));
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
	padding:1px 30px;
	height: 70px;
}


.night .icoEnding {
	background: #101219;
}
.night .icoEnding b {
	color:#afafaf;
}
	
.light .icoEnding {
	background: #3598db;
}
	
.light .icoEnding b {
	color:#fff;
}
.light .icoEnding p {
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
</style>