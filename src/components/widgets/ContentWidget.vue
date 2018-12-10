<template>
	<dl class="card">
		<!-- Title Header -->
		<dt v-if="titleTxt">
			<!-- Title -->
			{{titleTxt}}
			<!-- xTitle -->

			<!-- Info Panel Text -->
			<div v-if="infoPanelTxt && !infoPanelTypeButton" class="titleInfo">
				<Coin v-if="Object.keys(infoPanelIcoClassName).length > 0" :class="infoPanelIcoClassName"/>
				{{infoPanelTxt}}
			</div>
			<!-- xInfo Panel Text -->

			<!-- Header Button Slot -->
			<!-- @slot Use this slot for interactive elements ie buttons -->
			<slot name="headerButton"></slot>
			<!-- xHeader Button Slot -->

			<!-- Console Header Buttons -->
			<div v-if="consoleEnabled" style="float:right; height:10px; width:10px; background:#fe6963; border-radius:20px; margin-left:6px;"></div>
			<div v-if="consoleEnabled" style="float:right; height:10px; width:10px; background:#fcbc3c; border-radius:20px; margin-left:6px;"></div>
			<div v-if="consoleEnabled" style="float:right; height:10px; width:10px; background:#34c748; border-radius:20px; margin-left:6px;"></div>
			<!-- xConsole Header Buttons -->
		</dt>
		<!-- xTitle Header -->

		<!-- Content Container -->
		<dd :style="{'padding': contentPadding, 'position': (hasRelativeContent)?'relative':''}">
			<!-- Content Slot -->
			<!-- @slot Content Widget Body -->
			<slot></slot>
			<!-- xContent Slot -->

			<!-- If Footer -->
			<div class="footerRegion">
				<slot name="footer"></slot>
			</div>
			<!-- xIf Footer -->
		</dd>
		<!-- xContent Container -->
	</dl>
</template>

<script>
import Coin from '@/components/widgets/Coin.vue';
/**
 * @description
 * Content Widget Wrapper
 */
