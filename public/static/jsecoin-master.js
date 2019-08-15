// uglifyjs jsecoin-master.js -c -o jsecoin.min.js
// For testnet, set to 'local' or 'remote' (@string) to run on http://localhost:81 or https://testnet.jsecoin.com, false for production

var jseTestNet = jseTestNet || false; //'remote';

var app = app || false;

if (app == false && window && window.process && window.process.type) {
	app = 'desktop';  // this can probably be removed now because app is set in the app with || false
}

/* Var Definitions */
var user = user || false;
var stats = {};
var lastRequestTime = 0;
var locked = false;
var appHash = '849016FEE1';
var jseServer = 'https://server.jsecoin.com:443'; // change for production to https://server.jsecoin.com 
var jseLoadServer = 'https://load.jsecoin.com:443'; // https://load.jsecoin.com
var jseAdXServer = 'https://adx.jsecoin.com:443'; // https://load.jsecoin.com
var tabFocused = true;
var currentPage = 'index.html';
var scriptLoadTS = new Date().getTime();
var pX = 0; // mouse offset check to stop mining bots
var conversionTags = '<iframe src="https://jsecoin.com/pixels.php?conversion=signup" frameborder="0" width="1" height="1" style="position: absolute; left: -150px;"></iframe>';
var sessionHashes = 0;
var quitMining = true;
var ioLoaded = false;
var preHash = '0';
var hashRate = 1500; // start off at 1500 hps, should be lower for production
var maxHashRate = hashRate;
var socketIOAddress = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';
var rawData = [];
var chartData = [];
var series = [{data:0}];
var plot = {};
var currentCampaignID = null;
var currentSiteID = null;

window.onfocus = function() {
  tabFocused = true;
};
window.onblur = function() {
  tabFocused = false;
};
window.onbeforeunload = function() {
	delete window.user; 
};

$.ajaxSetup({ cache: false });

$(document).ajaxError(function(request, type, errorThrown) {
	//type.responseText contains json string we pass back
	var ajaxErrorEvent = document.createEvent('Event');
	if (type.status === 503) {
		notify('Server error, apologies we may be carrying out maintenance or experiencing very high demand. This error can also be caused by an adblocker or anti-virus software blocking our domain, please add an exception or disable the ad blocker/AV.');
		ajaxErrorEvent.initEvent('ajaxConnectionError', true, true);
		document.dispatchEvent(ajaxErrorEvent);
	} else if (type.status === 401) {
		ajaxErrorEvent.initEvent('ajaxCredentialsError', true, true);
		document.dispatchEvent(ajaxErrorEvent);
		notify('Credentials Error: '+type.responseText);
		setTimeout(function() {
			if (app === false) document.location.href = 'https://platform.jsecoin.com';
		}, 4000);
	} else {
		ajaxErrorEvent.initEvent('ajaxGeneralError', true, true);
		document.dispatchEvent(ajaxErrorEvent);
	}
});

function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) { params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]); }
	return params;
}
var get = getQueryParams(document.location.search);

if (get.testnet) {
	jseTestNet = get.testnet;
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

if (jseTestNet == false) {
	// Redirect everything to https
	if (!(window && window.process && window.process.type)) {
		if (location.protocol != 'https:'){ location.href = 'https:' + window.location.href.substring(window.location.protocol.length); }
	}
}

if (jseTestNet == 'local') {
	jseServer = 'http://localhost:81';
	jseLoadServer = 'http://localhost:81';
	jseAdXServer = 'http://localhost/jsecoin/github/server/static'
}
if (jseTestNet == 'remote') {
	jseServer = 'https://testnet.jsecoin.com:443';
	jseLoadServer = 'https://testnet.jsecoin.com:443';
}

function ajaxTestConnection(serverURL,callback) {
  $.ajax({
    type: "GET", 
    url: serverURL,
    timeout: 3000,
    success: function (data, text) {
      callback(true);
    },
    error: function (request, status, error) {
      callback(false);
    }
  });
}

if (jseTestNet == false) {
	ajaxTestConnection(jseServer,function(serverAlive) {
		if (!serverAlive) {
			console.log(jseServer+' Failed - Upgrading');
			jseServer = atob('aHR0cHM6Ly9zZXJ2ZXIxLmpzZWNvaW4uY29tOjQ0Mw==');
			if (app !== false) {
				var jseServerUpdate = new CustomEvent("jseServerUpdate", {detail: jseServer});
				document.dispatchEvent(jseServerUpdate);
			}
		}
	});

	ajaxTestConnection(jseLoadServer,function(serverAlive) {
		if (!serverAlive) {
			console.log(jseLoadServer+' Failed - Upgrading');
			jseLoadServer = atob('aHR0cHM6Ly9sb2FkMS5qc2Vjb2luLmNvbTo0NDM=');
		}
	});
}

var warningSign = '<img style="margin-top: -3px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8xMy8xOOpi2NMAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAADBElEQVQ4jZXOS2hcVRzH8e+5d2bu7TwybUwmcTATZ1ITmodKa5TEVhvaQqPEVk1UNARciZhFpAjtoj7wsWjpQlRIRLvTRUFFkCxEu9Hqwo2oRWhEpW2SWjrRzOPOnTv3nL+Lihttpj1wOH/4/86HnxIRmp1FpV5XkBgXmWsaFpEN7wnInB3btXZ2/97ym9DdLN8UPB13Pqp9+rHUFz+Tz9OpL5rlrY3af6DU3lsfm3zE3TZILL2FngfH98wr9fBGf64JKqXsnkJuoXvmaSgWYW2N/OhOevO5d3JKOTcMfgKHe2ZmClbMxctmqQ0NoTyfgZGRm1+K2K/eEPiaUl2F+0ZfbN+1GxyH0clJBiYmqGezdDhxtvXddugZpXqvGxxOJ+e3PvlUjEoV+vspXr7MhaUl9L59EIbc2dZu3bu5ZeG6wPeUGt968MAD8bYOyOUgHmdLKkXSdXEzGZiaIn7+Ijsy7buPWNbkhqBSKtqbv2U+P7wDCTWNwUEAUi0tuK6LBeiJCWRggN56wO3trW8ppdxrgqfSrUe7O93cn8deoJhtp2HbADiOgzEGgFDgj0PPc2b5Ah227jweT7zxv+ArSuXzhY7D6ZVfKe8cwxvcTlAqobVmenqa2dlZRAS/tI6+ewT7iUcJVv+iO+nMPa5U33/Au7q6FrqipahnRfFmX6ZRrRD4PsYYkskkANVqlSAICIpFWueO4N+UIulV1Wgq+e6/FUWEty1n/Kd7+uVKBjl3/Kj86DXk55VVOb9eloaI3P/QAWFTQpbLFbnk1eTc6iX5xQ/kmxPH5EOQU5tT8mwkclBEUM9B51Rf4csht9jvraxT334HjWweHQSIsrDsGGXPo1TxaG3L4Pl1Gtpg7CjexWWK335HPGpzJeYsnax6e9T7Mef08HDfWLK2RmAgrHpov05ohIY2hKFBUBhR1Pw62gihgTAEY1uYmEMYCkQsvqr5X0esoH7y+x9+S2g3kdbGiMFGyyaMCFrkn9dcnVUUbQvGErR9da9DAaRS8+u/17VZ/BuiQK+lnh+GwwAAAABJRU5ErkJggg==" alt="" />';

/* USER CHECK */
var jseTrack = {};
function checkUser() {
	jseTrack.url = window.location.href;
	jseTrack.userAgent = navigator.userAgent || 0;
	jseTrack.platform = navigator.platform || 0;
	jseTrack.referrer = document.referrer || 0;
	
	jseTrack.language = window.navigator.language || 0;
	if (navigator.languages) { 
		jseTrack.languages = navigator.languages.join('') || 0;
	} else {
		jseTrack.languages = 1;
	}
	jseTrack.timezoneOffset = new Date().getTimezoneOffset() || 0;
	jseTrack.appName = window.navigator.appName || 0;
	jseTrack.screenWidth = window.screen.width || 0;
	jseTrack.screenHeight = window.screen.height || 0;
	jseTrack.screenDepth = window.screen.colorDepth || 0;
	jseTrack.screen = jseTrack.screenWidth+'x'+jseTrack.screenHeight+'x'+jseTrack.screenDepth; // 1920x1080x24
	jseTrack.innerWidth = window.innerWidth || 0;
	jseTrack.innerHeight = window.innerHeight || 0;
	jseTrack.deviceMemory = navigator.deviceMemory || navigator.hardwareConcurrency || 0;
	jseTrack.protoString = Object.keys(navigator.__proto__).join('').substring(0, 100) || 0;
	
	jseTrack.initialRating = 0;
	jseTrack.movement = 0;
	jseTrack.timeOnSite = 0;
	jseTrack.elementsTracked = 0;
	jseTrack.timeFactor = 0;
	jseTrack.elementsFactor = 0;
	jseTrack.lastX = 0;
	jseTrack.lastY = 0;
	jseTrack.lastElement = null;
	
	function getHoverID() { 
		var q = document.querySelectorAll(":hover");
		if (q && q.length && q[q.length-1].id) {
			return q[q.length-1].id;
		} else if (q && q.length && q[q.length-1].className) {
			return q[q.length-1].className;
		} else {
			return false;
		}
	};
	var hoverElement = getHoverID();
	
	function webGLFP(){
		var canvas, ctx, width = 32, height = 32;
		canvas = document.createElement("canvas");
		canvas.width = width,
		canvas.height = height,
		ctx = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || canvas.getContext("moz-webgl");
		try {
			var f = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
			var g = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
			var h = ctx.createBuffer();
			ctx.bindBuffer(ctx.ARRAY_BUFFER, h);
			var i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]);
			ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW), h.itemSize = 3, h.numItems = 3;
			var j = ctx.createProgram();
			var k = ctx.createShader(ctx.VERTEX_SHADER);
			ctx.shaderSource(k, f);
			ctx.compileShader(k);
			var l = ctx.createShader(ctx.FRAGMENT_SHADER);
			ctx.shaderSource(l, g);
			ctx.compileShader(l);
			ctx.attachShader(j, k);
			ctx.attachShader(j, l);
			ctx.linkProgram(j);
			ctx.useProgram(j);
			j.vertexPosAttrib = ctx.getAttribLocation(j, "attrVertex");
			j.offsetUniform = ctx.getUniformLocation(j, "uniformOffset");
			ctx.enableVertexAttribArray(j.vertexPosArray);
			ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
			ctx.uniform2f(j.offsetUniform, 1, 1);
			ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);
			var m = "";
			var n = new Uint8Array(width * height * 4);
			ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);
			m = JSON.stringify(n).split(/[^0-9]/).join('').split('0').join('').match(/.{1,8}/g);
			var total = 1;
			for (var index = 0; index < Math.min(m.length || 1024); index+=1) {
				var val = parseFloat(m[index],10);
				total = total + val;
			}
			var o = Number(String(total).substr(2,8));
			 return o;
		}	catch (e) {
			return 0;
		}  
	}
	
	// localStorage check
	jseTrack.firstSeen = new Date().getTime();
	jseTrack.visits = 0;
	if (localStorage) {
		// find out if it's been validated before
		var localStorageCounter = localStorage.localStorageCounter || 0;
		localStorageCounter = parseInt(localStorageCounter) + 1;
		localStorage.setItem('localStorageCounter', localStorageCounter);
		if (localStorageCounter > 1) {
			jseTrack.visits = localStorageCounter;
		}	
	}
	// Test Web GL
	jseTrack.webGL = webGLFP();
	jseTrack.browserCheck = false;
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	var isEdge = !isIE && !!window.StyleMedia;
	var userAgentLowerCase = jseTrack.userAgent.toLowerCase();
	if (userAgentLowerCase.indexOf('chrome') > -1 && isChrome) { jseTrack.browserCheck = true; }
	if (userAgentLowerCase.indexOf('opera') > -1 && isOpera) { jseTrack.browserCheck = true; }
	if (userAgentLowerCase.indexOf('firefox') > -1 && isFirefox) { jseTrack.browserCheck = true; }
	if (userAgentLowerCase.indexOf('safari') > -1 && isSafari) { jseTrack.browserCheck = true; }
	if (userAgentLowerCase.indexOf('msie') > -1 && isIE) { jseTrack.browserCheck = true; }
	if (userAgentLowerCase.indexOf('edge') > -1 && isEdge) { jseTrack.browserCheck = true; }
	function handleMovement(event) {
		var eventDoc, doc, body, pageX, pageY;
		event = event || window.event;
		if (event.pageX == null) {
			eventDoc = (event.target && event.target.ownerDocument) || document;
			doc = eventDoc.documentElement;
			body = eventDoc.body;
			event.pageX = Math.floor((event.touches && event.touches[0].clientX || event.clientX || 0) +
				(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				(doc && doc.clientLeft || body && body.clientLeft || 0));
			event.pageY = Math.floor((event.touches && event.touches[0].clientY || event.clientY || 0) +
				(doc && doc.scrollTop || body && body.scrollTop || 0) -
				(doc && doc.clientTop || body && body.clientTop || 0));
		}
		// check to see if movement is normal, could get more advanced with this
		var fastMove = 15;
		if (jseTrack.lastX + fastMove > event.pageX && jseTrack.lastX - fastMove < event.pageX && jseTrack.lastY + fastMove > event.pageY && jseTrack.lastY - fastMove < event.pageY) {
			jseTrack.movement += 1;
		}
		jseTrack.lastX = event.pageX;
		jseTrack.lastY = event.pageY;
	}
	
	document.onmousemove = handleMovement;
	if ('ontouchmove' in document.documentElement) {
		document.ontouchmove = handleMovement;
	}
	if ('ontouchend' in document.documentElement) {
		document.ontouchend = function() {
			jseTrack.movement += 10;
		}
	}
	function increaseTimer() {
		jseTrack.timeOnSite += 1;
		// check hover element
		if (document.activeElement.id !== jseTrack.lastElement) {
			jseTrack.elementsTracked += 1;
			jseTrack.lastElement = document.activeElement.id;
		} else {
			var hoverID = getHoverID();
			if (hoverElement !== hoverID) {
				jseTrack.elementsTracked += 1;
				hoverElement = hoverID;
			}
		}
		setTimeout(function() {
			increaseTimer();
		},1000);
	}
	increaseTimer();
	
	return jseTrack;
}
checkUser();

/* GENERAL FUNCTIONS */

function cleanString(stringRaw) { // es5 version of function in server/modules/functions.js
	var stringClean = String(stringRaw);
	stringClean = stringClean.split(/[^ .$*+?\\\-_:/&=,{}@a-zA-Z0-9\s]/).join('');
	stringClean = stringClean.substr(0, 255);
	return stringClean;
}

