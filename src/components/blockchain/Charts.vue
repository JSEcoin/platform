<template>
	<div class="flexbox">
		<!--
		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Circulating Supply
				</h3>

				<div class="chartWrapper"><canvas id="myChart1" width="340" height="200"></canvas></div>
			</div>
		</div>
		-->
		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Token Price USD
				</h3>

				<div class="chartWrapper"><canvas id="myChart1" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Daily Impressions
				</h3>

				<div class="chartWrapper"><canvas id="myChart2" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Registered Sites
				</h3>

				<div class="chartWrapper"><canvas id="myChart3" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Daily Uniques
				</h3>
				<div class="chartWrapper"><canvas id="myChart4" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Daily Opt-Ins
				</h3>
				<div class="chartWrapper"><canvas id="myChart6" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Registered Users
				</h3>

				<div class="chartWrapper"><canvas id="myChart5" width="340" height="200"></canvas></div>
			</div>
		</div>

		<div class="flexWrap">
			<div class="box">
				<h3 class="title">
					Opt-In Miner Network
				</h3>

				<div class="chartWrapper"><canvas id="myChart7" width="340" height="200"></canvas></div>
			</div>
		</div>
	</div>
</template>

<script>
import Chart from 'chart.js';
import moment from 'moment';

export default {
	name: 'Charts',
	//DB container
	firebase: {},
	//data
	data() {
		return {
			label: [],
			USDJSE: [],
			coins: [],
			hit: [],
			pubs: [],
			unique: [],
			optin: [],
			users: [],
			totalOptIns: [],
			windowWidth: document.documentElement.clientWidth,
			resizeTimer: false,
		};
	},
	//component loaded
	mounted() {
		const self = this;
		//console.log(this);

		//db.ref('dailyPublicStats').limitToLast(14).once('value', (dailyStats) => {
		//console.log('stats',dailyStats.val());
		window.socketClient.emit('getDailyStats', (dailyStatsJSON) => {
		//window.socketClient.nodeQuery('getDailyStats', (dailyStatsJSON) => {
			//console.log('getDailyStats: '+dailyStatsJSON);
			const dailyStats = JSON.parse(dailyStatsJSON);
			//dailyStats.forEach((oStat) => {
			const tsNow = new Date().getTime();
			const coupleOfWeeksAgo = tsNow - 1209600000; // 14 days
			$.each(dailyStats, (dsKey, oStat) => {
			//for (let [dsKey] of Object.entries(dailyStats)) {
			//for (var dsKey in dailyStats) {
				//const oStat = stat.val();
				//console.log(stat.key, stat.val());
				//let oStat = dailyStats[dsKey];
				if (oStat.ts > coupleOfWeeksAgo) {
					this.label.push(moment((oStat.ts-43200000)).format('Do'));
					this.coins.push(parseFloat(oStat.coins));
					if (oStat.exchangeRates) {
						this.USDJSE.push(oStat.exchangeRates.USDJSE);
					} else {
						this.USDJSE.push(0);
					}
					this.hit.push(oStat.hit);
					this.pubs.push(oStat.pubs);
					this.unique.push(oStat.unique);
					this.optin.push(oStat.optin);
					this.users.push(oStat.users);
					this.totalOptIns.push(oStat.totalOptIns);
				}
			});
			/*
			console.log(self.label);
			console.log(self.coins);
			console.log(self.hit);
			console.log(self.pubs);
			console.log(self.unique);
			console.log(self.optin);
			console.log(self.users);
			console.log(self.totalOptIns);
			*/
			//generate charts
			self.drawCharts();

			//on window resize refresh charts
			window.addEventListener('resize', this.getWindowWidth);
		});
/*
		const myChart2 = new Chart('myChart2', {
		type: 'line',
		data: {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [{
		label: 'Active Users Mining',
		data: [20, 23, 40, 81, 146, 230, 444],
		fill: true,
		backgroundColor: 'rgba(146,202,155,0.3)',
		borderColor: 'rgb(146,202,155)',
		pointBackgroundColor: '#fff',
		lineTension: 0,
		pointRadius: 4,
		pointHoverRadius: 4,
		borderWidth: 2,
		}],
		},
		options: {
		responsive: true,
		title: {
		display: false,
		},
		tooltips: {
		position: 'nearest',
		mode: 'index',
		intersect: false,
		},
		},
		});

		const myChart3 = new Chart('myChart3', {
		type: 'line',
		data: {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [{
		label: 'Registered Sites',
		data: [10, 30, 50, 181, 256, 455, 540],
		fill: true,
		backgroundColor: 'rgba(221,160,160,0.3)',
		borderColor: 'rgb(221,160,160)',
		pointBackgroundColor: '#fff',
		lineTension: 0,
		pointRadius: 4,
		pointHoverRadius: 4,
		borderWidth: 2,
		}],
		},
		options: {
		responsive: true,
		title: {
		display: false,
		},
		tooltips: {
		position: 'nearest',
		mode: 'index',
		intersect: false,
		},
		},
		});
*/
		//console.log(myChart1, myChart2, myChart3);
	},
	//before component is destroyed cleanup
	beforeDestroy() {
		const self = this;
		window.removeEventListener('resize', self.getWindowWidth);
	},
	//methods
	methods: {
		getWindowWidth(event) {
			const self = this;
			//self.windowWidth = document.documentElement.clientWidth;
			const iWindowWidthNow = document.documentElement.clientWidth;
			if (self.windowWidth !== iWindowWidthNow) {
				$('canvas').hide();
				clearTimeout(self.resizeTimer);
				self.resizeTimer = setTimeout(function() {
					self.myChart1.destroy();
					self.myChart2.destroy();
					self.myChart3.destroy();
					self.myChart4.destroy();
					self.myChart5.destroy();
					self.myChart6.destroy();
					self.myChart7.destroy();
					self.windowWidth = document.documentElement.clientWidth;

					setTimeout(self.drawCharts,300);
				}, 250);
			}
		},

		drawCharts() {
			const self = this;
			$('canvas').show();

			self.myChart1 = new Chart('myChart1', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Exchange Rate',
						//data: self.coins,
						data: self.USDJSE,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'USD',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});

			self.myChart2 = new Chart('myChart2', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Miners',
						data: self.hit,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'miners',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});

			self.myChart3 = new Chart('myChart3', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Sites Published',
						data: self.pubs,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'sites',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});

			self.myChart4 = new Chart('myChart4', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Unique Miners',
						data: self.unique,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'miners',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});


			self.myChart4 = new Chart('myChart6', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Daily Opt-Ins',
						data: self.optin,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'optins',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});


			self.myChart5 = new Chart('myChart5', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Users Registered',
						data: self.users,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'users',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});

			self.myChart7 = new Chart('myChart7', {
				type: 'line',
				data: {
					labels: self.label,
					datasets: [{
						label: 'Total Opt-In Miners',
						data: self.totalOptIns,
						fill: true,
						backgroundColor: 'rgba(142,192,201,0.3)',
						borderColor: 'rgb(142,192,201)',
						pointBackgroundColor: '#fff',
						lineTension: 0,
						pointRadius: 4,
						pointHoverRadius: 4,
						borderWidth: 2,
					}],
				},
				options: {
					responsive: true,
					scales: {
						yAxes: [{
							gridLines: {
								borderDash: [8, 4],
								color: '#ece6e6',
							},
							scaleLabel: {
								display: true,
								labelString: 'Individual Opt-In Miners',
							},
						}],
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: moment().format('MMMM'),
								autoSkip: false,
								maxRotation: 90,
								minRotation: 90,
							},
						}],
					},
					title: {
						display: false,
					},
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
					},
				},
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chartWrapper {
	margin-right:20px;
}
</style>
