import Vue from 'vue';

const state = {
	//miningEnabled: false, //
	miningInterval: false,
	hashRateChartItems: ['Hash Rate', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	hashRate: 0, //hash rate
	hps: 0, //hashes per sec
	hashRateAcc: (localStorage.getItem('hashRateAccStored') !== null)?localStorage.getItem('hashRateAccStored'):3, //hash rate acceleration value
	displayStatusMsg: false, //
	startedMining: false, //has user started mining
	miningLabel: 'Connecting to Blockchain...', //mining label displaying during blockchain connection
	miningButton: 'START MINING', //mining button display -stop / start
	hashesFound: 0, //hashes found
	consoleMsg: ['> Click the start mining button'], //initial console msg
	animateHash: false, //animate hash ICO
	showChart: false, //show animated mining chart
};

const mutations = {
	/**
	 * updateMinerState
	 * Updates state value
	 * @param {*} state
	 * @param {*} update
	 */
	updateMinerState(state, update) {
		state[update.state] = update.val;
	},
	/**
	 * Start Mining
	 * Starts Mining Process
	 * @param {*} state
	 */
	startMining(state) {
		//
		state.startedMining = true;
		state.displayStatusMsg = true;
		state.miningButton = 'STOP MINING';
		const self = this;
		localStorage.setItem('backgroundMiningEnabled', true);
		//check jsecoin global var if mining has started.
		if (window.quitMining) {
			window.startMining();
			if (self.getters.whichPlatform === 'desktop') {
				import('electron').then((electron) => {
					electron.ipcRenderer.send('startedMining');
				}).catch((error) => {
					console.error(error);
				});
			}
		}
		/*
		if (typeof (Vue.$electron) !== 'undefined') {
			Vue.$electron.ipcRenderer.send('startedMining');
		}
		*/
		state.miningInterval = setInterval(() => {
			const event = new Event('addHashInterval');
			document.dispatchEvent(event);
		}, 1000);
		self.commit('updateHashInterval');
	},
	/**
	 * Update Hash Accelerator
	 * Updates chart hash acc value
	 * @param {*} state
	 */
	updateHashAcc(state, acc) {
		state.hashRateAcc = acc;
		localStorage.setItem('hashRateAccStored', acc);
	},
	/**
	 * Update Hash Interval
	 * Updates chart hash value display
	 * @param {*} state
	 */
	updateHashInterval(state) {
		const hashRate = parseInt(Number(window.hashRate),10);
		const hps = Number(window.hps);
		if (!isNaN(hps)) {
			state.hps = Number(hps);
		}
		if (!isNaN(hashRate)) {
			state.hashRate = hashRate;
			if (state.hashRateChartItems.length === 16) {
				//state.hashRateChartItems.shift();
				state.hashRateChartItems.splice(1, 1);
			}
			state.hashRateChartItems.push(state.hashRate);
		} else {
			state.hashRate = 0;
		}
	},
	/**
	 * Stop Mining
	 * Stop Mining process
	 * @param {*} state
	 */
	stopMining(state) {
		const self = this;
		//
		console.log('stop>>?');
		localStorage.setItem('backgroundMiningEnabled', false);
		window.stopMining();
		clearInterval(state.miningInterval);
		state.hashRateChartItems = ['Hash Rate', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		state.hashRate = 0;
		if (self.getters.whichPlatform === 'desktop') {
			import('electron').then((electron) => {
				electron.ipcRenderer.send('stoppedMining');
			}).catch((error) => {
				console.error(error);
			});
		}
		/*
		if (typeof (Vue.$electron) !== 'undefined') {
			Vue.$electron.ipcRenderer.send('stoppedMining');
		}
		*/
		state.displayStatusMsg = false;
		state.startedMining = false;
		state.miningButton = 'START MINING';
		state.miningLabel = 'Connecting to Blockchain...';
		state.consoleMsg.unshift('> Click the start mining button');
	},
	/**
	 * Connected
	 * Connection made to jsecoin for data
	 * @param {*} state
	 */
	connected(state) {
		const self = this;
		state.miningLabel = 'Connected...';
		setTimeout(() => {
			self.commit('updateStatusMsg');
		},1000);
	},
	/**
	 * Update Status Msg
	 * reset connection message and hide
	 * @param {*} state
	 */
	updateStatusMsg(state) {
		state.displayStatusMsg = false;
		state.miningLabel = 'Connecting to Blockchain...';
	},
	/**
	 * Clear Hash Anim
	 * Clear animation display
	 * @param {*} state
	 */
	clearHashAnim(state) {
		state.animateHash = false;
	},
	/**
	 * Update Mining Display
	 * Update console & hashes found
	 * @param {*} state
	 */
	updateMiningDisplay(state, consoleMsg) {
		const self = this;
		if (state.hashesFound < window.sessionHashes) {
			state.animateHash = true;
			setTimeout(function() {
				self.commit('clearHashAnim');
			}, 1200);
		}
		/*
		if (consoleMsg.indexOf) {
			self.commit('connected');
		}*/
		//hashes found
		state.hashesFound = window.sessionHashes;
		//console messages to display
		state.consoleMsg.unshift('> ' + consoleMsg);
		if (state.consoleMsg.length >= 15) {
			state.consoleMsg.pop();
		}
	},
};

const actions = {
	/**
	 * Start Platform Mining
	 * @param {*} param0
	 * @param {*} data
	 */
	startPlatformMining({ commit, state }, data) {
		commit('stopMining');
		commit('startMining');
	},
	/**
	 * Stop Platform Mining
	 * @param {*} param0
	 * @param {*} data
	 */
	stopPlatformMining({ commit, state }, data) {
		console.log('stopPlatformMining');
		commit('stopMining');
	},
	/**
	 * Connected To Platform Mining
	 * @param {*} param0
	 * @param {*} data
	 */
	connectedToPlatformMining({ commit, state }, data) {
		commit('connected');
	},
	/**
	 * Update Platform Mining Display
	 * @param {*} param0
	 * @param {*} data
	 */
	updatePlatformMiningDisplay({ commit, state }, data) {
		commit('updateMiningDisplay', data.consoleMsg);
	},
};
export default {
	state,
	mutations,
	actions,
};
