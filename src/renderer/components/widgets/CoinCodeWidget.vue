<template>
	<div class="row">
		<div class="coinArea" :title="coin.coinCode" :class="{clickable: showQR}">
			<div v-if="showQR" class="selector" :class="{coincode: !coin.used}"></div>
			<Coin :coinClass="{gold:coin.value >= 1, silver:coin.value < 1, small: true}" />
			{{coin.value}}
		</div>
	</div>
</template>

<script>
import Coin from '@/components/widgets/Coin.vue';
/**
 * @description
 * Coin Code Widget
 */
export default {
	name: 'CoinCodeWidget',
	components: {
		Coin,
	},
	props: {
		/**
		 * Coin Object
		 */
		coin: {
			type: Object,
		},
		/**
		 * Show QR code Icon
		 */
		showQR: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style scoped>

.night .coincode {
	background-image:url('../../assets/coincode_night.png');
	background-repeat: no-repeat;
}
.light .coincode {
	background-image:url('../../assets/coincode_light.png');
	background-repeat: no-repeat;
}

.selector {
	width:20px;
	background-size: 20px;
	margin-right:4px;
}
.selector.coincode {
	background-position: center;
}
.light .coinArea {
	color:#606060;
}
.night .coinArea {
	color:#606060;
}
.coinArea {
	padding: 4px 8px;
	border-radius: 3px;
	display:flex; 
	/*line-height:initial;*/
	line-height: 22px;
	flex-grow: 1;
}
.night .clickable.coinArea:hover {
	background: rgb(16, 18, 25);
}
.light .clickable.coinArea:hover {
	background: #eceded;
}
</style>