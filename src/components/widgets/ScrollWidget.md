Example of the custom scroller - only scrolls vertically.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light" style="position:relative; height:100px;">
				<ScrollWidget v-bind="{noSubNav:true}">
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
				</ScrollWidget>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night" style="position:relative; height:100px;">
				<ScrollWidget v-bind="{noSubNav:true}">
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
					<br />
				</ScrollWidget>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
