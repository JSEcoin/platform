<template>
	<AppWrapperWidget>
		<NavWidget activeNav="activeBlock"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<div id="FB-activeBlockSection" class="connected box">
				<h3 class="title highLight">
					<ul id="JSE-blockNav">
						<router-link class="previous" v-bind:to="`/blockchain/Block/${prevBlock}`" v-if="prevExists" tag="li">
							<i class="fa fa-angle-left icon-chevron-left" />
						</router-link>
						<li v-else>.</li>

						<li class="enableSelection">Block #{{ $route.params.id }}</li>

						<router-link class="next" v-bind:to="`/blockchain/Block/${nextBlock}`" v-if="nextExists" tag="li">
							<i class="fa fa-angle-right icon-chevron-right" />
						</router-link>
						<li v-else>.</li>
					</ul>
				</h3>
				<h4 v-if="exists" class="title subLight">
					<div v-if="blockInfo.hash === ''">
						Generating...
					</div>
					<div class="enableSelection" v-else>
						{{blockInfo.hash}}
					</div>
				</h4>
				<h4 v-else class="title subLight">
					Block not found..
				</h4>
			</div>

			<ContentWidget
				style="width:auto"
				:titleTxt="`Summary`">
				<div class="flexbox">
					<div class="flexWrap">
						<div class="box" v-if="exists">
							<div class="summaryPanel">
								<div><label>Height</label><span>{{ $route.params.id }}</span></div>
								<div><label>Difficulty</label><span>{{ blockInfo.difficulty }}</span></div>
								<div><label>Main Chain</label><span>{{ blockInfo.mainChain }}</span></div>
								<div><label>Prev. Hash</label><span>{{ blockInfo.previousHash }}</span></div>
								<div><label>Pre-Hash</label><span>{{ blockInfo.preHash }}</span></div>
								<div><label>Hash</label><span>{{ blockInfo.hash }}</span></div>
								<div><label>Nonce</label><span>{{ blockInfo.nonce }}</span></div>
								<div><label>Frequency</label><span>{{ blockInfo.frequency }}</span></div>
								<div><label>Block Time</label><span>{{ blockInfo.blockTime }}</span></div>
								<div><label>Timestamp</label><span>{{ blockInfo.timestamp }}</span></div>
								<div><label>Transactions</label><span>{{ blockInfo.transactionLength }}</span></div>
								<div><label>Server</label><span></span>{{ blockInfo.server }}</div>
								<div><label>Version</label><span></span>{{ blockInfo.version }}</div>
								<div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ContentWidget>
			<ContentWidget
				style="width:auto"
				:titleTxt="`Raw Block Data (JSON)`">
				<ButtonWidget style="margin:10px 0px; width:100%;" :buttonTxt="(jsonDisplay)?'Hide Data':'Show Data'" v-on:click.native="toggleJsonDisplay"/>

				<div id="JSEA-rawDataDisplay" :class="{'show':jsonDisplay}">
					<tree-view :data="blockInfo" :options="{maxDepth: 1, rootObjectKey:'blockInfo'}"></tree-view>
				</div>
			</ContentWidget>
			<ContentWidget
				style="width:auto"
				:titleTxt="`Transactions ${filterTransaction}`">
				<div class="flexbox">
					<div class="flexWrap">

						<ul id="JSE-mainTabs" class="tabset filterTabs" v-if="exists">
							<li v-on:click="filterTabs('all')" :class="{ active:isActive('all') }">Summary</li>
							<li v-if="transactions.minedTotal > 0" v-on:click="filterTabs('mining')" :class="{ active:isActive('mining') }">Mined [{{transactions.minedTotal}}]</li>
							<li v-if="transactions.exportedTotal > 0" v-on:click="filterTabs('export')" :class="{ active:isActive('export') }">Exported [{{transactions.exportedTotal}}]</li>
							<li v-if="transactions.importedTotal > 0" v-on:click="filterTabs('import')" :class="{ active:isActive('import') }">Imported [{{transactions.importedTotal}}]</li>
							<li v-if="transactions.transferTotal > 0" v-on:click="filterTabs('transfer')" :class="{ active:isActive('transfer') }">Transfer [{{transactions.transferTotal}}]</li>
						</ul>

						<div class="connected box" v-if="exists">
							<div class="dataset">
								<div class="infoPanel" v-if="transactions[filterTransaction].length === 0">
									No transaction data found.
								</div>
								<div v-else>
									<table class="hasConnectedFilter" v-if="(filterTransaction === 'all')">
									<thead>
										<tr>
											<th>Type</th>
											<th>Age</th>
											<th>From</th>
											<th>To</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(transaction, index) in transactions[filterTransaction]" :key="index" v-bind:to="`/blockchain/Transaction/${transaction.latestBlockLvl}/${transaction.latestBlockVal}/${transaction.key}`" tag="tr">
											<td>{{transaction.command}}</td>
											<td>{{transaction.timestamp}}</td>
											<td v-if="transaction.command === 'mining'">{{transaction.user2}}</td>
											<td v-else-if="transaction.command === 'import'"></td>
											<td v-else>{{transaction.user1}}</td>
											<td v-if="transaction.command === 'mining' || transaction.command === 'import'">{{transaction.user1}}</td>
											<td v-else>{{transaction.user2}}</td>
											<td>{{transaction.value}}</td>
										</router-link>
									</tbody>
									</table>
									<table class="hasConnectedFilter" v-if="(filterTransaction === 'mining')">
									<thead>
										<tr>
											<th>To</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(transaction, index) in transactions[filterTransaction]" :key="index" v-bind:to="`/blockchain/Transaction/${transaction.latestBlockLvl}/${transaction.latestBlockVal}/${transaction.key}`" tag="tr">
											<td>{{transaction.user1}}</td>
											<td>{{transaction.value}}</td>
										</router-link>
									</tbody>
									</table>
									<table class="hasConnectedFilter" v-if="(filterTransaction === 'transfer')">
									<thead>
										<tr>
											<th>Age</th>
											<th>From</th>
											<th>To</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(transaction, index) in transactions[filterTransaction]" :key="index" v-bind:to="`/blockchain/Transaction/${transaction.latestBlockLvl}/${transaction.latestBlockVal}/${transaction.key}`" tag="tr">
											<td>{{transaction.timestamp}}</td>
											<td>{{transaction.user1}}</td>
											<td>{{transaction.user2}}</td>
											<td>{{transaction.value}}</td>
										</router-link>
									</tbody>
									</table>
									<table class="hasConnectedFilter" v-if="(filterTransaction === 'export')">
									<thead>
										<tr>
											<th>Age</th>
											<th>From</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(transaction, index) in transactions[filterTransaction]" :key="index" v-bind:to="`/blockchain/Transaction/${transaction.latestBlockLvl}/${transaction.latestBlockVal}/${transaction.key}`" tag="tr">
											<td>{{transaction.timestamp}}</td>
											<td>{{transaction.user1}}</td>
											<td>{{transaction.value}}</td>
										</router-link>
									</tbody>
									</table>
									<table class="hasConnectedFilter" v-if="(filterTransaction === 'import')">
									<thead>
										<tr>
											<th>Age</th>
											<th>To</th>
											<th>Value</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(transaction, index) in transactions[filterTransaction]" :key="index" v-bind:to="`/blockchain/Transaction/${transaction.latestBlockLvl}/${transaction.latestBlockVal}/${transaction.key}`" tag="tr">
											<td>{{transaction.timestamp}}</td>
											<td>{{transaction.user1}}</td>
											<td>{{transaction.value}}</td>
										</router-link>
									</tbody>
									</table>
								</div>
							</div>
						</div>
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
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';


