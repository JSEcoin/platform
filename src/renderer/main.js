import Vue from 'vue';
import Vuebar from 'vuebar';
import axios from 'axios';
//todo replace with custom moment widget
import VueMoment from 'vue-moment';
import VueClipboard from 'vue-clipboard2';
import VueSwal from 'vue-swal';
//todo replace and use with QR coin generator
import VueQriously from 'vue-qriously';
import VueHead from 'vue-head';

//App, Router and Vuex Store
import App from './App';
import nav from './nav';
import store from './store';

if ((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined')) {
//if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
	Vue.use(require('vue-electron'));
}

//quick axios access
Vue.http = Vue.prototype.$http = axios;

//Vue.config.productionTip = false;
Vue.config.productionTip = process.env.NODE_ENV === 'production';

//date time calc
Vue.use(VueMoment);

//virtual scrollbar
Vue.use(Vuebar);

//copy
Vue.use(VueClipboard);

//QR Code Generator
Vue.use(VueQriously);

//sweet alert
Vue.use(VueSwal);

//header template injection
Vue.use(VueHead);

//
const AppData = Object.freeze({
	name: 'JSECoin',
	version: store.state.app.version,
});
/* eslint-disable no-new */
new Vue({
	components: {
		App,
	},
	head: {
		meta: [{
			name: 'viewport',
			content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
		}],
	},
	router: nav,
	store,
	template: '<App/>',
}).$mount('#JSEA-desktop');
