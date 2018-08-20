<template>
	<ContentWidget titleTxt="Console:" class="console mini" v-bind="{consoleEnabled: true}">
		<div style="height:110px" class="consoleContent">
			<p v-for="(msg, i) in consoleMsg" v-html="msg"></p>
		</div>
	</ContentWidget>
</template>

<script>
import { mapState } from 'vuex';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
/**
 * @description
 * Console Widget
 */
export default {
	name: 'ConsoleWidget',
	components: {
		ContentWidget,
	},
	computed: mapState({
		consoleMsg: state => state.miner.consoleMsg,  //holds array of messages to display in console
	}),
};
</script>

<style scoped>
.consoleContent::-webkit-scrollbar-track {
	background:none;
    border-radius: 8px;
}
.consoleContent::-webkit-scrollbar-thumb {
    border-radius: 8px;
}
.night .consoleContent::-webkit-scrollbar-thumb {
    background-color: #000;
}
.light .consoleContent::-webkit-scrollbar-thumb {
    background-color: #dee3e8;
}
.night .consoleContent::-webkit-scrollbar-thumb {
    background-color: none;
}
.consoleContent::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    padding: 10px;
}

::-webkit-scrollbar-corner {
	background:none;
}

.consoleContent {
	overflow: scroll;
	padding: 0 0 20px;
}

</style>
