<template>
	<AppWrapperWidget>
		<NavWidget activeNav="transactionInfo"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<ContentWidget
				style="width:auto"
				:titleTxt="`${transaction.command} Transaction`"
				:infoPanelTxt="`Block ${$route.params.blockVal}`">
				<div class="flexbox">
					<div class="flexWrap">
						<div class="box">
							<div class="summaryPanel" v-if="(transaction.command === 'mining')">
								<div><label>Type</label><span>{{ transaction.command }}</span></div>
								<div><label>User</label><span>{{ transaction.user1 }}</span></div>
								<div><label>Mined</label><span>{{ transaction.value }}</span></div>
							</div>

							<div class="summaryPanel" v-if="(transaction.command === 'export')">
								<div><label>Type</label><span>{{ transaction.command }}</span></div>
								<div><label>Public Key</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.coinCodePublicKey"></i> {{ transaction.coinCodePublicKey }}</span></div>
								<!--<div><label>Data</label><span>{{ transaction.data }}</span></div>-->
								<div><label>Host</label><span>{{ transaction.host }}</span></div>
								<div><label>Received</label><span>{{ transaction.receivedTimestamp }}</span></div>
								<div><label>Exported</label><span>{{ transaction.timestamp }}</span></div>
								<div><label>Signature</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.signature"></i> {{ transaction.signature }}</span></div>
								<div><label>Exported By</label><span>{{ transaction.user1 }}</span></div>
								<div><label>JSE</label><span>{{ transaction.value }}</span></div>
							</div>

							<div class="summaryPanel" v-if="(transaction.command === 'import')">
								<div><label>Type</label><span>{{ transaction.command }}</span></div>
								<div><label>Coin Code</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.coinCode"></i> {{ transaction.coinCode }}</span></div>
								<div><label>Public Key</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.publicKey"></i> {{ transaction.publicKey }}</span></div>
								<div><label>Imported</label><span>{{ transaction.timestamp }}</span></div>
								<div><label>Imported By</label><span>{{ transaction.user1 }}</span></div>
								<div><label>JSE</label><span>{{ transaction.value }}</span></div>
							</div>

							<div class="summaryPanel" v-if="(transaction.command === 'transfer')">
								<div><label>Type</label><span>{{ transaction.command }}</span></div>
								<!--<div><label>Data</label><span>{{ transaction.data }}</span></div>-->
								<div><label>Hash</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.hash" v-clipboard:success="handleCopyStatus(true)" v-clipboard:error="handleCopyStatus(false)"></i> {{ transaction.hash }}</span></div>
								<div><label>Host</label><span>{{ transaction.host }}</span></div>
								<div><label>Public Key</label><span class="enableSelection"><i class="fa fa-copy icon-copy" v-clipboard:copy="transaction.publicKey"></i> <span>{{ transaction.publicKey }}</span></span></div>
								<div><label>Received</label><span>{{ transaction.receivedTimestamp }}</span></div>
								<div><label>Transfer</label><span>{{ transaction.timestamp }}</span></div>
								<div><label>From</label><span>{{ transaction.user1 }}</span></div>
								<div><label>To</label><span>{{ transaction.user2 }}</span></div>
								<div><label>Value</label><span>{{ transaction.value }} JSE</span></div>
							</div>

							<div v-if="(transaction.command === 'summary')">
								<div class="summaryPanel">
									<div><label>Type</label><span>{{ transaction.command }}</span></div>
									<div><label>Processed</label><span>{{ transaction.timestamp }}</span></div>
								</div>

								<ul class="pageData">
									<li v-on:click="prev()" v-if="prevExists()"><i class="fa fa-angle-left icon-chevron-left" /></li>
									<li v-else>.</li>

									<li>{{page*pageBy}}-{{(page*pageBy)+pageBy}} of <span>{{transaction.data.length-1}}</span></li>

									<li v-on:click="next()" v-if="nextExists()"><i class="fa fa-angle-right icon-chevron-right" /></li>
									<li v-else>.</li>
								</ul>

								<tree-view :data="transaction.dataPaged[page]" :options="{maxDepth: 1, rootObjectKey:'data'}"></tree-view>

								<ul class="pageData">
									<li v-on:click="prev()" v-if="prevExists()"><i class="fa fa-angle-left icon-chevron-left" /></li>
									<li v-else>.</li>

									<li>{{page*pageBy}}-{{(page*pageBy)+pageBy}} of <span>{{transaction.data.length-1}}</span></li>

									<li v-on:click="next()" v-if="nextExists()"><i class="fa fa-angle-right icon-chevron-right" /></li>
									<li v-else>.</li>
								</ul>
							</div>

							<!--<div class="summaryPanel">
								<div :key="key" v-for="(value, key) in transaction"><label>{{key}}</label><span>{{ value }}</span></div>
							</div>-->
						</div>
					</div>
				</div>
			</ContentWidget>
			<ContentWidget
				v-if="((transaction.data) && (transaction.command !== 'summary'))"
				style="width:auto"
				:titleTxt="`Data`">
				<div class="flexWrap">
					<div class="box">
						<tree-view :data="transaction" :options="{maxDepth: 0, rootObjectKey:'data'}"></tree-view>
					</div>
				</div>
			</ContentWidget>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import moment from 'moment';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';

