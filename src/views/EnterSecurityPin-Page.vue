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
						<Pin v-on:submit-pin="setupPIN" v-bind="{enableCancelButton:false, pinTitle:'Create Your Pin', submitButtonTxt:'Set Pin'}" @keypress="closeError">

							<!-- register error display -->
							<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="margin: 10px auto;" />
							<!-- xregister error display -->
							<div class="warningInfo">
								<div class="warningInfoIcon">
									<i class="fa fa-warning"></i>
								</div>
								<div class="warningContent">
									<h5>Please note:</h5>
									<p>
										Pin numbers <b><u>can not be recovered!</u></b>
									</p>
									<p>
										Please write it down and keep it somewhere safe
										in case you forget it.
									</p>
									<p>
										If you lose your pin number you will not be able to withdraw or transfer funds
										from your account.
									</p>
								</div>
							</div>
							<div>
								<p class="subInfo">
									<b>Step 1. </b> Enter your unique PIN for your JSEcoin account:<br /> - it can be between 4 to 12 digits in length.
								</p>
							</div>
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
					self.$router.push('/dashboard');
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