export default {
	name: 'ContentWidget',
	inheritAttrs: false,
	components: {
		Coin,
	},
	props: {
		/**
		 * Panel Main Header Title
		 */
		titleTxt: {
			type: String,
			default: '',
		},
		/**
		 * Right Side Header info text
		 */
		infoPanelTxt: {
			type: String,
			default: '',
		},
		/**
		 * Right Side icon class name
		 */
		infoPanelIcoClassName: {
			type: Object,
			default() {
				return {};
			},
		},
		/**
		 * Right side button or text
		 */
		infoPanelTypeButton: {
			type: Boolean,
			default: false,
		},
		/**
		 * Content region padding style: '0px 0px 0px 0px'
		 */
		contentPadding: {
			type: String,
			default: '',
		},
		/**
		 * content region style position relative
		 */
		hasRelativeContent: {
			type: String, //todo mark as Boolean
			default: '',
		},
		/**
		 * display floating console buttons
		 */
		consoleEnabled: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style scoped>
.miningOverview dd {
	overflow-x:auto;
	white-space: nowrap;
	font-size:0.5em;
	padding:8px;
	/*display: flex;*/
	/*width:140px;*/
}

.night .miningOverview dd::-webkit-scrollbar-track {
}
.miningOverview dd::-webkit-scrollbar-thumb {
    border-radius: 8px;
}
.night .miningOverview dd::-webkit-scrollbar-thumb {
    background-color: #000;
}
.light .miningOverview dd::-webkit-scrollbar-thumb {
    background-color: #dee3e8;
}
.miningOverview dd::-webkit-scrollbar-thumb {
    background-color: none;
}
.miningOverview dd::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    padding: 10px;
}
.platformWeb.min dl {
	margin: 10px;
}
.platformWeb.min dl.mini {
	margin:0px;
}
dl {
	background:#fff;
	margin:16px 20px;
	box-shadow: rgba(210, 214, 217,1) 0px 1px 3px 0px;
	padding:0px;
	border-radius:6px;
	color:#606060;
	position: relative;
	overflow: hidden;
	width: -webkit-fill-available;
}

dl.noExt {
	padding:2px;
}
dl.mini dt {
	height:30px;
	padding: 0px;
    line-height: 30px;
    text-align: center;
	justify-content:center;
    font-size: 0.6em;
}
.platformWeb.min dl.mini dt {
	height:24px;
	padding: 0px;
}

dl.console.mini dt {
	font-size:0.8em;
	text-align:left;
    line-height: initial;
}
dl.console.mini dd {
    padding: 0px 0px 6px 0px;
}

.platformWeb.min dl.mini.buttonFooter dd {
	padding-bottom:60px;
}

.platformWeb.min dl dt {
	/*font-size:0.6em;*/
	height: 34px;
}
.platformWeb.min .titleInfo {
	height:34px;
    min-width: 188px;
}
dl dt {
	border-bottom:solid 1px #eee;
	padding:0px 18px;
	font-weight: bold;
	font-size:0.8em;
	letter-spacing: 1px;
	height: 44px;
	align-items: center;
	display:flex;
    text-transform: capitalize;
}

dl dd {
	padding:16px 16px;
	margin:0px;
	/*position: relative;*/
}
.platformWeb.min dl dd {
	padding:10px;
}

.night fieldset .mini {
	background:#1c1e28;
}
.light fieldset .mini {
	background:#fafafa;
}
.night .mini {
	border: solid 1px #171820
}
.mini dd {
	padding: 0px 0px 4px 0px;
    margin: 4px 8px 0px 8px;
}
.platformWeb.min .mini dd {
	padding: 0px 0px 4px 0px;
    margin: 4px 8px 0px 8px;
}
.night dl {
	background:#20222e;
	box-shadow:rgba(0, 0, 0,0.16) 0px 1px 3px 0px;
}

.night dl dt {
	border-bottom:solid 1px #171820;
	color:#afafaf;
}

.night .titleInfo {
	background:#101219 url('../../assets/images/bg_titleBarDivide_dark.png') no-repeat;
	color:#fff;
	border-bottom: solid 1px #171820;
}
.light .titleInfo {
	background:#2d384d url('../../assets/images/bg_titleBarDivide_light.png') no-repeat;
	color:#fff;
	border-bottom: solid 1px #eee;
}

.titleInfo {
	background-size:25% !important;
	position: absolute;
	right: 0px;
	top:0px;
	height:44px;
    padding: 0px 18px 0px 70px;
	display: flex;
	border-radius: 0px 6px 0px 0px;
	min-width:240px;
	text-align:right;
	align-items: center;
}

.night .titleButton {
    background: #101219;
}

.light .titleButton {
    background: #eaebed;
    color: #676666;
}
.titleButton {
	cursor: pointer;
    background-size: 25% !important;
    position: absolute;
    right: 0px;
    top: 0px;
    /* height: 44px; */
    /* padding: 12px 18px 12px 70px; */
    display: flex;
    border-radius: 6px;
    /* min-width: 240px; */
    text-align: left !important;
	padding: 3px 10px;
    margin: 8px;
    text-transform: uppercase;
    font-size: 0.8em;
	font-weight:bold;
    line-height: 21px;
}

.night .titleButton:hover {
	background:#000;
}

.light .titleButton:hover {
	background:#d7d9dc;
	color:#2a2929;
}

dt button {
    position: absolute;
    right: 8px;
    top: 8px;
    height: 30px;
    color: #fff;
    /* padding: 12px 18px 12px 70px; */
    line-height: 30px;
    width: initial;
	text-transform: none;
}
.platformWeb.min dt button {
	top:4px;
	right:2px;
}

.titleInfo .coin,
.titleInfo .hash,
.titleInfo .booklet {
	margin-right:6px;
	height:20px;
	width:20px;
}
.titleButton .booklet {
	margin-right:6px;
	height:20px;
	width:20px;
}
.titleInfo .hash {
	background-image:url('../../assets/images/hashes_light.png');
}
.night .titleButton .booklet {
	background-image:url('../../assets/images/booklet.png');
}
.light .titleButton .booklet {
	background-image:url('../../assets/images/booklet_light.png');
}
.titleButton .booklet {
	background-repeat: no-repeat;
    background-size: contain;
    margin-right: 6px;
    height: 20px;
    width: 20px;
}

.light .footerRegion  {
	border-radius: 0px 0px 6px 6px;
	text-align:center;
	position:absolute;
	bottom:0px;
	left:0px;
	right:0px;
	background:#fafafa;
	padding:0px 20px;
}
.night .footerRegion  {
	border-radius: 0px 0px 6px 6px;
	text-align:center;
	position:absolute;
	bottom:0px;
	left:0px;
	right:0px;
	background:#1c1e28;
	padding:0px 20px;
}
.footerRegion  {
	border-radius: 0px 0px 6px 6px;
	text-align:center;
	position:absolute;
	bottom:0px;
	left:0px;
	right:0px;
	padding:0px 20px;
}
.mini .footerRegion  {
	font-size:1.3em;
	padding:0px;
}
.light .footerTxt {
	color:#163457;
}
.night .footerTxt {
	color:#3598db;
}
.footerTxt {
	font-size: 0.7em;
	font-weight:bold;
	color:#3598db;
	letter-spacing:1px;
}
.platformWeb.min .footerTxt {
	font-size: 0.6em;
}
.night dl.console {
	background:#171820;
}
.light dl.console {
	background:#163457;
}
dl.console {
	border:0px;
	box-shadow:none;
	margin:10px 0px;
	padding:0px;
}

.platformWeb.min dl.console {
	margin:10px 0px;
}

.night dl.console dt {
	background:#101219;
	color:#fff;
}
.light dl.console dt {
	background:#0f2644;
	color:#fff;
	border:0px;
}
dl.console dt {
	padding: 8px 8px 8px 12px;
	font-family:Courier New, Courier, monospace;
	display:block;
}
.platformWeb.min dl.console dt {
	padding: 5px 8px 5px 12px;
	justify-content: inherit;
	display:block;
}

dl.console dd {
	font-family:Courier New, Courier, monospace;
	font-size:0.8em;
	padding: 4px;
}

.night dl.console dd p {
	color:#7b7c80;
}
.light dl.console dd p {
	color:#7b8c9f;
}
dl.console dd p {
	padding:0px 10px;
}

dd dl {
	/*margin:0px 0px 15px 0px;*/
}
dd dt {
	height: 33px;
	line-height:20px;
	padding:6px 10px;
}

dd dd dl {
	margin:0px;
}
.platformWeb.min dd dd dl {
	margin:0px;
}

dd dd dt {
	margin:0px;
	padding:0px;
	height:20px;
}
.platformWeb.min dd dd dt {
	margin:0px;
	padding:0px;
	height:20px;
}

dd dd dd {
	margin:0px 0px 10px 0px;
	padding:0px;
}
.platformWeb.min dd dd dd {
	margin:0px 0px 10px 0px;
	padding:8px;
}
</style>
