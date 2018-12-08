<template>
	<div id="chart"></div>
</template>

<script>
import c3 from 'c3';
import { mapState } from 'vuex';

export default {
	name: 'ChartWidgetC3',
	props: {
		handler: {
			type: Object,
		},
	},
	data () {
		return {
			$chart: null,
			c3Data: {
				columns: [
					['data1', 30, 20, 40],
				],
			},
		};
	},
	computed: mapState({
		stats: (state) => {
			const stats = state.miner.hashRateChartItems;
			return stats;
		},
		showChart: state => state.miner.showChart,
	}),
	watch: {
		stats: {
			//immediate: true,
			deep: true,
			handler(newVal, oldVal) {
				const self = this;
				if ((typeof (self.$chart) !== 'undefined') && (self.$chart !== null)) {
					self.$chart.load({
						columns: [self.stats],
					});
				}
			},
		},
		showChart: {
			deep: true,
			handler(newVal, oldVal) {
				const self = this;
				if (self.showChart) {
					self.generateChart();
				} else {
					self.destroyChart();
				}
			},
		},
	},
	mounted () {
		const self = this;
		self.generateChart();
	},
	methods: {
		generateChart() {
			const self = this;
			self.$store.commit('updateMinerState', {
				val: true,
				state: 'showChart',
			});

			self.$chart = c3.generate({
				bindto: this.$el,
				transition: {
					duration: 0,
				},
				size: {
					height: 100,
				},
				tooltip: {
					show: false,
				},
				grid: {
					x: {
						show: true,
					},
					y: {
						show: true,
					},
				},
				legend: {
					show: false,
				},
				padding: {
					top: 10,
					left: 20,
					right: 20,
				},
				area: {
					zerobased: false,
				},
				point: {
					focus: {
						expand: {
							enabled: false,
						},
					},
				},
				axis: {
					y: {
						min: 0,
						max: 12000,
						show: false,
						padding: {
							bottom: 0,
						},
						tick: {
							count: 6,
						},
					},
					x: {
						show: false,
					},
				},
				data: {
					type: 'area',
					columns: [self.stats],
				},
			});
		},
		destroyChart() {
			const self = this;
			if ((typeof (self.$chart) !== 'undefined') && (self.$chart !== null)) {
				self.$chart = self.$chart.destroy();
			}
		},
	},
	beforeDestroy() {
		const self = this;
		self.destroyChart();
	},
};
</script>

<style>
.night .c3-grid line {
	stroke:#101219;
}
.light .c3-grid line {
	stroke:#e5e5e5;
}

.night .c3-circle {
	stroke: #20222e;
	fill: #fafafa !important;
	stroke-width: 1.7;
	cursor: default !important;
}
.c3-event-rect{
	cursor: default !important;
}
.light .c3-circle {
	stroke: #88bbc8;
	fill: #fff !important;
	stroke-width: 1.5;
}
.night .c3-line-Hash-Rate {
	stroke: #88bbc8 !important
}
.light .c3-line-Hash-Rate {
	stroke: #88bbc8 !important
}
</style>
