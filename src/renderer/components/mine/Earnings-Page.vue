<template>
	<AppWrapperWidget>
		<NavWidget activeNav="mine" activeSubNav="earnings"></NavWidget>
		<ScrollWidget>
			<!-- Recent Platform Mining Earnings -->
			<ContentWidget titleTxt="Recent Platform Mining Earnings">	
				<table>
				<thead>
					<tr>
						<th>JSE</th>
						<th align="left">Date</th>
						<th>Reference</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(coin, i) in miningRewardHistory">
						<td>
							<CoinCodeWidget
								v-bind="{
									coin,
									showQR: false,
								}" />
						</td>
						<td align="left">{{ new Date(coin.ts) | moment("DD/MM/YY HH:mm:ss")}}</td>
						<td align="center">{{coin.siteid}}</td>
					</tr>
				</tbody>
				</table>
			</ContentWidget>
			<!-- xRecent Platform Mining Earnings -->
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
import CoinCodeWidget from '@/components/widgets/CoinCodeWidget.vue';

/**
 * @description
 * <p>Table display of the user mining reward history.</p>
 */
export default {
	name: 'Earnings-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
		CoinCodeWidget,
	},
	/**
	 * Computed
	 * */
	computed: mapState({
		miningRewardHistory: state => state.user.miningHistory,
	}),
	created() {
		const self = this;

		//grab server stats count platform mining user distribution
		const statsReq = {
			session: self.$store.state.user.session,
		};

		//get active miners
		/*
		axios.post(
			`${self.$store.state.app.jseCoinServer}pubStats/`,
			statsReq,
		).then((res) => {
			if (type of(res.data.statsDaily) !== 'undefined') {
				const dailyEarnings = Object.values(res.data.statsDaily).slice().reverse().filter(stat => ((hist.command === 'mining') && (hist.siteid === 'Platform Mining')))
			}
		}).catch((err) => {
			self.$store.commit('ajaxError', err.response);
		});
		*/
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
