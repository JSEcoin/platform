<template>
	<AppWrapperWidget>
		<ScrollWidget v-bind="{noNav:true}">
			
			<!-- Animation to display during server requests -->
			<SpinnerWidget :class="{active:loading}"/>
			<!-- xAnimation to display during server requests -->
			
			<ContentWidget :class="{hide:loading}"
				titleTxt="Setup Security Pin Code">
				<div>
					<form id="JSEA-Pin" @submit.prevent autocomplete="off">

						<!-- pin widget display -->
						<Pin v-on:submit-pin="setupPIN" v-bind="{enableCancelButton:false, submitButtonTxt:'Set Pin'}" @keypress="closeError">
							
							<!-- register error display -->
							<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="margin: 10px auto;" />
							<!-- xregister error display -->
							<p class="info">
								Please note that pin numbers can not be recovered so please write it down and keep it somewhere safe 
								in case you forget. If you lose your pin number you will not be able to withdraw or transfer funds 
								from your account.
							</p>
							<p>
								Pin numbers should be between 4 and 12 digits and only standard numbers 0-9.
							</p>
						</Pin>
						<!-- xpin widget display -->
					</form>
				</div>
			</ContentWidget>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import axios from 'axios';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import Pin from '@/components/widgets/Pin.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';

/**
 * @description
 * <p>New User Enter Security PIN</b></p>
 */
export default {
	name: 'EnterSecurityPin-Page',
	components: {
		AppWrapperWidget,
		ScrollWidget,
		ContentWidget,
		Pin,
		SpinnerWidget,
		FormErrorDisplayWidget,
	},
	data() {
		return {
			loading: false, //communicating with server
			form: {
				error: {
					msg: '',
					display: false,
				},
			},
		};
	},
	/**
	 * Register Functions
	 */
	methods: {
		setupPIN(pin) {
			const self = this;
			self.form.error.display = false;
			if ((pin.length >= 4) && (pin.length <= 12) && (pin !== '1234') && (pin !== '0000')) {
				self.loading = true;
				const setupPinReq = {
					pin,
					session: self.$store.state.user.session,
				};
				axios.post(
					`${self.$store.state.app.jseCoinServer}/setpin/`,
					setupPinReq,
				).then((res) => {
					self.loading = false;
					self.$router.push(`${self.$store.state.app.platformURL}/dashboard`);
				}).catch((err) => {
					self.loading = false;
					self.form.error.msg = err.response.data.notification;
					self.form.error.display = true;
					self.$store.commit('ajaxError', err.response);
				});
			} else {
				self.form.error.msg = 'Please check your Pin - you may not use a common Pin number like 1234 or 0000';
				self.form.error.display = true;
			}
		},
		closeError() {
			const self = this;
			self.form.error.msg = '';
			self.form.error.display = false;
		},
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>
