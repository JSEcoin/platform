<template>
	<AppWrapperWidget>
		<NavWidget activeNav="blockchainLatest"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
      <CandleStickChart />
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import CandleStickChart from '@/components/widgets/CandleStickChart.vue';

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
	name: 'Statsx',
	components: {
		AppWrapperWidget,
		ScrollWidget,
		NavWidget,
		CandleStickChart,
	},
};
</script>

<style scoped>
</style>
