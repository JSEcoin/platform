<template>
	<div v-if="hasData">
		<div class="hr"><hr /></div>

		<div id="JSE-earningsChart"></div>
	</div>
</template>

<script>
import c3 from 'c3';
import { mapState } from 'vuex';

export default {
	name: 'EarningsChart',
	props: {
		handler: {
			type: Object,
		},
	},
	data () {
		return {
			hasData: true,
			$chart: null,
			c3Data: {
				columns: [
					['data1', 30, 20, 40],
				],
			},
		};
	},
	mounted () {
		const self = this;
		c3.chart.internal.fn.additionalConfig = {
			barRadiusAll: false,
			barRadius: 5,
			tooltip_format_color: undefined,
		};

		c3.chart.internal.fn.isOrderDesc = function () {
			const config = this.config;
			if (this.isFunction(config.data_order)) {
				return false;
			}
			return config.data_order && config.data_order.toLowerCase() === 'desc';
		};

		c3.chart.internal.fn.isOrderAsc = function () {
			const config = this.config;
			if (this.isFunction(config.data_order)) {
				return false;
			}
			return config.data_order && config.data_order.toLowerCase() === 'asc';
		};

		c3.chart.internal.fn.generateDrawBar = function (barIndices, isSub) {
			const $$ = this;
			const config = $$.config;
			const getPoints = $$.generateGetBarPoints(barIndices, isSub);
			return function (d, i) {
				// 4 points that make a bar
				const points = getPoints(d, i);
				const groups = config.data_groups;
				let path = '';

				// switch points if axis is rotated, not applicable for sub chart
				const indexX = config.axis_rotated ? 1 : 0;
				const indexY = config.axis_rotated ? 0 : 1;
				const barRadius = config.barRadius;
				const barRadiusAll = config.barRadiusAll;
				if (groups && groups.length>0) {
					const lastGrps = [];
					groups.forEach(function(group){
						lastGrps.push(group[group.length-1]);
					});
					//if(points[0][1] < points[1][1] || points[0][0] > points[1][0] ) {
					//	barRadius = barRadius*-1;
					//}
					if (((points[0][1] === points[1][1]) && (points[1][1]=== points[2][1]) && (points[2][1] === points[3][1]))
						|| ((points[0][0] === points[1][0]) && (points[1][0]=== points[2][0]) && (points[2][0] === points[3][0]))) {
						path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
						+ 'L' + points[1][indexX] + ',' + (points[1][indexY]) + ' '
						+ 'L' + (points[2][indexX]) + ',' + points[2][indexY] + ' '
						+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
						+ 'z';
						return path;
					}
					if (lastGrps.indexOf(d.id) > -1 && (config.data_order === null)) {
						path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
						+ 'L' + points[1][indexX] + ',' + (points[1][indexY]+barRadius) + ' '
						+ 'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + (points[1][indexX]+barRadius) + ',' + points[1][indexY] + ' '
						+ 'L' + (points[2][indexX]-barRadius) + ',' + points[2][indexY] + ' '
						+ 'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + points[2][indexX] + ',' + (points[2][indexY]+barRadius) + ' '
						+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
						+ 'z';
						if (config.axis_rotated) {
							path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
							+ 'L' + (points[1][indexX]-barRadius) + ',' + points[1][indexY] + ' '
							+ 'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + points[1][indexX] + ',' + (points[1][indexY]+barRadius) + ' '
							+ 'L' + points[2][indexX] + ',' + (points[2][indexY]-barRadius) + ' '
							+ 'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + (points[2][indexX]-barRadius) + ',' + points[2][indexY] + ' '
							+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
							+ 'z';
						}
					} else {
						path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
						+ 'L' + points[1][indexX] + ',' + (points[1][indexY]) + ' '
						+ 'L' + (points[2][indexX]) + ',' + points[2][indexY] + ' '
						+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
						+ 'z';
						if (barRadiusAll) {
							path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
							+ 'L' + (points[1][indexX]+barRadius) + ',' + (points[1][indexY]) + ' '
							+ 'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + (points[1][indexX]) + ',' + (points[1][indexY]+barRadius) + ' '
							+ 'L' + (points[2][indexX]) + ',' + (points[2][indexY]-barRadius) + ' '
							+ 'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + (points[2][indexX]+barRadius) + ',' + (points[2][indexY]) + ' '
							+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
							+ 'z';
						}
					}
				} else {
					/*path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' ' +
					'L' + points[1][indexX] + ',' + (points[1][indexY]) + ' ' +
					'L' + (points[2][indexX]) + ',' + points[2][indexY] + ' ' +
					'L' + points[3][indexX] + ',' + points[3][indexY] + ' ' +
					'z';*/
					path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
					+ 'L' + points[1][indexX] + ',' + (points[1][indexY]+barRadius) + ' '
					+ 'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + (points[1][indexX]+barRadius) + ',' + points[1][indexY] + ' '
					+ 'L' + (points[2][indexX]-barRadius) + ',' + points[2][indexY] + ' '
					+ 'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + points[2][indexX] + ',' + (points[2][indexY]+barRadius) + ' '
					+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
					+ 'z';
					if (config.axis_rotated) {
						path = 'M ' + points[0][indexX] + ',' + points[0][indexY] + ' '
						+ 'L' + (points[1][indexX]-barRadius) + ',' + points[1][indexY] + ' '
						+ 'Q' + points[1][indexX] + ',' + points[1][indexY] + ' ' + points[1][indexX] + ',' + (points[1][indexY]+barRadius) + ' '
						+ 'L' + points[2][indexX] + ',' + (points[2][indexY]-barRadius) + ' '
						+ 'Q' + points[2][indexX] + ',' + points[2][indexY] + ' ' + (points[2][indexX]-barRadius) + ',' + points[2][indexY] + ' '
						+ 'L' + points[3][indexX] + ',' + points[3][indexY] + ' '
						+ 'z';
					}
				}
				return path;
			};
		};
		self.generateChart();
	},
	computed: mapState({
		pendingSelfMining: state => state.user.pendingSelfMining,
		pendingPublisherMining: state => state.user.pendingPublisherMining,
		pendingReferrals: state => state.user.pendingReferrals,
	}),
	methods: {
		generateChart() {
			const self = this;
			const rewards = [];
			if (self.pendingSelfMining > 0) {
				rewards.push(['Platform Mining', self.pendingSelfMining]);
			}
			if (self.pendingPublisherMining > 0) {
				rewards.push(['Publisher Mining', self.pendingPublisherMining]);
			}
			if (self.pendingReferrals > 0) {
				rewards.push(['Referral Rewards', self.pendingReferrals]);
			}

			if (rewards.length <= 2) {
				self.hasData = false;
				return;
			}
			self.$chart = c3.generate({
				bindto: document.getElementById('JSE-earningsChart'),
				transition: {
					duration: 0,
				},
				size: {
					height: 100,
				},
				padding: {
					top: 0,
					left: 10,
					right: 10,
				},
				data: {
					type: 'bar',
					//columns: [self.stats],
					columns: rewards,
					colors: {
						'Platform Mining': '#051b33',
						'Publisher Mining': '#185084',
						'Referral Rewards': '#538dca',
					},
				},
				grid: {
					y: {
						show: true,
					},
				},
				tooltip: {
					grouped: false,
					contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
						const tooltip = `<table class="c3-tooltip"><tbody><tr class="c3-tooltip-name--Publisher-Mining"><td class="name"><span style="border-radius:8px; background-color:${color(d[0].id)}"></span>${defaultTitleFormat(d)[0].name}</td><td class="value">${defaultTitleFormat(d)[0].value}</td></tr></tbody></table>`;
						return tooltip;
					},
				},
				axis: {
					rotated: true,
					x: {
						show: false,
					},
					y: {
						tick: {
							values: [1, 2, 4, 8, 16, 32, 64],
							//count: 10,
							//format: d3.format('.2f'),
						},
					},
				},
				bar: {
					width: {
						ratio: 0.7,
					},
					space: 0.2,
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
.hr {
	height:8px;
	border-radius: 8px;
}
#JSE-earningsChart {
	border-radius: 6px;
	margin:12px 12px 0px 12px;
}

.night #JSE-earningsChart {
	border:solid 1px #171820;
}

.light #JSE-earningsChart {
	border:solid 1px #eee;
}

#JSE-earningsChart .c3-legend-item line{
	stroke-linecap: round;
    stroke-width: 5px;
    shape-rendering: auto;
}
#JSE-earningsChart .c3-bars path {
    shape-rendering: auto;
}

