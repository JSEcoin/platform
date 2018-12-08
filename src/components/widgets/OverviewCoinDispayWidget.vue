<template>
	<div style="display:flex">
		<Coin v-if="Object.keys(coinClass).length > 0" :class="coinClass" />
		<div class="coinBalanceDisplay">
			{{coinTotal}} <span>JSE</span>
		</div>
	</div>
</template>

<script>
import Coin from '@/components/widgets/Coin.vue';
/**
 * @description
 * Overview Coin Dispay Widget
 */
export default {
	name: 'OverviewCoinDispayWidget',
	components: {
		Coin,
	},
	props: {
		/**
		 * Coin Class Name
		 */
		coinClass: {
			type: Object,
			default() {
				return {};
			},
		},
		/**
		 * Coin value
		 */
		coinTotal: {
			type: String,
			default: '0',
		},
	},
};
</script>

<style scoped>
.coinBalanceDisplay {
	align-self:center;
	padding-left:10px;
	font-size:2em;
	color:#3598db;
	font-weight:bold;
}

.coinBalanceDisplay span {
	color:#1bb394;
	font-size:0.6em;
}
</style>
