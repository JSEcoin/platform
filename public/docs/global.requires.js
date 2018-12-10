import Vue from 'vue';

import Router from 'vue-router';
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
import SocialSharing from 'vue-social-sharing';
import TreeView from 'vue-json-tree-view';
import VueIntro from 'vue-introjs';

import pdfMake from 'pdfmake/build/pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


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

//header template injection
Vue.use(VueHead);

//Social sharing
Vue.use(SocialSharing);

//Tree view json
Vue.use(TreeView);

//sitewizard
Vue.use(VueIntro);
