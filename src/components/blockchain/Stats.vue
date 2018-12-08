<template>
	<div>
		<div class="box enableSelection">
			<h3 class="title">
				JSE Statistics<br />
				<span class="sub">Updated {{timestamp}}</span>
			</h3>

			<div class="summaryPanel">
				<div><label>Users Registered</label><span>{{users}}</span></div>
				<div><label>Token Price</label><span>${{USDJSE}} USD</span></div>
				<div><label>Market Cap</label><span>${{marketCap}} USD</span></div>
				<div><label>Total Opt-Ins</label><span>{{totalOptIns}}</span></div>
				<div><label>JSEcoin Circulation</label><span>{{coins}}</span></div>
				<div><label>Publisher Websites</label><span>{{pubs}}</span></div>
				<div><label>Today Hits</label><span>{{hit}}</span></div>
				<div><label>Today Uniques</label><span>{{unique}}</span></div>
				<div><label>Today Opt-Ins</label><span>{{optin}}</span></div>
				<div><label>Web-Miners Online</label><span>{{publisherMinersCount}}</span></div>
				<div><label>Self-Miners Online</label><span>{{selfMinersCount}}</span></div>
				<div><label>Charity Account</label><span>{{charityAccount}}</span></div>
				<div><label>Distribution Acc.</label><span>{{distributionAccount}}</span></div>
				<div><label>Days Since Launch</label><span>{{days}} days ago</span></div>
			</div>
		</div>

		<!--<button class="activeButton" onclick="location.href='https://platform.jsecoin.com/'">Buy JSE Coins</button>-->
	</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Stats',
	data() {
		return {
			coins: 0,
			days: 0,
			pubs: 0,
			ts: 0,
			timestamp: 0,
			hit: 0,
			unique: 0,
			optin: 0,
			totalOptIns: 0,
			charityAccount: 0,
			distributionAccount: 0,
			publisherMinersCount: 0,
			selfMinersCount: 0,
			users: 0,
			USDJSE: 0,
			marketCap: 0,
			interval: {},
		};
	},
	//component loaded
	mounted() {
		const self = this;
		console.log('x', self);

		self.interval = setInterval(function(){
			this.timestamp = moment(this.ts).fromNow();
		}, 10000);
    window.socketClient.emit('getPublicStats', (oStatsJSON) => {
		//db.ref('publicStats').on('value', (stats) => {
		//window.socketClient.nodeQuery('getPublicStats', (oStatsJSON) => {
			//const oStats = stats.val();
			console.log('getPublicStats: '+oStatsJSON);
			const oStats = JSON.parse(oStatsJSON);
			this.coins = oStats.coins;
			this.days = oStats.days;
			this.hit = oStats.hit;
			this.pubs = oStats.pubs;
			this.ts = oStats.ts;
			this.timestamp = moment(oStats.ts).fromNow();
			let pubCount = 0;
			let selfCount = 0;
			$.each(oStats.clients, function(i, val){
				if (val.publisherMinersCount) pubCount += val.publisherMinersCount;
				if (val.selfMinersCount) selfCount += val.selfMinersCount;
			});
			this.publisherMinersCount = pubCount;
			this.selfMinersCount = selfCount;
			this.unique = oStats.unique;
			this.optin = oStats.optin;
			this.totalOptIns = oStats.totalOptIns;
			this.charityAccount = oStats.charityAccount + ' JSE';
			this.distributionAccount = oStats.distributionAccount + ' JSE';
			this.users = oStats.users;
			this.USDJSE = oStats.exchangeRates.USDJSE;
			this.marketCap = oStats.marketCap;
		});
	},
	//before component is destroyed cleanup
	beforeDestroy() {
		console.log('destroy');
		clearInterval(self.interval);
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.summaryPanel label {
	width:180px;
}
</style>
