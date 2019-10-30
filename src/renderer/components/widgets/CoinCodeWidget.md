Used within data tables to display side by side coin and optional QR icon along with coin value.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<CoinCodeWidget 
					v-bind="{
						coin: {
							value: '1000',
							coinCode: '123456789',
						},
						showQR: true,
					}"/>
				<div class="hr"><hr /></div>
				<CoinCodeWidget 
					v-bind="{
						coin: {
							value: '10340',
							coinCode: '2354354',
						},
						showQR: false,
					}"/>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<CoinCodeWidget 
					v-bind="{
						coin: {
							value: '1000',
							coinCode: '123456789',
						},
						showQR: true,
					}"/>
				<div class="hr"><hr /></div>
				<CoinCodeWidget 
					v-bind="{
						coin: {
							value: '10340',
							coinCode: '2354354',
						},
						showQR: false,
					}"/>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
