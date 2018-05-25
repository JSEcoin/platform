Card Wrapper example views

```vue
<template>
	<div>
		<div class="light">
			<OptionsListWrapperWidget titleTxt="light">
				<ContentWidget titleTxt="Example card wiget">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example" infoPanelTxt="info">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example" infoPanelTxt="123" :infoPanelIcoClassName="{gold: true}">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example3">
					<template slot="headerButton">
						<ButtonWidget buttonTxt="Button" v-bind="{isSmall: true}"/>
					</template>
					...
				</ContentWidget>
			</OptionsListWrapperWidget>
		</div>
		<div class="night">
			<OptionsListWrapperWidget titleTxt="night">
				<ContentWidget titleTxt="Example card wiget">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example" infoPanelTxt="info">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example" infoPanelTxt="123" :infoPanelIcoClassName="{gold: true}">
					...
				</ContentWidget>
				<ContentWidget titleTxt="Example3">
					<template slot="headerButton">
						<ButtonWidget buttonTxt="Button" v-bind="{isSmall: true}"/>
					</template>
					...
				</ContentWidget>
			</OptionsListWrapperWidget>
		</div>
	</div>
</template>

<script>
export default {};
</script>
```
