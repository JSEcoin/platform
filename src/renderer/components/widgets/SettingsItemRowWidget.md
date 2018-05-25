Example settings row with toggle switch imported into slot.

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<SettingsItemRowWidget settingName="example">
					<ToggleSwitchWidget 
					v-bind="{
						checked: true,
						name: 'example',
					}" />
				</SettingsItemRowWidget>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<SettingsItemRowWidget settingName="example">
					<ToggleSwitchWidget 
					v-bind="{
						checked: true,
						name: 'example',
					}" />
				</SettingsItemRowWidget>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
