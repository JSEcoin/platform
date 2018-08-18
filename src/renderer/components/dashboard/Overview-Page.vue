<template>
	<AppWrapperWidget>
		<NavWidget activeNav="dashboard" activeSubNav="overview"></NavWidget>
		<ScrollWidget>
			<!-- Balance -->
			<ContentWidget 
				titleTxt="Balance" 
				:infoPanelTxt="`Updated ${fromNow}`">
				<OverviewCoinDispayWidget 
					:coinTotal="`${balance}`"
					:coinClass="{gold:balance >= 1, silver:balance < 1}"></OverviewCoinDispayWidget>
			</ContentWidget>
			<!-- xBalance -->
			
			<!-- Earnings Today -->
			<ContentWidget 
				v-if="todaysEarnings !== 0" titleTxt="Earnings Today" 
				:infoPanelTxt="`Reset ${statsReset} Hrs Ago`">
				<OverviewCoinDispayWidget 
					:coinTotal="`${todaysEarnings}`"
					:coinClass="{gold:todaysEarnings >= 1, silver:todaysEarnings < 1}"></OverviewCoinDispayWidget>
			</ContentWidget>
			<!-- xEarnings Today -->
			
			<!-- Mined Lifetime -->
			<ContentWidget 
				v-if="((minedLifetime !== 0) && (minedLifetime !== 0))" 
				titleTxt="Mined Lifetime" 
				:infoPanelTxt="`Registered ${registrationDate}`">
				<OverviewCoinDispayWidget 
					:coinTotal="`${minedLifetime}`"
					:coinClass="{gold:minedLifetime >= 1, silver:minedLifetime < 1}"></OverviewCoinDispayWidget>
			</ContentWidget>
			<!-- xMined Lifetime -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import OverviewCoinDispayWidget from '@/components/widgets/OverviewCoinDispayWidget.vue';

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
	},
	computed: mapState({
		balance: state => state.user.balance,
		todaysEarnings: state => state.user.todaysEarnings,
		minedLifetime: state => state.user.minedLifetime,
		statsReset: state => state.user.statsReset,
		fromNow: state => state.user.fromNow,
		registrationDate: state => state.user.registrationDate,
	}),
};
</script>
