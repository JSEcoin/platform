<template>
	<div>
		<div v-if="coin.used" class="usedCoin">USED</div>
		<div v-if="!coin.used" class="availableCoin">AVAILABLE</div>
	</div>
</template>

<script>
/**
 * @description
 * Coin Status Widget
 */
export default {
	name: 'CoinStatusWidget',
	props: {
		/**
		 * Contains coin properties
		 */
		coin: {
			type: Object,
		},
	},
};
</script>

<style scoped>
.night .usedCoin {
	background:#101219;
	color:#606060;
}
.night .availableCoin {
	background:#101219; 
	color:#00a6c4
}

.light .usedCoin {
    background: #eceded;
    color: #606060;
}
.light .availableCoin {
    background: #eceded;
	color:#00a6c4
}
.usedCoin {
	padding:4px 8px; 
	font-size:0.75em; 
	font-weight:bold;
	line-height:initial; 
	border-radius:3px;
}
.availableCoin {
	padding:4px 8px; 
	font-size:0.75em; 
	font-weight:bold;
	line-height:initial; 
	border-radius:3px; 
}
</style>