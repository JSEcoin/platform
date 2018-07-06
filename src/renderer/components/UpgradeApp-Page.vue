<template>
	<AppWrapperWidget>
		<!-- Expired Display -->
		<ContentWidget titleTxt="Alpha Release Expired!" :infoPanelTxt="`Alpha Release: ${$store.state.app.version}`">
			<!-- Info -->
			<p>
				This alpha release {{$store.state.app.version}} - has now expired!
			</p>
			<p>
				Please check the JSECoin GitHub Release for the latest supported app.
			</p>
			<!-- xInfo -->

			<!-- Open Forums Window -->
			<ButtonWidget
				v-on:click.native="openExternalWindow('https://github.com/JSEcoin/platform/releases')"
				buttonTxt="JSECoin GitHub Release"/>
			<!-- xOpen Forums Window -->
		</ContentWidget>
		<!-- xExpired Display -->
	</AppWrapperWidget>
</template>

<script>
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';

/**
 * @description
 * <p>Displays when <b>window.user.appReleaseSupport > store.app.major</b></p>
 *
 * <p>This disables all functionality of the app and forces the user to download the latest release.<br/>
 * <b>Todo:</b> Apply Auto App updates functionality - so that this page is no longer required.</p>
 */
export default {
	name: 'UpgradeApp-Page',
	components: {
		AppWrapperWidget,
		ContentWidget,
		ButtonWidget,
	},
	methods: {
		/**
		 * Opens an external browser window and takes the user to the official upgrade forum post
		 * https://jsecoin.com/topic/jsecoin-desktop-mining-app-0-4-0-download/
		 *
		 * @param {string} url Web address to open in a new browser window
		 * @public
		 */
		openExternalWindow(url) {
			this.$electron.shell.openExternal(url);
		},
	},
};
</script>