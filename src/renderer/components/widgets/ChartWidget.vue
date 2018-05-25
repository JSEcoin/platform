<template>
	<div id="chart"></div>
</template>

<script>
import { mapState } from 'vuex';

let chartLibs = [
	'ojsojcore',
	'ojsojchart',
];
if (process.env.NODE_ENV === 'development') {
	chartLibs = [
		'ojs/ojcore',
		'ojs/ojchart',
	];
}
export default {
	name: 'ChartWidget',
	props: {
		type: String,
		orientation: String,
	},
	computed: mapState({
		stats: (state) => {
			const stats = [{
				items: state.miner.hashRateChartItems,
				areaColor: 'rgba(35, 123, 177, 0.2)',
				markerShape: 'circle',
				markerColor: '#fff',//88bbc8
				markerDisplayed: 'on',
				markerSize: 6,
				color: '#88bbc8',
				lineWidth: 1,
			}];
			return stats;
		},
	}),
	watch: {
		stats: {
			//immediate: true,
			deep: true,
			handler(newVal, oldVal) {
				const self = this;
				if (self.$store.state.app.theme === 'light') {
					//self.stats[0].markerColor = '#000';
					self.stats[0].areaColor = 'rgba(35, 123, 177, 0.04)';
					self.stats[0].markerSize = 6;
				}
				define(chartLibs, function() {
					$(self.$el).ojChart({
						series: self.stats,
					});
					//$(self.$el).ojChart('refresh');
				});
			},
		},
	},
	mounted() {
		const self = this;
		console.log(self.$requirejs);
		define(chartLibs, function() {
			const chartSettings = {
				type: self.type,
				orientation: self.orientation,
				stack: 'off',
				series: self.stats,
				//groups: ['Group A', 'Group B'],
				animationOnDisplay: 'none',
				animationOnDataChange: 'none',
				hoverBehavior: 'dim',
				styleDefaults: {
					animationIndicators: 'none',
					dataItemGaps: '0%',
					barGapRatio: 0,
					dataLabelPosition: 'none',
					groupSeparators: {
						rendered: 'off',
					},
				},
				valueFormats: {
					close: {
						tooltipDisplay: 'off',
						tooltipLabel: 'off',
					},
					group: {
						tooltipDisplay: 'off',
					},
					value: {
						tooltipDisplay: 'off',
					},
				},
				xAxis: {
					//rendered: 'off',
					axisLine: {
						lineColor: '#FFFFFF',
						//lineWidth: '1',
						rendered: 'off',
					},
					majorTick: {
						rendered: 'on',
						lineColor: '#101219',
						lineStyle: 'dotted',
					},
					minorTick: {
						//rendered: 'off',
					},
					tickLabel: {
						rendered: 'off',
					},
				},
				yAxis: {
					rendered: 'on',
					dataMax: 12000, //limited to
					dataMin: 0, //25
					maxSize: '50px',
					axisLine: {
						rendered: 'off',
					},
					majorTick: {
						rendered: 'on',
						lineColor: '#101219',
						lineStyle: 'dotted',
					},
					minorTick: {
						rendered: 'off',
					},
					tickLabel: {
						rendered: 'off',
					},
				},
			};
			if (self.$store.state.app.theme === 'light') {
				chartSettings.xAxis.majorTick.lineColor = '#e5e5e5';
				chartSettings.yAxis.majorTick.lineColor = '#e5e5e5';
			}
			console.log($,self.$el);
			$(self.$el).ojChart(chartSettings);
		});
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#chart {
	height: 100px;
	margin: 10px 0px 8px;
}
.light circle {
	stroke: #88bbc8;
	fill: #fff;
	stroke-width: 1.5;
}
.night circle {
	stroke: #20222e;
	fill: #fafafa;
	stroke-width: 1.7;
}
</style>
