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
import VueMultianalytics from 'vue-multianalytics';

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

//platformName analytics display
const platformName = `JSEapp_${(typeof (process.platform) !== 'undefined')? process.platform : 'unknown'}`;

//console.log(`initiating app - ${platformName}`);
//setup analytics on platform.
Vue.use(VueMultianalytics, {
	modules: {
		ga: {
			appName: platformName, // Mandatory
			appVersion: store.state.app.version, // Mandatory
			trackingId: 'UA-48537439-16', // Mandatory
			//debug: true, // Whether or not display console logs debugs (optional)
		},
		//facebook: {
		//	token: '500910373434901',
			//debug: true, // Whether or not display console logs debugs (optional)
		//},
	},
	routing: {
		vueRouter: nav, //  Pass the router instance to automatically sync with router (optional)
		//preferredProperty: 'name', // By default 'path' and related with vueRouter (optional)
		//ignoredViews: ['homepage'], // Views that will not be tracked
		//ignoredModules: ['ga'], // Modules that will not send route change events. The event sent will be this.$ma.trackView({viewName: 'homepage'}, ['ga'])
	},
});

//disable file:// check analytics requirement
if (((typeof (process) !== 'undefined') && (typeof (process.browser) === 'undefined')) || ((typeof (process) !== 'undefined') && (process.platform === 'mobile'))) {
	window.ActiveXObject = undefined;
	window.ga('set', 'checkProtocolTask', null);
}

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
