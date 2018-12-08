<template>
	<div v-if="$store.state.user.initTransaction" class="loadingDelayMask">
		<div class="statusDisplay">
			<div v-if="waitTimer > 0">
				[{{$store.state.user.countDownFrom - $store.state.user.waitTimer}}] Processing Transaction
			</div>
			<div v-else>
				{{msg}}
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * @description
 * Loading Delay Mask
 */
export default {
	name: 'LoadingDelayMaskWidget',
	props: {
		/**
		 * Display Message
		 */
		msg: {
			type: String,
			default: 'Initiating Transaction',
		},
	},
	computed: mapState({
		waitTimer: state => state.user.waitTimer,
	}),
};
</script>
