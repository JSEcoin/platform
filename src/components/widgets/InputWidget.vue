<template>
	<div class="col">
		<!-- Input Field -->
		<label :class="{show:showLabel, error:flag}">
			<!-- Label -->
			<div class="inputLabel">{{placeholder}}</div>
			<!-- xLabel -->

			<!-- Input plus Ico -->
			<div v-if="Object.keys(iconClass).length > 0" class="amountInput coin" :class="iconClass">
				<div class="interactiveIco":class="{'showPointer': ($store.getters.whichPlatform === 'mobile')}"" v-if="((iconClass.coincode) && (eventaction.length > 0))" v-on:click="emitEvent(eventaction, $event);"></div>
				<input autocapitalize="off" :type="inputType" ref="input" :maxlength="maxlength" :name="name" :placeholder="placeholder" :value="value" v-on:keyup="keyUp($event.target.value)" autocomplete="false" />
			</div>
			<!-- xInput plus Ico -->

			<div class="fullWidth" v-else>
				<!-- Password field Ico -->
				<i v-if="hideShow" v-on:click="showHidePass($event);" :class="{'fa-eye':showPass,'fa-eye-slash':!showPass}" class="fa faEye"></i>
				<!-- xPassword Field Ico -->

				<!-- Input no Ico -->
				<input v-if="(inputFieldType === 'input')" autocapitalize="off" :type="passDisplay" ref="input" :maxlength="maxlength" :name="name" :placeholder="placeholder" :value="value" v-on:keyup="keyUp($event.target.value, 'password')" :autocomplete="newpassword" />
				<!-- xInput no Ico -->

				<!-- to clean up make dynamic in seperate widget -->
				<select name="country" v-if="(inputFieldType === 'select')"
					@input="updateValue($event.target.value)">
					<option :value="null">Select</option>
					<option value="AF">Afghanistan</option>
					<option value="AX">Åland Islands</option>
					<option value="AL">Albania</option>
					<option value="DZ">Algeria</option>
					<option value="AS">American Samoa</option>
					<option value="AD">Andorra</option>
					<option value="AO">Angola</option>
					<option value="AI">Anguilla</option>
					<option value="AQ">Antarctica</option>
					<option value="AG">Antigua and Barbuda</option>
					<option value="AR">Argentina</option>
					<option value="AM">Armenia</option>
					<option value="AW">Aruba</option>
					<option value="AU">Australia</option>
					<option value="AT">Austria</option>
					<option value="AZ">Azerbaijan</option>
					<option value="BS">Bahamas</option>
					<option value="BH">Bahrain</option>
					<option value="BD">Bangladesh</option>
					<option value="BB">Barbados</option>
					<option value="BY">Belarus</option>
					<option value="BE">Belgium</option>
					<option value="BZ">Belize</option>
					<option value="BJ">Benin</option>
					<option value="BM">Bermuda</option>
					<option value="BT">Bhutan</option>
					<option value="BO">Bolivia, Plurinational State of</option>
					<option value="BQ">Bonaire, Sint Eustatius and Saba</option>
					<option value="BA">Bosnia and Herzegovina</option>
					<option value="BW">Botswana</option>
					<option value="BV">Bouvet Island</option>
					<option value="BR">Brazil</option>
					<option value="IO">British Indian Ocean Territory</option>
					<option value="BN">Brunei Darussalam</option>
					<option value="BG">Bulgaria</option>
					<option value="BF">Burkina Faso</option>
					<option value="BI">Burundi</option>
					<option value="KH">Cambodia</option>
					<option value="CM">Cameroon</option>
					<option value="CA">Canada</option>
					<option value="CV">Cape Verde</option>
					<option value="KY">Cayman Islands</option>
					<option value="CF">Central African Republic</option>
					<option value="TD">Chad</option>
					<option value="CL">Chile</option>
					<option value="CN">China</option>
					<option value="CX">Christmas Island</option>
					<option value="CC">Cocos (Keeling) Islands</option>
					<option value="CO">Colombia</option>
					<option value="KM">Comoros</option>
					<option value="CG">Congo</option>
					<option value="CD">Congo, the Democratic Republic of the</option>
					<option value="CK">Cook Islands</option>
					<option value="CR">Costa Rica</option>
					<option value="CI">Côte d'Ivoire</option>
					<option value="HR">Croatia</option>
					<option value="CU">Cuba</option>
					<option value="CW">Curaçao</option>
					<option value="CY">Cyprus</option>
					<option value="CZ">Czech Republic</option>
					<option value="DK">Denmark</option>
					<option value="DJ">Djibouti</option>
					<option value="DM">Dominica</option>
					<option value="DO">Dominican Republic</option>
					<option value="EC">Ecuador</option>
					<option value="EG">Egypt</option>
					<option value="SV">El Salvador</option>
					<option value="GQ">Equatorial Guinea</option>
					<option value="ER">Eritrea</option>
					<option value="EE">Estonia</option>
					<option value="ET">Ethiopia</option>
					<option value="FK">Falkland Islands (Malvinas)</option>
					<option value="FO">Faroe Islands</option>
					<option value="FJ">Fiji</option>
					<option value="FI">Finland</option>
					<option value="FR">France</option>
					<option value="GF">French Guiana</option>
					<option value="PF">French Polynesia</option>
					<option value="TF">French Southern Territories</option>
					<option value="GA">Gabon</option>
					<option value="GM">Gambia</option>
					<option value="GE">Georgia</option>
					<option value="DE">Germany</option>
					<option value="GH">Ghana</option>
					<option value="GI">Gibraltar</option>
					<option value="GR">Greece</option>
					<option value="GL">Greenland</option>
					<option value="GD">Grenada</option>
					<option value="GP">Guadeloupe</option>
					<option value="GU">Guam</option>
					<option value="GT">Guatemala</option>
					<option value="GG">Guernsey</option>
					<option value="GN">Guinea</option>
					<option value="GW">Guinea-Bissau</option>
					<option value="GY">Guyana</option>
					<option value="HT">Haiti</option>
					<option value="HM">Heard Island and McDonald Islands</option>
					<option value="VA">Holy See (Vatican City State)</option>
					<option value="HN">Honduras</option>
					<option value="HK">Hong Kong</option>
					<option value="HU">Hungary</option>
					<option value="IS">Iceland</option>
					<option value="IN">India</option>
					<option value="ID">Indonesia</option>
					<option value="IR">Iran, Islamic Republic of</option>
					<option value="IQ">Iraq</option>
					<option value="IE">Ireland</option>
					<option value="IM">Isle of Man</option>
					<option value="IL">Israel</option>
					<option value="IT">Italy</option>
					<option value="JM">Jamaica</option>
					<option value="JP">Japan</option>
					<option value="JE">Jersey</option>
					<option value="JO">Jordan</option>
					<option value="KZ">Kazakhstan</option>
					<option value="KE">Kenya</option>
					<option value="KI">Kiribati</option>
					<option value="KP">Korea, Democratic People's Republic of</option>
					<option value="KR">Korea, Republic of</option>
					<option value="KW">Kuwait</option>
					<option value="KG">Kyrgyzstan</option>
					<option value="LA">Lao People's Democratic Republic</option>
					<option value="LV">Latvia</option>
					<option value="LB">Lebanon</option>
					<option value="LS">Lesotho</option>
					<option value="LR">Liberia</option>
					<option value="LY">Libya</option>
					<option value="LI">Liechtenstein</option>
					<option value="LT">Lithuania</option>
					<option value="LU">Luxembourg</option>
					<option value="MO">Macao</option>
					<option value="MK">Macedonia, the former Yugoslav Republic of</option>
					<option value="MG">Madagascar</option>
					<option value="MW">Malawi</option>
					<option value="MY">Malaysia</option>
					<option value="MV">Maldives</option>
					<option value="ML">Mali</option>
					<option value="MT">Malta</option>
					<option value="MH">Marshall Islands</option>
					<option value="MQ">Martinique</option>
					<option value="MR">Mauritania</option>
					<option value="MU">Mauritius</option>
					<option value="YT">Mayotte</option>
					<option value="MX">Mexico</option>
					<option value="FM">Micronesia, Federated States of</option>
					<option value="MD">Moldova, Republic of</option>
					<option value="MC">Monaco</option>
					<option value="MN">Mongolia</option>
					<option value="ME">Montenegro</option>
					<option value="MS">Montserrat</option>
					<option value="MA">Morocco</option>
					<option value="MZ">Mozambique</option>
					<option value="MM">Myanmar</option>
					<option value="NA">Namibia</option>
					<option value="NR">Nauru</option>
					<option value="NP">Nepal</option>
					<option value="NL">Netherlands</option>
					<option value="NC">New Caledonia</option>
					<option value="NZ">New Zealand</option>
					<option value="NI">Nicaragua</option>
					<option value="NE">Niger</option>
					<option value="NG">Nigeria</option>
					<option value="NU">Niue</option>
					<option value="NF">Norfolk Island</option>
					<option value="MP">Northern Mariana Islands</option>
					<option value="NO">Norway</option>
					<option value="OM">Oman</option>
					<option value="PK">Pakistan</option>
					<option value="PW">Palau</option>
					<option value="PS">Palestinian Territory, Occupied</option>
					<option value="PA">Panama</option>
					<option value="PG">Papua New Guinea</option>
					<option value="PY">Paraguay</option>
					<option value="PE">Peru</option>
					<option value="PH">Philippines</option>
					<option value="PN">Pitcairn</option>
					<option value="PL">Poland</option>
					<option value="PT">Portugal</option>
					<option value="PR">Puerto Rico</option>
					<option value="QA">Qatar</option>
					<option value="RE">Réunion</option>
					<option value="RO">Romania</option>
					<option value="RU">Russian Federation</option>
					<option value="RW">Rwanda</option>
					<option value="BL">Saint Barthélemy</option>
					<option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
					<option value="KN">Saint Kitts and Nevis</option>
					<option value="LC">Saint Lucia</option>
					<option value="MF">Saint Martin (French part)</option>
					<option value="PM">Saint Pierre and Miquelon</option>
					<option value="VC">Saint Vincent and the Grenadines</option>
					<option value="WS">Samoa</option>
					<option value="SM">San Marino</option>
					<option value="ST">Sao Tome and Principe</option>
					<option value="SA">Saudi Arabia</option>
					<option value="SN">Senegal</option>
					<option value="RS">Serbia</option>
					<option value="SC">Seychelles</option>
					<option value="SL">Sierra Leone</option>
					<option value="SG">Singapore</option>
					<option value="SX">Sint Maarten (Dutch part)</option>
					<option value="SK">Slovakia</option>
					<option value="SI">Slovenia</option>
					<option value="SB">Solomon Islands</option>
					<option value="SO">Somalia</option>
					<option value="ZA">South Africa</option>
					<option value="GS">South Georgia and the South Sandwich Islands</option>
					<option value="SS">South Sudan</option>
					<option value="ES">Spain</option>
					<option value="LK">Sri Lanka</option>
					<option value="SD">Sudan</option>
					<option value="SR">Suriname</option>
					<option value="SJ">Svalbard and Jan Mayen</option>
					<option value="SZ">Swaziland</option>
					<option value="SE">Sweden</option>
					<option value="CH">Switzerland</option>
					<option value="SY">Syrian Arab Republic</option>
					<option value="TW">Taiwan, Province of China</option>
					<option value="TJ">Tajikistan</option>
					<option value="TZ">Tanzania, United Republic of</option>
					<option value="TH">Thailand</option>
					<option value="TL">Timor-Leste</option>
					<option value="TG">Togo</option>
					<option value="TK">Tokelau</option>
					<option value="TO">Tonga</option>
					<option value="TT">Trinidad and Tobago</option>
					<option value="TN">Tunisia</option>
					<option value="TR">Turkey</option>
					<option value="TM">Turkmenistan</option>
					<option value="TC">Turks and Caicos Islands</option>
					<option value="TV">Tuvalu</option>
					<option value="UG">Uganda</option>
					<option value="UA">Ukraine</option>
					<option value="AE">United Arab Emirates</option>
					<option value="GB">United Kingdom</option>
					<option value="US" selected="selected">United States</option>
					<option value="UM">United States Minor Outlying Islands</option>
					<option value="UY">Uruguay</option>
					<option value="UZ">Uzbekistan</option>
					<option value="VU">Vanuatu</option>
					<option value="VE">Venezuela, Bolivarian Republic of</option>
					<option value="VN">Viet Nam</option>
					<option value="VG">Virgin Islands, British</option>
					<option value="VI">Virgin Islands, U.S.</option>
					<option value="WF">Wallis and Futuna</option>
					<option value="EH">Western Sahara</option>
					<option value="YE">Yemen</option>
					<option value="ZM">Zambia</option>
					<option value="ZW">Zimbabwe</option>
				</select>
			</div>
		</label>
		<!-- Password strength display -->
		<ul class="passwordStrengthDisplay" v-if="passwordStrength">
			<li :class="{'highlight':passScore > 0}"></li>
			<li :class="{'highlight':passScore > 1}"></li>
			<li :class="{'highlight':passScore > 2}"></li>
			<li :class="{'highlight':passScore > 3}"></li>
		</ul>
		<span class="passwordStrengthText" v-if="passwordStrength">{{passScoreText[passScore]}}</span>
		<!-- xPassword strength display -->
		<!-- xInput Field -->
	</div>
