<template>
	<div v-if="errorMsg.length > 0" class="errorMsg cf">
		<div>
			<i class="fa fa-close"></i>
			<b>Error:</b><br />
			{{errorMsg}}
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

/**
 * @description
 * Form Error Display Widget
 */
export default {
	name: 'FormErrorDisplayWidget',
	props: {
		/**
		 * Error message
		 */
		errorMsg: {
			type: String,
			default: '',
		},
	},
};
</script>

<style scoped>

.night .errorMsg {
	background: #390107;
	box-shadow:rgb(104, 4, 16) 0px 0px 1px 0px inset, rgba(0, 0, 0, 0.3) 0px 1px 0px 0px;
	color: #a93340;
	cursor: pointer;
}

.night .errorMsg * {
	cursor: pointer;
}
.night .errorMsg:hover .fa-close {
	color:#000;
}

.errorMsg {
    box-shadow: 0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent;
    background-color: #fff6f6;
    color: #9f3a38;
	border-radius: 6px;
	font-size:0.8em;
	position: relative;
}

.errorMsg .fa-close {
	position: absolute;
	top:10px;
	right: 10px;
	color:#a93340;
	font-size:0.85em;
	cursor: pointer;
}

.errorMsg div {
	margin:8px 16px;
}
</style>