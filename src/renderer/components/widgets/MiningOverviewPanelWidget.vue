<template>
	<div class="miningOverview row">
		<!-- Current Balance -->
		<ContentWidget 
			v-if="((balanceMinor > 0) || (balanceMajor >= 1))"
			titleTxt="Current Balance" 
			class="mini hasFooter">
			<div class="row" style="">
				<div v-if="balanceMajor >= 1" class="valueIconDisplay">
					<Coin :coinClass="{gold: balanceMajor >= 1}"/>
					{{balanceMajor}}&nbsp;<span>JSE</span>
				</div>
			</div>
			<div v-if="balanceMinor > 0" class="row" style="">
				<div class="valueIconDisplay">
					<Coin :coinClass="{silver: balanceMinor > 0}"/>
					0.{{balanceMinor}}&nbsp;<span>JSE</span>
				</div>
			</div>
			<template slot="footer">
				<p class="footerTxt">Updated <br v-if="$store.getters.whichPlatform === 'mobile'"/> {{ fromNow }}</p>
			</template>
		</ContentWidget>
		<!-- xCurrent Balance -->

		<!-- Earnings Today -->
		<ContentWidget v-if="todaysEarnings > 0" titleTxt="Mined Today" class="mini hasFooter">
			<div class="row" style="">
				<div class="valueIconDisplay">
					<Coin :coinClass="{anim:animateCoin, gold:todaysEarnings > 0, silver:todaysEarnings < 1}"/>
					{{todaysEarnings}}&nbsp;<span>JSE</span>
				</div>
			</div>
			<template slot="footer" v-if="rewardReceivedFromNow">
				<p class="footerTxt">Received <br v-if="$store.getters.whichPlatform === 'mobile'"/> {{ rewardReceivedFromNow }}</p>
			</template>
		</ContentWidget>
		<!-- xEarnings Today -->

		<!-- Mining Overview -->
		<ContentWidget titleTxt="Mining Overview" class="mini">
			<div class="row" style="">
				<div class="valueIconDisplay">
					<div class="flip-container" :class="{anim:animateHash}">
						<div class="flipper">
							<div class="front">
								<div class="hash"></div>
							</div>
							<div class="back">
								<div class="hash"></div>
							</div>
						</div>
					</div>
					{{hashesFound}}&nbsp;<span>Hashes</span>
				</div>
			</div>
			<div class="row" style="">
				<div class="valueIconDisplay">
					<div class="miner"></div>
						{{activeMiners}}&nbsp;<span>{{minersTitle}}</span>
				</div>
			</div>
		</ContentWidget>
		<!-- Mining Overview -->
	</div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import moment from 'moment';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import Coin from '@/components/widgets/Coin.vue';

/**
 * @description
 * MiningOverview Panel Widget Displays
 * <ul>
 *     <li>Users Current Balance</li>
 *     <li>Todays Earnings - if user has earnt JSE from self mining</li>
 *     <li>Hashes SubmittedHashes Submitted</li>
 *     <li>Active Platform Miners</li>
 * </ul>
 */
