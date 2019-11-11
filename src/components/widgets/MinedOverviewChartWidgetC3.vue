<template>
	<div v-if="hasData">
		<div class="hr"><hr /></div>

		<OptionsListWrapperWidget titleTxt="Mined History">
			<div id="JSE-minedOverview"></div>
		</OptionsListWrapperWidget>
	</div>
</template>

<script>
import c3 from 'c3';
import moment from 'moment';
import { mapState } from 'vuex';

import OptionsListWrapperWidget from '@/components/widgets/OptionsListWrapperWidget.vue';

export default {
	name: 'MinedOverview',
	props: {
		handler: {
			type: Object,
		},
	},
	components: {
		OptionsListWrapperWidget,
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
			/*if (this.isFunction(config.data_order)) {
				return false;
			}*/
			return config.data_order && config.data_order.toLowerCase() === 'desc';
		};

		c3.chart.internal.fn.isOrderAsc = function () {
			const config = this.config;
			/*if (this.isFunction(config.data_order)) {
				return false;
			}*/
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
		rewards: state => state.user.rewards,
	}),
	methods: {
		generateChart() {
			const self = this;
			const xAxis = ['x'];
			const platformMined = ['Platform Mined'];
			const publisherMined = ['Publisher Mined'];
			const referralRewards = ['Referral Rewards'];
			const rewardList = Object.entries(self.rewards);
			if (rewardList.length <=0) {
				self.hasData = false;
				return;
			}
			let showPlatformMined = false;
			let showPublisherMined = false;
			let showReferralReward = false;
			rewardList.forEach((mined) => {
				const date = mined[0];
				xAxis.push(mined[0].replace(/(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3'));

				const platformMinedVal = (typeof (mined[1].s) !== 'undefined') ? mined[1].s : '0';
				const publisherMinedVal = (typeof (mined[1].p) !== 'undefined') ? mined[1].p : '0';
				const referralRewardVal = (typeof (mined[1].r) !== 'undefined') ? mined[1].r : '0';

				platformMined.push(platformMinedVal);
				publisherMined.push(publisherMinedVal);
				referralRewards.push(referralRewardVal);
				if (Number(platformMinedVal) > 0) {
					showPlatformMined = true;
				}
				if (Number(publisherMinedVal) > 0) {
					showPublisherMined = true;
				}
				if (Number(referralRewardVal) > 0) {
					showReferralReward = true;
				}
			});

			if ((!showPlatformMined) && (!showPublisherMined) && (!showReferralReward)) {
				self.hasData = false;
				return;
			}

			const barchartData = [];
			barchartData.push(xAxis);

			if (showPlatformMined) {
				barchartData.push(platformMined);
			}
			if (showPublisherMined) {
				barchartData.push(publisherMined);
			}
			if (showReferralReward) {
				barchartData.push(referralRewards);
			}
			self.$chart = c3.generate({
				bindto: document.getElementById('JSE-minedOverview'),
				transition: {
					duration: 0,
				},
				padding: {
					top: 10,
					left: 30,
					right: 10,
					bottom: 0,
				},
				size: {
					height: 150,
				},
				data: {
					x: 'x',
					type: 'bar',
			//        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
					columns: barchartData,
				},
				zoom: {
					enabled: true,
					type: 'drag',
					//rescale: true,
				},
				grid: {
					y: {
						show: true,
					},
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%m-%d',
							//fit: false,
							//rotate: 90,
						},
					},
				},
				tooltip: {
					grouped: false,
					contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
						//console.log(d[0]);
						const tooltip = `<table class="c3-tooltip"><tbody><tr><th colspan="2">${moment(d[0].x).format('MMM Do YY')}</th></tr><tr class="c3-tooltip-name--Publisher-Mining"><td class="name"><span style="border-radius:8px; background-color:${color(d[0].id)}"></span>${d[0].name}</td><td class="value">${d[0].value}</td></tr></tbody></table>`;
						return tooltip;
					},
				},/*
				bar: {
					width: {
						ratio: 0.7,
					},
					//space: 0.2,
				},*/
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
/*
#JSE-minedOverview {
	border-radius: 6px;
	margin:12px 12px 0px 12px;
}

.night #JSE-minedOverview {
	border:solid 1px #171820;
}

.light #JSE-minedOverview {
	border:solid 1px #eee;
}
*/
#JSE-minedOverview .c3-legend-item line{
	stroke-linecap: round;
    stroke-width: 5px;
    shape-rendering: auto;
}
#JSE-minedOverview .c3-bars path {
    shape-rendering: auto;
}

#JSE-minedOverview .c3-tooltip {
	opacity: 1;
	box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.2);
	font-weight: bold;
}
 .night #JSE-minedOverview.c3 .c3-tooltip {
	border: solid 1px #000;
 }
.night #JSE-minedOverview.c3 .c3-tooltip td {
	background:transparent;
}
#JSE-minedOverview .c3-tooltip tr {
	border:0px;
}
.light #JSE-minedOverview .c3-tooltip td:first-child {
	border-right:solid 4px #fafafa;
}
.night #JSE-minedOverview .c3-tooltip td:first-child {
	border-right:solid 4px #101219;
}
#JSE-minedOverview .c3-tooltip td {
	border:0px;
}
.light #JSE-minedOverview .c3-tooltip th {
	border-bottom: solid 4px #fafafa;
}
.night #JSE-minedOverview .c3-tooltip th {
	background: #101219;
}
</style>
