<template>
	<div class="col">
		<!-- Input Field -->
		<label :class="{show:showLabel, error:flag}">
			<!-- Label -->
			<div class="inputLabel">{{placeholder}}</div>
			<!-- xLabel -->
			
			<!-- Input plus Ico -->
			<div v-if="Object.keys(iconClass).length > 0" class="amountInput coin" :class="iconClass">
				<input autocapitalize="off" type="text" ref="input" :maxlength="maxlength" :name="name" :placeholder="placeholder" :value="value" v-on:keyup="keyUp($event.target.value)" />
			</div>
			<!-- xInput plus Ico -->

			<div class="fullWidth" v-else>
				<!-- Password field Ico -->
				<i v-if="hideShow" v-on:click="showHidePass($event);" :class="{'fa-eye':showPass,'fa-eye-slash':!showPass}" class="fa faEye"></i>
				<!-- xPassword Field Ico -->

				<!-- Input no Ico -->
				<input autocapitalize="off" :type="passDisplay" ref="input" :maxlength="maxlength" :name="name" :placeholder="placeholder" :value="value" v-on:keyup="keyUp($event.target.value)" />
				<!-- xInput no Ico -->
			</div>
		</label>
		<!-- xInput Field -->
	</div>
</template>

<script>
/**
 * @description
 * Input Widget
 */
export default {
	name: 'InputWidget',
	data() {
		return {
			showPass: false,			//password input set eye icon
			passDisplay: this.inputType,	//password input type ['password','text']
		};
	},
	model: {
		prop: 'value',
		event: 'keyup',
	},
	props: {
		/**
		 * @model input value
		 */
		value: {
			type: String,
			default: '',
		},
		/**
		 * input name
		 */
		name: {
			type: String,
			default: '',
		},
		/**
		 * input placeholder and label display
		 */
		placeholder: {
			type: String,
			default: '',
		},
		/**
		 * show/hide label display
		 */
		showLabel: {
			type: Boolean,
			default: false,
		},
		/**
		 * Flag error class
		 */
		flag: {
			type: Boolean,
			default: false,
		},
		/**
		 * input icon class name
		 */
		iconClass: {
			type: Object,
			default() {
				return {};
			},
		},
		/**
		 * input max length
		 */
		maxlength: {
			type: String,
			default: '',
		},
		/**
		 * input type ['text', 'password']
		 */
		inputType: {
			type: String,
			default: 'text',
		},
		/**
		 * Allow password text to be visible with the eye icon
		 */
		hideShow: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		/**
		 * Toggles (hide/show) the password field text display
		 *
		 * @param {object} e - Click event
		 * @returns nothing
		 * @public
		 */
		showHidePass(e) {
			e.preventDefault();
			const self = this;
			self.showPass = !self.showPass;
			self.passDisplay = (self.showPass)?'text':'password';
		},
		/**
		 * Emit keyup event
		 */
		keyUp(val) {
			const self = this;
			/**
			 * keyup event.
			 *
			 * @event success
			 * @type {string} value of input
			 */
			self.$emit('keyup', val);
		},
		/**
		 * Used to focus the input from the parent
		 */
		focus() {
			const self = this;
			self.$refs.input.focus();
		},
	},
};
</script>

<style scoped>

.night .coincode {
	background-image:url('../../assets/coincode_night.png');
	background-repeat: no-repeat;
}
.light .coincode {
	background-image:url('../../assets/coincode_light.png');
	background-repeat: no-repeat;
}

label {
	font-size:0.9em;
	color:#636363;
	display: flex;
	/*margin:10px 0px 0px 0px;*/
	margin:0px;
	position: relative;
}
label.show.error .inputLabel,
label.show.error input:focus {
	color:#ff8585;
}
label.show.error input {
	border-bottom: solid 1px #ff8585;
}
.fullWidth {
	display: flex;
	flex-grow: 1;
}
input {
	border:0px;
	/*border-bottom:solid 1.5px #30c1ea;*/
	border-bottom: solid 1px #ddd;
	background:#fff;
	color:#a5a5a5;
	padding:4px 8px;
	height: 32px;
	line-height: 32px;
	font-size:1em;
	flex-grow: 1;
	/*margin: 26px 16px 8px;*/
	color:#666;
	border-radius: 3px;
	cursor:text
}

.night .error input,
.light .error input {
	border-bottom: solid 1px #ff8585;
    color: #ff8585;
}

.night input:focus,
.light input:focus {
	border-bottom:solid 1.5px #30c1ea;
	color:#73b6fb;
}

.inputLabel {
	position: absolute;
	top: 5px;
    left: 10px;
	color:#757575;
	font-size:0.9em;
	opacity:0;
	transition: opacity 1s;
	flex-grow: 1;
}
input {
	margin: 26px 6px 8px;
}

label.show .inputLabel {
	opacity:1;
}

input[name="password"] {
	padding-right:30px;
}

.night .amountInput.coin.gold,
.light .amountInput.coin.gold,
.coin.gold {
	background-image:url('../../assets/coin_gold.png');
	background-repeat: no-repeat;
}

.night .amountInput.coin.silver,
.light .amountInput.coin.silver,
.coin.silver {
	background-image:url('../../assets/coin_silver.png');
	background-repeat: no-repeat;
}

.night .amountInput {
	background-color: #101219;
    border-bottom: solid 1px #444;
}
.light .amountInput {
	background-color: #fff;
	border-bottom: solid 1px #ddd;
}
.amountInput {
	/*padding-left:24px;*/
	flex-grow:1;
	display:flex;
	background-size:20px !important;
    background-position: 4px 6px !important;
	height: 32px !important;
    /*margin: 10px 4px 8px;*/
	margin: 26px 6px 8px;
	width: auto !important;
	border-radius: 3px;
}
.night .amountInput input {
	background:none;
}

.night input {
	background:#101219;
	border-bottom: solid 1px #444;
}


.amountInput input {
	background:transparent;
	/*border:0px;*/
	margin:0px;
	padding-left: 30px;
    width: 100%;
}
.faEye {
	position: absolute;
	bottom: 18px;
	right: 14px;
	cursor: pointer;
}
/* Checkbox switch 

.checkbox-switch {
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    position: relative;
    text-align: left;
    width: 80px;
    height: 30px;
    -webkit-border-radius: 30px;
    border-radius: 30px;
    line-height: 1.2;
    font-size: 14px;
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

.checkbox-switch .checkbox-animate {
    position: relative;
    width: 80px;
    height: 30px;
    background-color: #95a5a6;
    -webkit-transition: background 0.25s ease-out 0s;
    transition: background 0.25s ease-out 0s;	
	border-radius: 30px;
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
}*/
</style>
