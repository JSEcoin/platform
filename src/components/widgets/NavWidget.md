Top level nav widget - 
_this is a hard coded example updating the activeNav / activeSubNav will just hide the components_.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<NavWidget activeNav="test" activeSubNav="test2" />
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<NavWidget activeNav="test" activeSubNav="test2" />
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
