<template>
	<AppWrapperWidget>
		<NavWidget activeNav="mine" activeSubNav="mine"></NavWidget>
		<ScrollWidget>
			
			<ContentWidget 
				v-if="($store.getters.isAppGoogle)"
				titleTxt="Mining functionality: [Disabled]" 
				class="mini buttonFooter"
				style="text-align:center; margin:10px;">
				<p style="color:#fff;">
					This to comply with Googles Restricted Content policy.
				</p>
					
				<p style="color:#fff;">
					If you would like to enable the mining feature on your mobile please download and install our "Alpha Mobile App" available from gitHub.
				</p>
				
				<template slot="footer">
					<div style="font-size: 12px; display: flex; justify-content: space-around; padding: 10px;">
						<ButtonWidget
							:isSmall="true"
							v-on:click.native="openExternalWindow('https://play.google.com/about/restricted-content/financial-instruments/cryptocurrencies/')"
							buttonTxt="Googles guidelines"/>

						<ButtonWidget
							:isSmall="true"
							v-on:click.native="openExternalWindow('https://github.com/JSEcoin/platform/releases')"
							buttonTxt="Alpha mobile release"/>
					</div>
				</template>
			</ContentWidget>
			<!-- Mining Overview -->
			<MiningOverviewPanelWidget/>
			<!-- xMining Overview -->

			<!-- Hash Rate Percentage Chart -->
			<ContentWidget 
				v-if="(!$store.getters.isAppGoogle)"
				titleTxt="Hash Rate Percentage Chart" 
				contentPadding="60px 10px 0px 10px" 
				hasRelativeContent="true" 
				:infoPanelTxt="`${hps} H/s`" 
				:infoPanelIcoClassName="{hash: true}">
				<!-- Mining Accelerator -->
				<MiningAcceleratorWidget/>
				<!-- xMining Accelerator -->

				<!-- Toggle Mining Button -->
				<ButtonWidget 
					iconClassName="miningIco" 
					v-on:click.native="toggleMining" 
					:buttonTxt="miningButton" 
					:class="{green:!startedMining, red:startedMining}"/>
				<!-- xToggle Mining Button -->
				
				<!-- Mining HashRate Chart -->
				<MiningChartWidget/>
				<!-- xMining HashRate Chart -->
				
				<!-- Console -->
				<ConsoleWidget/>
				<!-- xConsole -->
			</ContentWidget>
			<!-- xHash Rate Percentage Chart -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import { mapState } from 'vuex';
import AppWrapperWidget from '../widgets/AppWrapperWidget.vue';
import NavWidget from '../widgets/NavWidget.vue';
import ScrollWidget from '../widgets/ScrollWidget.vue';
import MiningOverviewPanelWidget from '../widgets/MiningOverviewPanelWidget.vue';
import ContentWidget from '../widgets/ContentWidget.vue';
import ButtonWidget from '../widgets/ButtonWidget.vue';
import MiningAcceleratorWidget from '../widgets/MiningAcceleratorWidget.vue';
import MiningChartWidget from '../widgets/MiningChartWidget.vue';
import ConsoleWidget from '../widgets/ConsoleWidget.vue';

/**
 * @description
 * <p>Platform Miner provides an overview of:</p>
 * <ul>
 *     <li>Users Current Balance</li>
 *     <li>Todays Earnings - Only displayed if user has earnt JSE from self mining</li>
 *     <li>Hashes Submitted</li>
 *     <li>Active Platform Miners</li>
 * </ul>
 * <p>Provides the ability to:</p>
 * <ul>
 *     <li>allow users to "Start"/"Stop" Mining</li>
 *     <li>control of the CPU resources to be used to find a hash from the Mining Accelerator</li>
 * </ul>
 * <p>Additionally a console display is available to track the activity of the miner</p>
 */
export default {
	name: 'PlatformMiner-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		MiningOverviewPanelWidget,
		ContentWidget,
		MiningAcceleratorWidget,
		ButtonWidget,
		MiningChartWidget,
		ConsoleWidget,
	},
	computed: mapState({
		hps: state => state.miner.hps,
		miningButton: state => state.miner.miningButton,
		startedMining: state => state.miner.startedMining,
	}),
	methods: {
		/**
		 * Toggle Mining (Start/Stop)
		 *
		 * @returns nothing
		 * @public
		 */
		toggleMining() {
			const self = this;
			//start stop miner
			if (window.quitMining) {
				self.$store.dispatch({
					type: 'startPlatformMining',
				});
			} else {
				self.$store.dispatch({
					type: 'stopPlatformMining',
				});
			}
		},
		/**
		 * Opens an external browser window and takes the user to the official upgrade forum post
		 * https://jsecoin.com/topic/jsecoin-desktop-mining-app-0-4-0-download/
		 *
		 * @param {string} url Web address to open in a new browser window
		 * @public
		 */
		openExternalWindow(url) {
			const self = this;
			if (self.$store.getters.whichPlatform === 'desktop') {
				this.$electron.shell.openExternal(url);
			} else if (self.$store.getters.whichPlatform === 'mobile'){
				cordova.InAppBrowser.open(url, '_system');
			} else {
				window.open(url);
			}
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.night #JSEA-legend {
	background:#1c1e28;
	border:solid 1px #171820;
	color:#676666;
}
.light #JSEA-legend {
	background:#fafafa;
	border:solid 1px #eceded;
	color:#676666;
}
#JSEA-legend {
	border-radius:6px;
	font-size:0.7em;
	float:right;
	padding:4px 8px;
}
#JSEA-key {
	height: 4px;
	width: 16px;
	background: #88bbc8;
	display: inline-block;
	margin:0px 5px 2px 0px;
}


@keyframes glow {
  0%   { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
.night #JSEW-miningStatus {
    background: #101219;
    color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.8), inset 0px 0px 0px 1px rgba(255,255,255,0.3);
}
.light #JSEW-miningStatus {
    background: #fafafa;
    color: #163457;
	box-shadow: 0px 1px 3px 0px rgba(255,255,255,0.8), inset 0px 0px 0px 1px rgba(0,0,0,0.1);
}
#JSEW-miningStatus {
	display:none;
	position: absolute;
    top: 24px;
    /* margin: 0px auto; */
    width: 200px;
    left: 50%;
    margin-left: -100px;
    padding: 8px 16px;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.8em;
	font-weight:bold;
    border-radius: 6px;
    letter-spacing: 1px;
	z-index:1;
}
#JSEW-miningStatus.active {
	display: block;
	animation: glow 2s infinite;
}
</style>
