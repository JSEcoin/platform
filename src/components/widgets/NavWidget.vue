<template>
	<nav id="JSEA-headerNavWrapper">
		<nav id="JSEA-topLvlNav" class="cf">
			<ul v-if="activeNav === 'test'">
				<li class="active">Test 1</li>
				<li>Test 2</li>
				<li>Test 3</li>
				<li>Test 4</li>
			</ul>
			<ul v-else>
				<router-link v-bind:to="`/dashboard`" tag="li" :class="{'active': activeNav === 'dashboard'}">
					Dashboard
				</router-link>
				<router-link v-bind:to="`/wallet`" tag="li" :class="{'active': activeNav === 'wallet'}">
					Wallet
				</router-link>
				<router-link v-bind:to="`/mine`" tag="li" :class="{'active': activeNav === 'mine'}">
					Mine
				</router-link>
				<router-link class="hasNoNav" v-bind:to="`/settings`" tag="li" :class="{'active': activeNav === 'settings'}">
					Settings
				</router-link>
				<router-link v-if="(screen === 'max')" class="hasNoNav" v-bind:to="`/blockchain`" tag="li" :class="{'active': activeNav === 'blockchainLatest'}">
					Blockchain Latest
				</router-link>
				<router-link v-if="(screen === 'max')" class="hasNoNav" v-bind:to="`/blockchain`" tag="li" :class="{'active': activeNav === 'allBlocks'}">
					All Blocks
				</router-link>
				<router-link v-if="(screen === 'max')" class="hasNoNav" v-bind:to="`/blockchain`" tag="li" :class="{'active': activeNav === 'activeBlock'}">
					Active Block
				</router-link>
				<router-link v-if="(screen === 'max')" class="hasNoNav" v-bind:to="`/blockchain`" tag="li" :class="{'active': activeNav === 'transactionInfo'}">
					Transaction Info
				</router-link>
			</ul>
		</nav>

		<nav v-if="activeSubNav" id="JSEA-topSubLvlNav" class="cf">
			<ul v-if="activeNav === 'test'">
				<li>Sub Test 1</li>
				<li class="active">Sub Test 2</li>
				<li>Sub Test 3</li>
			</ul>

			<ul v-if="activeNav === 'dashboard'">
				<router-link v-bind:to="`/dashboard`" tag="li" :class="{'active': activeSubNav === 'overview'}">
					Overview
				</router-link>
				<router-link v-bind:to="`/dashboard/account`" tag="li"  :class="{'active': activeSubNav === 'account'}">
					Account
				</router-link>
				<!--<router-link v-bind:to="`/dashboard/exchange`" tag="li"  :class="{'active': activeSubNav === 'exchange'}">
					Exchange
				</router-link>-->
			</ul>

			<ul v-if="activeNav === 'wallet'">
				<router-link v-bind:to="`/wallet`" tag="li" :class="{'active': activeSubNav === 'transfer'}">
					Transfer
				</router-link>
				<router-link v-bind:to="`/wallet/export`" tag="li" :class="{'active': activeSubNav === 'export'}">
					Export
				</router-link>
				<router-link v-bind:to="`/wallet/import`" tag="li" :class="{'active': activeSubNav === 'import'}">
					Import
				</router-link>
				<router-link v-bind:to="`/wallet/transactions`" tag="li" :class="{'active': activeSubNav === 'transactions'}">
					Transactions
				</router-link>
			</ul>

			<ul v-if="activeNav === 'mine'">
				<router-link v-bind:to="`/mine`" tag="li" :class="{'active': activeSubNav === 'mine'}">
					Platform Miner
				</router-link>
				<router-link v-bind:to="`/mine/earnings`" tag="li" :class="{'active': activeSubNav === 'earnings'}">
					Earnings History
				</router-link>
			</ul>
		</nav>
	</nav>
</template>

<script>
import { mapState } from 'vuex';

/**
 * @description
 * Top Lvl Nav Items
 */
export default {
	name: 'NavWidget',
	props: {
		/**
		 * Highlights Active Nav Item ['dashboard', 'wallet', 'mine', 'settings']
		 */
		activeNav: {
			type: String,
			default: '',
		},
		/**
		 * Highlights Active Sub Nav Item {'dashboard':['overview', 'account']} {'wallet':['transfer', 'export', 'import, 'transactions']} {'mine':['mine', 'earnings]}
		 */
		activeSubNav: {
			type: String,
			default: '',
		},
	},
	computed: mapState({
		screen: state => state.app.screen,
	}),
};
</script>

