<template>
	<div class="checkbox-switch" :class="{'acceptToggle':(type === 'accept')}">
		<!-- Checkbox -->
		<input type="checkbox" :checked="checked" :name="name" class="input-checkbox" v-on:change="change($event.target.checked)">
		<!-- xCheckbox -->

		<!-- UI -->
		<div class="checkbox-animate" v-if="type === 'accept'">
			<span class="checkbox-off">DECLINE</span>
			<span class="checkbox-on">ACCEPT</span>
		</div>
		<div class="checkbox-animate" v-else>
			<span class="checkbox-off">OFF</span>
			<span class="checkbox-on">ON</span>
		</div>
		<!-- xUI -->
	</div>
</template>

<script>
/**
 * @description
 * Toggle Switch Widget
 */
export default {
	name: 'ToggleSwitchWidget',
	model: {
		prop: 'checked',
		event: 'change',
	},
	props: {
		/**
		 * @model
		 * Flag display on/off
		 */
		checked: {
			type: Boolean,
			default: false,
		},
		/**
		 * input field name
		 */
		name: {
			type: String,
			default: '',
		},
		/**
		 * type
		 */
		type: {
			type: String,
			default: '',
		},
	},
	methods: {
		/**
		 * Emit change event
		 */
		change(val) {
			const self = this;
			/**
			 * Change event.
			 *
			 * @event change
			 * @type {string} returned value of checkbox
			 */
			self.$emit('change', val);
		},
	},
};
</script>

<style scoped>

/* Checkbox switch */

.checkbox-switch {
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    position: relative;
    text-align: left;
    width: 80px;
    height: 30px;
    border-radius: 30px;
    line-height: 1.2;
    font-size: 14px;
}
.platformWeb.min .checkbox-switch {
    height: 24px;
    border-radius: 24px;
    font-size: 10px;
}

.checkbox-switch input.input-checkbox {
	position: absolute;
	left: 0;
	top: 0;
	width: 80px;
	height: 30px;
	padding: 0;
	margin: 0;
	opacity: 0;
	z-index: 2;
	cursor: pointer;
}
.platformWeb.min input.input-checkbox {
	height: 24px;
}

.checkbox-switch .checkbox-animate {
    position: relative;
    width: 80px;
    height: 30px;
    background-color: #95a5a6;
    -webkit-transition: background 0.25s ease-out 0s;
    transition: background 0.25s ease-out 0s;	
	border-radius: 30px;
}
.platformWeb.min .checkbox-switch .checkbox-animate {
    height: 24px;
    border-radius: 24px;
}

.checkbox-switch .checkbox-animate:before {
	content: "";
	display: block;
	position: absolute;
	width: 20px;
	height: 20px;
	border-radius: 10px;
	-webkit-border-radius: 10px;
	background-color: #7f8c8d;
	top: 5px;
	left: 5px;
	 -webkit-transition: left 0.3s ease-out 0s;
    transition: left 0.3s ease-out 0s;
    z-index: 10;
}
.platformWeb.min .checkbox-switch .checkbox-animate:before {
	top: 2px;
	left: 5px;
}

.checkbox-switch input.input-checkbox:checked + .checkbox-animate {
	background-color: #2ecc71;
	border-radius: 30px;
}

.checkbox-switch input.input-checkbox:checked + .checkbox-animate:before {
	left: 55px;
	background-color: #27ae60;
}

.checkbox-switch .checkbox-off,
.checkbox-switch .checkbox-on {
	float: left;
	color: #fff;
	font-weight: 700;
	padding-top: 6px;
	 -webkit-transition: all 0.3s ease-out 0s;
    transition: all 0.3s ease-out 0s;
}

.checkbox-switch .checkbox-off {
	margin-left: 30px;
	opacity: 1;
}

.checkbox-switch .checkbox-on {
	display: none;
	float: right;
	margin-right: 35px;
	opacity: 0;
}

.checkbox-switch input.input-checkbox:checked + .checkbox-animate .checkbox-off {
	display: none;
	opacity: 0;
}

.checkbox-switch input.input-checkbox:checked + .checkbox-animate .checkbox-on {
	display: block;
	opacity: 1;
}
.acceptToggle.checkbox-switch,
.acceptToggle.checkbox-switch .checkbox-animate,
.acceptToggle.checkbox-switch input.input-checkbox,
.acceptToggle.checkbox-switch input.input-checkbox:checked + .checkbox-animate {
	width:100px;
}
.acceptToggle.checkbox-switch input.input-checkbox:checked + .checkbox-animate:before {
	left:75px;
}
</style>