</template>

<script>
import zxcvbn from 'zxcvbn';

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
			passScore: 0,
			passScoreText: [
				'Password Strength',
				'Weak',
				'Ok',
				'Strong',
				'Very Strong',
			],
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
		 * icon has an action event
		 */
		eventaction: {
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
		/**
		 * Show input password strength
		 */
		passwordStrength: {
			type: Boolean,
			default: false,
		},
		/***
		 * type of field default input
		 */
		inputFieldType: {
			type: String,
			default: 'input',
		},
		/***
		 * type of field default input
		 */
		newpassword: {
			type: String,
			default: 'false',
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
		keyUp(val, inputType) {
			const self = this;
			/**
			 * keyup event.
			 *
			 * @event success
			 * @type {string} value of input
			 */
			self.$emit('keyup', val);
			//if password set score
			if ((inputType === 'password') && (self.passwordStrength)) {
				self.passScore = zxcvbn(val).score;
			}
		},
		/**
		 * Used to focus the input from the parent
		 */
		focus() {
			const self = this;
			self.$refs.input.focus();
		},
		/**
		 * Emit event
		 */
		emitEvent(eventName, e) {
			const self = this;
			e.preventDefault();
			e.stopPropagation();
			/**
			 * keyup event.
			 *
			 * @event success
			 * @type {string} value of input
			 */
			console.log(eventName);
			self.$emit(eventName);
		},
		updateValue(value) {
			this.$emit('input', value);
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
.interactiveIco {
    display: block;
    position: absolute;
    left: 0px;
    bottom: 8px;
    width: 30px;
    height: 30px;
}
.interactiveIco.showPointer {
	cursor: pointer;
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

.passwordStrengthDisplay {
	display: flex;
	border: solid 1px rgba(0,0,0,0.06);
    padding: 4px 0px;
    border-radius: 8px;
    margin: 0px 6px;
}
.passwordStrengthDisplay li {
	flex:1;
	height:4px;
	border-radius:4px;
	background:#ccc;
	list-style:none;
	margin:0px 6px;
	transition: background 0.2s;
}
.passwordStrengthDisplay li.highlight {
	background:#3598db;
}
.passwordStrengthText{
    text-align: center;
    font-size: 0.55em;
    text-transform: uppercase;
    font-weight: bold;
    /* color: #ccc; */
    padding-right: 6px;
    display: block;
}
</style>
