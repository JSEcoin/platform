<template>
	<AppWrapperWidget>
		<NavWidget activeNav="dashboard" activeSubNav="account"></NavWidget>
		<ScrollWidget>
			<!-- Account Overview -->
			<ContentWidget titleTxt="Account">
				<div class="row">
					<div class="col" style="padding:8px 20px 0px 0px">
						<canvas ref="indenticon" width="600" height="600" style="border-radius:8px; width:100px; height:100px;"></canvas>
						<div style="text-align:center; font-size:0.75em; font-weight:bold; background:#fafafa; border-radius:8px; padding:4px 8px;">Acc No: {{user.uid}}</div>
					</div>
					<div class="col" style="width:100%;">
						<div class="row" style="display:flex;">
							<InputWidget
								v-bind="{showLabel:true}"
								placeholder="Name"
								name="Name"
								:value="user.name" />
						</div>
						<div class="row" style="display:flex;">
							<InputWidget
								v-bind="{showLabel:true}"
								placeholder="E-mail"
								name="E-mail"
								:value="user.email" />
						</div>
						<div class="row" style="display:flex;">
							<InputWidget
								v-bind="{showLabel:true}"
								placeholder="Address"
								name="Address"
								:value="user.address" />
						</div>
					</div>
				</div>
			</ContentWidget>
			<!-- xAccount Overview -->
	
			<!-- Animation to display during server requests -->
			<SpinnerWidget :class="{active:loading}"/>
			<!-- xAnimation to display during server requests -->

			<!-- Account Overview -->
			<ContentWidget titleTxt="Signed In" v-if="!loading">
				<OptionsListWrapperWidget style="text-transform:capitalize;" :titleTxt="`${loginRecord.app} - ${date(loginRecord.ts)}`" :key="i" v-for="(loginRecord, i) in loginsRes">
					<ul class="tableListDisplay">
						<li>
							<div class="row">
								<label>Country</label>
								<span>{{loginRecord.geo}}</span>
							</div>
							<div class="row">
								<label>IP Address</label>
								<span>{{loginRecord.ip}}</span>
							</div>
							<div class="row">
								<label>User Agent</label>
								<span>{{loginRecord.ua}}</span>
							</div>
							<!-- <div class="row">
								<label></label>
								<span>{{loginRecord[4]}}</span>
							</div> -->
						</li>
					</ul>
					
					
					
					
				</OptionsListWrapperWidget>
			</ContentWidget>
			<!-- xAccount Overview -->
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import SpinnerWidget from '@/components/widgets/SpinnerWidget.vue';
import OptionsListWrapperWidget from '@/components/widgets/OptionsListWrapperWidget.vue';
import InputWidget from '@/components/widgets/InputWidget.vue';

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
		SpinnerWidget,
		OptionsListWrapperWidget,
		InputWidget,
	},
	data() {
		return {
			loginsRes: [],
			loading: false,
			identiconImg: [],
			identiconParts: {
				background: 9,
				legs: 6,
				arms: 8,
				neck: 3,
				hat: 9,
				body: 7,
				head: 8,
				eyes: 9,
				logo: 8,
			},
			identiconTotal: 0,
		};
	},
	created() {
		const self = this;
		this.user = window.user;

		self.history();
		self.generateIdenticon();
	},
	methods: {
		history() {
			const self = this;
			self.loading = true;

			const lastLoginReq = {
				session: self.$store.state.user.session,
			};

			//post req for login info
			axios.post(
				`${self.$store.state.app.jseCoinServer}/lastlogins/`,
				lastLoginReq,
			).then((res) => {
				console.log(res);
				const dataset = Object.values(res.data);
				self.loginsRes = dataset.slice().reverse();
				self.loading = false;
			}).catch((err) => {
				self.loading = false;
				if (err.response.data.notification) {
					self.form.error.msg = err.response.data.notification;
				} else {
					self.form.error.msg = 'Unknown Error';
				}
				self.$store.commit('ajaxError', err.response);
			});
		},
		/**
		 * Updates timestamp with readable format
		 *
		 * @param {string} ts -  timestamp
		 * @returns time from now stamp
		 * @public
		 */
		date(ts) {
			return moment(Number(ts)).fromNow();
		},
		generateIdenticon(publicKey) {
			const self = this;
			const identiconFiles = [];
			let identCode = 1;
			let tmpCode = 0;

			let charCount = 4; // skip the first few
			Object.entries(self.identiconParts).forEach(([key, value]) => {
				//if (!identiconParts.hasOwnProperty(key)) continue;
				const charCode = window.user.publicKey.charCodeAt(charCount);
				identCode = 1;
				tmpCode = 0;

				// limit identCode to max number of parts via a basic math loop
				while (tmpCode <= charCode) {
					identCode++;
					tmpCode++;
					if (identCode > self.identiconParts[key]) {
						identCode = 1;
					}
				}
				identiconFiles[key] = 'https://jsecoin.com/img/identicons/'+key+identCode+'.png';
				self.identiconImg.push(self.loadImage(identiconFiles[key]));
				charCount++;
			});
			//console.log(identiconFiles);
		},
		loadImage(src) {
			const self = this;
			const img = new Image();
			img.onload = self.updateCanvas;
			img.src = src;
			return img;
		},
		updateCanvas() {
			const self = this;
			self.identiconTotal++;
			if (Object.values(self.identiconParts).length === self.identiconTotal) {
				const canvas = self.$refs.indenticon;
				const ctx = canvas.getContext('2d');
				//console.log('x',self.identiconImg);
				self.identiconImg.forEach((i, k) => {
					//console.log(i);
					ctx.imageSmoothingQuality = 'high';
					ctx.drawImage(i, 0, 0);
				});
			}
		},
	},
};
</script>
