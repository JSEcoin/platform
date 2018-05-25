<template>
	<div class="row">
		<div class="maxCol">
			<p><b>{{settingName}}</b></p>
		</div>
		<div class="optionInterface">
			<!-- @slot Interactive element -->
			<slot/>
		</div>
	</div>
</template>

<script>
/**
 * @description
 * Settings Item Row Widget
 * - Displays 2 col row.
 */
export default {
	name: 'SettingsItemRowWidget',
	props: {
		/**
		 * Settings Option Name
		 */
		settingName: {
			type: String,
			default: '',
		},
	},
};
</script>

<style scoped>
.row {
	display: flex;
	justify-content: center;
}
.maxCol {
	flex-grow: 1;
	display: flex;
	align-items: center;
	color: #676666;
}

.optionInterface {
	display: flex;
    align-items: center;
}
</style>
