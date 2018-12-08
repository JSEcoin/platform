Coin type display - [Gold, Silver] - may add more options in future.

```vue
<template>
	<div>
		<ButtonWidget buttonTxt="Animate Coins" v-on:click.native="animateCoin"/>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<div class="row">
					<Coin :coinClass="{gold: true, anim: animate}" />
					<Coin :coinClass="{silver: true, anim: animate}" />
				</div>
				<div class="hr"><hr/></div>
				<div class="row">
					<Coin :coinClass="{gold: true, small: true, anim: animate}" />
					<Coin :coinClass="{silver: true, small: true, anim: animate}" />
				</div>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<div class="row">
					<Coin :coinClass="{gold: true, anim: animate}" />
					<Coin :coinClass="{silver: true, anim: animate}" />
				</div>
				<div class="hr"><hr/></div>
				<div class="row">
					<Coin :coinClass="{gold: true, small: true, anim: animate}" />
					<Coin :coinClass="{silver: true, small: true, anim: animate}" />
				</div>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			animate: false,
		};
	},
	methods: {
		animateCoin() {
			const self = this;
			console.log('click');

			self.animate = true;
			setTimeout(() => {
				self.animate = false;
			},1000);
		},
	},
};
</script>
```
