<template>
	<div class="miningOverview" style="margin:0px; padding:0px;">
		<div class="row">
			<!-- Platform Mining -->
			<ContentWidget
				v-if="(todaysEarnings > 0)" titleTxt="Mined Today"
				class="mini hasFooter">
				<div class="row" style="">
					<div v-if="todaysEarnings >= 1" class="valueIconDisplay">
						<Coin :coinClass="{gold: todaysEarnings >= 1, silver:minedLifetime < 1}"/>
						{{todaysEarnings}}&nbsp;<span>JSE</span>
					</div>
				</div>
				<template slot="footer">
					<p class="footerTxt">Reset {{statsReset}} Hrs Ago</p>
				</template>
			</ContentWidget>
			<!-- xPlatform Mining -->

			<!-- Publisher Mining -->
			<ContentWidget
				v-if="(minedLifetime > 0)" titleTxt="Mined Lifetime"
				class="mini hasFooter">
				<div class="row" style="">
					<div class="valueIconDisplay">
						<Coin :coinClass="{gold:minedLifetime > 0, silver:minedLifetime < 1}"/>
						{{minedLifetime}}&nbsp;<span>JSE</span>
					</div>
				</div>
				<template slot="footer">
					<p class="footerTxt">Registered {{registrationDate}}</p>
				</template>
			</ContentWidget>
			<!-- xPublisher Mining -->
		</div>
		<MinedOverviewChartWidgetC3 />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import Coin from '@/components/widgets/Coin.vue';
import OptionsListWrapperWidget from '@/components/widgets/OptionsListWrapperWidget.vue';
import MinedOverviewChartWidgetC3 from '@/components/widgets/MinedOverviewChartWidgetC3.vue';

/**
 * @description
 * Miner Panel Widget Displays
 * <ul>
 *     <li>Platform Mining Reward</li>
 *     <li>Publisher Mining Reward</li>
 *     <li>Referral Rewards</li>
 * </ul>
 */
export default {
	name: 'RewardPanelWidget',
	components: {
		ContentWidget,
		Coin,
		OptionsListWrapperWidget,
		MinedOverviewChartWidgetC3,
	},
	computed: mapState({
		todaysEarnings: state => state.user.todaysEarnings,
		minedLifetime: state => state.user.minedLifetime,
		statsReset: state => state.user.statsReset,
		registrationDate: state => state.user.registrationDate,
	}),
};
</script>
<style scoped>
.miningOverview  {
	margin:12px 12px 0px 12px;
}
.platformWeb.min .miningOverview {
	margin:12px 6px 0px 6px;
}
.miningOverview dl {
	margin:0px 8px;
	flex-grow: 1;
	width:33%;
}
.platformWeb.min .miningOverview dl {
	margin:0px 4px;
}
.miningOverview dl.hasFooter {
	padding-bottom:28px;
}

.min .miningOverview dl.hasFooter {
	padding-bottom:38px;
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