<style scoped>
#JSEA-headerNavWrapper {
	position: relative;
	z-index: 10;
}
.platformWeb.min #JSEA-topLvlNav li,
.platformDesktop.min #JSEA-topLvlNav li {
	/*font-size:0.6em;*/
	padding: 8px 0px;
}
.platformWeb.min .light #JSEA-topSubLvlNav li {
	/*font-size:0.5em;*/
	padding: 8px 0px;
}

.platformWeb.max #JSEA-topSubLvlNav li,
.platformDesktop.max #JSEA-topSubLvlNav li {
	padding: 6px 12px;
	flex-grow: unset;
}

.platformWeb.max #JSEA-topLvlNav li,
.platformDesktop.max #JSEA-topLvlNav li {
	flex-grow: unset;
}

.night #JSEA-topLvlNav li:hover,
.night #JSEA-topLvlNav li.active {
	background:#101219;
	color:#fff;
}

.night #JSEA-topLvlNav li {
	color:#3598db;
}

.light #JSEA-topSubLvlNav {
	background:#3598db;
    border-bottom: solid 2px #1970c7;
    position: relative;
}
.max.light #JSEA-topSubLvlNav {
	background:#fff;
}
.max.night #JSEA-topSubLvlNav {
	background: #20222e;
}
.max.light #JSEA-topSubLvlNav li,
.max.night #JSEA-topSubLvlNav li {
	color: #3598db;
}

.light #JSEA-topSubLvlNav li.active,
.light #JSEA-topSubLvlNav li:hover {
	color:#fff;
	background:#1970c7;
	cursor: pointer;
}
.light #JSEA-topSubLvlNav li {
	color:rgba(255,255,255,0.9);
}

.night #JSEA-topLvlNav {
    background: #20222e;
    border-bottom: solid 2px #101219;
}

.night #JSEA-topSubLvlNav {
	background:#101219;
    border-bottom: solid 2px #000;
}

#JSEA-topSubLvlNav ul {
	display:flex;
	margin:0px;
	padding:0px;
}

#JSEA-topSubLvlNav li {
	list-style: none;
    flex-grow: 1;
	text-align: center;
	padding:10px 0px;
	font-size:0.7em;
	text-transform:uppercase;
	letter-spacing:1px;
	transition: background 0.2s, color 0.2s;
	font-weight:800;
}

.night #JSEA-topSubLvlNav li {
	color:#73b6fb;
}

.night #JSEA-topSubLvlNav li.active,
.night #JSEA-topSubLvlNav li:hover {
	color:#fff;
	background:#000;
	cursor: pointer;
}
#JSEA-topLvlNav {
	background:#fff;
	border-bottom:solid 2px #3598db;
}

.max #JSEA-topLvlNav {
	border-bottom:0px;
}

#JSEA-topLvlNav ul {
	margin:0px;
	padding:0px;
	display:flex;
}

#JSEA-topLvlNav li {
	list-style: none;
	color:#3598db;
	text-transform: uppercase;
	flex-grow:1;
	padding:8px 18px;
	cursor: pointer;
	font-weight: bold;
	font-size:0.8em;
	letter-spacing: 1px;
	text-align:center;
	transition: background 0.2s, color 0.2s;
	display: block;
}

.max #JSEA-topLvlNav li {
	display: none;
    padding: 10px 10px 9px 10px;
}
.max.light #JSEA-topLvlNav li {
	color:#606060;
}

.max #JSEA-topLvlNav li.active {
	display: block;
	background: transparent;
    width: 100%;
    text-align: left;
}

#JSEA-topLvlNav li:hover {
	background:#eaf4fb;
}

#JSEA-topLvlNav li.active {
	background:#3598db;
	color:#fff;
}
.max.light .hasNoNav {
    box-shadow: inset 0px -0.5px 0px 0px #ddd;
}
.max.night .hasNoNav {
    box-shadow: inset 0px -0.5px 0px 0px #171820;
}

</style>