export default {
  name: 'Transaction-Page',
	components: {
		AppWrapperWidget,
		ContentWidget,
		NavWidget,
		ScrollWidget,
	},
	//data
	data() {
		return {
			page: 0,
			pageBy: 20,
			transaction: false,
		};
	},
	filters: {
		json(value) {
			return JSON.stringify(value, null, 2);
		},
	},
	//component loaded
	mounted() {
		const self = this;
		console.log(this);
		console.log('Transaction Key: blockChain/'+this.$route.params.blockLvl+'/'+this.$route.params.blockVal+'/input/'+this.$route.params.key);

		//window.socketClient.emit('getChainData', 'blockChain/'+this.$route.params.blockLvl+'/'+this.$route.params.blockVal+'/input/'+this.$route.params.key, (oTransactionRaw) => {
		//window.socketClient.getChainData('blockChain/'+this.$route.params.blockLvl+'/'+this.$route.params.blockVal+'/input/'+this.$route.params.key, (oTransactionRaw) => {
		//db.ref('blockChain/'+this.$route.params.blockLvl+'/'+this.$route.params.blockVal+'/input/'+this.$route.params.key).once('value', (transaction) => {
		//console.log(transaction.val());
		//const oTransaction = transaction.val();
		window.socketClient.getChainData('blockChain/'+this.$route.params.blockLvl+'/'+this.$route.params.blockVal+'/input/'+this.$route.params.key, (oTransactionRaw) => {
			const oTransaction = oTransactionRaw;
			if (typeof (oTransaction.ts) !== 'undefined') {
				oTransaction.timestamp = moment(oTransaction.ts).format('MMMM Do YYYY, h:mm:ss a');
			}
			if (typeof (oTransaction.received) !== 'undefined') {
				oTransaction.receivedTimestamp = moment(oTransaction.received).format('MMMM Do YYYY, h:mm:ss a');
			}
			if ((oTransaction.command !== 'mining')) {
				if ((typeof (oTransaction.data) !== 'undefined') && (oTransaction.command !== 'summary')) {
					oTransaction.data = JSON.parse(oTransaction.data);
				} else {
					//chunk arrays as displaying and formatting all data crushes the browser
					const clone = oTransaction.data.slice(0);
					oTransaction.dataPaged = this.chunkArray(clone, self.pageBy);
				}
			}
			this.transaction = oTransaction;
		});
	},
	//before component is destroyed cleanup
	beforeDestroy() {
		console.log('destroy');
		const self = this;
	},

	methods: {
		handleCopyStatus(status) {
			this.copySucceeded = status;
			console.log(status);
		},
		onCopy(e) {
			console.log('You just copied: ' + e.text);
		},
		onError(e) {
			console.log('Failed to copy texts');
		},
		doCopy() {
			this.$copyText(this.message).then(function (e) {
				//alert('Copied');
				console.log(e);
			}, function (e) {
				//alert('Can not copy');
				console.log(e);
			});
		},
		chunkArray(myArray, chunkSize){
			const self = this;
			const results = [];
			let iPos = 0;
			const iPage = self.pageBy;
			while (myArray.length) {
				const iStartPos = iPos * iPage;
				const newArr = [];
				newArr.length = iStartPos;
				const aCollapsed = newArr.concat(myArray.splice(0, chunkSize));
				const oCollapsed = Object.assign({}, aCollapsed);
				results.push(oCollapsed);
				iPos += 1;
			}

			return results;
		},
		next() {
			const self = this;
			self.page += 1;
		},
		prev() {
			const self = this;
			self.page -= 1;
		},
		prevExists() {
			return (this.page > 0);
		},
		nextExists() {
			return (this.page*this.pageBy < this.transaction.data.length-this.pageBy);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fa-copy {
	display: inline-block;
	cursor: pointer;
}

.enableSelection {
	display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.title {
	text-transform:capitalize;
}

.pageData {
	background:#005ba7;
	border-radius: 6px;
	margin:0px 20px;
	padding:0px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: stretch;
	align-content: stretch;
	justify-content:space-between;
	color:#fff;
}
.pageData li {
	list-style: none;
    display: block;
    padding: 12px 16px;
    border-radius: 6px;
}

.pageData li i {
	padding:4px 8px;
	border-radius: 3px;
}

.fa-angle-right,
.fa-angle-left {
    cursor: pointer !important;
    color: #8ca8d7;
}

.fa-angle-right:hover,
.fa-angle-left:hover {
	background: #1a6bb0;
    color: #fff;
}
</style>
