<template>
	<fieldset>
		<legend>{{titleTxt}}</legend>
		<!-- @slot Options Body Content -->
		<slot/>
	</fieldset>
</template>

<script>
/**
 * @description
 * Options List Wrapper Widget
 */
export default {
	name: 'OptionsListWrapperWidget',
	props: {
		/**
		 * Section Title Text
		 */
		titleTxt: {
			type: String,
			default: '',
		},
	},
};
</script>

<style scoped>
.night fieldset {
	border:solid 1px #171820;
}
.light fieldset {
	border:solid 1px #eee;
}
fieldset {
	margin-bottom:10px;
	border-radius: 6px;
}
legend {
	font-weight:bold;
	font-size: 0.8em;
	padding:0px 10px;
	color:#afafaf;
}
</style>
