import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';

const state = {
	txLimit: 0, //user transaction limit
	pendingTotal: 0, //total rewards pending to be paid out
	pendingSelfMining: 0, //self mining rewards
	pendingPublisherMining: 0, //publisher mining rewards
	pendingReferrals: 0, //referral rewards
	loggedIn: false, //is user logged in
	confirmed: false, //has user comfirmed his account via email?
	balance: '0', //users balance
	balanceMajor: '0', //major currency
	balanceMinor: '0', //fractional currency
	todaysEarnings: '0', //todays earnings
	minedLifetime: '0', //mined lifetime
	importHistory: [], //user coin import history
	session: '', //session info
	transactionInterval: false, //chart hash interval
	initTransaction: false, //transaction initiated
	waitTimer: 0, //interval counter
	countDownFrom: 30, //interval to countdown from
	statsReset: 0, //reset midnight UTC hrs
	lastUpdated: new Date(), //last updated
	fromNow: '', //last updated text display
	registrationDate: 0, //users Registration date
	miningHistory: [], //users mining reward history
	globalErrMsg: '', //global error message notifacation - used on redirect to login
	registered: false, //has user gone through registration process
};

const mutations = {
	/**
	 * updateUserStateValue
	 * Updates User State Value
	 * @param {*} state
	 * @param {*} update
	 */
	updateUserStateValue(state, update) {
		state[update.state] = update.val;
	},
	/**
	 * AJAX Error
	 * @param {*} state
	 * @param {*} err
	 */
	ajaxError(state, err) {
		const self = this;
        switch (err.status) {
			//session invalid
			case 401:
				self.commit('logout');
				if (typeof (err.data.notification) !== 'undefined') {
					state.globalErrMsg = err.data.notification;
				}
				break;
			case 503:
				self.commit('logout');
				state.globalErrMsg = 'Server Error: We may be carrying out maintenance or experiencing very high demand.';
				break;
			default:
				//
				break;
		}
	},
	/**
	 * Update Balance
	 * Updates balance major/min display
	 * @param {*} state
	 * @param {*} balance
	 */
	updateBalance(state, balance) {
		//update user balance as string
		state.balance = balance;
		//calculate maj/min balance
		const balanceSplit = balance.split('.');
		state.balanceMajor = balanceSplit[0];
		state.balanceMinor = balanceSplit[1];

		state.lastUpdated = new Date();
	},
	/**
	 * Update State
	 * Update global user state keys
	 * @param {*} state
	 * @param {*} data
	 */
	updateState(state, data) {
		//user transaction limit
		state.txLimit = data.txLimit;
		//update rewards
		state.pendingTotal = data.pendingTotal;
		state.pendingSelfMining = data.pendingSelfMining;
		state.pendingPublisherMining = data.pendingPublisherMining;
		state.pendingReferrals = data.pendingReferrals;
		//update any other user required state items
		state.confirmed = data.confirmed;
		state.todaysEarnings = data.todaysEarnings;
		state.minedLifetime = data.minedLifetime;
		//state.registrationDate = data.registrationDate;
		state.registrationDate = moment(data.registrationDate).fromNow();
		state.miningHistory = data.miningHistory;
		state.importHistory = data.importHistory;
		//new Date().toJSON()
		state.statsReset = moment.utc().hours();
	},
	/**
	 * Update Session
	 * Update store user session
	 * @param {*} state
	 * @param {*} session
	 */
	updateSession(state, session) {
		//set update session
		if (state.loggedIn) {
			state.session = session;
			localStorage.setItem('userSession', session);
		}
	},
	/**
	 * Reset State
	 * Clear users state remove session disable miner
	 * @param {*} state
	 */
	resetState(state) {
		//stop mining
		window.stopMining();
		//clear
		state = {
			balance: '0',
			balanceMajor: '0',
			balanceMinor: '0',
			todaysEarnings: '0',
			minedLifetime: '0',
			session: '',
		};
		//clear global obj
		user = {};
		//remove user session
		localStorage.removeItem('userSession');
		//prevent background mining on restart
		localStorage.setItem('backgroundMiningEnabled', false);
	},
	/**
	 * Update fromNow
	 * Updates when userObj was last updated every 30sec
	 * @param {*} state
	 */
	updateFromNow(state) {
		const self = this;
		state.fromNow = moment(state.lastUpdated).fromNow();
		setTimeout(() => {
			if (state.loggedIn) {
				self.commit('updateFromNow');
			}
		}, 30000);
	},
	/**
	 * Update Interval
	 * Increase counter call clearDelay if counter === 30
	 * @param {*} state
	 */
	updateInterval(state) {
		const self = this;
		state.waitTimer += 1;

		if (self.getters.whichPlatform === 'desktop') {
			import('electron').then((electron) => {
				electron.ipcRenderer.send('updateProgressBar',((1/state.countDownFrom)*state.waitTimer));
			}).catch((error) => {
				console.error(error);
			});
		}
		/*
		if (typeof (Vue.$electron) !== 'undefined') {
			Vue.$electron.ipcRenderer.send('updateProgressBar',((1/state.countDownFrom)*state.waitTimer));
		}
		*/

		if (state.waitTimer === state.countDownFrom) {
			self.commit('clearDelay');
		}
	},
	/**
	 * Delay
	 * Start delay timer to pevent user from doing any transactions for 30 seconds
	 * @param {*} state
	 */
	delay(state, duration) {
		const self = this;
		if (!state.transactionInterval) {
			state.countDownFrom = duration;
			state.transactionInterval = setInterval(() => {
				self.commit('updateInterval');
			}, 1000);
			self.commit('updateInterval');
		}
	},
	/**
	 * Clear Delay
	 * Clear timer and allow user to transact
	 * @param {*} state
	 */
	clearDelay(state) {
		const self = this;
		clearInterval(state.transactionInterval);
		state.transactionInterval = false;
		state.initTransaction = false;
		state.waitTimer = 0;
		if (self.getters.whichPlatform === 'desktop') {
			import('electron').then((electron) => {
				electron.ipcRenderer.send('updateProgressBar',-1);
			}).catch((error) => {
				console.error(error);
			});
		}
		/*
		if (typeof (Vue.$electron) !== 'undefined') {
			Vue.$electron.ipcRenderer.send('updateProgressBar',-1);
		}
		*/
	},
	/**
	 * Logout
	 * Logout User
	 * @param {*} state
	 */
	logout(state) {
		const self = this;

		const logoutSession = {
			session: state.session,
			app: self.getters.whichPlatform,
		};

		//
		self.commit('resetState');
		self.commit('loggedIn', false);
		self.commit('stopMining');

		//
		if (self.getters.whichPlatform === 'desktop') {
			import('electron').then((electron) => {
				electron.ipcRenderer.send('logout');
			}).catch((error) => {
				console.error(error);
			});
		}
		/*
		if (typeof (Vue.electron) !== 'undefined') {
			Vue.$electron.ipcRenderer.send('logout');
		}
		*/
		localStorage.setItem('autoLogin', 'false');
		self.commit('updateAppState', {
			val: false,
			state: 'autoLogin',
		});
		console.log(state);
		//load login route
		//if (self.getters.whichPlatform === 'web') {
			import('../../nav').then((nav) => {
				//console.log('router');
				nav.default.push('login');
			}).catch((error) => {
				console.error(error);
			});
		//}
		/**
		Vue.$router.push('login');
		**/

		//
		axios.post(
			'https://server.jsecoin.com/logout/',
			logoutSession,
		).then((res) => {
			//res
		}).catch((e) => {
			//console.error(e);
		});
	},
	/**
	 * logged In
	 * Set if user is logged in or out
	 * @param {*} state
	 * @param {*} status
	 */
	loggedIn(state, status) {
		state.loggedIn = status;
		if (!status) {
			if (typeof (window.JSEsocket) !== 'undefined') {
				window.JSEsocket.disconnect();
			}
		}
	},
};

const actions = {
	/**
	 * Update User Balance
	 * Push balance update
	 * @param {*} param0
	 * @param {*} data
	 */
	updateUserBalance({ commit, state }, data) {
		commit('updateBalance', data.balance+'');
	},
	/**
	 * Update User Session
	 * @param {*} param0
	 * @param {*} data
	 */
	updateUserSession({ commit, state }, data) {
		commit('updateSession', data.session);
	},
	/**
	 * Update User State
	 * @param {*} param0
	 * @param {*} data
	 */
	updateUserState({ commit, state }, data) {
		commit('updateBalance', data.balance+'');
		commit('updateState', data);
		commit('updateSession', data.session);
	},
	/**
	 * Reset User State
	 * @param {*} param0
	 */
	resetUserState({ commit, state }) {
		commit('resetState');
	},
	/**
	 * Delay User Action
	 * @param {*} param0
	 */
	delayUserAction({ commit, state }) {
		commit('delay');
	},
	/**
	 * Logout User
	 * @param {*} param0
	 */
	logoutUser({ commit, state }) {
		commit('logout');
	},
};
export default {
	state,
	mutations,
	actions,
};
function newFunction(err) {
    switch (err.status) {
        case 401:
            break;
    }
}
