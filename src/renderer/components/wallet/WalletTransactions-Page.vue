<template>
	<AppWrapperWidget>
		<NavWidget activeNav="wallet" activeSubNav="transactions"></NavWidget>
		<ScrollWidget>
			<!-- Sent -->
			<ContentWidget titleTxt="Sent JSE To">
				<ContentWidget 
					class="containedTransferItem" 
					:titleTxt="coinDate(transaction.ts)" 
					:infoPanelTxt="`${transaction.value}`" 
					:infoPanelIcoClassName="{gold:transaction.value >= 1, silver:transaction.value < 1}" 
					:key="`id${i}`" 
					v-if="((transaction.command === 'transfer') && (transaction.value < 0))" 
					v-for="(transaction, i) in userHistory">

					<dl class="transactionRef">
						<dt style="font-weight:bold;">SENT: </dt>
						<dd>{{transaction.user2email}}</dd>
						
						<dt v-if="transaction.reference" style="font-weight:bold;">REFERENCE: </dt>
						<dd class="ref" v-if="transaction.reference">"{{transaction.reference}}"</dd>
					</dl>
				</ContentWidget>
			</ContentWidget>
			<!-- xSent -->
			
			<!-- Received -->
			<ContentWidget titleTxt="Received JSE From">
				<ContentWidget  
					class="containedTransferItem" 
					:titleTxt="coinDate(transaction.ts)" 
					:infoPanelTxt="`${transaction.value}`" 
					:infoPanelIcoClassName="{gold:transaction.value >= 1, silver:transaction.value < 1}"
					:key="`id${i}`" 
					v-if="((transaction.command === 'transfer') && (transaction.value > 0))" 
					v-for="(transaction, i) in userHistory">
				
					<dl class="transactionRef">
						<dt style="font-weight:bold;">RECEIVED: </dt>
						<dd>{{transaction.user1email}}</dd>
						
						<dt v-if="transaction.reference" style="font-weight:bold;">REFERENCE: </dt>
						<dd class="ref" v-if="transaction.reference">"{{transaction.reference}}"</dd>
					</dl>
				</ContentWidget>
			</ContentWidget>
			<!-- xReceived -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import moment from 'moment';
import AppWrapperWidget from '../widgets/AppWrapperWidget.vue';
import NavWidget from '../widgets/NavWidget.vue';
import ScrollWidget from '../widgets/ScrollWidget.vue';
import ContentWidget from '../widgets/ContentWidget.vue';

/**
 * @description
 * <p>Displays a list of JSE transactions <b>"Sent"</b> and <b>"Recieved"</b>.</p>
 */
export default {
	name: 'WalletTransactions-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
	},
	data() {
		return {
			user: {},
			userHistory: [],
		};
	},
	created() {
		this.user = window.user;
		//rever history obj list and create easy loopabe array
		this.userHistory = Object.values(this.user.history).slice().reverse();
	},
	methods: {
		/**
		 * Updates coin timestamp with readable date format
		 *
		 * @param {string} ts - coin timestamp
		 * @returns nothing
		 * @public
		 */
		coinDate(ts) {
			return moment(ts).format('DD/MM/YY HH:mm:s');
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.night dl.containedTransferItem {
	background:#171820;
}

.light dl.containedTransferItem {
	background:#fafafa;
}

dl.containedTransferItem {
	border-radius: 6px;
	box-shadow: none;
	padding:0px;
	margin:0px 0px 10px 0px;
}
.platformWeb.mobile dl.containedTransferItem {
	margin:0px 0px 10px 0px;
}

.night .containedTransferItem dt {
	background:#101219;
}
.light .containedTransferItem dt {
	background:#eceded;
	border:0px;
}
.containedTransferItem dt {
	height:34px;
	line-height:34px;
	padding:0px 16px;
}
.night .containedTransferItem dt .titleInfo {
	background-color:#000;
	background-image: url(../../assets/images/bg_titleBarDivide_dark_sub.png);
    height: 33px;
    padding: 6px 18px 5px 70px;
    line-height: 20px;
	min-width: 200px;
}
.light .containedTransferItem dt .titleInfo {
	background-color:#1d2536;
	background-image: url(../../assets/images/bg_titleBarDivide_light_sub.png);
	border:0px;
	height: 33px;
    padding: 6px 18px 5px 70px;
    line-height: 20px;
	min-width: 200px;
}

.containedTransferItem dd {
	position: relative;
	/*min-height:90px;*/
	word-wrap: break-word;
}
.center-line {
	position: absolute;
    top: 20px;
    left: 40px;
    z-index: 10;
    /* bottom: 20px; */
    width: 2px;
    -webkit-transform: translateX(-1px);
    transform: translateX(-1px);
    background-color: #00a6c4;
    height: 40px;
}
.item1 {
	position: relative;
    -ms-flex-preferred-size: 50%;
    flex-basis: 50%;
    /* margin: 5rem 0 0; */
    right: -18px;
    top: -40px;
}.item2 {
	position: relative;
    -ms-flex-preferred-size: 50%;
    flex-basis: 50%;
    /* margin: 5rem 0 0; */
    right: -18px;
    top: inherit;
}
.item1:before, 
.item2:before {
    content: "";
    position: absolute;
    z-index: 20;
    top: calc(1.8rem + 7px);
    width: 8px;
    height: 8px;
    border: 2px solid #0490ab;
    border-radius: 9999px;
    background-color: #182a36;
}
.item1 .info,
.item2 .info {
    position: absolute;
    z-index: 10;
    top: calc(1.8rem + 4px);
    font-family: montserratlight,sans-serif;
    font-size: 14px;
    line-height: 18px;
    color: #0490ab;
    text-align: center;
	left:20px;
}
.transactionRef { 
	margin-top:0px !important;
	background:transparent !important;
	border-radius:6px;
	font-size:0.8em;
	padding:0px;
	margin:10px 0px 0px 0px;
	box-shadow: none !important;
}

.transactionRef dt {
	height:30px;
	line-height:30px;
	padding:0px 8px;
	border-radius: 0px;
	background:transparent !important;
} 
.transactionRef dd {
	padding:0px 8px;
}
.night .transactionRef dd.ref {
	background:#101219;
	color:#9a9a9a;
	box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.8);
}
.light .transactionRef dd.ref {
	background:#eceded;
	color:#606060;
}
.transactionRef dd.ref {
	padding:4px 8px;
	border-radius: 6px;
    margin: 0px 0px 10px 0px;
}
</style>
