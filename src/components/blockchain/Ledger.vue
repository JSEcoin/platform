<template>
	<div>
		<div class="box enableSelection">
			<h3 class="title">
				JSE Ledger<br />
			</h3>
			<div class="summaryPanel" v-html="ledgerHTML">
			  {{ledgerHTML}}
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Ledger',
	data() {
		return {
			ledger: {},
			ledgerHTML: '',
		};
	},
	//component loaded
	mounted() {
		const self = this;
		window.socketClient.emit('getLedger', (ledger) => {
			console.log(ledger);
			const richList = Object.keys(ledger).sort(function(a,b){ return ledger[a]-ledger[b]; });
			richList.reverse();
			let rawLedgerHTML = '<div><label>POSITION</label><label>USER ID</label><span>BALANCE</span></div>';
			let position = 1;
			richList.forEach(function(uid){ rawLedgerHTML += `<div><label>${position}</label><label>${uid}</label><span>${ledger[uid]}</span></div>`; position +=1; });
			this.ledgerHTML = rawLedgerHTML;
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