export default {
	name: 'MiningOverviewPanelWidget',
	components: {
		ContentWidget,
		Coin,
	},
	data() {
		return {
			activeMiners: '', //active miners
			animateCoin: false, //animates coin icon
			minersTitle: 'Calculating Miners',
		};
	},
	computed: mapState({
		balanceMajor: state => state.user.balanceMajor,
		balanceMinor: state => state.user.balanceMinor,
		todaysEarnings: state => state.user.todaysEarnings,
		fromNow: state => state.user.fromNow,
		rewardReceivedFromNow: (state) => {
			let lastRewardReceived = false;
			//check if platform mining history exists
			if (typeof (state.user.miningHistory[0]) !== 'undefined') {
				lastRewardReceived = moment(state.user.miningHistory[0].ts).fromNow();
			}
			return lastRewardReceived;
		},
		hashesFound: state => state.miner.hashesFound, //total hashes found
		animateHash: state => state.miner.animateHash, //animates hash icon
	}),
	created() {
		const self = this;

		//grab server stats count platform mining user distribution
		const statsReq = {
			session: self.$store.state.user.session,
		};

		//get active miners
		axios.get(
			`${self.$store.state.app.jseCoinServer}/stats/`,
			statsReq,
		).then((res) => {
			self.activeMiners = 0;
			for (const [k, v] of Object.entries(res.data.clients)) {
				self.activeMiners += v.selfMinersCount;
			}
			self.minersTitle = 'Miners';
		}).catch((err) => {
			self.$store.commit('ajaxError', err.response);
		});
	},
};
</script>
<style scoped>
.miningOverview  {
	margin:12px 12px 0px 12px;
}
.platformWeb.mobile .miningOverview {
	margin:12px 6px 0px 6px;
}
.miningOverview dl {
	margin:0px 8px;
	flex-grow: 1;
	width:33%;
}
.platformWeb.mobile .miningOverview dl {
	margin:0px 4px;
}
.miningOverview dl.hasFooter {
	padding-bottom:28px;
}

.miningOverview dt {
	text-align: center;
	padding: 6px 12px;
	font-size:0.7em;
}


.miningOverview .row {
	justify-content:center;
	margin-top:5px;
}
.valueIconDisplay {
	align-self: center;
	align-items: center;
    padding-left: 26px;
    font-size: 2em;
    color: #3598db;
    font-weight: bold;
	display: flex;
	width:100%;
}
.valueIconDisplay span {
    color: #1bb394;
    font-size: 0.6em;
	/*padding-right:8px;*/
}
.valueIconDisplay .coin,
.valueIconDisplay .hash,
.valueIconDisplay .cpu,
.valueIconDisplay .miner {
	margin-left: -26px;
	float:left;
	margin-right:4px;
}
.hash {
	background-image:url('../../assets/hashes.png');
	background-repeat:no-repeat;
	background-size: contain;
	width: 20px;
    height: 20px;
    min-width: 20px;
}
.cpu {
	background-image:url('../../assets/cpu.png');
	background-repeat:no-repeat;
	background-size: contain;
	width: 20px;
    height: 20px;
    min-width: 20px;
}

.miner {
	background-image:url('../../assets/ico_users.png');
	background-repeat:no-repeat;
	background-size: contain;
	width: 20px;
    height: 20px;
    min-width: 20px;
}
.miningOverview dd .coin {
	width:20px;
	height:20px;
	overflow: hidden;
	border-radius: 20px;
	min-width:20px;
	position: relative;
}
.flip-container {
	-webkit-perspective: 1000;
	-moz-perspective: 1000;
	-o-perspective: 1000;
	perspective: 1000;
	margin-left:-26px;
	float:left;
}
@keyframes example {
    100% {transform: rotateY(180deg);}
}

.flip-container.anim .flipper {
/*	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
	-o-transform: rotateY(180deg);*/
	animation-name: example;
    animation-duration: 1s;
}

.flip-container, .front, .back {
	width: 20px;
	height: 20px;
	margin-right:4px;
}

.flipper {
	-webkit-transition: 0.6s;
	-webkit-transform-style: preserve-3d;

	-moz-transition: 0.6s;
	-moz-transform-style: preserve-3d;

	-o-transition: 0.6s;
	-o-transform-style: preserve-3d;

	transition: 0.6s;
	transform-style: preserve-3d;

	position: relative;
}

.front, .back {
	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-o-backface-visibility: hidden;
	backface-visibility: hidden;

	position: absolute;
	top: 0;
	left: 0;
}

.front {
	z-index: 2;
}

.back {
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
	-o-transform: rotateY(180deg);
	transform: rotateY(180deg);
}

.front .hash, 
.back .hash {
	margin:0px;
}
</style>