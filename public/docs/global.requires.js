import Vue from 'vue';

import Router from 'vue-router';

import Vuebar from 'vuebar';
//import 'hazardous';
import { join, normalize } from 'path';
import axios from 'axios';
import VueMoment from 'vue-moment';
//import requirejs from 'requirejs';
import VueClipboard from 'vue-clipboard2';
import VueSwal from 'vue-swal';
//todo replace and use with QR coin generator
import VueQriously from 'vue-qriously';

//import emptyRoute from './emptyRoute';
//import store from './store';

Vue.use(Router);

//if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
const ps = '/';//(process.env.NODE_ENV !== 'development') ? '\\\\' : '/';
/*
let requireConf = {
	baseUrl: __static+'/JET/js',
	// Path mappings for the logical module names
	// Update the main-release-paths.json for release mode when updating the mappings
	paths: {
		knockout: 'libs/knockout/knockout-3.4.0.debug',
		jquery: 'libs/jquery/jquery-3.1.1',
		'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0',
		promise: 'libs/es6-promise/es6-promise',
		hammerjs: 'libs/hammer/hammer-2.0.8',
		ojdnd: 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
		ojs: 'libs/oj/v4.2.0/debug',
		ojL10n: 'libs/oj/v4.2.0/ojL10n',
		ojtranslations: 'libs/oj/v4.2.0/resources',
		text: 'libs/require/text',
		signals: 'libs/js-signals/signals',
		customElements: 'libs/webcomponents/custom-elements.min',
		proj4: 'libs/proj4js/dist/proj4-src',
		css: 'libs/require-css/css',
	},
	// Shim configurations for modules that do not expose AMD
	shim: {
		jquery: {
			exports: ['jQuery', '$'],
		},
	},
};
if (process.env.NODE_ENV !== 'development') {
	let jetPath = __dirname.replace(/electron.asar/, 'app.asar.unpacked');
	jetPath = jetPath.replace(/renderer/, 'dist/electron');
	requireConf = {
		//baseUrl: join(__dirname, '/static/JET/js'),//`${__static}${ps}JET${ps}js${ps}`,
		// Path mappings for the logical module names
		// Update the main-release-paths.json for release mode when updating the mappings
		paths: {
			knockout: join(jetPath, '/static/JET/js/libs$/knockout/knockout-3.4.0.debug'),//`${ps}libs${ps}knockout${ps}knockout-3.4.0.debug`,
			jquery: join(jetPath, '/static/JET/js/libs/jquery/jquery-3.1.1'),//`${ps}libs${ps}jquery${ps}jquery-3.1.1`,
			'jqueryui-amd': join(jetPath, '/static/JET/js/libs/jquery/jqueryui-amd-1.12.0'),//`${ps}libs${ps}jquery${ps}jqueryui-amd-1.12.0`,
			promise: join(jetPath, '/static/JET/js/libs/es6-promise/es6-promise'),//`${ps}libs${ps}es6-promise${ps}es6-promise`,
			hammerjs: join(jetPath, '/static/JET/js/libs/hammer/hammer-2.0.8'),//`${ps}libs${ps}hammer${ps}hammer-2.0.8`,
			ojdnd: join(jetPath, '/static/JET/js/libs/dnd-polyfill/dnd-polyfill-1.0.0'),//`${ps}libs${ps}dnd-polyfill${ps}dnd-polyfill-1.0.0`,
			ojs: join(jetPath, '/static/JET/js/libs/oj/v4.2.0/debug'),//`${ps}libs${ps}oj${ps}v4.2.0${ps}debug`,
			ojL10n: join(jetPath, '/static/JET/js/libs/oj/v4.2.0/ojL10n'),//`${ps}libs${ps}oj${ps}v4.2.0${ps}ojL10n`,
			ojtranslations: join(jetPath, '/static/JET/js/libs/oj/v4.2.0/resources'),//`${ps}libs${ps}oj${ps}v4.2.0${ps}resources`,
			text: join(jetPath, '/static/JET/js/libs/require/text'),//`${ps}libs${ps}require${ps}text`,
			signals: join(jetPath, '/static/JET/js/libs/js-signals/signals'),//`${ps}libs${ps}js-signals${ps}signals`,
			customElements: join(jetPath, '/static/JET/js/libs/webcomponents/custom-elements.min'),//`${ps}libs${ps}webcomponents${ps}custom-elements.min`,
			proj4: join(jetPath, '/static/JET/js/libs/proj4js/dist/proj4-src'),//`${ps}libs${ps}proj4js${ps}dist${ps}proj4-src`,
			css: join(jetPath, '/static/JET/js/libs/require-css/css'),//`${ps}libs${ps}require-css${ps}css`,

			ojsojcore: join(jetPath, '/static/JET/js/libs/oj/v4.2.0/debug/ojcore'),
			ojsojchart: join(jetPath, '/static/JET/js/libs/oj/v4.2.0/debug/ojchart'),
		},
		// Shim configurations for modules that do not expose AMD
		shim: {
			jquery: {
				exports: ['jQuery', '$'],
			},
		},
	};
}

//configuration
requirejs.config(requireConf);
*/
//quick axios access
Vue.http = Vue.prototype.$http = axios;

//Vue.config.productionTip = false;
Vue.config.productionTip = process.env.NODE_ENV === 'production';

//Vue router
Vue.use(Router);

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
