<template>
	<div>
		<div class="miningOverview row" style="margin: 0px; padding: 0px;">
			<!-- Next Pending Payment -->
			<ContentWidget
				v-if="(pendingNextPayment >= 0)"
				titleTxt="Next Pending Payment"
				class="mini">
				<div class="row" style="">
					<div v-if="pendingNextPayment >= 0" class="valueIconDisplay">
						<Coin :coinClass="{gold: pendingNextPayment >= 1, silver:pendingNextPayment < 1}"/>
						{{pendingNextPayment}}&nbsp;<span>JSE</span>
					</div>
				</div>
			</ContentWidget>
			<!-- xNext Pending Payment -->

			<!-- Due 24hrs -->
			<ContentWidget v-if="(pendingToday >= 0)"
				titleTxt="Due within 24hrs"
				class="mini">
				<div class="row" style="">
					<div class="valueIconDisplay">
						<Coin :coinClass="{gold:pendingToday > 0, silver:pendingToday < 1}"/>
						{{pendingToday}}&nbsp;<span>JSE</span>
					</div>
				</div>
			</ContentWidget>
			<!-- xDue 24hrs -->
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import Coin from '@/components/widgets/Coin.vue';

/**
 * @description
 * Reward Payment Panel Overview Widget Displays
 * <ul>
 *     <li>Next Pending Payment Due</li>
 *     <li>Due within 24hrs</li>
 * </ul>
 */
export default {
	name: 'RewardPanelWidget',
	components: {
		ContentWidget,
		Coin,
	},
	computed: mapState({
		pendingNextPayment: state => state.user.pendingNextPayment,
		pendingToday: state => state.user.pendingToday,
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
	background-image:url('../../assets/images/hashes.png');
	background-repeat:no-repeat;
	background-size: contain;
	width: 20px;
    height: 20px;
    min-width: 20px;
}
.cpu {
	background-image:url('../../assets/images/cpu.png');
	background-repeat:no-repeat;
	background-size: contain;
	width: 20px;
    height: 20px;
    min-width: 20px;
}

.miner {
	background-image:url('../../assets/images/ico_users.png');
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

.night .c3-grid line {
	stroke:#101219;
}
.light .c3-grid line {
	stroke:#e5e5e5;
}

.night .c3-circle {
	stroke: #20222e;
	fill: #fafafa !important;
	stroke-width: 1.7;
	cursor: default !important;
}
.c3-event-rect{
	cursor: default !important;
}
.light .c3-circle {
	stroke: #88bbc8;
	fill: #fff !important;
	stroke-width: 1.5;
}
.night .c3-line-Hash-Rate {
	stroke: #88bbc8 !important
}
.light .c3-line-Hash-Rate {
	stroke: #88bbc8 !important
}
</style>
