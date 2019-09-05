Coin overview display

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<OverviewCoinDispayWidget coinTotal="345" :coinClass="{gold:true}">
					...
				</OverviewCoinDispayWidget>
				<div class="hr"><hr/></div>
				<OverviewCoinDispayWidget coinTotal="345" :coinClass="{silver:true}">
					...
				</OverviewCoinDispayWidget>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<OverviewCoinDispayWidget coinTotal="345" :coinClass="{gold:true}">
					...
				</OverviewCoinDispayWidget>
				<div class="hr"><hr/></div>
				<OverviewCoinDispayWidget coinTotal="345" :coinClass="{silver:true}">
					...
				</OverviewCoinDispayWidget>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
