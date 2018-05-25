Example of animated splash display

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<ToggleSwitchWidget 
					v-bind="{
						checked: true,
						name: 'test',
					}" />
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="light">
				<ToggleSwitchWidget 
					v-bind="{
						checked: true,
						name: 'test',
					}" />
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