export default {
	name: 'Block-Page',
	components: {
		AppWrapperWidget,
		ContentWidget,
		NavWidget,
		ScrollWidget,
		ButtonWidget,
	},
	data() {
		return {
			jsonDisplay: false,
			blockInfo: {},
			prevBlock: parseFloat(this.$route.params.id)-1,
			nextBlock: parseFloat(this.$route.params.id)+1,
			exists: true,
			nextExists: false,
			prevExists: false,
			filterTransaction: 'all',
			blockID: [],
			blocks: [],
			transactions: {
				minedTotal: 0,
				transferTotal: 0,
				importedTotal: 0,
				exportedTotal: 0,
				all: [],
				mining: [],
				transfer: [],
				import: [],
				export: [],
			},
			interval: [],
		};
	},
	mounted() {
		//if (parseFloat(this.$route.params.id) < 1000) {
		//	this.exists = false;
		//	console.log('Block Starts at 1000');
		//} else {
			this.requestBlock(this.$route.params.id);
		//}
	},
	//before component is destroyed cleanup
	beforeDestroy() {
		console.log('destroy');
		//unbind db socket connection
		//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal).off();
	},

	watch: {
		//update data params based on route id
		$route(to, from) {
			let vPosition = 'new';

			//if (parseFloat(this.$route.params.id) < 1000) {
			//	this.exists = false;
			//	console.log('Block Starts at 1000');
			//	return;
			//}
			if (to.params.id !== from.params.id) {
				this.prevBlock = parseFloat(to.params.id)-1;
				this.nextBlock = parseFloat(to.params.id)+1;
			}
			console.log(to.params.id, from.params.id);
			if (parseFloat(to.params.id) > parseFloat(from.params.id)) {
				vPosition = 'next';
			}
			if (parseFloat(to.params.id) < parseFloat(from.params.id)) {
				vPosition = 'previous';
			}

			this.requestBlock(to.params.id, vPosition);
			//if (parseFloat(this.$route.params.id) < 1000) {
			//	this.exists = false;
			//	console.log('Block Starts at 1000');
			//}
		},
	},

	//methods
	methods: {
		requestBlock(blockID, pos) {
			const self = this;
			//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal).off();
			self.latestBlockLvl = window.socketClient.getBlockRef(blockID);
			self.latestBlockVal = blockID;

			//window.socketClient.emit('getChainData', 'blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal, (blockObj) => {
			//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal).on('value', (block) => {

			window.socketClient.getChainData('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal, (blockObj) => {
				const oBlock = blockObj;
				console.log(oBlock);
				console.log(pos);


				//if (blockID >= 999) {
				//	console.log('gt 999 next true');
					this.nextExists = true;
				//}
				//if (blockID > 1000) {
				//	console.log('gt 1000 prevExists true');
					this.prevExists = true;
				//}

				if (pos === 'next') {
					console.log('next',(oBlock !== null));
					this.nextExists = (oBlock !== null);
				}
				if (pos === 'previous') {
					console.log('prev', (oBlock !== null));
					this.prevExists = (oBlock !== null);
				}

				//f (blockID < 999) {
				//	console.log('lt 9999 next false');
				//	this.nextExists = false;
				//}

				//if (blockID <= 1000) {
				//	console.log('lte 1000 prev false');
				//	this.prevExists = false;
				//}

				this.exists = (oBlock !== null);

				self.transactions = {
					minedTotal: 0,
					transferTotal: 0,
					importedTotal: 0,
					exportedTotal: 0,
					all: [],
					mining: [],
					transfer: [],
					import: [],
					export: [],
				};

				if (oBlock === null) {
					return;
				}
				this.blockInfo = oBlock;

				oBlock.blockTime = moment(oBlock.startTime).fromNow();
				oBlock.timestamp = oBlock.startTime;

				if (typeof (oBlock.input) === 'undefined') {
					this.blockInfo.transactionLength = 0;
					return;
				}

				this.transactionLength();

				const oTransactions = oBlock.input;
				$.each(oTransactions, function(i, val){
					oTransactions[i].latestBlockLvl = self.latestBlockLvl;
					oTransactions[i].latestBlockVal = self.latestBlockVal;
					oTransactions[i].key = i;

					self.transactions.all.push(oTransactions[i]);

					if (oTransactions[i].command === 'summary') {
						console.log('[Transaction summary]', oTransactions[i]);

						oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
					}
					if (oTransactions[i].command === 'mining') {
						//console.log('[Transaction mining]', oTransactions);
						self.transactions.minedTotal += 1;
						self.transactions.mining.push(oTransactions[i]);
					}
					if (oTransactions[i].command === 'export') {
						console.log('[Transaction export]', oTransactions[i]);
						self.transactions.exportedTotal += 1;
						oTransactions[i].timestamp = (oTransactions[i].ts)?moment(oTransactions[i].ts).fromNow():'N/A'; //JSEcoin Controller v1.504 export didn't support ts
						self.transactions.export.push(oTransactions[i]);
					}
					if (oTransactions[i].command === 'import') {
						console.log('[Transaction import]', oTransactions[i]);
						self.transactions.importedTotal += 1;
						oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
						self.transactions.import.push(oTransactions[i]);
					}
					if (oTransactions[i].command === 'transfer') {
						console.log('[Transaction transfer]', oTransactions[i]);
						self.transactions.transferTotal += 1;
						oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
						self.transactions.transfer.push(oTransactions[i]);
					}
				});
			});
		},
		transactionLength() {
			if (typeof (this.blockInfo.input) !== 'undefined') {
				this.blockInfo.transactionLength = Object.keys(this.blockInfo.input).length;
			}
		},
		//update transaction display
		filterTabs(filter) {
			this.filterTransaction = filter;
			this.activeItem = filter;
		},
		//update active filter class
		isActive(menuItem) {
			return this.filterTransaction === menuItem;
		},
		toggleJsonDisplay() {
			const self = this;
			self.jsonDisplay = !self.jsonDisplay;
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#JSE-blockNav {
	margin:0px;
	padding:0px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: stretch;
	align-content: stretch;
	justify-content:space-between;
}
#JSE-blockNav li {
	list-style:none;
	display: block;
	padding:12px 16px;
	border-radius: 6px;
}

