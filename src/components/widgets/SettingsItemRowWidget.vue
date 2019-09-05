<template>
	<div class="row">
		<div class="maxCol" v-on:click="info" :class="{'clickable': (infoDesc.length > 0) }">
			<label>
				<i class="fa fa-info-circle" v-if="(infoDesc.length > 0)"></i>
				<p><b>{{settingName}}</b></p>
			</label>
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
		/**
		 * has description on setting
		 */
		infoDesc: {
			type: String,
			default: '',
		},
	},
	methods: {
		/**
		 * Show info on settings
		 *
		 * @returns nothing
		 * @public
		 */
		info() {
			const self = this;
			if (self.infoDesc.length > 0) {
				self.$swal(self.settingName, self.infoDesc, 'info');
			}
		},
	},
};
</script>

<style scoped>
.row {
	display: flex;
	justify-content: center;
    padding: 0px 6px 0px 10px;
    border-radius: 80px;
	margin: 10px 0px;
}

.light .row {
    background: #fafbfd;
}
.night .row {
    background: #171820;
}

.maxCol {
	flex-grow: 1;
	display: flex;
	align-items: center;
	color: #676666;
}
.maxCol label {
	display: flex;
    align-items: center;
}
.maxCol p {
    padding-left: 8px;
}


.optionInterface {
	display: flex;
    align-items: center;
}
</style>
