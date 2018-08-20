<template>
	<div class="loadingDelayMask">

		<!-- Confirm account -->
		<div class="confirmDisplay" v-if="!confirmationSent">
	
			<!-- Error display -->
			<FormErrorDisplayWidget v-on:click.native="closeError" v-if="form.error.display" :errorMsg="form.error.msg"  style="margin: 10px auto;" />
			<!-- xError display -->
			
			<h4>Confirm Email:</h4>
			<p>
				You will need to confirm your email address using the link provided within your registration email.
			</p>

			<ButtonWidget v-if="!loading" style="margin:0px auto;" type="button" v-bind="{isSmall:true}" v-on:click.native="resendEmail()" buttonTxt="Resend Welcome Email"/>

			<!-- Animation to display during server requests -->
			<SpinnerWidget v-else :class="{active:loading}"/>
			<!-- xAnimation to display during server requests -->

			<p>
				If you still are not receiving the welcome email please add noreply@jsecoin.com to your address book and check any junk mail folders.
			</p>
		</div>
		<!-- xConfirm account -->
		<!-- Account confirm email sent -->
		<div class="confirmDisplay" v-else>

		</div>
		<!-- xAccount confirm email sent -->
	</div>
</template>

<script>
import axios from 'axios';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
import FormErrorDisplayWidget from '@/components/widgets/FormErrorDisplayWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';

/**
 * @description
 * Confirm Account Mask
 */
export default {
	name: 'ConfirmAccountMaskWidget',
	components: {
		ButtonWidget,
		FormErrorDisplayWidget,
		SpinnerWidget,
	},
	data() {
		return {
			confirmationSent: false, //has resend email been sent?
			loading: false,
			//form modal
			form: {
				//form error display
				error: {
					msg: '',		//form error messages
					display: false, //display error message
				},
			},
		};
	},
	methods: {
		resendEmail() {
			const self = this;
			console.log('sending email');

			self.loading = true;
			self.form.error.display = false;

			axios.get(
				`${self.$store.state.app.jseCoinServer}/resendwelcome/${window.user.uid}/${window.user.email}/`,
			).then((res) => {
				console.log('success', res);
				self.loading = false;
				if (res.data) {
					self.form.error.msg = res.data;
					self.form.error.display = true;
				} else {
					self.confirmationSent = true;
				}
			}).catch((err) => {
				console.log('err', err);
				self.loading = false;
			});
		},
		closeError() {
			const self = this;
			self.form.error.display = '';
		},
	},
};
</script>

<style scoped>
.confirmDisplay {
    position: absolute;
    top: 24px;
	margin:0px 20px;
    padding: 8px 16px;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.8em;
    font-weight: bold;
    border-radius: 6px;
    letter-spacing: 1px;
}
.night .confirmDisplay {
    background: #101219;
    color: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.8), inset 0px 0px 0px 1px rgba(255,255,255,0.3);
}
.light .confirmDisplay {
    background: #fff;
    color: #101219;
    box-shadow: 0px 1px 2px 0px rgba(25,112,199,0.6);
	border:solid 1px rgba(53,152,219,0.7);
	font-weight:bold;
}
</style>