#JSE-earningsChart .c3-tooltip {
	opacity: 1;
	box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.2);
	font-weight: bold;
}
 .night #JSE-earningsChart.c3 .c3-tooltip {
	border: solid 1px #000;
 }
.night #JSE-earningsChart.c3 .c3-tooltip td {
	background:transparent;
}
#JSE-earningsChart .c3-tooltip tr {
	border:0px;
}
.light #JSE-earningsChart .c3-tooltip td:first-child {
	border-right:solid 4px #fafafa;
}
.night #JSE-earningsChart .c3-tooltip td:first-child {
	border-right:solid 4px #101219;
}
#JSE-earningsChart .c3-tooltip td {
	border:0px;
}

.night #JSE-earningsChart.c3 .c3-axis-x path,
.night #JSE-earningsChart.c3 .c3-axis-x line,
.night #JSE-earningsChart.c3 .c3-axis-y path,
.night #JSE-earningsChart.c3 .c3-axis-y line {
    stroke: #606060;
}
.night #JSE-earningsChart.c3 .c3-axis-x g,
.night #JSE-earningsChart.c3 .c3-axis-y g,
.night #JSE-earningsChart.c3 .c3-legend-item,
.night #JSE-earningsChart.c3 .c3-legend-item-data text {
    fill: #afafaf;
}
.light #JSE-earningsChart.c3 .c3-axis-x path,
.light #JSE-earningsChart.c3 .c3-axis-x line,
.light #JSE-earningsChart.c3 .c3-axis-y path,
.light #JSE-earningsChart.c3 .c3-axis-y line {
    stroke: #afafaf;
}
.light #JSE-earningsChart.c3 .c3-axis-x g,
.light #JSE-earningsChart.c3 .c3-axis-y g,
.light #JSE-earningsChart.c3 .c3-legend-item,
.light #JSE-earningsChart.c3 .c3-legend-item-data text {
    fill: #606060;
}
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
.light #JSE-earningsChart.c3 .c3-event-rects,
.night #JSE-earningsChart.c3 .c3-event-rects {
	fill-opacity: 0 !important;
	background:red;
	fill:red;
}
</style>
