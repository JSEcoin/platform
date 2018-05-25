<template>
	<div class="col">
		<label style="margin-bottom:10px;">
			<div class="inputLabel" style="opacity:1">6 Digit Auth Code *</div>
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode1" @keyup="focusInput('val1', 1, $event)" v-model="form.authCode.val1" style="width:30px; margin:26px 4px 8px; text-align:center" />
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode2" @keyup="focusInput('val2', 2, $event)" v-model="form.authCode.val2" style="width:30px; margin:26px 4px 8px; text-align:center" />
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode3" @keyup="focusInput('val3', 3, $event)" v-model="form.authCode.val3" style="width:30px; margin:26px 4px 8px; text-align:center" />
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode4" @keyup="focusInput('val4', 4, $event)" v-model="form.authCode.val4" style="width:30px; margin:26px 4px 8px; text-align:center" />
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode5" @keyup="focusInput('val5', 5, $event)" v-model="form.authCode.val5" style="width:30px; margin:26px 4px 8px; text-align:center" />
			<input maxlength="1" type="text" :placeholder="'0'" @keyup.enter="onSubmit" ref="authCode6" @keyup="focusInput('val6', 6, $event)" v-model="form.authCode.val6" style="width:30px; margin:26px 4px 8px; text-align:center" />
		</label>
	</div>
</template>

<script>
/**
 * @description
 * <p>2FA interface</p>
 */
export default {
	name: 'TwoFA',
	data() {
		return {
			//form modal
			form: {
				authCode: {
					val1: this.val[0],
					val2: this.val[1],
					val3: this.val[2],
					val4: this.val[3],
					val5: this.val[4],
					val6: this.val[5],
				},
			},
		};
	},
	props: {
		/**
		 * @model input value
		 */
		val: {
			type: Array,
			default: () => [
				'0',
				'0',
				'0',
				'0',
				'0',
				'0',
			],
		},
	},
	mounted() {
		const self = this;
		//focus on authcode input
		//timeout required as interface not available
		setTimeout(function() {
			self.$refs.authCode1.focus();
		}, 10);
	},
	methods: {
		/**
		 * Focus 2FA Inputs
		 * - enter submits 2FA code
		 * - allows easy traversal accross inputs with keyboard commands
		 * - - backspace/left & right arrow key detection
		 *
		 * @param {string} val - data authcode reference
		 * @param {number} refNext - input position reference
		 * @param {object} e - keyup event
		 * @returns nothing
		 * @public
		 */
		focusInput(val, refNext, e) {
			const self = this;
			//enter
			if (e.which === 13) {
				/**
				 * submit-code event.
				 *
				 * @event submit-code
				 * @type {object} authcode obj
				 */
				const AC = self.form.authCode;
				self.$emit('submit-code', AC);
				return;
			}
			//backspace
			if (e.which === 8) {
				refNext = (refNext === 1)?6:refNext-1;
				self.$refs['authCode'+refNext].focus();
				self.form.authCode[val] = 0;
				return;
			}
			//arrow left
			if (e.which === 37) {
				refNext = (refNext === 1)?6:refNext-1;
				self.$refs['authCode'+refNext].focus();
				return;
			}
			//arrow right
			if (e.which === 39) {
				refNext = (refNext === 6)?1:refNext+1;
				self.$refs['authCode'+refNext].focus();
				return;
			}

			//spacebar
			if (e.which === 32) {
				refNext = (refNext === 6)?1:refNext+1;
				self.$refs['authCode'+refNext].focus();
				self.form.authCode[val] = 0;
				return;
			}

			//number pressed
			if (isFinite(e.key)) {
				self.form.authCode[val] = e.key;
				/**
				 * key-up event.
				 *
				 * @event key-up
				 * @type {string} input ref
				 * @type {string} value
				 */
				self.$emit('key-up', val, e.key);
				refNext = (refNext === 6)?1:refNext+1;
				self.$refs['authCode'+refNext].focus();
			} else {
				self.$emit('key-up', val, 0);
			}
		},
	},
};
</script>

<style scoped>

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
</style>