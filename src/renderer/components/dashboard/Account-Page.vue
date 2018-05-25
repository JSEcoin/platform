<template>
	<AppWrapperWidget>
		<NavWidget activeNav="dashboard" activeSubNav="account"></NavWidget>
		<ScrollWidget>
			<!-- Account Overview -->
			<ContentWidget titleTxt="Account">
				<ul class="tableListDisplay">
					<li>
						<div class="row">
							<label>Account No</label>
							<span>{{user.uid}}</span>
						</div>
						<div class="row">
							<label>Name</label>
							<span>{{user.name}}</span>
						</div>
						<div class="row">
							<label>Email</label>
							<span>{{user.email}}</span>
						</div>
						<div class="row">
							<label>Address</label>
							<span>{{user.address}} - {{user.country}}</span>
						</div>
					</li>
				</ul>
			</ContentWidget>
			<!-- xAccount Overview -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import AppWrapperWidget from '../widgets/AppWrapperWidget.vue';
import NavWidget from '../widgets/NavWidget.vue';
import ScrollWidget from '../widgets/ScrollWidget.vue';
import ContentWidget from '../widgets/ContentWidget.vue';

/**
 * @description
 * <p>Basic user account information overview returning data from the user object:</p>
 * <ul>
 *     <li>Account No</li>
 *     <li>Name</li>
 *     <li>Email</li>
 *     <li>Address</li>
 * </ul>
 */
export default {
	name: 'Account-Page',
	components: {
		AppWrapperWidget,
		NavWidget,
		ScrollWidget,
		ContentWidget,
	},
	data() {
		return {
			user: {},
		};
	},
	created() {
		this.user = window.user;
	},
};
</script>
