Example of animated splash display

```vue
<template>
	<div class="light" style="position:relative; width:320px; height:400px; margin:0px auto;">
		<Splash 
			textDisplay="Example Widget"
			v-bind="{
				showWidget: splashWidget.activeAppIco,
				animateTxt: splashWidget.activeTxt
			}" />
		<div>
			<ButtonWidget buttonTxt="Refresh" v-on:click.native="refresh" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			splashWidget: {
				activeAppIco: false, //fadeIn Animation flag
				activeTxt: false, //text animation flag
			},
		};
	},
	created() {
		const self = this;
		self.refresh();
	}, 
	methods: {
		refresh() {
			const self = this;
			//reset
			self.splashWidget.activeAppIco = false;
			self.splashWidget.activeAppIco = false;

			//splash animation intro setup
			setTimeout(function(){
				self.splashWidget.activeAppIco = true;
				setTimeout(function(){
					self.splashWidget.activeTxt = true;
				},500);
			},2000);
		},
	},
};
</script>
```
