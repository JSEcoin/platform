Displays delay to highlight transactions are limited per 30 second block within ContentWidget.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<LoadingDelayMaskWidget />
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<LoadingDelayMaskWidget />
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