#JSE-blockNav li.next *,
#JSE-blockNav li.previous *,
#JSE-blockNav li.next,
#JSE-blockNav li.previous {
	cursor: pointer;
	color: #8ca8d7;
}

#JSE-blockNav li.next:hover *,
#JSE-blockNav li.previous:hover *,
#JSE-blockNav li.next:hover,
#JSE-blockNav li.previous:hover {
	background:#1a6bb0;
	color:#fff;
}
#FB-activeBlockSection {
    margin: 16px 20px;
    padding: 0px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    color: #606060;
}
.light #FB-activeBlockSection {
	background: #fff;
    box-shadow: rgba(210, 214, 217,1) 0px 1px 3px 0px;
}
.night #FB-activeBlockSection {
	background: #20222e;
    box-shadow: rgba(0, 0, 0,0.16) 0px 1px 3px 0px;
}
#FB-activeBlockSection h3 {
	margin:10px;
}

#FB-activeBlockSection h4 {
    margin: 0px;
    padding: 9px 8px;
    text-align: center;
}
.light #FB-activeBlockSection h4 {
    background: #fbfcfd;
}
.night #FB-activeBlockSection h4 {
    background: #1c1e28;
}
#JSEA-rawDataDisplay {
	display:none;
}
#JSEA-rawDataDisplay.show {
	display: block;
}
</style>
