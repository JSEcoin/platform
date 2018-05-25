Example of button widgets with font awesome 4.7 support

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<ButtonWidget buttonTxt="large" />
				<ButtonWidget v-bind="{isSmall:true}" buttonTxt="small" />
				<div class="hr"><hr /></div>
				<div class="row buttonActions">
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-copy" />
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-download" />
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-close" />
				</div>
				<div class="hr"><hr /></div>
				<ButtonWidget 
					iconClassName="miningIco" 
					v-on:click.native="toggleMining" 
					buttonTxt="Mine JSE" 
					:class="{green:!startedMining, red:startedMining}"/>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<ButtonWidget buttonTxt="large" />
				<ButtonWidget v-bind="{isSmall:true}" buttonTxt="small" />
				<div class="hr"><hr /></div>
				<div class="row buttonActions">
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-copy" />
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-download" />
					<ButtonWidget v-bind="{isSmall:true}" iconClassName="fa fa-close" />
				</div>
				<div class="hr"><hr /></div>
				<ButtonWidget 
					iconClassName="miningIco" 
					v-on:click.native="toggleMining" 
					buttonTxt="Mine JSE" 
					:class="{green:!startedMining, red:startedMining}"/>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			startedMining: false,
		};
	},
	methods: {
		toggleMining() {
			const self = this;
			self.startedMining = !self.startedMining;
		},
	},
};
</script>

<style scoped>
button {
	margin:10px !important;
}

.row.buttonActions {
    justify-content: center;
}

.row {
    display: flex;
}
</style>
```