function calculatePendingTotal() {
	user.pendingTotal = 0;
	user.pendingSelfMining = 0;
	user.pendingPublisherMining = 0;
	user.pendingAdvertiser = 0;
	user.pendingReferrals = 0;
	var daysPending = 0;
	var firstObjectOnly = true;
	user.pendingNextPayment = 0;
	user.platformPendingChartData = [];
	user.publisherPendingChartData = [];
	user.advertisingPendingChartData = [];
	user.referralPendingChartData = [];

	for (var key in user.rewards) {
		if (!user.rewards.hasOwnProperty(key)) continue;
		if (!user.rewards[key].d) {
			if (user.rewards[key].s) { // self-mining
				user.pendingTotal += user.rewards[key].s;
				user.pendingSelfMining += user.rewards[key].s;
				user.platformPendingChartData.push([key,user.rewards[key].s]);
				if (firstObjectOnly) { user.pendingNextPayment += user.rewards[key].s; }
			}
			if (user.rewards[key].p) { // publisher mining
				user.pendingTotal += user.rewards[key].p;
				user.pendingPublisherMining += user.rewards[key].p;
				user.publisherPendingChartData.push([key,user.rewards[key].p]);
				if (firstObjectOnly) { user.pendingNextPayment += user.rewards[key].p; }
			}
			if (user.rewards[key].a) { // advertising
				user.pendingTotal += user.rewards[key].a;
				user.pendingAdvertiser += user.rewards[key].a;
				user.advertisingPendingChartData.push([key,user.rewards[key].a]);
				if (firstObjectOnly) { user.pendingNextPayment += user.rewards[key].a; }
			}
			if (user.rewards[key].r) { // referral rewards
				user.pendingTotal += user.rewards[key].r;
				user.pendingReferrals += user.rewards[key].r;
				user.referralPendingChartData.push([key,user.rewards[key].r]);
				if (firstObjectOnly) { user.pendingNextPayment += user.rewards[key].r; }
			}
			if (user.pendingNextPayment > 0) { firstObjectOnly = false; }
		}
		daysPending += 1;
	}
	if (daysPending > 6) {
		user.pendingToday = user.pendingNextPayment;
	} else {
		user.pendingToday = 0;
	}
}

function notify(msg) {
	if (app === false) {
		$('.notifycontent').html(msg+'<br><button type="button" class="btn btn-sm btn-primary alertbutton" onclick="closeAlert()">OK</button>');
		$(".alert").removeClass('hide animated fadeOutUp').addClass('animated fadeInDown');
	} else {
		console.log('NOTIFY: '+msg);
	}
}

function launchModal(title,content) {
	$('#tmpmodal').modal('show');
	$('.modal-title').html(title);
	$('#tmpmodalbody').html(content);
}


function isEthAddress(address) {
	if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
		return false;
	} else {
		return true;
	}
}

function ymd2datepicker(yymmdd) {
	return '20'+yymmdd.substr(0,2)+'-'+yymmdd.substr(2,2)+'-'+yymmdd.substr(4,2);
}

function datepicker2ymd(datepicker) {
	return datepicker.split('201').join('1').split('202').join('2').split('-').join(''); // 2010 - 2029
}

