<template>
	<AppWrapperWidget>
		<NavWidget activeNav="blockchainLatest"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<div id="FB-block">
				<ContentWidget
					:titleTxt="`Latest ${blocks.length} Blocks`"
					:infoPanelTxt="`Height ${latestBlockVal}`"
					style="padding-bottom:50px;">
					<div class="flexbox">
						<div class="flexWrap">
							<div class="box hasFooterButton">
								<div class="dataset">
									<table>
									<thead>
										<tr>
											<th>Height</th>
											<th style="min-width:100px">Age</th>
											<th>Transactions</th>
										</tr>
									</thead>
									<tbody>
										<router-link class="clickableRow" v-for="(block, index) in blocks" :key="index" v-bind:to="`/blockchain/Block/${block.blockID}`" tag="tr">
											<td>{{block.blockID}}</td>
											<td>{{block.timestamp}}</td>
											<td>{{block.transactionLength}}</td>
										</router-link>
										<!--<router-link to="/Block/5421803" tag="tr">
											<td>5421803</td>
											<td>
												<span class="text-overflow-dynamic-container">
													<span class="text-overflow-dynamic-ellipsis">
													a few seconds ago
													</span>
												</span>
											</td>
											<td>10</td>
											<td>10</td>
										</router-link>-->
									</tbody>
									</table>
								</div>


							</div>
						</div>
					</div>
					
					<template slot="footer">
						<ButtonWidget class="small" style="margin:10px 0px; width:100%;" buttonTxt="See All Blocks" v-on:click.native="goto(`/blockchain/AllBlocks/${latestBlockLvl}/${latestBlockVal}`);"/>
					</template>
				</ContentWidget>
				<ContentWidget 
					:titleTxt="`Latest ${transactions[filterTransaction].length} Transactions`">
					<div class="flexbox">
						<div class="flexWrap">
							<div class="box">
								<ul class="filterTabs">
									<li v-on:click="filterTabs('all')" :class="{ active:isActive('all') }">All</li>
									<li v-on:click="filterTabs('mining')" :class="{ active:isActive('mining') }">Mining</li>
									<li v-on:click="filterTabs('export')" :class="{ active:isActive('export') }">Export</li>
									<li v-on:click="filterTabs('import')" :class="{ active:isActive('import') }">Import</li>
									<li v-on:click="filterTabs('transfer')" :class="{ active:isActive('transfer') }">Transfer</li>
								</ul>

								<div class="dataset">
									<div class="infoPanel" v-if="transactions[filterTransaction].length === 0">
										Waiting for transaction...
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
									</div>
								</div>
							</div>
						</div>
						<!--<router-link to="/blockchain/AllTransactions" tag="button" class="activeButton">
							See All Transactions
						</router-link>-->
					</div>
				</ContentWidget>
			</div>
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
	//component name
	name: 'Blocks',
	components: {
		AppWrapperWidget,
		ContentWidget,
		ScrollWidget,
		NavWidget,
		ButtonWidget,
	},
	//data
	data() {
		return {
			latestBlockVal: 0,
			latestBlockLvl: 0,
			filterTransaction: 'all',
			blockID: [],
			blocks: [],
			transactions: {
				all: [],
				mining: [],
				transfer: [],
				import: [],
				export: [],
			},
			interval: [],
		};
	},
	created() {
		const ioclient = window.JSEsocket;//require('socket.io-client'); // for peer client connections
		window.socketClient = ioclient.connect('https://load.jsecoin.com', { secure: true, reconnect: true, transports: ['websocket'], heartbeatTimeout: 1800000, maxHttpBufferSize: 1000000000 }); // connects to host defined in server.js

		// max blocksize is hardcoded to 1000 instead of jseSettings, can't see this changing
		window.socketClient.getBlockRef = function(blockNumber) {
			let blockRef = Math.round((blockNumber - (1000/2)) / (1000));
			if (blockRef < 0) { blockRef = 0; }
			return blockRef;
		};


		window.window.global = {
			currentChain: {},
		}; // store blockChain
		window.socketClient.on('newBlock', function(myBlockRef,myBlockID,myBlock) {
			console.log('newBlock Received: '+myBlockRef+' / '+myBlockID);
			if (typeof window.window.global.currentChain[myBlockRef] === 'undefined') window.window.global.currentChain[myBlockRef] = {};
			window.window.global.currentChain[myBlockRef][myBlockID] = myBlock;
		});

		window.socketClient.emit('getLatestBlocks');
		window.socketClient.emit('subscribeToNewBlocks', null);

		window.socketClient.getNodeChainData = function(key) {
		return new Promise((resolve) => {
			socketClient.emit('getChainData', key, (returnObject) => {
					const keySplit = (key.slice(-1) === '/') ? key.slice(0, -1).split('/') : key.split('/');
					keySplit.shift();
					if (keySplit.length === 2) {
						console.log('Writing new chain data for received block: '+keySplit[1]);
						// Check if key exists before setting anything to it
						if (typeof window.window.global.currentChain[keySplit[0]] === 'undefined') window.window.global.currentChain[keySplit[0]] = {};
						window.window.global.currentChain[keySplit[0]][keySplit[1]] = returnObject;
					}
					resolve(returnObject);
				});
		});
		};

		window.socketClient.getChainData = async function(key,callback) {
			// from db.js with data > window.global.currentChain, and keySplit.shift() line added
			// key is a firebase style key i.e. 'siteIDs/145/mywebsitecom/s'
			const keySplit = (key.slice(-1) === '/') ? key.slice(0, -1).split('/') : key.split('/');
			keySplit.shift();
			//console.log('KEYSPLIT: '+JSON.stringify(keySplit));
			if (keySplit.length === 1) {
				if (window.window.global.currentChain[keySplit[0]]) {
					callback(window.window.global.currentChain[keySplit[0]]);
					return;
				}
			} else if (keySplit.length === 2) {
				if (window.window.global.currentChain[keySplit[0]] && window.window.global.currentChain[keySplit[0]][keySplit[1]]) { // double check the parents exist to avoid errors, throw a null back if any keys are undefined
					callback(window.window.global.currentChain[keySplit[0]][keySplit[1]]);
					return;
				}
			} else if (keySplit.length === 3) {
				if (window.window.global.currentChain[keySplit[0]] && window.window.global.currentChain[keySplit[0]][keySplit[1]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]]) {
					callback(window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]]);
					return;
				}
			} else if (keySplit.length === 4) {
				if (window.window.global.currentChain[keySplit[0]] && window.window.global.currentChain[keySplit[0]][keySplit[1]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]]) {
					callback(window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]]);
					return;
				}
			} else if (keySplit.length === 5) {
				if (window.window.global.currentChain[keySplit[0]] && window.window.global.currentChain[keySplit[0]][keySplit[1]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]]) {
					callback(window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]]);
					return;
				}
			} else if (keySplit.length === 6) { // keys have a maximuim of five levels, think the most we use is four so this gives a bit of room just in case
				if (window.window.global.currentChain[keySplit[0]] && window.window.global.currentChain[keySplit[0]][keySplit[1]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]] && window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]][keySplit[5]]) {
					callback(window.window.global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]][keySplit[5]]);
					return;
				}
			} else {
				console.log('ERROR window.socketClient.js 540: Maximum field length reached'); // should never hit this.
			}
			// data doesn't exist locally try looking it up on the server
			console.log('Going to fetch '+key+' from node as no data locally for '+key);
			const result = await socketClient.getNodeChainData(key);
			console.log('Got result from node: '+typeof result+' : '+JSON.stringify(result));
			callback(result);
		};
	},
	//component loaded
	mounted() {
		const self = this;
		//console.log(this);
		//update timestamp every 10 seconds
		self.interval = setInterval(function(){
			$.each(self.blocks, function(i, val){
				self.blocks[i].timestamp = moment(self.blocks[i].startTime).fromNow();
			});
			$.each(self.transactions[self.filterTransaction], function(i, val){
				if (typeof (self.transactions[self.filterTransaction][i].timestamp) !== 'undefined') {
					self.transactions[self.filterTransaction][i].timestamp = moment(self.transactions[self.filterTransaction][i].ts).fromNow();
				}
			});
		}, 10000);


		function writeBlocks() {
			self.blocks = [];
			self.transactions.all =[];
			self.transactions.mining =[];
			self.transactions.export =[];
			self.transactions.import =[];
			self.transactions.transfer =[];
			$.each(window.global.currentChain, function(myBlockRef, val){
			//for (var myBlockRef in window.global.currentChain) {
				//if (!window.global.currentChain.hasOwnProperty(myBlockRef)) continue;
				//console.log('BR: '+myBlockRef);
				//for (var myBlockID in window.global.currentChain[myBlockRef]) {
					$.each(window.global.currentChain[myBlockRef], function(myBlockID, val2){
					//if (!window.global.currentChain[myBlockRef].hasOwnProperty(myBlockID)) continue;
					//console.log('BID: '+myBlockID);
					self.blockID = parseInt(myBlockID, 10); // don't want very latest block?
					self.latestBlockVal = self.blockID;
					self.latestBlockLvl = window.socketClient.getBlockRef(self.latestBlockVal);
					const oBlocks = window.global.currentChain[myBlockRef][myBlockID];
					//console.log('[Block]',oBlocks);
					if (typeof (oBlocks) === 'undefined') return;
					oBlocks.transactionLength = 0;
					oBlocks.timestamp = moment(oBlocks.startTime).fromNow();

					self.blocks.unshift(oBlocks);
					self.blocks.length = (self.blocks.length > 10)?10:self.blocks.length;
					if (typeof (oBlocks.input) !== 'undefined') {
						const oTransactions = oBlocks.input;
						oBlocks.transactionLength = Object.keys(oTransactions).length;
						$.each(oTransactions, function(i, val3){
							oTransactions[i].latestBlockLvl = self.latestBlockLvl;
							oTransactions[i].latestBlockVal = self.latestBlockVal;
							oTransactions[i].key = i;
							if (self.transactions.all.indexOf(oTransactions[i]) === -1) {
								self.transactions.all.unshift(oTransactions[i]);
								self.transactions.all.length = (self.transactions.all.length > 10)?10:self.transactions.all.length;
							}
							if (oTransactions[i].command === 'mining') {
								if (self.transactions.mining.indexOf(oTransactions[i]) === -1) {
									//console.log('[Transaction mining]', oTransactions);
									self.transactions.minedTotal += 1;
									self.transactions.mining.unshift(oTransactions[i]);
									self.transactions.mining.length = (self.transactions.mining.length > 10)?10:self.transactions.mining.length;
								}
							}
							if (oTransactions[i].command === 'export') {
								if (self.transactions.export.indexOf(oTransactions[i]) === -1) {
									console.log('[Transaction export]', oTransactions[i]);
									self.transactions.exportedTotal += 1;
									oTransactions[i].timestamp = (oTransactions[i].ts)?moment(oTransactions[i].ts).fromNow():'N/A'; //JSEcoin Controller v1.504 export didn't support ts
									self.transactions.export.unshift(oTransactions[i]);
									self.transactions.export.length = (self.transactions.export.length > 10)?10:self.transactions.export.length;
								}
							}
							if (oTransactions[i].command === 'import') {
								if (self.transactions.import.indexOf(oTransactions[i]) === -1) {
									console.log('[Transaction import]', oTransactions[i]);
									self.transactions.importedTotal += 1;
									oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
									self.transactions.import.unshift(oTransactions[i]);
									self.transactions.import.length = (self.transactions.import.length > 10)?10:self.transactions.import.length;
								}
							}
							if (oTransactions[i].command === 'transfer') {
								if (self.transactions.transfer.indexOf(oTransactions[i]) === -1) {
									console.log('[Transaction transfer]', oTransactions[i]);
									self.transactions.transferTotal += 1;
									oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
									self.transactions.transfer.unshift(oTransactions[i]);
									self.transactions.transfer.length = (self.transactions.transfer.length > 10)?10:self.transactions.transfer.length;
								}
							}
						});
					}
				});
			});
		}
		writeBlocks();
		setInterval(function() {
			writeBlocks();
		}, 5000);
		/*
		//grab latest blockid and watch for changes
		//db.ref('blockID').on('value', (coreBlock) => {
		window.socketClient.on('newBlock', (myBlockRef,myBlockID,myBlock) => {
		//window.socketClient.emit('getBlockID', (blockID) => {
			console.log('Blocks.vue newBlock Received: '+myBlockID);
			if (typeof socketClient.currentChain[myBlockRef] == 'undefined') socketClient.currentChain[myBlockRef] = {};
			socketClient.currentChain[myBlockRef][myBlockID] = myBlock;
			//window.socketClient.emit('subscribeBlockID', (blockID) => {
			//db.ref('blockChain/'+self.latestBlockLvl).off();
			//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal+'/input').off();
			//store current block
			self.blockID = parseInt(myBlockID); // don't want very latest block?
			self.latestBlockVal = self.blockID;
			self.latestBlockLvl = window.socketClient.getBlockRef(self.latestBlockLvl);

			console.log(self.latestBlockLvl);
			console.log(self.latestBlockVal);

			//grab block
			//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal).once('value', (blocks) => {
			//window.socketClient.emit('getChainData', 'blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal, (blockObj) => {
			const oBlocks = myBlock;
			console.log('[Block]',oBlocks);
			if (typeof (oBlocks) === 'undefined') {
				return;
			}
			oBlocks.transactionLength = 0;
			oBlocks.timestamp = moment(oBlocks.startTime).fromNow();
			self.blocks.unshift(oBlocks);
			self.blocks.length = (self.blocks.length > 10)?10:self.blocks.length;
			//self.blockID.unshift(oBlocks.blockID+'');
			//self.blockID.length = (self.blockID.length > 10)?10:self.blockID.length;

			if (typeof (oBlocks.input) !== 'undefined') {
				const oTransactions = oBlocks.input;
				oBlocks.transactionLength = Object.keys(oTransactions).length;

				$.each(oTransactions, function(i, val){
					oTransactions[i].latestBlockLvl = self.latestBlockLvl;
					oTransactions[i].latestBlockVal = self.latestBlockVal;
					oTransactions[i].key = i;

					self.transactions.all.unshift(oTransactions[i]);
					self.transactions.all.length = (self.transactions.all.length > 10)?10:self.transactions.all.length;

					if (oTransactions[i].command === 'mining') {
						//console.log('[Transaction mining]', oTransactions);
						self.transactions.minedTotal += 1;
						self.transactions.mining.unshift(oTransactions[i]);
						self.transactions.mining.length = (self.transactions.mining.length > 10)?10:self.transactions.mining.length;
					}
					if (oTransactions[i].command === 'export') {
						console.log('[Transaction export]', oTransactions[i]);
						self.transactions.exportedTotal += 1;
						oTransactions[i].timestamp = (oTransactions[i].ts)?moment(oTransactions[i].ts).fromNow():'N/A'; //JSEcoin Controller v1.504 export didn't support ts
						self.transactions.export.unshift(oTransactions[i]);
						self.transactions.export.length = (self.transactions.export.length > 10)?10:self.transactions.export.length;
					}
					if (oTransactions[i].command === 'import') {
						console.log('[Transaction import]', oTransactions[i]);
						self.transactions.importedTotal += 1;
						oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
						self.transactions.import.unshift(oTransactions[i]);
						self.transactions.import.length = (self.transactions.import.length > 10)?10:self.transactions.import.length;
					}
					if (oTransactions[i].command === 'transfer') {
						console.log('[Transaction transfer]', oTransactions[i]);
						self.transactions.transferTotal += 1;
						oTransactions[i].timestamp = moment(oTransactions[i].ts).fromNow();
						self.transactions.transfer.unshift(oTransactions[i]);
						self.transactions.transfer.length = (self.transactions.transfer.length > 10)?10:self.transactions.transfer.length;
					}
				});
			}
			*/
			//listen for transactions against block
			/*
				db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal+'/input').limitToLast(1).on('child_added', (transactions) => {
				const oTransactions = transactions.val();

				self.transactions.all.unshift(oTransactions);
				self.transactions.all.length = (self.transactions.all.length > 10)?10:self.transactions.all.length;

				oTransactions.latestBlockLvl = self.latestBlockLvl;
				oTransactions.latestBlockVal = self.latestBlockVal;
				oTransactions.key = transactions.key;

				if (oTransactions.command === 'summary') {
					console.log('[Transaction summary]', oTransactions);

					oTransactions.timestamp = moment(oTransactions.ts).fromNow();
				}
				if (oTransactions.command === 'mining') {
					//console.log('[Transaction mining]', oTransactions);

					self.transactions.mining.unshift(oTransactions);
					self.transactions.mining.length = (self.transactions.mining.length > 10)?10:self.transactions.mining.length;
				}
				if (oTransactions.command === 'import') {
					console.log('[Transaction import]', oTransactions);

					oTransactions.timestamp = moment(oTransactions.ts).fromNow();
					self.transactions.import.unshift(oTransactions);
					self.transactions.import.length = (self.transactions.import.length > 10)?10:self.transactions.import.length;
				}
				if (oTransactions.command === 'export') {
					console.log('[Transaction export]', oTransactions);

					oTransactions.timestamp = (oTransactions.ts)?moment(oTransactions.ts).fromNow():'N/A'; //JSEcoin Controller v1.504 export didn't support ts
					self.transactions.export.unshift(oTransactions);
					self.transactions.export.length = (self.transactions.export.length > 10)?10:self.transactions.export.length;
				}
				if (oTransactions.command === 'transfer') {
					console.log('[Transaction transfer]', oTransactions);

					oTransactions.timestamp = moment(oTransactions.ts).fromNow();
					self.transactions.transfer.unshift(oTransactions);
					self.transactions.transfer.length = (self.transactions.transfer.length > 10)?10:self.transactions.transfer.length;
				}
				if (typeof (self.blocks[self.blockID.indexOf(self.latestBlockVal)]) !== 'undefined') {
					self.blocks[self.blockID.indexOf(self.latestBlockVal)].transactionLength +=1;
				}
			});
		});
*/
	},

	//before component is destroyed cleanup
	beforeDestroy() {
		console.log('destroy');
		const self = this;
		//clear update ts interval
		clearInterval(self.interval);

		//unbind db socket connection
		//db.ref('blockID').off();
		//db.ref('blockChain/'+self.latestBlockLvl).off();
		//db.ref('blockChain/'+self.latestBlockLvl+'/'+self.latestBlockVal+'/input').off();
	},

	//methods
	methods: {
		//update transaction display
		filterTabs(filter) {
			this.filterTransaction = filter;
			this.activeItem = filter;
		},
		//update active filter class
		isActive(menuItem) {
			return this.filterTransaction === menuItem;
		},
		goto(route) {
			const self = this;
			self.$router.push(`${route}`);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.max dl {
    margin: 16px 10px;
}
</style>
