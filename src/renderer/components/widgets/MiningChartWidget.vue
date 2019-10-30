<template>
	<div style="position:relative;" class="cf">
		<div id="JSEW-miningStatus" :class="{ active : displayStatusMsg }">{{miningLabel}}</div>
		<ChartWidgetC3 type="lineWithArea" orientation="vertical" />

		<div id="JSEA-legend">
			<div id="JSEA-key"></div>{{hashRate}} <b>Hash Rate</b>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import ChartWidgetC3 from '@/components/widgets/ChartWidgetC3.vue';
/**
 * @description
 * Mining Chart Widget
 */
export default {
	name: 'MiningChartWidget',
	components: {
		ChartWidgetC3,
	},
	computed: mapState({
		hashRate: state => state.miner.hashRate,
		miningLabel: state => state.miner.miningLabel,
		displayStatusMsg: state => state.miner.displayStatusMsg,
	}),
};
</script>