function shuffle(array) {
	var counter = array.length, temp, index;
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function randString(length) {
	var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var randString = shuffle(chars).join('').slice(0,length);
	return randString;
}

function copyToClipboard(containerid) {
	if (document.selection) { 
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select().createTextRange();
		document.execCommand("Copy"); 
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		//window.getSelection().empty();
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand("Copy");
	}
	$('.copiedresult').html('<i class="fa fa-check fa-2" style="color: green;" aria-hidden="true"></i>');
}

function timeSince(date) {
	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);
	if (interval > 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
}

function utcTS2local(TS) {
	var date = new Date(TS);
	//var utcDate = date.toUTCString();
	var localString = date.toLocaleString();
	return localString;
}

function closeAlert() {
	$(".alert").removeClass('animated fadeInDown').addClass('animated fadeOutUp');
	setTimeout(function() { $(".alert").addClass('hide'); },1000);
}

function round(value) {
	var decimals = 8;
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function buttonLoading(id) {
	var buttonWidth = $('#'+id).width();
	var buttonHeight = $('#'+id).height();
	$('#'+id).html('<img src="img/buttonloading.gif" alt="loading..." style="height: 14px; width: 36px;">');
	$('#'+id).width(buttonWidth);
	$('#'+id).height(buttonHeight);
}

function goodPassword(pass) {
	var score = 0;
	// award every unique letter until 5 repetitions
	var letters = new Object();
	for (var i=0; i<pass.length; i++) {
		letters[pass[i]] = (letters[pass[i]] || 0) + 1;
		score += 5.0 / letters[pass[i]];
	}
	var variations = {
		digits: /\d/.test(pass),
		lower: /[a-z]/.test(pass),
		upper: /[A-Z]/.test(pass),
	}
	variationCount = 0;
	for (var check in variations) {
		variationCount += (variations[check] == true) ? 1 : 0;
  }
	score += (variationCount - 1) * 10;
  var badRoots = ['12345','password','qwerty','letmein','football','loveyou','admin','welcome','monkey','login','abc123','starwars','123123','dragon','passw0rd','asdf123','master','hello','freedom','whatever','qazwsx','trustno','54321','jordan','harley'];
  for (var i=0; i<badRoots.length; i++) {
    if (pass.indexOf(badRoots[i]) > -1) {
      score = score / 2;  
    }
  }
  if (pass.length < 6) {
    score = 0;
  }
	// These passwords still beat the test. Tested 35,000 passwords common from various sources on Github via passtest.js
  var commonPasswords = ['Usuckballz1','Soso123aljg','123qweasdzxc','1qaz2wsx3edc','q1w2e3r4t5y6','1q2w3e4r5t6y','Mailcreated5240','Password1','Sojdlg123aljg','PolniyPizdec0211','7uGd5HIp2J','vSjasnel12','Good123654','zxcasdqwe123','Password123','1qazxsw23edc','PE#5GZ29PTZMSE','3rJs1la7qE','123hfjdk147','421uiopy258','uQA9Ebw445','YAgjecc826','1v7Upjw3nT','d41d8cd98f00b204e9800998ecf8427e','P3Rat54797','qti7Zxh18U','Tnk0Mk16VX','W5tXn36alfW','MaprCheM56458','ka_dJKHJsy6','g9l2d1fzPY','SZ9kQcCTwY','PolniyPizdec110211','5532361cnjqrf','dIWtgm8492','3rJs5la8qE','3rJs1la2qE','CM6E7Aumn9','Groupd2013','OcPOOok325','1q2w3e4r5t6y7u8i9o0p','3Odi15ngxB','&#9679;&#9679;&#9679;&#9679;&#96','3d8Cubaj2E','PolniyPizdec1102','e10adc3949ba59abbe56e057f20f883e','TempPassWord','y6p67FtrqJ','1zn6FpN01x','1b78ef23aa2506f41feecfcc45b66038','5hsU75kpoT','d71lWz9zjS','iw14Fi9jxL','YfDbUfNjH10305070','c43qpul5RZ','b9399f21060d4b5fcb6d3cf5fea8de','H2vWDuBjX4','vRbGQnS997','x4ivygA51F','s8YLPe9jDPvYM','18atcskD2W','asdfghjkl;&#39;','w66YRyBgRa','qweasdzxc123','X3LUym2MMJ','1Fr2rfq7xL','Telechargement','d9Zufqd92N','Qwerty123','8ix6S1fceH','qwegta13091990','1q2w3e4r5t6y7u','scvMOFAS79','7253497a5e31bd64','827ccb0eea8a706c4c34a16891f84e7b','6V21wbgad','linkedin2011','asdfghjkl123','5plK4L5Uc7','mV46VkMz10','W5tn36alfW','qdujvyG5sxa','pakistan123','jamesbond007','dfg5Fhg5VGFh1','XBLhInTB9w','J1V1fp2BXm','couponSC10','5X1CJdsb9p','1q2w3e4r5t6y7u8i','rbOTmvZ954','playstation3','yfdbufnjh63','Sample123','fxzZ75yer','wsbe279qSG','1q2w3e4r5t6y7u8i9o','pazzword123','owt243yGbJ','Eh1K9oh335','319f4d26e3c536b5dd871bb2c52e3178','Password01','8PHroWZ624','iw14Fi9jwQa','skateboarding','playstation2'];
	if (commonPasswords.indexOf(pass) > -1) { 
		score = 0;
	}
	if (score > 60) {
		return true;
	} else {
		return false;
	}
}

function generateIdenticon(publicKey,containerDivID,size) { // size should be 160px in string format or 100% anything that can be set in css
	var identiconParts = {};
	identiconParts['background'] = 9; // 5 background files parts/background1.png to parts/background5.png 
	identiconParts['legs'] = 6;
	identiconParts['arms'] = 8;
	identiconParts['neck'] = 3;
	identiconParts['hat'] = 9;
	identiconParts['body'] = 7;
	identiconParts['head'] = 8;
	identiconParts['eyes'] = 9;
	identiconParts['logo'] = 8;

	var identiconFiles = {};

	var charCount = 4; // skip the first few
	for (var key in identiconParts) {
		if (!identiconParts.hasOwnProperty(key)) continue;
		var charCode = publicKey.charCodeAt(charCount);
		var identCode = 1;
		var tmpCode = 0;
		// limit identCode to max number of parts via a basic math loop
		while (tmpCode <= charCode) {
			identCode += 1; 
			tmpCode += 1;
			if (identCode > identiconParts[key]) { identCode = 1; }
		}
		identiconFiles[key] = 'img/identicons/'+key+identCode+'.png'; // put directory before key if applicable
		charCount ++;
	}
	for (var key in identiconFiles) {
		if (!identiconFiles.hasOwnProperty(key)) continue;
		$('#'+containerDivID).html($('#'+containerDivID).html() + '<img src="'+identiconFiles[key]+'" class="identicon-layer" style="z-index: '+charCount+'; height: '+size+'; width: '+size+';" />');
		charCount ++;
	}
}

function identiconClick() {
	launchModal('About Your Identicon','Identicons are images generated from your public key. This helps give a visual representation of your unique public key which is more recognisable to the human eye than a series of alphanumeric characters.<br><br>At JSEcoin we have chosen to use robots for our identicons because they are gender neutral and provide a good balance between personable characters and professionalism.<br><br>We hope you like your new identicon!<br><br><div id="identicon-modal" onclick="notify(\'<div class=breakword>Hello I am your identicon for public key:<br>'+user.publicKey+'</div>\');"></div>');
	generateIdenticon(user.publicKey,'identicon-modal','400px');
}

function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
}

/* Authentication and page loading */
function checkAuth() {
	if (user && user.session) {
		return true;
	} else {
		//notify('You need to log in');
		if (app === false) document.location.href = 'https://platform.jsecoin.com';
	}
	return false;
}

function drawBasicChart(id,data) {
	$.plot($("#"+id), [{
		data: data,
		color: "#2F4050",
		bars: {
			show: true, 
			align: "center",
			lineWidth:1
		}
	}], {
		xaxes: [{
			mode: "categories",

		}],
		yaxes: [{
			min: 0,
			tickDecimals: 0,
			axisLabel: 'JSE',
			axisLabelUseCanvas: true
		}],
		legend: {
			position: 'sw'
		},
		colors: ["#1ab394"],
		grid: {
			color: "#999999",
			hoverable: true,
			clickable: true,
			tickColor: "#D4D4D4",
			borderWidth:0,
			hoverable: true
		},
		tooltip: true,
		tooltipOpts: {
			cssClass: 'chartTooltips',
			content: "%y JSE",
			onHover: function(flotItem, $tooltipEl) {
					// console.log(flotItem, $tooltipEl);
			}
		}
	});
}


/* SESSION INITIATION FUNCTIONS */

// Save tracking variables to global cookie and localstorage
if (localStorage) {
	if (get['utm_source']) { localStorage.setItem('utmSource', get['utm_source']); document.cookie = "utmSource="+get['utm_source']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	if (get['utm_campaign']) { localStorage.setItem('utmCampaign', get['utm_campaign']); document.cookie = "utmCampaign="+get['utm_campaign']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	if (get['utm_content']) { localStorage.setItem('utmContent', get['utm_content']); document.cookie = "utmContent="+get['utm_content']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	if (localStorage.getItem("jseUnique") === null) { // set jseunique
		var jseUnique = randString(12);
		user.jseUnique = jseUnique;
		localStorage.setItem('jseUnique', jseUnique);
	} else {
		user.jseUnique = localStorage.getItem("jseUnique");
	}
}

function loadScripts() { // called after registration or login
	$.getScript( "js/jsecrypto.js", function( data, textStatus, jqxhr ) {	});
	$.getScript( "js/plugins/flot/jquery.flot.time.js", function( data, textStatus, jqxhr ) {	});
	$.getScript( "js/plugins/flot/jquery.flot.tooltip.min.js", function( data, textStatus, jqxhr ) {	});
	$.getScript( "js/plugins/flot/jquery.flot.categories.js", function( data, textStatus, jqxhr ) {	}); // can't minify or bundle these for some reason
}

// function to load script dynamically from js for JSEsocket.io
function loadScript(url, alreadyLoaded, callback) {
	if (alreadyLoaded === true) {
		callback();
	} else {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onreadystatechange = callback;
		script.onload = callback;
		head.appendChild(script);
	}
}

function startSocketIOConnection() {
	loadScript(socketIOAddress, ioLoaded, function() {
		if (ioLoaded !== true) {
			console.log('Loaded '+socketIOAddress)
			miningLog('Loaded '+socketIOAddress);
		} else {
			console.log('Rebooting socket.io connection');
		}
		ioLoaded = true;
		if (window.JSEsocket) {
			window.JSEsocket.disconnect();
			window.JSEsocket.destroy();
		}
		window.JSEsocket = io.connect(jseLoadServer, {secure: true});

		window.onbeforeunload = function(e) {
			window.JSEsocket.disconnect();
			window.JSEsocket.destroy();
		};

		window.JSEsocket.on('connect_error', function(exception) {
			console.log('JSE SOCKET ERROR: '+JSON.stringify(exception));
			miningLog('JSE SOCKET ERROR: '+JSON.stringify(exception));
			console.log('Restarting in 15 seconds');
			miningLog('Restarting in 15 seconds');
			window.JSEsocket.disconnect();
			window.JSEsocket.destroy();
			setTimeout(function() {
				startSocketIOConnection();
			}, 15000);
		});

		window.JSEsocket.on('connect', function () { 
			window.JSEsocket.emit('registerSession', user.uid, user.session, function(socketioResponse) {
				if (socketioResponse === true) {
					console.log('Successfully registered socket.io session');
				} else {
					console.log('Error 551 socket.io registration problem');
				}
			});
			setTimeout(function() {
				$.ajax({url:jseLoadServer+'/appid/316d4bfc8dd7/',type:'GET',contentType:'text/plain'}).done(function(data) {
					appHash = data.substring(0,16).toLowerCase();
				});
			}, 45000);
		});

		window.JSEsocket.once('connect', function () { 
			console.log('JSE Socket Connected!');
			miningLog('JSE Socket Connected!');
			var socketConnectionMade = document.createEvent('Event');
			socketConnectionMade.initEvent('socketConnectionMade', true, true);
			document.dispatchEvent(socketConnectionMade);

			window.JSEsocket.on('disconnect', function() {
				console.log('JSE Socket Disconnect');
				miningLog('JSE Socket Disconnect');
			});

			// start the miner up when we receive the first preHash
			window.JSEsocket.on('firstPreHash', function (blockPreHash) {
				console.log('JSE Initial Data Received: '+blockPreHash);
				miningLog('JSE Initial Data Received: '+blockPreHash);
				preHash = blockPreHash;
				window.lastPreHashReceived = new Date().getTime();
			}); 

			// update preHash variable when we receive a new preHash
			window.JSEsocket.on('blockPreHash', function (blockPreHash) {
				console.log('JSE Data Received: '+blockPreHash);
				miningLog('JSE Data Received: '+blockPreHash);
				preHash = blockPreHash;
				window.hashesFoundThisBlock = 0;
				window.lastPreHashReceived = new Date().getTime();
			});

			// refreshUser if when requested by socket.io server
			window.JSEsocket.on('userUpdate', function (updateReason,updateData) {
				if (updateReason == 'blockUpdate') { // a block has been received with a transaction containing this uid
					refreshUser(function() {
						if (currentPage == 'mining.html') {
							miningLog('Transaction found in the latest block :)');
							if (quitMining == false && $('.miningtable').length) {
								redrawMiningPage();
							}	
						} else if (currentPage == 'funds.html') {
							loadFunds();
						}
						console.log('Transaction found in the latest block :)');
						// could add additional checks here for transactions/confirmations
					});
				}
			});
		});
	});
}

function register() {
	if(!$("#newterms").is(':checked')) { notify('You need to agree to terms'); grecaptcha.reset(); return false; }
	if($('#newemail').val() !== $('#retypeemail').val()) { notify('Email addresses do not match'); grecaptcha.reset(); return false; }
	var newUser = {};
	newUser.name = cleanString($('#newname').val());
	newUser.email = cleanString($('#newemail').val());
	if (!validateEmail(newUser.email)) { notify('Email invalid, please check your email address'); grecaptcha.reset(); return false; }
	var badEmailProviders = ['jsecoin.com','jsecoins.com','cobin2hood.com','mailinator','luxusmail','inboxalias','maildrop.cc','guerrillamail','tm2mail.com','muimail.com','hitbts.com','minex-coin.com','c1oramn.com','balanc3r.com','c1oramn.com','letsmail9.com','crymail2.com','ax80mail.com'];
	for (var i = badEmailProviders.length - 1; i >= 0; i--) {
		if (newUser.email.indexOf(badEmailProviders[i]) > -1) {
			notify('Temporary email addresses will be closed, please use your real address'); grecaptcha.reset(); return false;
		}
	}
	newUser.password = $('#newpassword').val(); // not cleaned in case it fups the hash
	if (!goodPassword(newUser.password)) { notify('You need to use a stronger password'); grecaptcha.reset(); return false; }
	newUser.address = cleanString($('#newaddress').val());
	newUser.country = cleanString($('#newcountry').val());
	newUser['g-recaptcha-response'] = grecaptcha.getResponse();
	if(newUser['g-recaptcha-response'] === undefined || newUser['g-recaptcha-response'] === '' || newUser['g-recaptcha-response'] === null) {
		notify('Complete the ReCaptcha "I am not a robot"'); return false;
	}
	newUser.preRegHashes = 0; // not need after next update
	var localTime = new Date();
	newUser.localTS = localTime.getTime();
	newUser.timeOffset = localTime.getTimezoneOffset();
	newUser.regTime = newUser.localTS - scriptLoadTS; // used for bot detection
	newUser.language = window.navigator.userLanguage || window.navigator.language;
	newUser.screen = screen.width+'x'+screen.height;
	newUser.platform = app || 'platform';
	newUser.userAgent = navigator.userAgent || app || 'unknown';
	// check cookies
	if (document.cookie.indexOf('utmSource') > -1 ) { newUser.source = getCookie('utmSource'); }
	if (document.cookie.indexOf('utmCampaign') > -1 ) { newUser.source = getCookie('utmCampaign'); }
	if (document.cookie.indexOf('utmContent') > -1 ) { newUser.source = getCookie('utmContent'); }
	// check local storage
	if (localStorage && localStorage.utmSource) { newUser.source = localStorage.utmSource }
	if (localStorage && localStorage.utmCampaign) { newUser.campaign = localStorage.utmCampaign }
	if (localStorage && localStorage.utmContent) { newUser.content = localStorage.utmContent }
	// check get variables
	if (get['utm_source']) { newUser.source = get['utm_source']; }
	if (get['utm_campaign']) { newUser.campaign = get['utm_campaign']; }
	if (get['utm_content']) { newUser.content = get['utm_content']; }
	if (localStorage && localStorage.jseUnique) { newUser.jseUnique = localStorage.jseUnique; }
	$('body').append(conversionTags);
	$.ajax({url:jseServer+'/register/',type:'POST',contentType:'application/json',data: JSON.stringify(newUser)}).done(function(data) {
		user = JSON.parse(data);
		if (user.fail) {
			notify(user.notification);
			delete user;
			grecaptcha.reset();
			return false;
		} else {
			// registration successful
			$('.loginout1').html('<a href="javascript:void(0)"  onclick="logOut();"><i class="fa fa-sign-out"></i> Log Out</a>');
			$('.loginout2').html('<a href="javascript:void(0)" onclick="logOut();" data-toggle="tooltip" title="Log Out"><i class="fa fa-sign-out"></i> <span class="nav-label">Log Out</span></a>');	
			loadScripts();
			loadDashboard();
			startSocketIOConnection();
			return false;
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) {
			notify(failObj.notification);
			delete user;
			grecaptcha.reset();
		}
		return false;
	});
}

function confirmAccount() {
	var strippedUID = parseInt(get.uid,10);
	var cleanCode = cleanString(get.confirmcode);
	var jT = checkUser(); // jseTrack
	var recaptchaResponse = grecaptcha.getResponse();
	if(recaptchaResponse === undefined || recaptchaResponse === '' || recaptchaResponse === null) {
		notify('Complete the ReCaptcha "I am not a robot"');
		grecaptcha.reset();
		return false;
	}
	jT['g-recaptcha-response'] = recaptchaResponse;
	console.log('posting');
	$.ajax({url:jseServer+'/confirm/'+strippedUID+'/'+cleanCode+'/',type:'POST',contentType:'application/json',data: JSON.stringify(jT)}).done(function(data) {
		var res = JSON.parse(data);
		if (res.fail) {
			notify(res.notification);
			grecaptcha.reset();
			return false;
		} else {
			notify('Thank you for confirming your account');
			setTimeout(function() {
				window.location = "https://platform.jsecoin.com/";
			},1500);		
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) {
			notify(failObj.notification);
		}
		grecaptcha.reset();
		return false;
	});
	return false;
}

function login() {
	var credentials = {};
	credentials.email = cleanString($('#loginemail').val());
	credentials.password = $('#loginpassword').val();
	credentials.authCode = $('#authcode').val() || undefined;
	if (localStorage && localStorage.jseUnique) { credentials.jseUnique = localStorage.jseUnique; }

	credentials.initial = 1;
	credentials.screen = screen.width+'x'+screen.height;
	credentials.platform = app || 'platform';
	credentials.userAgent = navigator.userAgent || app || 'unknown';

	if (typeof grecaptcha !== 'undefined') {
		credentials['g-recaptcha-response'] = grecaptcha.getResponse();
		if(credentials['g-recaptcha-response'] === undefined || credentials['g-recaptcha-response'] === '' || credentials['g-recaptcha-response'] === null) {
			notify('Complete the ReCaptcha "I am not a robot"'); return false;
		}
	}
	if (!credentials.email) {
		if (app === false) document.location.href = 'https://platform.jsecoin.com';
	} else {
		try {
			$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				user = JSON.parse(data);
				if (user.fail) { 
					notify(user.notification);
					if (user.resetForm) {
						$('#authcode').val(undefined)
						$('#tmpmodal').modal('hide');
					}
					user = {};
					if (typeof grecaptcha !== 'undefined') { grecaptcha.reset(); }
					return false;
				} else {
					if (user.msg2fa) {
						// request 2fa
						var authForm = '<form class="m-t" role="form" action="javascript:void(0)" onsubmit="login()"><div class="form-group"><input type="text" autofocus="autofocus" id="authcode" class="form-control w300c" placeholder="6 Digit Auth Code" autocomplete="off" required=""></div><button type="submit" class="btn btn-primary block m-b w300c">Submit Code</button></form><br><small>(Please note there is a 30 second window to submit your code)';
						launchModal('Two Factor Authentication',user.msg2fa+'<br><br>'+authForm);
						return false;
					} else {
						// No 2fa required
						if (!user.confirmed) {
							notify('You need to confirm your email address using the link provided in the registration email<br><br><a href="https://server.jsecoin.com/resendwelcome/'+user.uid+'/'+user.email+'/" target="_blank">Resend Welcome Email</a><br><br>If you still are not receiving the welcome email please add noreply@jsecoin.com to your address book and check any junk mail folders.');
						}
						if ($('#checkout-login-container').length) {
							// merchant tools checkout
							merchantCheckoutLogin();
							$('#tmpmodal').modal('hide');
						} else {
							// platform dashboard
							$('.loginout1').html('<a href="javascript:void(0)"  onclick="logOut();"><i class="fa fa-sign-out"></i> Log Out</a>');
							$('.loginout2').html('<a href="javascript:void(0)" onclick="logOut();" data-toggle="tooltip" title="Log Out"><i class="fa fa-sign-out"></i> <span class="nav-label">Log Out</span></a>');	

							$('#tmpmodal').modal('hide');
							$('.systemmessage').html(user.systemMessage);
							if ($(window).width() < 768) {
								$("body").addClass("mini-navbar");
								SmoothlyMenu();
							}
							loadScripts();
							loadDashboard();
							startSocketIOConnection();
						}
						return false;
					}
				}
			}).fail(function(data2) {
				var failObj = JSON.parse(data2.responseText);
				if (failObj && failObj.notification) { notify(failObj.notification); }
				return false;
			});
		} catch(ex) {
			console.log('Session/Login Error: 379');
		}
	}
}

/* Credential Functions */

function setup2fa() {
	if (checkAuth()) {
		var credentials = {};
		credentials.session = user.session;
		$.ajax({url:jseServer+'/twofa/setup2fa/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var qrHTML = '<div style="margin: 10px auto; text-align: center;"><div class="qrcontainer"><div id="qrcode" style="width:166px; height:166px; margin: 0 auto;"></div></div><div id="secret-backup"></div><br>Scan with <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en" target="_blank">Google Authenticator</a> or <a href="https://authy.com/download/" target="_blank">Authy App</a><br><br></div>';
			var authForm = '<form class="m-t" role="form" action="javascript:void(0)" onsubmit="test2fa()"><div class="form-group"><input type="text" id="authcode" class="form-control w300c" placeholder="6 Digit Auth Code" required=""></div><button type="submit" class="btn btn-primary block m-b w300c">Setup Two Factor Authentication</button></form>';
			launchModal('Scan This Code',qrHTML+authForm);
			var qrElement = new QRCode(document.getElementById("qrcode"), {
				width : 166,
				height : 166
			});
			var returnObject = JSON.parse(data);
			if (returnObject.fail) { notify(returnObject.notification); return false; }
			qrElement.makeCode(returnObject.authuri);
			var secretBackup = returnObject.authuri.split('secret=')[1].split('&')[0];
			$('#secret-backup').html('<div style="font-weight: bold; font-size: 18px; margin-top: 5px;">'+warningSign+' Please make a note of your back up key '+warningSign+'</div>Without this key if you lose your phone you will not be able to access to your account<br><div style="font-weight: bold; font-size: 18px; margin-top: 5px;">'+secretBackup+'</div>');
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) notify(failObj.notification);
			return false;
		});
	}
}

function restore2fa() {
	$('#qrcode').html('');
	var otURL = 'otpauth://totp/JSEcoin:'+$('#restore-email').val()+'?secret='+$('#restore-secret').val()+'&issuer=JSEcoin&algorithm=SHA1&digits=6&period=30';
	var qrElement = new QRCode(document.getElementById("qrcode"), {
		width : 166,
		height : 166
	});
	qrElement.makeCode(otURL);
}

function test2fa() {
	var credentials = {};
	credentials.session = user.session;
	credentials.authCode = $('#authcode').val();

	$.ajax({url:jseServer+'/twofa/test2fa/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) { notify(returnObject.notification); setup2fa(); return false; }
		if (returnObject.success) { notify(returnObject.notification); $('#tmpmodal').modal('hide'); refreshUser(function() { loadDashboard(); }); return false; }
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); setup2fa(); }
		return false;
	});
}

function remove2fa() {
	var authForm = '<h4>Enter your two factor authentication code to remove 2fa from your account</h4><form class="m-t" role="form" action="javascript:void(0)" onsubmit="testRemove2fa()"><div class="form-group"><input type="text" id="authcode" class="form-control w300c" placeholder="6 Digit Auth Code" required=""></div><button type="submit" class="btn btn-primary block m-b w300c">Remove Two Factor Auth</button></form>';
	launchModal('Remove Two Factor Authentication',authForm);
}

function testRemove2fa() {
	var credentials = {};
	credentials.session = user.session;
	credentials.authCode = $('#authcode').val();
	$.ajax({url:jseServer+'/twofa/remove2fa/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) { notify(returnObject.notification); remove2fa(); return false; }
		if (returnObject.success) { notify(returnObject.notification); $('#tmpmodal').modal('hide'); refreshUser(function() { loadDashboard(); }); return false; }
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); remove2fa(); }
		return false;
	});
}

