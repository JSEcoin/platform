<template>
	<AppWrapperWidget>
		<NavWidget activeNav="allBlocks"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
			<ContentWidget 
				style="width:auto; padding-bottom:50px;">
				<div class="box hasFooterButton">					
					<div class="dataset">
						<table>
						<thead>
							<tr>
								<th>Height</th>
								<th style="min-width:100px">Timestamp</th>
								<th>Transactions</th>
							</tr>
						</thead>
						<tbody id="v-for-blocks">
							<router-link class="clickableRow" v-for="(block, index) in blocks" :key="index" v-bind:to="`/blockchain/Block/${block.blockID}`" tag="tr">
								<td>{{block.blockID}}</td>
								<td>{{block.timestamp}}</td>
								<td>{{block.transactionLength}}</td>
							</router-link>
						</tbody>
						</table>
					</div>
				</div>
				<template slot="footer">
					<div class="row" style="justify-content:center;">
						<router-link class="previous" v-bind:to="`/blockchain/AllBlocks/${latestBlockLvl}/${prevBlock}`" v-if="prevExists" tag="li">
							<i class="fa fa-angle-left icon-chevron-left"></i> Previous
						</router-link>
						<li v-else>.</li>

						<router-link class="next" v-bind:to="`/blockchain/AllBlocks/${latestBlockLvl}/${nextBlock}`" v-if="nextExists" tag="li">
							Next <i class="fa fa-angle-right icon-chevron-right"></i>
						</router-link>
						<li v-else>.</li>
					</div>
				</template>
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
  name: 'AllBlocks',
	components: {
		AppWrapperWidget,
		ContentWidget,
		NavWidget,
		ScrollWidget,
	},
	//data
	data() {
		return {
			latestBlockVal: this.$route.params.blockVal,
			latestBlockLvl: this.$route.params.blockLvl,
			prevBlock: this.$route.params.blockLvl,
			nextBlock: this.$route.params.blockLvl,
			pageBy: 20,
			blocks: {},
			exists: true,
			nextExists: true,
			prevExists: true,
		};
	},
	//component loaded
	mounted() {
		const self = this;
		console.log('params',self.$route.params);
		console.log('blockLvl',self.$route.params.blockLvl);
		console.log('blockVal',self.$route.params.blockVal);
		console.log('self',self);


		if ((parseFloat(self.$route.params.blockVal) < 1000) || (parseFloat(self.$route.params.blockLvl) < 1)) {
			self.exists = false;
			if (parseFloat(self.$route.params.blockVal) < 1000) {
				console.log('Block ID Starts at 1000');
			} else {
				console.log('Block Lvl Starts at 1');
			}
		} else {
			self.prevBlock = parseFloat(self.$route.params.blockVal)-self.pageBy;
			self.nextBlock = parseFloat(self.$route.params.blockVal)+self.pageBy;

			self.requestPagedBlock(self.$route.params.blockVal);
		}
		//console.log(this.$route.params.blockVal);

		//

		//db.ref('blockChain/'+self.latestBlockLvl).orderByChild('blockID').startAt(self.blockVal).limitToFirst(self.pageBy)
		//.once('value', (blocks) => {
		/*
		db.ref('blockChain/'+this.$route.params.blockLvl).startAt(this.$route.params.blockVal).once('value', (blocks) => {
			console.log('xy', blocks.val());
		});*/
		//this.requestBlockList(this.$route.params.id);
	},

	//methods
	methods: {
		requestPagedBlock(blockID, pos) {
			const self = this;
			self.latestBlockLvl = window.socketClient.getBlockRef(blockID);
			self.latestBlockVal = blockID;
			/*
			db.ref('blockChain/'+self.latestBlockLvl).orderByChild('blockID').startAt(parseFloat(self.$route.params.blockVal)-self.pageBy).limitToFirst(self.pageBy)
			.once('value', (blocks) => {
				const oBlocks = blocks.val();
			*/
			const oBlocks = window.global.currentChain[self.latestBlockLvl];
			console.log('oBlocks Data', oBlocks);

			// Go fetch some previous blocks to add to allblocks
			const previousBlock = parseInt(Object.keys(oBlocks)[0],10) - 1;
			console.log('previousBlock: '+previousBlock);
			window.socketClient.getChainData('blockChain/'+window.socketClient.getBlockRef(previousBlock)+'/'+previousBlock, () => { });
			for (let i = 0; i < 10; i+=1) {
				window.socketClient.getChainData('blockChain/'+window.socketClient.getBlockRef(previousBlock-i)+'/'+(previousBlock-i), () => { });
			}
			window.socketClient.getChainData('blockChain/'+window.socketClient.getBlockRef(previousBlock-10)+'/'+(previousBlock-10), () => {
				$.each(oBlocks, function(i, val){
					const oBlock = oBlocks[i];
					oBlock.blockTime = moment(oBlock.startTime).fromNow();
					oBlock.timestamp = moment(oBlock.startTime).format('MMMM Do YYYY, h:mm:ss a');
					if (typeof (oBlock.input) !== 'undefined') {
						oBlock.transactionLength = Object.keys(oBlock.input).length;
					} else {
						oBlock.transactionLength = 0;
					}
				});
				self.blocks = oBlocks;

				if (blockID >= 999) {
					console.log('gt 999 next true');
					this.nextExists = true;
				}
				if (blockID > 1000) {
					console.log('gt 1000 prevExists true');
					this.prevExists = true;
				}

				if (pos === 'next') {
					console.log('next',(oBlocks !== null));
					this.nextExists = (oBlocks !== null);
				}
				if (pos === 'previous') {
					console.log('prev', (oBlocks !== null));
					this.prevExists = (oBlocks !== null);
				}

				if (blockID < 999) {
					console.log('lt 9999 next false');
					this.nextExists = false;
				}

				if (blockID <= 1000) {
					console.log('lte 1000 prev false');
					this.prevExists = false;
				}

				this.exists = (oBlocks !== null);
			});
		},
		/*
		Unused?
		requestBlockList(blockID, pos) {
			db.ref('blockChain/'+self.latestBlockLvl).limitToLast(101).once('value', (block) => {

			});
		},

		requestByBlockKey(blockKey) {
			db.ref('blockChain/'+self.latestBlockLvl).startAt(blockKey).limitToFirst(101).once('value', (block) => {

			});
		},
		*/
	},

	watch: {
		//update data params based on route id
		$route(to, from) {
			const self = this;
			let vPosition = 'new';

			//if to address is not defined then exit
			if (to.params.blockVal === 'NaN') {
				self.nextExists = false;
				return;
			}

			//if blockid < 1000 then hide
			if (parseFloat(to.params.blockVal) < 1000) {
				self.prevExists = false;
				return;
			}

			if (parseFloat(to.params.blockVal) === 1000) {
				self.prevExists = false;
				self.nextExists = true;
			}

			if (parseFloat(to.params.blockLvl) < 1) {
				self.prevExists = false;
				self.nextExists = false;
				return;
			}

			console.log(to.params,from.params);
			if (to.params.blockVal !== from.params.blockVal) {
				self.prevBlock = parseFloat(to.params.blockVal)-self.pageBy;
				self.nextBlock = parseFloat(to.params.blockVal)+self.pageBy;
			}
			console.log(to.params.blockVal, from.params.blockVal);
			if (parseFloat(to.params.blockVal) > parseFloat(from.params.blockVal)) {
				vPosition = 'next';
			}
			if (parseFloat(to.params.blockVal) < parseFloat(from.params.blockVal)) {
				vPosition = 'previous';
			}

			self.requestPagedBlock(to.params.blockVal, vPosition);
		},
	},

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#JSE-viewBlocksPage {
	background:#005ba7;
	color:#8ca8d7;
	display: flex;
	justify-content: space-between;
	align-content: stretch;
	align-items: stretch;
	flex-wrap: nowrap;
	flex-direction: row;
	margin:0px;
	padding:0px;
	position: absolute;
	bottom:0px;
	left: 0px;
	right:0px;
}

#JSE-viewBlocksPage li {
	cursor: pointer !important;
	list-style: none;
	padding:10px 20px;
	flex-grow:1;
	text-align: center;
	font-weight: bold;
}

#JSE-viewBlocksPage li * {
	cursor: pointer !important;
}

#JSE-viewBlocksPage li:first-child,
#JSE-viewBlocksPage li:last-child {
	border-right:solid 1px #8ca8d7;
}

#JSE-viewBlocksPage li:hover {
	color:#fff;
}
</style>
