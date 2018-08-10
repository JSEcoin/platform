<template>
	<div class="sliderWrapper">
		<div class="accText">Mining Accelerator</div>
		<VueSlider 
			ref="slider" 
			v-bind="{
				'tooltip-dir': 'bottom',
				'formatter': updateSlider(slider.value),
				style: slider.style,
				min: slider.minVal,
				max: slider.maxVal,
				tooltipStyle: slider.tooltipStyle,
				piecewise: true
			}" 
			v-model="slider.value" 
			:processStyle="slider.processStyle">
		</VueSlider>
	</div>
</template>

<script>
//import { mapState } from 'vuex';
import VueSlider from 'vue-slider-component';
/**
 * @description
 * Mining Accelerator Widget
 */
export default {
	name: 'MiningAcceleratorWidget',
	components: {
		VueSlider,
	},
	props: {
		forceTheme: {
			type: String,
			default: 'light',
		},
	},
	data() {
		return {
			slider: {
				value: 3,
				processStyle: {
					backgroundColor: 'rgba(254, 80, 75, 0)',
				},
				style: {
					margin: '0px',
				},
				minVal: 1,
				maxVal: 9,
				tooltipStyle: [
					{
						backgroundColor: 'rgba(254, 80, 75, 0)',
						borderColor: '#f05b72',
					},
					{
						backgroundColor: 'rgba(254, 80, 75, 0)',
						borderColor: '#3498db',
					},
				],
			},
		};
	},
	created() {
		const self = this;

		//get update hashrate acc value
		if (localStorage.getItem('hashRateAccStored') !== null) {
			self.slider.value = localStorage.getItem('hashRateAccStored');
		}

		//update processStyle colour
		if ((self.$store.state.app.theme === 'light') && (self.forceTheme === 'light')) {
			self.slider.processStyle.backgroundColor = 'rgba(45,56,77,0)';
		} else {
			self.slider.processStyle.backgroundColor = 'rgba(16,18,25,0)';
		}
	},
	methods: {
		/**
		 * Updates accelerator colour based on value and stores selected value
		 *
		 * @param {string} val - Selected slide option value
		 * @public
		 */
		updateSlider(val) {
			const self = this;
			let bgSliderColor = `rgba(16,18,25, ${val / self.slider.maxVal})`;
			if ((self.$store.state.app.theme === 'light') && (self.forceTheme === 'light')) {
				bgSliderColor = `rgba(45,56,77, ${val / self.slider.maxVal})`;
			}
			self.slider.processStyle.backgroundColor = bgSliderColor;
			self.$store.commit('updateHashAcc', val);
		},
	},
};
</script>

<style scoped>
.night .sliderWrapper{
    border-bottom: solid 1px #171820;
}

.light .sliderWrapper{
    border-bottom: solid 1px #eee;
}

.sliderWrapper {
	position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    padding: 10px;
}
.platformWeb.mobile .sliderWrapper {
	padding: 20px 0px 4px 0px;
}
.night .accText {
}
.light .accText {
	color:#999;
}
.accText {
	font-size: 0.55em;
    font-weight: bold;
    letter-spacing: 1px;
    position: absolute;
    top: 6px;
    left: 18px;
}
</style>
