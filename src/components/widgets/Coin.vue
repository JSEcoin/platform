<template>
	<div class="coin" :class="coinClass">
		<div class="coinGlintLrge"></div>
	</div>
</template>

<script>
/**
 * @description
 * <p>Show coin [Silver, Gold]</p>
 */
export default {
	name: 'Coin',
	props: {
		/**
		 * Coin Class Name [small, gold, silver, anim]
		 */
		coinClass: {
			type: Object,
			default() {
				return {};
			},
		},
	},
};
</script>

<style scoped>
.coin {
    background-repeat: no-repeat;
    background-size: contain;
    width: 55px;
    height: 55px;
	margin-right: 6px;
	position: relative;
	overflow: hidden;
}

.coin.small {
	width:20px;
	height:20px;
}

.coin.gold {
	background-image:url('../../assets/coin_gold.png');
	border-radius: 55px;
}
.coin.silver {
	background-image:url('../../assets/coin_silver.png');
	border-radius: 20px;
}

.coinGlintLrge {
	opacity:0;
	position: absolute;
	background:#fff;
	width:8px;
	height:100%;
	left:-10px;
	transition:left 0.4s;
	transform: skewX(20deg);
}

.anim.coin .coinGlintLrge {
	opacity:0.65;
	left:70px;
}
.anim.coin.small .coinGlintLrge {
	left:25px;
}
</style>