function resetPassword() {
	var credentials = {};
	credentials.email = cleanString($('#resetemail').val());
	credentials['g-recaptcha-response'] = grecaptcha.getResponse();
	if(credentials['g-recaptcha-response'] === undefined || credentials['g-recaptcha-response'] === '' || credentials['g-recaptcha-response'] === null) {
		notify('Complete the ReCaptcha "I am not a robot"'); return false;
	}
	$.ajax({url:jseServer+'/password/reset/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			notify('Password reset code has been sent to you, please check your email at: '+credentials.email);
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
	return false;
}

function changePassword() {
	var credentials = {};
	credentials.email = cleanString($('#resetemail').val());
	if($('#newpassword').val() !== $('#retypepassword').val()) { notify('Passwords do not match'); return false; }
	credentials.newPassword = $('#newpassword').val();
	credentials.passwordReset = $('#passwordreset').val();
	if (!goodPassword(credentials.newPassword)) { notify('You need to use a stronger password'); return false; }
	$.ajax({url:jseServer+'/password/change/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			notify('Password has been changed, please log in with your new password');
			if (app === false) document.location.href = 'https://platform.jsecoin.com';
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
	return false;
}

function checkPinSafe() {
	$('#new-pin').val($('#new-pin').val().split(/[^0-9]/).join(''));
	if ($('#new-pin').val().length >= 4 && $('#new-pin').val().length <= 12 && $('#new-pin').val() !== '1234' && $('#new-pin').val() !== '12345' && $('#new-pin').val() !== '123456' && $('#new-pin').val() !== '0000' && $('#new-pin').val() !== '1111' && $('#new-pin').val() !== '2222' && $('#new-pin').val() !== '3333' && $('#new-pin').val() !== '4444' && $('#new-pin').val() !== '5555' && $('#new-pin').val() !== '6666' && $('#new-pin').val() !== '7777' && $('#new-pin').val() !== '8888' && $('#new-pin').val() !== '9999') {
		$('#new-pin').removeClass('redInput');
		$('#new-pin').addClass('greenInput');
	} else {
		$('#new-pin').removeClass('greenInput');
		$('#new-pin').addClass('redInput');
	}
}

function setPin() {
	var credentials = {};
	credentials.session = user.session;
	if ($('#new-pin').val() !== $('#new-pin2').val()) {
		notify('Pin numbers do not match, please check and try again');
		return false;
	}
	credentials.pin = $('#new-pin').val().split(/[^0-9]/).join('');
	$.ajax({url:jseServer+'/account/setpin/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.success) { $('#tmpmodal').modal('hide'); }
		notify(returnObject.notification);
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

function showAPIKey() {
	checkPin(function() {
		var credentials = {};
		credentials.session = user.session;
		credentials.pin = getPin();
		$.ajax({url:jseServer+'/account/getapikey/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var returnObject = JSON.parse(data);
			if (returnObject.fail) { notify(returnObject.notification); }
			if (returnObject.apiKey) {
				user.apiKey = returnObject.apiKey
				$('#apikey').toggleClass('hide').html(user.apiKey);
				$('#additional-api-buttons').toggleClass('hide');
			}
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	});
}

function resetAPIKey() {
	if (confirm('Are you sure you want to reset your API key? Previous keys will no longer work.')) {
		checkPin(function() {
			var credentials = {};
			credentials.session = user.session;
			credentials.pin = getPin();
			$.ajax({url:jseServer+'/account/resetapikey/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				var returnObject = JSON.parse(data);
				if (returnObject.fail) { notify(returnObject.notification); }
				if (returnObject.newAPIKey) {
					user.apiKey = returnObject.newAPIKey
					$('#apikey').html(user.apiKey);
				}
			}).fail(function(data2) {
				var failObj = JSON.parse(data2.responseText);
				if (failObj && failObj.notification) { notify(failObj.notification); }
				return false;
			});
		});
	}
}

function updateAPILevel() {
	checkPin(function() {
		//console.log('running UPDATEAPI function');
		var newAPILevel = parseFloat($('#apilevel').val());
		var credentials = {};
		credentials.session = user.session;
		credentials.newAPILevel = newAPILevel;
		credentials.pin = getPin();
		$.ajax({url:jseServer+'/account/updateapilevel/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			refreshUser(function() {
				loadSettings();
			});
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	});
}

function checkPinFunction() {
	notify('Pin number function error ref 912');
	$('.check-pin-container').addClass('hide');
}

function checkPin(callback) {
	if ($('#content').length) {
		$('.check-pin').css('left', ($('#content').innerWidth()/2) - 155 + ($('body').innerWidth() - $('#content').innerWidth()));
	} else {
		$('.check-pin').css('left', ($('body').innerWidth()/2) - 155);
	}
	$('.check-pin-container').removeClass('hide');
	$('.check-pin').addClass('animated zoomInDown');
	//$('#pin').val('');
	$('#pin').focus();
	checkPinFunction = function() {
		if ($('#pin').val()) {
			callback();
		}
	}
	$("#pin").off('keydown'); // clear previous keydown events
	$("#pin").on('keydown', function(e) {
    if (e.which == 13) {
      checkPinFunction();
    }
	});
}

function getPin() {
	var pin = cleanString($('#pin').val());
	$('#pin').val('');
	$('.check-pin-container').addClass('hide');
	return pin;
}

function forgotPin() {
	$('.check-pin-container').addClass('hide');
	launchModal('Forgotton Your Pin?','Your pin is a 4-12 digit number that is a security feature to prevent loss of funds from users who have compromised email accounts. For this reason it is not possible to reset your pin number. Users get three attempts per six hour period to guess pin numbers that may have been forgotten. We recommend trying common numbers, dates, years as most people will use a number that is already familiar to them. This is a screenshot of the pin setup screen in case it jogs any memories.<br><br><img src="https://jsecoin.com/misc/pin.png" class="img-responsive img-rounded" alt="pin number screenshot" />');
}

function cancelPin() {
	$('#pin').val('')
	$('.check-pin-container').addClass('hide');
	return false;
}

function updateDetails() {
	checkPin(function() {
		//console.log('running UPDATEDETAILS function');
		var credentials = {};
		credentials.session = user.session;
		credentials.newName = cleanString($('#newname').val());
		credentials.newAddress = cleanString($('#newaddress').val());
		credentials.pin = getPin();
		$.ajax({url:jseServer+'/account/updatedetails/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			refreshUser(function() {
				loadSettings();
			});
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	});
}

function logOut() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/logout/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		user = {};
		if (app === false) document.location.href = 'https://platform.jsecoin.com';
		if (typeof window.JSEsocket !== 'undefined') {
			window.JSEsocket.disconnect();
			window.JSEsocket.destroy();
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

/* Refresh User Data */

var userDataRefresh = document.createEvent('Event'); // fires event on data refresh, used by app (14th March 2018)
userDataRefresh.initEvent('userDataRefresh', true, true);

function refreshUser(callback) {
	var credentials = {};
	credentials.session = user.session;
	if (app !== false) {
		credentials.app = app;
	}
	// Fields that don't want to be deleted on user refresh
	var dontRefresh = ['campaigns','advStats','pubStats'];
	var dontRefreshStore = {};
	for (var i = 0; i < dontRefresh.length; i++) {
		if (user[dontRefresh[i]]) {
			dontRefreshStore[dontRefresh[i]] = user[dontRefresh[i]];
		}
	}

	$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		user = JSON.parse(data);
		for (var i = 0; i < dontRefresh.length; i++) {
			user[dontRefresh[i]] = dontRefreshStore[dontRefresh[i]];
		}
		document.dispatchEvent(userDataRefresh);
		if (!user.session) {
			//try again
			$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				user = JSON.parse(data);
				for (var i = 0; i < dontRefresh.length; i++) {
					user[dontRefresh[i]] = dontRefreshStore[dontRefresh[i]];
				}
				document.dispatchEvent(userDataRefresh);
				if (!user.session) {
					if (app === false) document.location.href = 'https://platform.jsecoin.com';
					return false;
				}
				callback();
				return true;
			}).fail(function(data2) {
				var failObj = JSON.parse(data2.responseText);
				if (failObj && failObj.notification) { notify(failObj.notification); }
				return false;
			});
		}
		callback();
	});
}

// Update user variable if logged in
var refreshTime = 900000; // 15 mins
function checkForUser() {
	if (user) {
		refreshUser(function() {});
	}
	refreshTime += (refreshTime * 0.05); // make refreshes slower for people logged in for a long time.
	if (refreshTime > 1800000) { refreshTime = 3600000; } // 60 min max
	setTimeout(function() { checkForUser(); }, refreshTime);
}
checkForUser();

/* Transaction Functions */

function confirmTransfer() {
	var toUser = cleanString($('#touser').val());
	var toAmount = parseFloat($('#toamount').val());
	var toReference = cleanString($('#toreference').val().split(/[^ \.,@a-zA-Z0-9]/).join(''));
	if (user.balance < toAmount) {
		notify('Insufficient balance to complete transfer'); return false;
	} else if (user.confirmed == false) {
		notify('You need to confirm your account before you send a transaction. Please check the email address provided and click the confirmation link in the welcome email.'); return false;
	} else if (toAmount < 0.000001) {
		notify('Amount to send is below the minimum 0.000001 JSE.'); return false;
	} else if (!toAmount) {
		notify('You need to enter an amount transfer'); return false;
	} else if (isNaN(toAmount)) {
		notify('Error amount to transfer is not recognised'); return false;
	} else if (locked) {
		notify('Account locked pending transaction, please try again in 20 seconds'); return false;
	} else {
		if (confirm('Do you wish to send '+toAmount+' to '+toUser+'? Reference: '+toReference)) {
			locked = true;
			setTimeout(function() { locked = false; }, 10000);
			var credentials = {};
			credentials.session = user.session;
			credentials.toUser = toUser;
			credentials.toAmount = toAmount;
			credentials.toReference = toReference;
			launchModal('Sending '+toAmount+' JSE to '+toUser,'Requesting Data To Sign...<br><br>');
			$.ajax({url:jseServer+'/push/requesttransfer/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				var returnObject = JSON.parse(data);
				if (returnObject.fail) {
					notify(returnObject.notification);
					$('#tmpmodal').modal('hide');
					return false;
				} else {
					$('#tmpmodalbody').append('Received Data To Sign: ' + data.length + ' bytes<br><br>');
					signData(data, user, function(signed) { // user contains same fields required by keypair (publicKey & privateKey)
						$('#tmpmodalbody').append('<h5>Signing Transaction Data with ECDSA Cryptography</h5>Public Key: '+signed.publicKey+'<br><br>SHA256 HASH: ' + signed.hash+'<br><br>Signature: ' + signed.signature+'<br><br>');
						$('#tmpmodal').modal('hide');
						checkPin(function() {
							signed.session = user.session;
							signed.pin = getPin();
							$.ajax({url:jseServer+'/push/data/',type:'POST',contentType:'application/json',data: JSON.stringify(signed)}).done(function(returnData) {
								var returnObject2 = JSON.parse(returnData);
								if (returnObject2.fail) {
									notify('Server received signed data but transaction failed:<br>'+returnObject2.notification);
								} else if (returnObject2.success) {
									notify('Transaction Completed Successfully');
								} else {
									notify(returnObject2.notification);
								}
								refreshUser(function() { loadTransfer(); });
							}).fail(function(data3) {
								var failObj = JSON.parse(data3.responseText);
								if (failObj && failObj.notification) { notify(failObj.notification); }
								$('#tmpmodal').modal('hide');
								return false;
							});
						});
					});
				}
			}).fail(function(data2) {
				var failObj = JSON.parse(data2.responseText);
				if (failObj && failObj.notification) { notify(failObj.notification); }
				$('#tmpmodal').modal('hide');
				return false;
			});
		}
	}
}

function exportCoins() {
	var exportAmount = parseFloat($('#exportamount').val());
	if (!exportAmount) { notify('You need to enter an amount to export'); return false; }
	if (user.balance < exportAmount) {
		notify('Insufficient balance to complete export'); return false;
	} else if (user.confirmed == false) {
		notify('You need to confirm your account before you export tokens. Please check the email address provided and click the confirmation link in the welcome email.'); return false;
	} else if (exportAmount < 0.000001) {
		notify('Amount to send is below the minimum 0.000001 JSE.'); return false;
	} else if (locked) {
		notify('Account locked pending transaction, please try again in 20 seconds'); return false;
	} else {
	if (confirm('Do you wish to export '+exportAmount+' JSE')) {
			locked = true;
			setTimeout(function() { locked = false; }, 10000);
			var credentials = {};
			credentials.session = user.session;
			credentials.exportAmount = exportAmount;
			launchModal('Exporting '+exportAmount+' JSE','Sending export request to server...<br><br>');

			$.ajax({url:jseServer+'/push/requestexport/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				var returnObject = JSON.parse(data);
				if (returnObject.fail) {
					notify(returnObject.notification);
					$('#tmpmodal').modal('hide');
					return false;
				} else if (isNaN(exportAmount)) {
					notify('Error amount to export is not recognised'); return false;
				} else {
					$('#tmpmodalbody').append('Received Data To Sign: ' + data.length + ' bytes<br><br>');
					signData(data, user, function(signed) { // user contains same fields required by keypair (publicKey & privateKey)
						$('#tmpmodalbody').append('<h5>Signing Transaction Data with ECDSA Cryptography</h5>Public Key: '+signed.publicKey+'<br><br>SHA256 HASH: ' + signed.hash+'<br><br>Signature: ' + signed.signature+'<br><br>');
						$('#tmpmodal').modal('hide');
						checkPin(function() {
							signed.session = user.session;
							signed.pin = getPin();
							$.ajax({url:jseServer+'/push/data/',type:'POST',contentType:'application/json',data: JSON.stringify(signed)}).done(function(data) {
								var returnObject = JSON.parse(data);
								if (returnObject.fail) {
									notify('Server received signed data but transaction failed:<br>'+returnObject.notification);
								} else if (returnObject.success) {
									launchModal('Exported Coin Code','<h4>Your export code is:</h4><div class="linkbox">'+returnObject.coinCode+'</div>');
								} else {
									notify(returnObject.notification);
								}
								refreshUser(function() { loadExport(); });
							}).fail(function(data3) {
								var failObj = JSON.parse(data3.responseText);
								if (failObj && failObj.notification) { notify(failObj.notification); }
								$('#tmpmodal').modal('hide');
								return false;
							});
						});
					});
				}
			}).fail(function(data2) {
				var failObj = JSON.parse(data2.responseText);
				if (failObj && failObj.notification) { notify(failObj.notification); }
				$('#tmpmodal').modal('hide');
				return false;
			});
		}
	}
}

function importCoins() {
	var coinCode = cleanString($('#importcode').val());
	if (!coinCode || typeof coinCode == 'undefined' || coinCode == '') { 
		notify('You need to enter a coin code'); return false; 
	} else if (user.confirmed == false) {
		notify('You need to confirm your account before you import tokens. Please check the email address provided and click the confirmation link in the welcome email.'); return false;
	} else if (locked) {
		notify('Account locked pending transaction, please try again in 20 seconds'); return false;
	}
	coinCode = String(coinCode).trim();
	locked = true;
	setTimeout(function() { locked = false; }, 10000);
	var credentials = {};
	credentials.session = user.session;
	credentials.coinCode = coinCode;
	$.ajax({url:jseServer+'/push/import/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			notify('Imported '+returnObject.value+' JSE');
			refreshUser(function() { loadExport(); });
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

/* MISC FUNCTIONS */

function getCode() {
	if (!$('#pub-setup-terms').is(':checked')) { notify('You need to agree to terms'); return false; }
	var advertising = true;
	if (!$('#pub-setup-advertising').is(':checked')) { 
		advertising = false;
	}
	var newSite = $('#pub-setup-site').val();
	if (!newSite || typeof newSite == 'undefined' || newSite == '') { notify('You need to enter a domain name'); return false; }
	if (newSite.indexOf('.') == -1) { notify('You need to enter a valid domain name'); return false; }
	newSite = String(newSite).toLowerCase().split('http://').join('').split('https://').join('').split('www.').join('');
	if (newSite.indexOf('/') > -1) { var newSiteSplit = newSite.split('/'); newSite = newSiteSplit[0]; }
	var subID = $('#pub-setup-subid').val() || '0';
	subID = cleanString(String(subID));
	$('#pub-setup-site').val(newSite); //update with removed chars;
	$('#pub-setup-subid').val(subID); //update with removed chars;
	var additionalOptions = '';
	if ($('#pub-setup-darkmode').is(':checked')) additionalOptions += 'window.JSEDarkMode=1;';
	if ($('#pub-setup-position').val() === 'top') additionalOptions += 'window.JSETopNotification=1;';
	if ($('#pub-setup-language').val() !== 'auto') additionalOptions += 'window.JSESetLanguage="'+$('#pub-setup-language').val()+'";';
	if (!$('#pub-setup-advertising').is(':checked')) {
		additionalOptions += 'window.JSENoAds=1;';
	} else {
		if ($('#pub-setup-select-category').val() !== 'auto') {
			additionalOptions += 'window.JSEManualCategory='+$('#pub-setup-select-category').val()+';';
		}
		if (!$('#pub-setup-autobanner-top').is(':checked')) additionalOptions += 'window.JSENoAutoBannerTop=1;';
		if (!$('#pub-setup-autobanner-bottom').is(':checked')) additionalOptions += 'window.JSENoAutoBannerBottom=1;';
		if (!$('#pub-setup-intext').is(':checked')) additionalOptions += 'window.JSENoInText=1;';
		if ($('#pub-setup-block').val().length > 1) additionalOptions += 'window.JSEBlockedAdvertisers="'+$('#pub-setup-block').val().split(/\s/).join(',').split(/[^0-9,]/).join('')+'";';
	}
	if ($('#pub-setup-no-mining').is(':checked')) additionalOptions += 'window.JSENoMining=1;';

	var credentials = {};
	credentials.session = user.session;
	credentials.newSite = newSite;
	credentials.subID = subID;
	credentials.advertising = advertising;

	$.ajax({url:jseServer+'/newsite/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		//console.log(data);
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			var newCode = '<script type="text/javascript">\n\
!function(){'+additionalOptions+'var e=document,t=e.createElement("script"),s=e.getElementsByTagName("script")[0];t.type="text/javascript",t.async=t.defer=!0,t.src="https://load.jsecoin.com/load/'+user.uid+'/'+newSite+'/'+subID+'/0/",s.parentNode.insertBefore(t,s)}();\n\
</script>';

			launchModal('Copy and paste this code just above the closing &lt;/body&gt; tag','<div class="breakword"><xmp class="codeformat" id="sitecode">'+newCode+'</xmp><br><hr><button class="btn btn-sm btn-primary" onclick="copyToClipboard(\'sitecode\'); $(this).addClass(\'animated tada\');">Copy to Clipboard</button> <span class="copiedresult"></span></div>');
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

function removeStats(what,ref) {
	var credentials = {};
	credentials.session = user.session;
	credentials.what = cleanString(what);
	credentials.ref = cleanString(ref);
	if (confirm('Are you sure you want to permanently remove this '+credentials.what.substring(0, credentials.what.length - 1)+' reference '+credentials.ref+'?')) {
		$.ajax({url:jseServer+'/account/removestats/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			//var returnObject = JSON.parse(data);
			loadPublishers();
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	}
}

function sharePopUp() {
	var shareLink = 'https://platform.jsecoin.com/?lander=3&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=';
	launchModal('Here is your referral link, tell your friends about JSEcoin and earn more JSE','<div class="breakword"><xmp class="codeformat" id="sharelink">'+shareLink+'</xmp><br><hr><button class="btn btn-sm btn-primary" onclick="copyToClipboard(\'sharelink\'); $(this).addClass(\'animated tada\');">Copy to Clipboard</button><span class="copiedresult"></span>  <button class="btn btn-sm btn-primary" onclick="loadReferrals(); $(\'#tmpmodal\').modal(\'hide\');">More Links &amp; Full Terms</button> <button class="btn btn-sm btn-primary" onclick="socialPopUp(\'facebook\');"><i class="fa fa-facebook-square" aria-hidden="true"></i> Share on Facebook</button> <button class="btn btn-sm btn-primary" onclick="socialPopUp(\'twitter\');"><i class="fa fa-twitter-square" aria-hidden="true"></i> Tweet</button></div>');
}

function socialPopUp(socialNetwork) {
	var encodedAffLink = encodeURIComponent('https://platform.jsecoin.com/?lander=3&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=socialshare');
	if (socialNetwork == 'facebook') {
		var socialURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodedAffLink;
	} else { // twitter
		var twitterText = ['Now anyone can mine cryptocurrency with JSEcoin','I am earning cryptocurrency with JSEcoin','JSEcoin - Browser based cryptocurrency mining','Anyone can mine cryptocurrency right now','New web based mining technology JSEcoin'];
		var hashTags1 = ['cryptocurrency', 'bitcoin', 'blockchain', 'crypto'];
		var hashTags2 = ['jsecoin','jse','cryptomining', 'webmining', 'minecryptocurrency', 'minecrypto', 'fintech', 'webmasters', 'cryptocurrencies', 'tokensales', 'browsermining'];
		var shuffledTwitterText = shuffle(twitterText);
		var shuffledHashTags1 = shuffle(hashTags1);
		var shuffledHashTags2 = shuffle(hashTags2);
		var socialURL = 'https://twitter.com/intent/tweet?url='+encodedAffLink+'&text='+encodeURI(shuffledTwitterText[0])+'&via=jsecoin&hashtags='+shuffledHashTags1[0]+','+shuffledHashTags2[0];
	}
	var socialWidth = $(window).width() / 2;
	var socialHeight = $(window).height() / 2;
	var socialTop = socialHeight / 2;
	var socialLeft = socialWidth / 2;		
	window.open(socialURL,"","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + socialWidth +",height=" + socialHeight + ",top=" + socialTop + ",left=" + socialLeft);
}


function getCodeSiteID(newSite) {
			var newCode = '<script type="text/javascript">\n\
!function(){var e=document,t=e.createElement("script"),s=e.getElementsByTagName("script")[0];t.type="text/javascript",t.async=t.defer=!0,t.src="https://load.jsecoin.com/load/'+user.uid+'/'+newSite+'/optionalSubID/0/",s.parentNode.insertBefore(t,s)}();\n\
</script>';
	launchModal('Copy and paste this code just above the closing &lt;/body&gt; tag','<div class="breakword"><xmp class="codeformat" id="sitecode">'+newCode+'</xmp><br><hr><button class="btn btn-sm btn-primary" onclick="copyToClipboard(\'sitecode\'); $(this).addClass(\'animated tada\');">Copy to Clipboard</button> <span class="copiedresult"></span></</div>');
}

/* MINING FUNCTIONS */

// Fallback SHA256 function for chrome browsers on sites with no https
function fallbackSHA256(s, nonce, callback) {
	function safe_add(x, y) { var lsw = (65535 & x) + (65535 & y); return (x >> 16) + (y >> 16) + (lsw >> 16) << 16 | 65535 & lsw }
	function S(X, n) { return X >>> n | X << 32 - n }
	function R(X, n) { return X >>> n }
	function Ch(x, y, z) { return x & y ^ ~x & z }
	function Maj(x, y, z) { return x & y ^ x & z ^ y & z }
	function Sigma0256(x) { return S(x, 2) ^ S(x, 13) ^ S(x, 22) }
	function Sigma1256(x) { return S(x, 6) ^ S(x, 11) ^ S(x, 25) }
	function Gamma0256(x) { return S(x, 7) ^ S(x, 18) ^ R(x, 3) }
	function Gamma1256(x) { return S(x, 17) ^ S(x, 19) ^ R(x, 10) }
	var chrsize = 8, hexcase = 0;
	callback(function(binarray) {
		for (var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", str = "", i = 0; i < 4 * binarray.length; i++) str += hex_tab.charAt(binarray[i >> 2] >> chrsize * (3 - i % 4) + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> chrsize * ( 3 - i % 4) & 15);
		return str;
	}(function(m, l) {
		var a, b, c, d, e, f, g, h, T1, T2, K = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
		HASH = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
		W = new Array(64);
		m[l >> 5] |= 128 << 24 - l % 32, m[15 + (l + 64 >> 9 << 4)] = l;
		for (var i = 0; i < m.length; i += 16) {
			a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3], e = HASH[4], f = HASH[5], g = HASH[6], h = HASH[7];
			for (var j = 0; j < 64; j++) W[j] = j < 16 ? m[j + i] : safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]), T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]),
				T2 = safe_add(Sigma0256(a), Maj(a, b, c)), h = g, g = f, f = e, e = safe_add(d, T1), d = c, c = b, b = a, a = safe_add(T1, T2);
				HASH[0] = safe_add(a, HASH[0]), HASH[1] = safe_add(b, HASH[1]), HASH[2] = safe_add(c, HASH[2]), HASH[3] = safe_add(d, HASH[3]), HASH[4] = safe_add(e, HASH[4]), HASH[5] = safe_add(f, HASH[5]), HASH[6] = safe_add(g, HASH[6]), HASH[7] = safe_add(h, HASH[7])
		}
		return HASH;
	}(function(str) {
		for (var bin = Array(), mask = (1 << chrsize) - 1, i = 0; i < str.length * chrsize; i += chrsize) bin[i >> 5] |= (str.charCodeAt(i / chrsize) & mask) << 24 - i % 32;
		return bin;
	}(s = function(string) {
		string = string.replace(/\r\n/g, "\n");
		for (var utftext = "", n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			c < 128 ? utftext += String.fromCharCode(c) : c > 127 && c < 2048 ? (utftext += String.fromCharCode(c >> 6 | 192), utftext += String.fromCharCode(63 & c | 128)) : (utftext += String.fromCharCode(c >> 12 | 224), utftext += String.fromCharCode(c >> 6 & 63 | 128), utftext += String.fromCharCode(63 & c | 128));
		}
		return utftext;
	}(s)), s.length * chrsize)) + "," + nonce)
}

function textEncoderUTF8 (str) {
	 if (window.TextEncoder) {
			return new TextEncoder ("utf-8").encode (str)
	 } else {
			var l = str.length, arr = new Uint8Array (l); 
			for (var i = 0; i < l; i++) arr [i] = String (str).charCodeAt (i);
			return arr 
	 }
} 

// Based on Crypto API (include hex function below)
function cryptoSha256(str,nonce) {
	var buffer = textEncoderUTF8(str);
	return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
		return hex(hash)+','+nonce;
	});
}

function hex(buffer) {
	var hexCodes = [];
	var view = new DataView(buffer);
	for (var i = 0; i < view.byteLength; i += 4) {
		// Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
		var value = view.getUint32(i)
		// toString(16) will give the hex representation of the number without padding
		var stringValue = value.toString(16)
		// We use concatenation and slice for padding
		var padding = '00000000'
		var paddedValue = (padding + stringValue).slice(-padding.length)
		hexCodes.push(paddedValue);
	}
	return hexCodes.join("");
}

function stopMining() {
	$('#startminingbutton').removeClass('btn-success').addClass('btn-primary');
	$('#startminingbutton').html('<i class="fa fa-gavel"></i> &nbsp; Start Mining');
	$('#startminingbutton').attr("onclick","startMining(); $(this).addClass('animated tada');");
	console.log('Cancelling mining operation...');
	miningLog('Cancelling mining operation...');
	setTimeout(function() { 
		console.log('Cancelled mining operation...');
		miningLog('Cancelled mining operation...');
	}, 5000);
	quitMining = true;
}

// load 2nd script from 3rd party javascript, need to double check this works
function startMining() {
	quitMining = false;
	if (pX < 10 && app === false) {
		launchModal('Automated mining system detected.<br><br>If you are seeing this message in error please restart your browser.<br><br>It is currently not possible to use the self-mining platform with a headless browser or automated bot.<br><br>We have put these measures in place to prevent mining fraud.');
		setTimeout(function() { stopMining(); }, 3000);
		return false;
	}
	if (app === false) {
		$('#startminingbutton').removeClass('btn-primary').addClass('btn-success');
		setTimeout(function() { $('#startminingbutton').html('<i class="fa fa-times"></i> &nbsp; Stop Mining'); }, 1000);
		$('#startminingbutton').attr("onclick","stopMining()");
	}
	
	window.JSEsocket.emit('startComs', 2, function(authResponse) {
		if (authResponse === 'badIP') {
			launchModal('VPN / VPS / Proxy / Tor IP Address Detected','Sorry it is not currently possible to mine from an anonymous IP address. This may be because you are connected to the internet via: <ul><li>A VPN (Virtual Private Network)</li><li>Anonymous Proxy</li><li>TOR Onion Router</li></ul>To start mining please disconnect from your VPN / Proxy / Tor connection and use a valid IP address.<br><br>We have put these measures in place to prevent mining fraud.');
			setTimeout(function() { stopMining(); }, 3000);
		} else if (user.confirmed == false) {
			notify('You need to confirm your account before you start mining. Please check the email address provided and click the confirmation link in the welcome email.');
			setTimeout(function() { stopMining(); }, 3000);
		} else {
			console.log('Mining Coms Started Succesfully');
		}
	});

	window.hashesFoundThisBlock = 0;

	// submit a hash, string is preHash,hash,nonce,uid,jseUnique,siteID,subId separated by commars
	function processHashV2(hashSubmissionString) {
		sessionHashes ++;
		window.JSEsocket.emit('submitHash', hashSubmissionString);
	}

	var speedTestCount = 0; // to display speed test one time in 5
	
	function variableDifficulty (n) { for (var s="", i=n; i--;) s += "0"; return s; }

	window.jseMineV2 = function() {
		if (quitMining) { return false; }
		var found = false;
		var difficulty = 4 + hashesFoundThisBlock;
		var hashingStarted = new Date().getTime();
		var startNumber=Math.floor(Math.random()*99999999999);
		for (var x = startNumber; x <= startNumber + hashRate && !found; x++) { // need to add a timeout to reduce load
			var targetTextWithNonce = preHash+','+x; // set the bit to be hashed as preHash,nonce
			if (window.crypto && window.crypto.subtle) {
				cryptoSha256(targetTextWithNonce,x).then(function (hashNonce) {
					if (hashNonce.substr(0, difficulty) === variableDifficulty(difficulty)) {
						found = true; // stop mining to submit the hash
						hashesFoundThisBlock ++;
						processHashV2(preHash+','+hashNonce+','+user.uid+','+user.jseUnique+',Platform Mining,0,'+appHash); // this is a string preHash,hash,nonce,uid,uniq,siteid,subid
						console.log('Found Hash! : '+hashNonce);
						miningLog('<b>Found Hash! : '+hashNonce+'</b>');
						$('.fa-puzzle-piece').addClass('animated flash fa-3x');
						setTimeout(function() { $('.fa-puzzle-piece').removeClass('animated flash fa-3x'); }, 1000);
					}
				});
			} else {
				var hash = fallbackSHA256(targetTextWithNonce,x,function (hashNonce) {
					if (hashNonce.substr(0, difficulty) === variableDifficulty(difficulty)) {
						found = true; // stop mining to submit the hash
						hashesFoundThisBlock ++;
						processHashV2(preHash+','+hashNonce+','+user.uid+','+user.jseUnique+',Platform Mining,0,'+appHash);
						console.log('Found Hash! : '+hashNonce);
						miningLog('<b>Found Hash! : '+hashNonce+'</b>');
						$('.fa-puzzle-piece').addClass('animated flash fa-3x');
						setTimeout(function() { $('.fa-puzzle-piece').removeClass('animated flash fa-3x'); }, 1000);
					}
				});
			}
		}
		setTimeout(function(y) {
			// using the same CPU balancing from V1, could this be improved?
			var hashingFinished = new Date().getTime();
			var hashesCompleted = y - startNumber;
			var hashingSeconds = (hashingFinished - hashingStarted) / 1000;
			hps = Math.floor(hashesCompleted / hashingSeconds);
			if ($('#hashrateacceleration').length) {
				var hpa = 1 + ($('#hashrateacceleration').val() / 20);
				hashRate = hps * hpa;
			} else {
				hashRate = hps * 1.2;
			}
			if (hashRate < 25) { hashRate = 25; }
			if (hashRate > 12000) { hashRate = 12000; }
			speedTestCount ++; if (speedTestCount == 5) { 
				speedTestCount = 0;
				console.log('Hashrate Speed Test: '+hps+' hashes/sec');
				miningLog('Hashrate Speed Test: '+hps+' hashes/sec');
			}
			
			window.jseMineV2(); // restart mining function with new hash rate based on previous seconds work total
		}, 1000,x);
	}


	window.JSEsocket.emit('requestFirstPreHash', '2'); // 1 = publisher, 2 = self-mining
	shortMiningInterval();
	if (app === false) {
		longMiningInterval();
	}
	function checkConnected() {
		// wait for socketio connection to load and jseMineV2 function to be available
		if ( window.jseMineV2 ) {
			window.jseMineV2();
		} else {
			setTimeout(function() { checkConnected(); }, 1000);
		}
	}
	checkConnected();
}

// restart socket and mining every 30 mins
setInterval(function() {
	if (quitMining === false && app === false) {
		console.log('Restarting JSE Socket.IO and Mining at 30 min Intervals');
		miningLog('Restarting JSE Socket.IO and Mining at 30 min Intervals');
		quitMining = true;
		if (typeof JSEsocket !== 'undefined') {
			window.JSEsocket.disconnect();
			window.JSEsocket.destroy();
			setTimeout(function() {
				startSocketIOConnection();
			}, 5000);
			setTimeout(function() { startMining(); }, 15000);
		}
	}
//}, 120000);
}, 1800000);

function updateHashRateAcceleration() {
	var hashRateAcc = $('#hashrateacceleration').val();
	$('.range-value').html(hashRateAcc);
	if (hashRateAcc <= 4) { $('.input-range').css('background-color','rgba(0, 0, 0, 0)'); }
	if (hashRateAcc >= 5) { $('.input-range').css('background-color','rgba(255, 190, 170, 1)'); }
	if (hashRateAcc >= 7) { $('.input-range').css('background-color','rgba(255, 50, 40, 1)'); }
	if (hashRateAcc >= 9) { $('.input-range').css('background-color','rgba(220, 0, 0, 1)'); }
	localStorage.setItem('hashRateAccStored', hashRateAcc);
}


/* GENERAL PLATFORM FUNCTIONS */

function viewLogins() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/account/lastlogins/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		var targetHTML = '<table class="table target-table"><tr><th>GEO</th><th>App</th><th>IP Address</th><th>Date</th><th>User Agent</th></tr>';
		var reverseLogins = [];
		for (var key in returnObject) {
			if (!returnObject.hasOwnProperty(key)) continue;
			reverseLogins.push(returnObject[key]);
		}
		reverseLogins.reverse();
		for (var i = 0; i < reverseLogins.length; i++) {
			var loginData = reverseLogins[i];
			targetHTML += '<tr><td><i class="fa fa-globe"></i> '+loginData.geo+'</td><td>'+loginData.app.charAt(0).toUpperCase()+loginData.app.slice(1)+'</td><td>'+loginData.ip+'</td><td>'+utcTS2local(Number(loginData.ts))+'</td><td>'+loginData.ua+'</td></tr>';
		}
		targetHTML += '</table>';
		launchModal('Previous Logins',targetHTML);
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}


function displayPurchase(reference) {
	for (var i in user.merchantPurchases) {
		if (user.merchantPurchases[i].reference == reference) {
			delete user.merchantPurchases[i].actions;
			launchModal('Purchase Ref. '+reference,'<table class="table"><tr><td style="font-weight: bold;">'+JSON.stringify(user.merchantPurchases[i]).substring(2).slice(0, -2).replace(/":"?/g,'</td><td>').replace(/"?,"/g,'</td></tr><tr><td style="font-weight: bold;">')+'</table>');
		}
	}
}

function deposit() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/ethereum/getdepositaddress/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
			if (returnObject.fail) { notify(returnObject.notification); }
			if (returnObject.success) { 
				launchModal('Deposit ERC20 tokens to the platform','Please send JSE ERC20 tokens to:<br><br><div id="deposit-address" class="generalbox full-width">'+returnObject.ethAddress+'</div><br><button class="btn btn-primary" onclick="copyToClipboard(\'deposit-address\');">Copy to Clipboard</button><br><br>We will query this address for one hour. If the transaction is taking longer just click deposit again, the address will not change. Do not send ETH to this address, only send JSE ERC20 tokens. Your account will automatically be credited within 30 minutes of funds being received.');
			}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

function withdraw() {
	var credentials = {};
	credentials.session = user.session;
	launchModal('Withdraw tokens to an ERC20 address','Please enter the amount and wallet address where you would like to send tokens:<br><br>Account Balance: '+user.balance+' JSE<br><br><a href="javascript:void(0);" onclick="showTxLimit();">Daily Transaction Limit :'+user.txLimit+'JSE - (Click Here To Adjust)</a><br><br><table class="table"><tr><td>Amount</td><td><input type="text" id="withdrawal-amount" class="form-control w150" style="display: inline-block;" placeholder="0.000000" onchange="updateWithdrawalFees();" onkeyup="updateWithdrawalFees();" /> <img src="img/coin_gold.png" style="height: 24px; width: 24px;" alt="JSE" /></td></tr><tr><td>Fee</td><td><input type="text" id="withdrawal-fee" class="form-control w150" style="display: inline-block;" value="0" readonly /> <i class="fa fa-info-circle" style="color: #1B5794; cursor: pointer; font-size: 18px;" aria-hidden="true" onclick="notify(\'Fees for withdrawals are necessary because we have to pay Gas price to carry out transactions on the Ethereum network\');" data-toggle="tooltip" data-placement="top" title="Fees for withdrawals are necessary because we have to pay Gas price to carry out transactions on the Ethereum network"></i></td></tr><tr><td>Total</td><td><input type="text" id="withdrawal-total" class="form-control w150" value="0" readonly /> <span id="withdrawal-total-warning" style="color: #C00; font-size: 12px;"></span></td></tr><tr><td>Address</td><td><input type="text" id="withdrawal-address" class="form-control full-width" placeholder="0x..." /></td></tr></table><br><button class="btn btn-primary" onclick="submitWithdrawal();">Send</button><br><br>Please note withdrawals can take anything from a few minutes up to 24 hours.');
}

function updateWithdrawalFees() {
	var withdrawalValue = parseFloat($('#withdrawal-amount').val());
	var fees = 118; // Math.round(0.00157755 * 75000); // Transaction cost in ETH * ETH/JSE exchange rate, update clien-side and server-side
	$('#withdrawal-fee').val(fees);
	var totalWithdrawalValue = withdrawalValue + fees;
	if (withdrawalValue < 0) {
		$('#withdrawal-amount').val(0);
		return false;
	}
	if (totalWithdrawalValue > user.balance) {
		$('#withdrawal-total').val(user.balance);
		$('#withdrawal-total-warning').html('Maximum available balance');
		$('#withdrawal-amount').val(user.balance - fees);
	} else if (totalWithdrawalValue > user.txLimit) {
		$('#withdrawal-total').val(user.txLimit);
		$('#withdrawal-total-warning').html('<a href="javascript:void(0);" onclick="showTxLimit();">Daily Transaction Limit :'+user.txLimit+'JSE - (Click Here To Adjust)</a>');
		$('#withdrawal-amount').val(user.txLimit - fees);
	} else {
		$('#withdrawal-total').val(totalWithdrawalValue);
		$('#withdrawal-total-warning').html('');
	}
}

function submitWithdrawal() {
	$('#tmpmodal').modal('hide');
	checkPin(function() {
		var credentials = {};
		credentials.session = user.session;
		credentials.withdrawalAmount = parseFloat($('#withdrawal-amount').val());
		credentials.withdrawalAddress = $('#withdrawal-address').val().split(/[^a-zA-Z0-9]/).join('');
		if (!isEthAddress(credentials.withdrawalAddress)) {
			cancelPin();
			notify('Withdrawal address is invalid, please use an ERC20 compatible wallet address');
		}
		credentials.pin = getPin();
		$.ajax({url:jseServer+'/ethereum/withdraw/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var returnObject = JSON.parse(data);
				if (returnObject.fail) { notify(returnObject.notification); }
				if (returnObject.success) { 
					launchModal('Confirm Withdrawal','Please check your email for a confirmation link to complete withdrawal.');
				}
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	});
}

function cancelSubscription(reference) {
	if (confirm('Are you sure you want to cancel this subscription? Ref. '+reference)) {
		var credentials = {};
		credentials.session = user.session;
		credentials.reference = reference;
		$.ajax({url:jseServer+'/checkout/cancel/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var returnObject = JSON.parse(data);
			if (returnObject.fail) { notify(returnObject.notification); }
			if (returnObject.success) { notify('Subscription reference: '+reference+' has been cancelled'); }
			var noUIDRef = reference.split('/')[1];
			if (typeof user.merchantSales[noUIDRef] !== 'undefined') {
				user.merchantSales[noUIDRef].cancelledTS = new Date().getTime();
				loadMerchant();
			} else if (typeof user.merchantPurchases[noUIDRef] !== 'undefined') {
				user.merchantPurchases[noUIDRef].cancelledTS = new Date().getTime();
				loadDashboard();
			}
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	}
}

function processMerchantOrder(reference) {
	var credentials = {};
	credentials.session = user.session;
	credentials.reference = reference;
	$.ajax({url:jseServer+'/checkout/process/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) { notify(returnObject.notification); }
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

function setupTransfer(email,amount,reference) {
	loadTransfer();
	setTimeout(function() {
		$('#touser').val(email);
		$('#toamount').val(amount);
		$('#toreference').val(reference);
	}, 1000);
}

function showTxLimit() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/account/txtoday/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify (returnObject.notification);
		} else {
			user.txLimit = returnObject.txLimit;
			$('#txLimit').html(user.txLimit);
			var txLeft = user.txLimit - returnObject.txToday;
			launchModal('Transaction Limits','Your current daily transaction limit is: '+user.txLimit+' JSE<br>Used: '+returnObject.txToday+' JSE - Remaining: '+txLeft+' JSE<br>Account Balance: '+user.balance+' JSE<br><br>We recommend keeping this as low as possible. You can adjust your transaction limit to any value<br>&gt; 10000 JSE Requires Email Link Confirmation<br>&gt; 100000 JSE Requires Email Confirmation and Admin Approval<br><br><table class="table"><tr><td>New Limit</td><td><input type="text" id="tx-limit-change" class="w150 mt5" placeholder="'+user.txLimit+'" /> JSE</td></tr><tr><td>Pin Number</td><td><input type="text" id="tx-limit-pin" class="w150 mt5 text-center jsefont" autocomplete="off" name="pinNumber" /></td></tr><tr><td></td><td><button class="btn btn-primary mt5" onclick="adjustTxLimit();">Adjust Transaction Limit</button></td></tr></table>');
		}
	});
}

function adjustTxLimit() {
	var credentials = {};
	credentials.session = user.session;
	credentials.newTxLimit = $('#tx-limit-change').val();
	if (credentials.newTxLimit > user.balance) {
		notify('You can not set a transaction limit above your current account balance');
		return false;
	}
	credentials.pin = $('#tx-limit-pin').val();
	$.ajax({url:jseServer+'/account/updatetxlimit/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify (returnObject.notification);
		} else if (returnObject.emailRequired) {
			notify ('Please confirm the new daily transaction limit by clicking the secure link in the confirmation email sent to '+user.email);
			$('#tmpmodal').modal('hide');
		} else {
			$('#tmpmodal').modal('hide');
			user.txLimit = credentials.newTxLimit
			$('#txLimit').html(credentials.newTxLimit);
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

function removeCoin(coinCode) {
	var credentials = {};
	credentials.session = user.session;
	credentials.coinCode = coinCode;
	if (confirm('Once removed from your account there will be no way to retrieve this code. Have you stored the coincode safely and are you sure you want to remove this coincode?')) {
		$.ajax({url:jseServer+'/account/removecoincode/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var returnObject = JSON.parse(data);
			if (returnObject.fail) {
				notify (returnObject.notification);
			}
			loadExport();
		}).fail(function(data2) {
			var failObj = JSON.parse(data2.responseText);
			if (failObj && failObj.notification) { notify(failObj.notification); }
			return false;
		});
	}
}

function shortMiningInterval() {
	if (quitMining) { return false; }
	if (hashRate > maxHashRate) { maxHashRate = Math.round(hashRate); }
	hashRatePercentage = Math.round((hashRate / maxHashRate) * 100);
	$('.sessionhashes').html(sessionHashes);
	$('.maxhashrate').html(maxHashRate);
	if ($('#hashratechart').length) {
		rawData.push(hashRatePercentage);
		if (rawData.length > 100) { rawData.shift(); }
		chartData = [];
		for (var i = 0; i < rawData.length; i++) {
			chartData.push([i,rawData[i]]);
		}
		series[0].data = chartData;

		plot.setData(series);
		plot.draw();
	}
	if (quitMining == false && $('.miningtable').length) {
		setTimeout(function() { shortMiningInterval(); }, 1000);
	}
}

function redrawMiningPage() {
	var preEarnings = parseFloat($('.todayearnings').html());
		if (user.statsToday && (preEarnings < user.statsToday.c)) {
			$('.fa-money').addClass('animated flash fa-3x');
			setTimeout(function() { $('.fa-money').removeClass('animated flash fa-3x'); }, 1000);
		}
		calculatePendingTotal();
		$('.pending-self-mining').html(user.pendingSelfMining);
		if (user.statsToday) { $('.todayearnings').html(user.statsToday.c); }
		$('.sessionhashes').html(sessionHashes);
		var transactionTable = '';
		var reverseArray = [];
		for (var i in user.mining) {
			reverseArray.push(user.mining[i]);
		}
		for (var i = reverseArray.length - 1; i >= 0; i--) {
			var t = reverseArray[i]
			// set last reward
			if (i == reverseArray.length - 1) {
				var lastRewardTS = new Date(t.ts);
				var lastReward = timeSince(lastRewardTS);
				$('#lastReward').html('<h5>Last mining reward received '+lastReward+' ago</h5>');
				// do stats reset time as well
				var now = new Date();
				var midnight = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0, 10, 0);     
				var statsReset = timeSince(midnight);
				$('.stats-reset').html('Stats reset '+statsReset+' ago');
			}

			if (t.command && t.command == 'mining' && t.siteid == 'Platform Mining') {
				//var transactionTime = new Date(t.ts);
				//t.utcdate = transactionTime.toUTCString()
				t.localTime = utcTS2local(t.ts);
				transactionTable += '<tr><td>'+t.localTime+'</td><td><img src="img/coin_gold.png" alt="" class="table-coin" /> '+t.value+' JSE</td><td>'+t.siteid+'</td></tr>';
			}
		}
		$('.miningtable').html(transactionTable);
		$('.jsebalance').html(user.balance);
}

function longMiningInterval() {
	if (user) {
		redrawMiningPage();
	}
	if (Math.random() > 0.9) {	// every 10 mins
		$.ajax({url:jseServer+'/stats/',type:'GET',contentType:'application/json'}).done(function(data) {
			publicStats = JSON.parse(data);
			//$('.selfMinersToday').html(publicStats.selfMiners);
			var totalSelfMiners = 0;
			for (var key in publicStats.clients) {
				if (publicStats.clients[key].selfMinersCount) { totalSelfMiners += publicStats.clients[key].selfMinersCount; }
			 }
			$('.selfMinersNow').html(totalSelfMiners);
		});
	}
	if (quitMining == false && $('.miningtable').length) {
		setTimeout(function() { longMiningInterval(); }, 60000);
	}
	// test to see if a tab has come over the top and dropped the hash rate down
	if (!app && !tabFocused && hashRate < 500) {
		$('.bannerframe').html('<h2>Try opening the platform in a separate browser window to avoid hash rate drop off from multiple tabs</h2>');
		$('.bannerframe').attr("onclick","window.open('https://jsecoin.com/en/support/FAQ/')");
		if ($('#JSE-nightMode').length == 0) {
			$('.bannerframe').css('background','#FFFFFF');
		} else {
			$('.bannerframe').css('background','#000000');
		}
		loadMiningBanner = function() {};
	}
}

function miningLog(message) {
	if($('#console').length !== 0) {
		$('#console').prepend('<p>' + message + '</p>');
		$('#console').html($('#console').html().substr(0, 1000));
	}
	if($('#iframe-console').length !== 0) {
		$('#iframe-console').html('<p>' + message + '</p>');
	}
	if (app !== false) {
		var miningLogUpdate = new CustomEvent("miningLogUpdate", {detail: message});
		document.dispatchEvent(miningLogUpdate);
	}
}

function createHashRateChart(chartData) {
	var container = $("#hashratechart");
	series = [{ data: chartData, lines: { fill: true } }];

	var hashRateChartBackground = '#FFFFFF';
	if ($('#JSE-nightMode').length !== 0) {
		hashRateChartBackground = '#000000';
	}

	plot = $.plot(container, series, {
			grid: {  color: "#999999", tickColor: "#D4D4D4", borderWidth:0, minBorderMargin: 20, labelMargin: 10, backgroundColor: { colors: [hashRateChartBackground, hashRateChartBackground] }, margin: { top: 8, bottom: 20, left: 20 },
					markings: function(axes) {
							var markings = [];
							var xaxis = axes.xaxis;
							for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
									markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: hashRateChartBackground });
							}
							return markings;
					}
			},
			colors: ["#1B5794"],
			xaxis: { min: 0, max: 100 },
			yaxis: { min: 0, max: 100 },
			legend: { show: true }
	});

	$(window).resize(function() { 
		if (typeof plot !== 'undefined') {
			plot.resize(); 
			plot.setupGrid();
			plot.draw();
		}
	});
}

function toggleEmailSettings(type) {
	//console.log('toggleEmail');
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/account/toggleemail/'+type+'/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			if (type == 'newsletter') {
				if (returnObject.turnedOn) {
					$('#newsletterEmail').prop('checked', true);
					user.noNewsletter = false;
				} else if (returnObject.turnedOff) {
					$('#newsletterEmail').prop('checked', false);
					user.noNewsletter = true;
				}
			} else if (type == 'transaction') {
				if (returnObject.turnedOn) {
					$('#transactionEmail').prop('checked', true);
					user.noEmailTransaction = false;
				} else if (returnObject.turnedOff) {
					$('#transactionEmail').prop('checked', false);
					user.noEmailTransaction = true;
				}
			} else if (type == 'globalresubscribe') {
				if (returnObject.success) {
					notify('Your email has been removed from the global unsubscribe list');
				}
			}
		}
	}).fail(function(data2) {
		var failObj = JSON.parse(data2.responseText);
		if (failObj && failObj.notification) { notify(failObj.notification); }
		return false;
	});
}

/* ADX FUNCTIONS */

function newCampaign() {
	launchModal('New Campaign','<div id="adx-new-campaign-container"></div>');
	$("#adx-new-campaign-container").load('adxcampaign.html',function() {

	});
}

function editCampaign(campaignID) {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/advertising/getcampaigns/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		user.campaigns = JSON.parse(data);
		launchModal('Edit Campaign','<div id="adx-new-campaign-container"></div>');
		$("#adx-new-campaign-container").load('adxcampaign.html',function() {
			injectCampaignData(campaignID);
		});
	});
}

function pauseCampaign(campaignID) {
	var credentials = {};
	credentials.session = user.session;
	credentials.cid = campaignID;
	$.ajax({url:jseServer+'/advertising/pausecampaign/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		notify('Changes to ad campaign may take up to five minutes to propagate');
		loadAdExchange();
	});
}

function restartCampaign(campaignID) {
	var credentials = {};
	credentials.session = user.session;
	credentials.cid = campaignID;
	$.ajax({url:jseServer+'/advertising/restartcampaign/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		notify('Changes to ad campaign may take up to five minutes to propagate');
		loadAdExchange();
	});
}

function archiveCampaign(campaignID) {
	if (confirm('Are you sure you want to delete this campaign? All related stats data and campaign settings will be removed permanently.')) {
		var credentials = {};
		credentials.session = user.session;
		credentials.cid = campaignID;
		$.ajax({url:jseServer+'/advertising/archivecampaign/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			loadAdExchange();
		});
	}
}

function duplicateCampaign(campaignID) {
	if (confirm('Are you sure you want to duplicate this campaign?')) {
		var credentials = {};
		credentials.session = user.session;
		credentials.cid = campaignID;
		$.ajax({url:jseServer+'/advertising/duplicatecampaign/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			loadAdExchange();
		});
	}
}

// loadAdxStats used for both publisher and advertiser stats
var lastWhat = 'summary';
function loadAdxStats(thisID,pubOrAdv,what,sortedBy) {
	var myAdxStats = {};
	if (what === null) {
		what = lastWhat;
	} else {
		lastWhat = what;
	}
	$('.adx-stats-tab').removeClass('active');
	$('#adx-stats-tab-'+what).addClass('active');
	if (pubOrAdv === 'adv') {
		if (thisID) currentCampaignID = thisID;
		$('.adx-current-campaign').html(user.campaigns[currentCampaignID].name);
	} else {
		if (thisID)	currentSiteID = thisID;
		$('.adx-current-siteid').html(currentSiteID);
		$('#pub-stats-datepicker').show();
		$('#pub-stats-datetoggle').hide();
	}
	var fromDate = datepicker2ymd($('#adx-from-datepicker').val());
	var toDate = datepicker2ymd($('#adx-to-datepicker').val());

	if (what === 'summary') {
		$('#adx-stats-th-what').html('Date');
		if (pubOrAdv === 'pub') {
			myAdxStats = user.pubStats || {}; // datastore query?
		} else {
			myAdxStats = user.advStats || {}; // datastore query?
		}
		var tableHTML = '';
		for (var ymd in myAdxStats) {
			if (!myAdxStats.hasOwnProperty(ymd)) continue;
			if (parseInt(ymd) >= parseInt(fromDate) && parseInt(ymd) <= parseInt(toDate)) {
				if (myAdxStats[ymd] && myAdxStats[ymd][currentSiteID]) {
					// publisher summary
					var validated = Math.min(Math.round(((myAdxStats[ymd][currentSiteID].v || 0) / (myAdxStats[ymd][currentSiteID].i || 0)) * 100) || 0,100);
					var ctr = Number(((myAdxStats[ymd][currentSiteID].c || 0) / (myAdxStats[ymd][currentSiteID].i || 0)) * 100).toFixed(2);
					tableHTML += '<tr><td class="text-left">'+ymd+'</td><td class="text-center">'+(myAdxStats[ymd][currentSiteID].i || 0)+'</td><td class="text-center">'+validated+'%</td><td class="text-center">'+(myAdxStats[ymd][currentSiteID].c || 0)+'</td><td class="text-center">'+(ctr || 0)+'%</td><td class="text-center">'+round(myAdxStats[ymd][currentSiteID].j || 0)+'</td></tr>';
				} else if (myAdxStats[ymd] && myAdxStats[ymd][currentCampaignID]) {
					// advertiser summary
					var validated = Math.min(Math.round(((myAdxStats[ymd][currentCampaignID].v || 0) / (myAdxStats[ymd][currentCampaignID].i || 0)) * 100) || 0,100);
					var conversionStat = '<td class="text-center">'+(myAdxStats[ymd][currentCampaignID].k || 0)+'</td>';
					var ctr = Number(((myAdxStats[ymd][currentCampaignID].c || 0) / (myAdxStats[ymd][currentCampaignID].i || 0)) * 100).toFixed(2);
					tableHTML += '<tr><td class="text-left">'+ymd+'</td><td class="text-center">'+(myAdxStats[ymd][currentCampaignID].i || 0)+'</td><td class="text-center">'+validated+'%</td><td class="text-center">'+(myAdxStats[ymd][currentCampaignID].c || 0)+'</td><td class="text-center">'+(ctr || 0)+'%</td>'+conversionStat+'<td class="text-center">'+round(myAdxStats[ymd][currentCampaignID].j || 0)+'</td></tr>';
				}
			}
		}
		$('#adx-stats-table').html(tableHTML);
	} else {
		if (what) $('#adx-stats-th-what').html(what.charAt(0).toUpperCase() + what.substr(1));
		var targetField;
		if (pubOrAdv === 'pub') {
			if (what === 'placements') {
				targetField = 'adxPubPlacements';
			} else if (what === 'geos') {
				targetField = 'adxPubGeos';
			} else if (what === 'domains') {
				targetField = 'adxPubDomains';
			} else if (what === 'advIDs') {
				targetField = 'adxPubAdvIDs';
			} else if (what === 'devices') {
				targetField = 'adxPubDevices';
			} else if (what === 'subids') {
				targetField = 'adxPubSubIDs';
			}
		} else {
			if (what === 'creatives') {
				targetField = 'adxAdvCreatives';
			} else if (what === 'geos') {
				targetField = 'adxAdvGeos';
			} else if (what === 'domains') {
				targetField = 'adxAdvDomains';
			} else if (what === 'pubIDs') {
				targetField = 'adxAdvPubIDs';
			} else if (what === 'devices') {
				targetField = 'adxAdvDevices';
			} else if (what === 'browsers') {
				targetField = 'adxAdvBrowsers';
			}
		}
		var credentials = {};
		credentials.session = user.session;
		$.ajax({url:jseServer+'/advertising/stats/'+targetField+'/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			var myAdxStats = data;
			var targetFields = {};
			for (var ymd in myAdxStats) {
				if (!myAdxStats.hasOwnProperty(ymd)) continue;
				if (parseInt(ymd) >= parseInt(fromDate) && parseInt(ymd) <= parseInt(toDate)) {
					if (myAdxStats[ymd] && myAdxStats[ymd][currentSiteID]) {
						for (var field in myAdxStats[ymd][currentSiteID]) {
							if (!myAdxStats[ymd][currentSiteID].hasOwnProperty(field)) continue;
							if (!targetFields[field]) targetFields[field] = { i: 0, v: 0, c: 0, k: 0, j: 0 };
							//console.log(myAdxStats[ymd][currentSiteID][field].i);
							targetFields[field].i += myAdxStats[ymd][currentSiteID][field].i || 0;
							targetFields[field].v += myAdxStats[ymd][currentSiteID][field].v || 0;
							targetFields[field].c += myAdxStats[ymd][currentSiteID][field].c || 0;
							targetFields[field].k += myAdxStats[ymd][currentSiteID][field].k || 0;
							targetFields[field].j += myAdxStats[ymd][currentSiteID][field].j || 0;
						}
					} else if (myAdxStats[ymd] && myAdxStats[ymd][currentCampaignID]) {
						for (var field in myAdxStats[ymd][currentCampaignID]) {
							if (!myAdxStats[ymd][currentCampaignID].hasOwnProperty(field)) continue;
							if (!targetFields[field]) targetFields[field] = { i: 0, v: 0, c: 0, k: 0, j: 0 };
							//console.log(myAdxStats[ymd][currentCampaignID][field].i);
							targetFields[field].i += myAdxStats[ymd][currentCampaignID][field].i || 0;
							targetFields[field].v += myAdxStats[ymd][currentCampaignID][field].v || 0;
							targetFields[field].c += myAdxStats[ymd][currentCampaignID][field].c || 0;
							targetFields[field].k += myAdxStats[ymd][currentCampaignID][field].k || 0;
							targetFields[field].j += myAdxStats[ymd][currentCampaignID][field].j || 0;
						}
					}
				}
			}
			var tableHTML = '';
			var sortableArray = [];
			for (var field in targetFields) {
				if (!targetFields.hasOwnProperty(field)) continue;
				sortableArray.push({field: field,value: targetFields[field][sortedBy]})
			}
			sortableArray.sort(function(a, b) {
				return b.value - a.value;
			});
			for (var i = 0; i < sortableArray.length; i++) {
				var field = sortableArray[i].field;
				var rowClass = '';
				var additionalButtons = '';
				if (what === 'creatives') { // check to see if banner or keyword is still active
					var found = false;
					var campaignCreatives = user.campaigns[currentCampaignID].banners;
					var formattedField = '<a href="https://adx.jsecoin.com/'+field+'" target="_blank"><img src="https://adx.jsecoin.com/'+field+'" style="max-height: 50px;"></a>';
					if (user.campaigns[currentCampaignID].keywords) {
						campaignCreatives = user.campaigns[currentCampaignID].keywords;
						var formattedField = field;
					}
					for (var i2 = 0; i2 < campaignCreatives.length; i2++) {
						if (campaignCreatives[i2].fileName === field || campaignCreatives[i2].keyword === field) {
							found = true;
							if (campaignCreatives[i2].paused) {
								found = 'paused';
							}
						}
					}
					if (!found) {
						rowClass = 'adx-disabled-row';
					} else if (found === 'paused') {
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" style="background:#079F80;" onclick="toggleCreative(\''+currentCampaignID+'\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-play"></i></button> ';
					} else {
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" onclick="toggleCreative(\''+currentCampaignID+'\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-pause"></i></button> ';
					}
				} else if (what === 'domains' && pubOrAdv === 'adv') {
					var blacklisted = false;
					if (user.campaigns[currentCampaignID].domainBlacklist.indexOf(field) > -1) {
						blacklisted = true;
					}
					if (blacklisted) {
						rowClass = 'adx-disabled-row';
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" style="background:#079F80;" onclick="modifyBlacklist(\''+currentCampaignID+'\',\'remove\',\'domainBlacklist\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-play"></i></button> ';
					} else {
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" onclick="modifyBlacklist(\''+currentCampaignID+'\',\'add\',\'domainBlacklist\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-pause"></i></button> ';
					}
				} else if (what === 'pubIDs') {
					var blacklisted = false;
					if (user.campaigns[currentCampaignID].publisherBlacklist.indexOf(field) > -1) {
						blacklisted = true;
					}
					if (blacklisted) {
						rowClass = 'adx-disabled-row';
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" style="background:#079F80;" onclick="modifyBlacklist(\''+currentCampaignID+'\',\'remove\',\'publisherBlacklist\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-play"></i></button> ';
					} else {
						additionalButtons = '<button class="btn btn-primary btn-xs adx-table-button" onclick="modifyBlacklist(\''+currentCampaignID+'\',\'add\',\'publisherBlacklist\',\''+field+'\'); loadAdxStats(\''+thisID+'\',\''+pubOrAdv+'\',\''+what+'\',\''+sortedBy+'\');"><i class="fa fa-pause"></i></button> ';
					}
				}
				var conversionStat = '';
				if (pubOrAdv !== 'pub') {
					conversionStat = '<td class="text-center">'+(targetFields[field].k || 0)+'</td>';
				}
				var ctr = Number(((targetFields[field].c || 0) / (targetFields[field].i || 0)) * 100).toFixed(2);
				var validated = Math.min(Math.round(((targetFields[field].v || 0) / (targetFields[field].i || 0)) * 100) || 0,100);
				tableHTML += '<tr class="'+rowClass+'"><td class="text-left">'+additionalButtons+(formattedField || field)+'</td><td class="text-center">'+(targetFields[field].i || 0)+'</td><td class="text-center">'+(validated || 0)+'%</td><td class="text-center">'+(targetFields[field].c || 0)+'</td><td class="text-center">'+(ctr || 0)+'%</td>'+conversionStat+'<td class="text-center">'+round(targetFields[field].j || 0).toFixed(2)+'</td></tr>';
			}
			$('#adx-stats-table').html(tableHTML);	
		});
	}
}

function toggleCreative(cid,creative) {
	var credentials = {};
	credentials.session = user.session;
	credentials.cid = cid;
	credentials.creative = creative;
	$.ajax({url:jseServer+'/advertising/togglecreative/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var res = JSON.parse(data);
		if (res.success) {
			if (res.creativeType === 'banner') {
				for (var i = 0; i < user.campaigns[cid].banners.length; i+=1) {
					if (user.campaigns[cid].banners[i].fileName === creative) {
						if (user.campaigns[cid].banners[i].paused) {
							user.campaigns[cid].banners[i].paused = false;
						} else {
							user.campaigns[cid].banners[i].paused = true;
						}
					}
				}
			} else if (res.creativeType === 'keyword') {
				for (var i = 0; i < user.campaigns[cid].keywords.length; i+=1) {
					if (user.campaigns[cid].keywords[i].keyword === creative) {
						if (user.campaigns[cid].keywords[i].paused) {
							user.campaigns[cid].keywords[i].paused = false;
						} else {
							user.campaigns[cid].keywords[i].paused = true;
						}
					}
				}
			}
			console.log('Creative updated: '+creative);
		}
	});
}

function modifyBlacklist(cid, addSubtract, blacklist, field) {
	var credentials = {};
	credentials.session = user.session;
	credentials.cid = cid;
	credentials.addSubtract = addSubtract;
	credentials.blacklist = blacklist;
	credentials.field = field;
	$.ajax({url:jseServer+'/advertising/blacklist/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var res = JSON.parse(data);
		if (res.success) {
			if (addSubtract === 'add') {
				user.campaigns[cid][blacklist] += field+"\n";
			} else if (addSubtract === 'remove') {
				user.campaigns[cid][blacklist] = user.campaigns[cid][blacklist].split(field+"\n").join('');
			}
			console.log('Blacklist updated: '+field);
		}
	});
}

/* PAGE LOADING */

function loadDashboard() {
	currentPage = 'dashboard.html';
	if (checkAuth()) {
		$("#content").load('dashboard.html',function() {
			// set pin number
			if (user.requirePin) {
				setTimeout(function() {
					launchModal('Set Account Pin Number','<h3>You need to set a pin number</h3>Please note that pin numbers can not be recovered so please write it down and keep it somewhere safe in case you forget. If you lose your pin number you will not be able to withdraw or transfer funds from your account.<br><br>Pin numbers should be between 4 and 12 digits and only standard numbers 0-9.<br><br>Please enter your new pin:<br><br><input type="text" id="new-pin" class="w150c text-center" onkeyup="checkPinSafe();" placeholder="Enter new pin" autocomplete="off" name="new-pin" /><br><input type="text" id="new-pin2" class="w150c text-center mt5" placeholder="Re-enter pin" autocomplete="off" name="new-pin2" /><br><button class="btn btn-primary mt5" onclick="setPin();">Set New Pin Number</button><div style="font-weight: bold; font-size: 18px; margin-top: 5px;">'+warningSign+' Please write down this pin number as it can not be recovered '+warningSign+'</div>' );
				},5000);
			}			
		});
	}
}

function loadFunds() {
	currentPage = 'funds.html';
	if (checkAuth()) {
		$("#content").load('funds.html',function() {});
	}
}

function loadMerchant() {
	currentPage = 'merchant.html';
	if (checkAuth()) {
		$("#content").load('merchant.html',function() {});
	}
}

function loadEnterprise() {
	currentPage = 'enterprise.html';
	if (checkAuth()) {
		$("#content").load('enterprise.html',function() {});
	}
}

function loadTransfer() {
	currentPage = 'transfer.html';
	if (checkAuth()) {
		$("#content").load('transfer.html',function() {});
	}
}

function loadExport() {
	currentPage = 'export.html';
	if (checkAuth()) {
		$("#content").load('export.html',function() {});
	}
}


function loadMining() {
	currentPage = 'mining.html';
	if (checkAuth()) {
		$("#content").load('mining.html',function() {});
	}
}


function loadPublishers() {
	currentPage = 'publishers.html';
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/account/pubstats/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		stats = JSON.parse(data);
		$("#content").load('publishers.html',function() {});
	});
}


function loadInvestors() {
	currentPage = 'investors.html';
	$("#content").load('investors.html',function() {
		$('.titletext').html('Investors');
	});
}

function loadSettings() {
	if (checkAuth()) {
		currentPage = 'settings.html';
		$("#content").load('settings.html',function() {});
	}
}


function loadReferrals() {
	if (checkAuth()) {
		currentPage = 'referrals.html';
		$("#content").load('referrals.html',function() {});
	}
}

function loadAdExchange() {
	currentPage = 'adexchange.html';
	$("#content").load('adexchange.html',function() {
		$('.titletext').html('<a href="javascript:void(0)" onclick="loadAdExchange();">Ad-Exchange</a>');
	});
}

function loadAdxCampaignStats(campaignID) {
	currentPage = 'adxstats.html';
	currentCampaignID = campaignID;
	$("#content").load('adxstats.html',function() {
		//$('.titletext').html(currentCampaignID);
		loadAdxStats(currentCampaignID,'adv','summary','j');
	});
}

function loadPage(pageName) {
	if (pageName == 'Register') {
		currentPage = 'register.html';
		$("#content").load('register.html',function() {
			$('.titletext').html('Register');
			if (get.email) { $('#newemail').val(cleanString(get.email)); }
		});
		return false;
	} else if (pageName == 'Login') {
		currentPage = 'login.html';
		$("#content").load('login.html',function() {
			$('.titletext').html('Login');
		});
		return false;
	} else if (pageName == 'ResetPassword') {
		currentPage = 'resetpassword.html';
		$("#content").load('resetpassword.html',function() {
			$('.titletext').html('Reset Password');
		});
		return false;
	} else if (pageName == 'Confirm') {
		currentPage = 'confirm.html';
		$("#content").load('confirm.html',function() {
			$('.titletext').html('Confirm Account');
		});
		return false;
	} else if (pageName == 'Restore2FA') {
		currentPage = 'restore2fa.html';
		$("#content").load('restore2fa.html',function() {
			$('.titletext').html('Restore 2FA');
		});
		return false;
	} else if (pageName.substr(0,6) == 'Lander') {
		currentPage = 'lander'+pageName.substr(6,9)+'.html';
		$("#content").load('lander'+pageName.substr(6,9)+'.html',function() {
			$('.titletext').html('Register');
				setTimeout(function() {
					$('.navbar-minimalize').click();
				}, 1000);
		});
		return false;
	}
}


if (get.register || get.registration) {
	loadPage('Register');
} else if (get.login) {
	loadPage('Login');
} else if (get.confirm) {
	loadPage('Confirm');
} else if (get.lander) {
	loadPage('Lander'+get.lander.split(/[^0-9]/).join(''));
} else if (get.publishers) {
	loadPublishers();
} else {
	loadPage('Login');
}

//$('#pageloadingcontainer').fadeOut();

if (localStorage.getItem('themeVal') !== null && String(window.location).indexOf('checkout.html') == -1) {
	$('#JSE-updateTheme i').attr('class','fa fa-sun-o');
	$('<link />', {
		id: 'JSE-nightMode',
		rel: 'stylesheet',
		href: 'css/themes/nightMode.css'
	}).appendTo('head');
}
	
/* THEME AND MENU SETUP */

if (app === false) {
	$(document).ready(function () {
		if ($('#checkout-login-container').length == 0) { // don't do this for checkout.html
			// MetsiMenu
			$('#side-menu').metisMenu();

			$('#JSE-updateTheme').on('click', function () {
				if ($('#JSE-nightMode').length === 0) {
					
					localStorage.setItem('themeVal','nightMode');
					$(this).find('i').attr('class','fa fa-sun-o');
					$('<link />', {
						id: 'JSE-nightMode',
						rel: 'stylesheet',
						href: 'css/themes/nightMode.css'
					}).appendTo('head');
				} else { 
					localStorage.removeItem('themeVal');
					$(this).find('i').attr('class','fa fa-moon-o');
					$('#JSE-nightMode').remove();
				}
				if (currentPage == 'mining.html') {
					createHashRateChart();
					if ($('#JSE-nightMode').length == 0) {
						$('.bannerframe').css('background','#FFFFFF');
					} else {
						$('.bannerframe').css('background','#000000');
					}
				}
			});

			// minimalize menu
			$('.navbar-minimalize:not(.binded)').addClass("binded").click(function () {
					$("body").toggleClass("mini-navbar");
					SmoothlyMenu();
			})

			// Full height of sidebar
			function fix_height() {
					var heightWithoutNavbar = $("body > #wrapper").height() - 61;
					$(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
			}
			fix_height();

			$(window).bind("load resize click scroll", function() {
					if(!$("body").hasClass('body-small')) {
							fix_height();
					}
			})
			$("[data-toggle=popover]").popover();
		}
	});
}

window.SmoothlyMenu = function() {
	if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
		// Hide menu in order to smoothly turn on when maximize menu
		$('#side-menu').hide();
		// For smoothly turn on menu
		setTimeout(function () {
			$('#side-menu').fadeIn(500);
		}, 100);
	} else if ($('body').hasClass('fixed-sidebar')){
		$('#side-menu').hide();
		setTimeout(function () {
			$('#side-menu').fadeIn(500);
		}, 300);
	} else {
		// Remove all inline style from jquery fadeIn function to reset menu state
		$('#side-menu').removeAttr('style');
	}
};


// Minimalize menu when screen is less than 768px
$(function() {
	$(window).bind("load resize", function() {
			if ($(this).width() < 769) {
					$('body').addClass('body-small')
			} else {
					$('body').removeClass('body-small')
			}
			if ($(this).width() < 500) {
				// set viewport manually to min 500px
        $('#viewport').attr('content','user-scalable=no,width=500');
   		}
	})

// Jims Beautiful ASCII Art
console.log(''+"\n"+'\
#####################################'+"\n"+'\
#                                   #'+"\n"+'\
#               OOOOO               #'+"\n"+'\
#           OOOOO   OOOOO           #'+"\n"+'\
#          OOO         OOO          #'+"\n"+'\
#       o  OOO         OOO  o       #'+"\n"+'\
#     o    OOO         OOO    o     #'+"\n"+'\
#    o     OOO         OOO     o    #'+"\n"+'\
#           OOOOO   OOOOO           #'+"\n"+'\
#      OOOOO    OOOOO    OOOOO      #'+"\n"+'\
#  OOOOO   OOOOO     OOOOO   OOOOO  #'+"\n"+'\
# OOO         OOO   OOO         OOO #'+"\n"+'\
# OOO         OOO   OOO         OOO #'+"\n"+'\
# OOO         OOO   OOO         OOO #'+"\n"+'\
# OOO         OOO   OOO         OOO #'+"\n"+'\
#  OOOOO   OOOOO     OOOOO   OOOOO  #'+"\n"+'\
#      OOOOO             OOOOO      #'+"\n"+'\
#              o  o  o              #'+"\n"+'\
#                                   #'+"\n"+'\
#        _ ___ ___        _         #'+"\n"+'\
#     _ | | __| __|__ ___(_)___     #'+"\n"+'\
#    | || |__ | _|  _| _ | |   |    #'+"\n"+'\
#    |____|___|___|__|___|_|_|_|    #'+"\n"+'\
#                                   #'+"\n"+'\
#   DEVELOPERS! Get involved with   #'+"\n"+'\
#   the JSEcoin project.            #'+"\n"+'\
#                                   #'+"\n"+'\
#        https://jsecoin.com        #'+"\n"+'\
#                                   #'+"\n"+'\
#####################################'+"\n"+'\
																		 '+"\n"+'\
Information for developers:          '+"\n"+'\
https://developer.jsecoin.com        '+"\n"+'\
																		 '+"\n"+'\
Found a bug?:                        '+"\n"+'\
https://jsecoin.com/oddJobs/bugBounty'+"\n"+'\
																		 '+"\n"+'\
					 Version 1.8.20            '+"\n"+'\
#####################################'+"\n");
})
