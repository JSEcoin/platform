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
	}),
	watch: {
		stats: {
			//immediate: true,
			deep: true,
			handler(newVal, oldVal) {
				const self = this;
				self.$chart.load({
					columns: [self.stats],
				});
			},
		},
	},
	mounted () {
		const self = this;

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
	methods: {
		destroyChart () {
			const self = this;
			//self.$chart = self.$chart.destroy();
		},
	},
	beforeDestroy () {
		const self = this;
		//self.destroyChart();
	},
};
</script>

<style>
.c3 svg{font:10px sans-serif;-webkit-tap-highlight-color:transparent}.c3 line,.c3 path{fill:none;stroke:#000}.c3 text{-webkit-user-select:none;-moz-user-select:none;user-select:none}.c3-bars path,.c3-event-rect,.c3-legend-item-tile,.c3-xgrid-focus,.c3-ygrid{shape-rendering:crispEdges}.c3-chart-arc path{stroke:#fff}.c3-chart-arc rect{stroke:#fff;stroke-width:1}.c3-chart-arc text{fill:#fff;font-size:13px}.c3-grid line{stroke:#aaa}.c3-grid text{fill:#aaa}.c3-xgrid,.c3-ygrid{stroke-dasharray:3 3}.c3-text.c3-empty{fill:grey;font-size:2em}.c3-line{stroke-width:1px}.c3-circle._expanded_{stroke-width:1px;stroke:#fff}.c3-selected-circle{fill:#fff;stroke-width:2px}.c3-bar{stroke-width:0}.c3-bar._expanded_{fill-opacity:1;fill-opacity:.75}.c3-target.c3-focused{opacity:1}.c3-target.c3-focused path.c3-line,.c3-target.c3-focused path.c3-step{stroke-width:2px}.c3-target.c3-defocused{opacity:.3!important}.c3-region{fill:#4682b4;fill-opacity:.1}.c3-brush .extent{fill-opacity:.1}.c3-legend-item{font-size:12px}.c3-legend-item-hidden{opacity:.15}.c3-legend-background{opacity:.75;fill:#fff;stroke:#d3d3d3;stroke-width:1}.c3-title{font:14px sans-serif}.c3-tooltip-container{z-index:10}.c3-tooltip{border-collapse:collapse;border-spacing:0;background-color:#fff;empty-cells:show;-webkit-box-shadow:7px 7px 12px -9px #777;-moz-box-shadow:7px 7px 12px -9px #777;box-shadow:7px 7px 12px -9px #777;opacity:.9}.c3-tooltip tr{border:1px solid #ccc}.c3-tooltip th{background-color:#aaa;font-size:14px;padding:2px 5px;text-align:left;color:#fff}.c3-tooltip td{font-size:13px;padding:3px 6px;background-color:#fff;border-left:1px dotted #999}.c3-tooltip td>span{display:inline-block;width:10px;height:10px;margin-right:6px}.c3-tooltip td.value{text-align:right}.c3-area{stroke-width:0;opacity:.2}.c3-chart-arcs-title{dominant-baseline:middle;font-size:1.3em}.c3-chart-arcs .c3-chart-arcs-background{fill:#e0e0e0;stroke:#fff}.c3-chart-arcs .c3-chart-arcs-gauge-unit{fill:#000;font-size:16px}.c3-chart-arcs .c3-chart-arcs-gauge-max{fill:#777}.c3-chart-arcs .c3-chart-arcs-gauge-min{fill:#777}.c3-chart-arc .c3-gauge-value{fill:#000}.c3-chart-arc.c3-target g path{opacity:1}.c3-chart-arc.c3-target.c3-focused g path{opacity:1}

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
