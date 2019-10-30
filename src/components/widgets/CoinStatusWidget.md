Displays if the coin has been exported and is available or has been used.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<CoinStatusWidget 
					v-bind="{
						coin: {used: true},
					}"/>
				<CoinStatusWidget 
					v-bind="{
						coin: {used: false},
					}"/>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<CoinStatusWidget 
					v-bind="{
						coin: {used: true},
					}"/>
				<CoinStatusWidget 
					v-bind="{
						coin: {used: false},
					}"/>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
div {
	margin:10px;
}
</style>
```
