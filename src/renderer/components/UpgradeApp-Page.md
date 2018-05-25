Open New Forums Browser Window
```vue
<template>
	<div class="light">
		<ButtonWidget
			v-on:click.native="openExternalWindow('https://jsecoin.com/topic/jsecoin-desktop-mining-app-0-4-0-download/')"
			buttonTxt="Open JSE Forum"/>
	</div>
</template>

<script>
export default {
	methods: {
		openExternalWindow(url) {
			if (this.$electron) {
				this.$electron.shell.openExternal(url);
			} else {
				window.open(url);
			}
		},
	},
};
</script>
```
