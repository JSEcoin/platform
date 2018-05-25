Generate Cold Storage Wallet PDF Booklet button - onclick will trigger PDF to be genereated with 7 example coins.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<GenerateBookletWidget 
				v-bind="{
					bookletData: [{
						value: 1,
						coinCode: 123456,
						ts: 1525879817807,
					},{
						value: 1234,
						coinCode: 2436373733,
						ts: 1525879817807,
					},{
						value: 1345,
						coinCode: 34534y36346,
						ts: 1525879817807,
					},{
						value: 34,
						coinCode: 3463463634,
						ts: 1525879817807,
					},{
						value: 344,
						coinCode: 346346346346346,
						ts: 1525879817807,
					},{
						value: 4,
						coinCode: 46346346346,
						ts: 1525879817807,
					},{
						value: 6,
						coinCode: 346346346346,
						ts: 1525879817807,
					}],
				}" />
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<GenerateBookletWidget 
				v-bind="{
					bookletData: [{
						value: 1,
						coinCode: 123456,
						ts: 1525879817807,
					},{
						value: 1234,
						coinCode: 2436373733,
						ts: 1525879817807,
					},{
						value: 1345,
						coinCode: 34534y36346,
						ts: 1525879817807,
					},{
						value: 34,
						coinCode: 3463463634,
						ts: 1525879817807,
					},{
						value: 344,
						coinCode: 346346346346346,
						ts: 1525879817807,
					},{
						value: 4,
						coinCode: 46346346346,
						ts: 1525879817807,
					},{
						value: 6,
						coinCode: 346346346346,
						ts: 1525879817807,
					}],
				}" />
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
