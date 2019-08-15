// uglifyjs jsecoin-master.js -c -o jsecoin.min.js
// For testnet, set to 'local' or 'remote' (@string) to run on http://localhost:81 or https://testnet.jsecoin.com, false for production

//nb. u = unique, h = hit, a = hash, c = coin

var jseTestNet = false; //'remote';

var user = false;
var stats = {};
var lastRequestTime = 0;

var jseServer = 'https://server.jsecoin.com:443' // change for production to https://server.jsecoin.com 
var jseLoadServer = 'https://load.jsecoin.com:443'; // https://load.jsecoin.com

if (jseTestNet == 'local') {
	jseServer = 'http://localhost:81';
	jseLoadServer = 'http://localhost:81';
}
if (jseTestNet == 'remote') {
	jseServer = 'https://testnet.jsecoin.com:443';
	jseLoadServer = 'https://testnet.jsecoin.com:443';
}
if (jseTestNet == false) {
	// Redirect everything to https
	if (location.protocol != 'https:'){ location.href = 'https:' + window.location.href.substring(window.location.protocol.length);}
}
//document.write('<div id="siteclosed" style="z-index: 99999; background: rgba(255,255,255,0.9); width: 100%; height: 100%; position: fixed; top: 0; left: 0; text-align:center; padding-top: 10%;"><img src="https://jsecoin.com/img/logo300black.png" alt="JSEcoin" /><h1>Platform Closed While We Migrate The Servers</h1><h2>Scheduled Maintenance</h2></div>');

$.ajaxSetup({ cache: false });

//window.onbeforeunload = function() { return true; };

function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) { params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]); }
	return params;
}
var get = getQueryParams(document.location.search);

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function cleanString(stringRaw) { // es5 version of function in server/modules/functions.js
	var stringClean = String(stringRaw);
	stringClean = stringClean.split(/[^ .$*+?\\\-_:/,@a-zA-Z0-9\s]/).join('');
	stringClean = stringClean.substr(0, 255);
	return stringClean;
}

function notify(msg) {
	/*
	$('.notifycontent').html(msg);
	$('#notify').fadeIn();
	*/
	$('.notifycontent').html(msg);
	
	$(".alert").removeClass('hide animated zoomOutDown').addClass('animated zoomInDown');
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
	$(".alert").removeClass('animated zoomInDown').addClass('animated zoomOutDown');
}

function round(value) {
	var decimals = 8;
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var scriptLoadTS = new Date().getTime();

// save tracking variables

if (localStorage) {
	if (get['utm_source']) { localStorage.setItem('utmSource', get['utm_source']); document.cookie = "utmSource="+get['utm_source']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	if (get['utm_campaign']) { localStorage.setItem('utmCampaign', get['utm_campaign']); document.cookie = "utmCampaign="+get['utm_campaign']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	if (get['utm_content']) { localStorage.setItem('utmContent', get['utm_content']); document.cookie = "utmContent="+get['utm_content']+";domain=.jsecoin.com;path=/;expires=Thu, 18 Dec 2037 12:00:00 UTC;"; }
	// set jseunique
	if (localStorage.getItem("jseUnique") === null) {
		var jseUnique = randString(12);
		user.jseUnique = jseUnique;
		localStorage.setItem('jseUnique', jseUnique);
	} else {
		user.jseUnique = localStorage.getItem("jseUnique");
	}
}




function loadPage(pageName) {
	if (pageName == 'Register') {
		$("#content").load('register.html',function() {
			$('.titletext').html('Register');
			if (get.email) { $('#newemail').val(cleanString(get.email)); }
		});
		return false;
	} else if (pageName == 'Login') {
		$("#content").load('login.html',function() {
			$('.titletext').html('Login');
		});
		return false;
	} else if (pageName == 'ResetPassword') {
		$("#content").load('resetpassword.html',function() {
			$('.titletext').html('Reset Password');
		});
		return false;
	} else if (pageName == 'Lander1') {
		$("#content").load('lander1.html',function() {
			$('.titletext').html('Start');
				setTimeout(function() {
					$('.navbar-minimalize').click();
				}, 1000);
		});
		return false;
	} else if (pageName == 'Lander2') {
		$("#content").load('lander2.html',function() {
			$('.titletext').html('Register');
				setTimeout(function() {
					$('.navbar-minimalize').click();
				}, 1000);
		});
		return false;
	}
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

		if (score > 50) {
			return true;
		} else {
			return false;
		}
}

function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
}


var conversionTags = '<!-- Google Code for JSECOIN REGISTRATION Conversion Page -->\
<script type="text/javascript">\
var google_conversion_id = 994059797;\
var google_conversion_language = "en";\
var google_conversion_format = "3";\
var google_conversion_color = "ffffff";\
var google_conversion_label = "BjRCCPOQ_nMQlcyA2gM";\
var google_remarketing_only = false;\
</script>\
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">\
</script>\
<noscript>\
<div style="display:inline;">\
<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/994059797/?label=BjRCCPOQ_nMQlcyA2gM&amp;guid=ON&amp;script=0"/>\
</div>\
</noscript>\
\
<script>\
fbq("track", "Lead");\
</script>\
\
<script>\
	ga("send", "event", "goal", "signup");\
</script>\
\
<img src="https://trends.revcontent.com/conv.php?t=UaV2dZ39B6b7BVMKNB6%2BHKNaZW01XC1HQrqPP2qkgPhC7dwA8FxsbSroz9Qjs26N" />\
';

var saleTags = '<!-- Google Code for JSECOIN INVESTMENT Conversion Page -->\
<script type="text/javascript">\
var google_conversion_id = 994059797;\
var google_conversion_language = "en";\
var google_conversion_format = "3";\
var google_conversion_color = "ffffff";\
var google_conversion_label = "viQRCLDYx3QQlcyA2gM";\
var google_remarketing_only = false;\
</script>\
<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">\
</script>\
<noscript>\
<div style="display:inline;">\
<img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/994059797/?label=viQRCLDYx3QQlcyA2gM&amp;guid=ON&amp;script=0"/>\
</div>\
</noscript>\
\
<script>\
fbq("track", "Sale");\
</script>\
\
<script>\
	ga("send", "event", "goal", "sale");\
</script>\
';

function register() {

	if(!$("#newterms").is(':checked')) { notify('You need to agree to terms'); grecaptcha.reset(); return false; }
	if($('#newemail').val() !== $('#retypeemail').val()) { notify('Email addresses do not match'); grecaptcha.reset(); return false; }

	var newUser = {};
	newUser.name = cleanString($('#newname').val());
	newUser.email = cleanString($('#newemail').val());

	if (!validateEmail(newUser.email)) { notify('Email invalid, please check your email address'); grecaptcha.reset(); return false; }

	var badEmailProviders = ['cobin2hood.com','mailinator','inboxalias','maildrop.cc','guerrillamail','tm2mail.com','muimail.com','hitbts.com','minex-coin.com','c1oramn.com','balanc3r.com','c1oramn.com','letsmail9.com','crymail2.com','ax80mail.com'];
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


	//notify(JSON.stringify(newUser));

	$('body').append(conversionTags);

	$.ajax({url:jseServer+'/register/',type:'POST',contentType:'application/json',data: JSON.stringify(newUser)}).done(function(data) {
		user = JSON.parse(data);
		if (user.fail) {
			notify(user.notification);
			delete user;
			grecaptcha.reset()
			return false;
		} else {
			// registration successful
			$('.loginout1').html('<a href="javascript:void(0)"  onclick="logOut();"><i class="fa fa-sign-out"></i> Log Out</a>');
			$('.loginout2').html('<a href="javascript:void(0)" onclick="logOut();" data-toggle="tooltip" title="Log Out"><i class="fa fa-sign-out"></i> <span class="nav-label">Log Out</span></a>');	
			loadScripts();
			loadDashboard();
			return false;
		}
	});
}

function loadScripts() {
	$.getScript( "js/jsecrypto.js", function( data, textStatus, jqxhr ) {	});
	$.getScript( "js/plugins/flot/jquery.flot.time.js", function( data, textStatus, jqxhr ) {	});
	$.getScript( "js/plugins/flot/jquery.flot.tooltip.min.js", function( data, textStatus, jqxhr ) {	});
}

function setup2fa() {
	if (checkAuth()) {
		var credentials = {};
		credentials.session = user.session;

		$.ajax({url:jseServer+'/twofa/setup2fa/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {

			var qrHTML = '<div style="margin: 10px auto; text-align: center;"><div class="qrcontainer"><div id="qrcode" style="width:166px; height:166px; margin: 0 auto;"></div></div><br>Scan with <a href="https://authy.com/download/" target="_blank">Authy App</a> or <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en" target="_blank">Google Authenticator</a><br><br></div>';
			var authForm = '<form class="m-t" role="form" action="javascript:void(0)" onsubmit="test2fa()"><div class="form-group"><input type="text" id="authcode" class="form-control w300c" placeholder="6 Digit Auth Code" required=""></div><button type="submit" class="btn btn-primary block m-b w300c">Setup Two Factor Authentication</button></form>';
			launchModal('Scan This Code',qrHTML+authForm);

			var qrElement = new QRCode(document.getElementById("qrcode"), {
				width : 166,
				height : 166
			});
			returnObject = JSON.parse(data);
			if (returnObject.fail) { notify(returnObject.notification); return false; }
			qrElement.makeCode(returnObject.authuri);
		});
	}
}

function test2fa() {
	var credentials = {};
	credentials.session = user.session;
	credentials.authCode = $('#authcode').val();

	$.ajax({url:jseServer+'/twofa/test2fa/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		returnObject = JSON.parse(data);
		if (returnObject.fail) { notify(returnObject.notification); setup2fa(); return false; }
		if (returnObject.success) { notify(returnObject.notification); $('#tmpmodal').modal('hide'); refreshUser(function() { loadDashboard(); }); return false; }
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
		returnObject = JSON.parse(data);
		if (returnObject.fail) { notify(returnObject.notification); remove2fa(); return false; }
		if (returnObject.success) { notify(returnObject.notification); $('#tmpmodal').modal('hide'); refreshUser(function() { loadDashboard(); }); return false; }
	});
}

$(document).ajaxError(function() {
	if (user) {
		console.log('Ajax Error: 326');
	} else {
		notify('Server error, apologies we may be carrying out maintenance or experiencing very high demand. This error can also be caused by an adblocker or anti-virus software blocking our domain, please add an exception or disable the ad blocker/AV.');
	}
});

function login() {
	var credentials = {};
	credentials.email = cleanString($('#loginemail').val());
	credentials.password = $('#loginpassword').val();
	credentials.authCode = $('#authcode').val() || undefined;
	if (localStorage && localStorage.jseUnique) { credentials.jseUnique = localStorage.jseUnique; }

	credentials.initial = 1;

	if (!user.msg2fa) { // dont do recaptcha again for 2fa login
		credentials['g-recaptcha-response'] = grecaptcha.getResponse();
		if(credentials['g-recaptcha-response'] === undefined || credentials['g-recaptcha-response'] === '' || credentials['g-recaptcha-response'] === null) {
			notify('Complete the ReCaptcha "I am not a robot"'); return false;
		}
	}

	if (!credentials.email) {
		document.location.href = 'https://platform.jsecoin.com';
	} else {
		try {
			$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				user = JSON.parse(data);
				if (user.fail) { 
					notify(user.notification);
					user = {};
					grecaptcha.reset()
					return false;
				} else {
					if (user.msg2fa) {
						// request 2fa
						var authForm = '<form class="m-t" role="form" action="javascript:void(0)" onsubmit="login()"><div class="form-group"><input type="text" id="authcode" class="form-control w300c" placeholder="6 Digit Auth Code" required=""></div><button type="submit" class="btn btn-primary block m-b w300c">Submit Code</button></form><br><small>(Please note there is a 30 second window to submit your code)';
						launchModal('Two Factor Authentication',user.msg2fa+'<br><br>'+authForm);
						return false;
					} else {
						// No 2fa required
						if (!user.confirmed) {
							notify('You need to confirm your email address using the link provided in the registration email<br><br><a href="https://server.jsecoin.com/resendwelcome/'+user.uid+'/'+user.email+'/" target="_blank">Resend Welcome Email</a>');
						}

						if ($('#checkout-login-container').length) {
							// merchant tools checkout
							merchantCheckoutLogin();
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
						}
						return false;
					}
				}
			});
		} catch(ex) {
			console.log('Session/Login Error: 379');
		}
	}
}

// Log back in if leave the page
window.onbeforeunload = function(){
	delete window.user; 
};

function resetPassword() {
	var credentials = {};
	credentials.email = cleanString($('#resetemail').val());
	$.ajax({url:jseServer+'/password/reset/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		var returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			notify('Password reset code has been sent to you, please check your email at: '+credentials.email);
		}
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
			document.location.href = 'https://platform.jsecoin.com';
		}
	});
	return false;
}


function logOut() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/logout/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		user = {};
		document.location.href = 'https://platform.jsecoin.com';
	});
}

function refreshUser(callback) {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		user = JSON.parse(data);
		if (!user.session) {
			//try again
			$.ajax({url:jseServer+'/login/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				user = JSON.parse(data);
				if (!user.session) {
					document.location.href = 'https://platform.jsecoin.com';
					return false;
				}
				callback();
				return true;
			});
		}
		callback();
	});
}

// Update user variable if logged in
var refreshTime = 60000;
function checkForUser() {
	if (user) {
		refreshUser(function() {});
	}
	refreshTime += (refreshTime * 0.05); // make refreshes slower for people logged in for a long time.
	if (refreshTime > 1800000) { refreshTime = 1800000; } // 30 min max
	setTimeout(function() { checkForUser(); }, refreshTime);
}
checkForUser();


function confirmTransfer() {
	var toUser = cleanString($('#touser').val());
	var toAmount = parseFloat($('#toamount').val());
	var toReference = cleanString($('#toreference').val().split(/[^ \.,@a-zA-Z0-9]/).join(''));
	if (user.balance < toAmount) {
		notify('Insufficient balance to complete transfer'); return false;
	} else if (user.confirmed == false) {
		notify('You need to confirm your account before you send a transaction. Please check the email address provided and click the confirmation link in the welcome email.'); return false;
	} else if (!toAmount) {
		notify('You need to enter an amount transfer'); return false;
	} else if (isNaN(toAmount)) {
		notify('Error amount to transfer is not recognised'); return false;
	} else {
		if (confirm('Do you wish to send '+toAmount+' to '+toUser+'? Reference: '+toReference)) {
			var credentials = {};
			credentials.session = user.session;
			credentials.toUser = toUser;
			credentials.toAmount = toAmount;
			credentials.toReference = toReference;
			launchModal('Sending '+toAmount+' to '+toUser,'Requesting Data To Sign...<br><br>');

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
	
						$.ajax({url:jseServer+'/push/data/',type:'POST',contentType:'application/json',data: JSON.stringify(signed)}).done(function(data) {
							returnObject = JSON.parse(data);
							if (returnObject.fail) {
								$('#tmpmodalbody').append('Server received signed data but transaction failed:<br>'+returnObject.notification);
							} else if (returnObject.success) {
								$('#tmpmodalbody').append('Transaction Completed');
							} else {
								$('#tmpmodalbody').append('Transaction failed: Unknown reponse from server<br>'+returnObject.notification);
							}
							notify(returnObject.notification);
							setTimeout(function() { $('#tmpmodalbody').html(''); $('#tmpmodal').modal('hide'); }, 5000);
							refreshUser(function() { loadTransfer(); });
						});
					});
				}
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
	} else {
	if (confirm('Do you wish to export '+exportAmount+' JSE')) {
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
						
						$.ajax({url:jseServer+'/push/data/',type:'POST',contentType:'application/json',data: JSON.stringify(signed)}).done(function(data) {
							var returnObject = JSON.parse(data);
							if (returnObject.fail) {
								$('#tmpmodalbody').append('Server received signed data but transaction failed:<br>'+returnObject.notification);
							} else if (returnObject.success) {
								$('#tmpmodalbody').append('Transaction Completed');
							} else {
								$('#tmpmodalbody').append('Transaction failed: Unknown reponse from server<br>'+returnObject.notification);
							}
							notify(returnObject.notification);
							if (returnObject.success) {
								$('#tmpmodalbody').html('<h4>Your export code is:</h4><div class="linkbox">'+returnObject.coinCode+'</div>');
							}
							refreshUser(function() { loadExport(); });
						});
					});
				}
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
	}
	coinCode = String(coinCode).trim();
	var credentials = {};
	credentials.session = user.session;
	credentials.coinCode = coinCode;
	$.ajax({url:jseServer+'/push/import/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			notify('Imported '+returnObject.value+' JSE');
			refreshUser(function() { loadExport(); });
		}
	});

}


function launchModal(title,content) {
	$('#tmpmodal').modal('show');
	$('.modal-title').html(title);
	$('#tmpmodalbody').html(content);
}


function getCode() {
	if (!$('#newterms').is(':checked')) { notify('You need to agree to terms'); return false; }
	if (!$('#newadvertising').is(':checked')) { 
		var advertising = false;
	} else {
		var advertising = true;
	}
	var newSite = $('#newsite').val();
	if (!newSite || typeof newSite == 'undefined' || newSite == '') { notify('You need to enter a domain name'); return false; }
	if (newSite.indexOf('.') == -1) { notify('You need to enter a valid domain name'); return false; }

	newSite = String(newSite).toLowerCase().split('http://').join('').split('https://').join('').split('www.').join('');
	if (newSite.indexOf('/') > -1) { var newSiteSplit = newSite.split('/'); newSite = newSiteSplit[0]; }

	var subID = $('#subid').val() || '0';
	subID = cleanString(String(subID));
	
	$('#newsite').val(newSite); //update with removed chars;
	$('#subid').val(subID); //update with removed chars;

	var credentials = {};
	credentials.session = user.session;
	credentials.newSite = newSite;
	credentials.subID = subID;
	credentials.advertising = advertising;

	$.ajax({url:jseServer+'/newsite/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		console.log(data);
		returnObject = JSON.parse(data);
		if (returnObject.fail) {
			notify(returnObject.notification);
		} else {
			var newCode = '<script type="text/javascript">\n\
!function(){var e=document,t=e.createElement("script"),s=e.getElementsByTagName("script")[0];t.type="text/javascript",t.async=t.defer=!0,t.src="https://load.jsecoin.com/load/'+user.uid+'/'+newSite+'/'+subID+'/0/",s.parentNode.insertBefore(t,s)}();\n\
</script>';

			launchModal('Copy and paste this code just above the closing &lt;/body&gt; tag','<div class="breakword"><xmp class="codeformat" id="sitecode">'+newCode+'</xmp><br><hr><button class="btn btn-sm btn-primary" onclick="copyToClipboard(\'sitecode\'); $(this).addClass(\'animated tada\');">Copy to Clipboard</button> <span class="copiedresult"></span></div>');
		}
	});

}

function sharePopUp() {
	var shareLink = 'https://platform.jsecoin.com/?lander=2&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=';
	launchModal('Here is your referral link, tell your friends about JSEcoin and earn more JSE','<div class="breakword"><xmp class="codeformat" id="sharelink">'+shareLink+'</xmp><br><hr><button class="btn btn-sm btn-primary" onclick="copyToClipboard(\'sharelink\'); $(this).addClass(\'animated tada\');">Copy to Clipboard</button><span class="copiedresult"></span>  <button class="btn btn-sm btn-primary" onclick="loadReferrals(); $(\'#tmpmodal\').modal(\'hide\');">More Links &amp; Full Terms</button> <button class="btn btn-sm btn-primary" onclick="socialPopUp(\'facebook\');"><i class="fa fa-facebook-square" aria-hidden="true"></i> Share on Facebook</button> <button class="btn btn-sm btn-primary" onclick="socialPopUp(\'twitter\');"><i class="fa fa-twitter-square" aria-hidden="true"></i> Tweet</button></div>');
}


function socialPopUp(socialNetwork) {
	var encodedAffLink = encodeURIComponent('https://platform.jsecoin.com/?lander=2&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=socialshare');
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

function showAPIKey() {
	$('#apikey').toggleClass('hide').html(user.apiKey);
}

function updateAPILevel() {
	var newAPILevel = parseFloat($('#apilevel').val());
	var credentials = {};
	credentials.session = user.session;
	credentials.newAPILevel = newAPILevel;

	$.ajax({url:jseServer+'/updateapilevel/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		refreshUser(function() {
			loadSettings();
		});
	});
}


function updateDetails() {
var credentials = {};
	credentials.session = user.session;
	credentials.newName = cleanString($('#newname').val());
	credentials.newAddress = cleanString($('#newaddress').val());

	$.ajax({url:jseServer+'/updatedetails/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		refreshUser(function() {
			loadSettings();
		});
	});
}


/* 
Mining code Hash a Hash
*/

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


var sessionHashes = 0;
var quitMining = true;
var preHash = '0';
var hashRate = 1500; // start off at 1500 hps, should be lower for production
var maxHashRate = hashRate;
var socketIOAddress = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js';

// function to load script dynamically from js for JSEsocket.io
function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	head.appendChild(script);
}

function stopMining() {
	$('#startminingbutton').removeClass('btn-success').addClass('btn-primary');
	$('#startminingbutton').html('<i class="fa fa-gavel"></i> &nbsp; Start Mining');
	$('#startminingbutton').attr("onclick","startMining(); $(this).addClass('animated tada');");
	console.log('Cancelling mining operation...');
	setTimeout(function() { console.log('Cancelled mining operation...'); }, 15000);
	quitMining = true;
}


// load 2nd script from 3rd party javascript, need to double check this works
function startMining() {
	quitMining = false;
	$('#startminingbutton').removeClass('btn-primary').addClass('btn-success');
	setTimeout(function() { $('#startminingbutton').html('<i class="fa fa-times"></i> &nbsp; Stop Mining'); }, 1000);
	$('#startminingbutton').attr("onclick","stopMining()");

	loadScript(socketIOAddress, function() {
		console.log('Loaded '+socketIOAddress)

		window.JSEsocket = io.connect(jseLoadServer, {secure: true});

		JSEsocket.on('connect_error', function(exception) {
			console.log('JSE SOCKET ERROR: '+JSON.stringify(exception));
			JSEsocket.destroy();
		})

		JSEsocket.on('connect', function () { 
			JSEsocket.emit('startComs', 2, function(authResponse) {
				if (authResponse === 'badIP') {
					launchModal('VPN / VPS / Proxy / Tor IP Address Detected','Sorry it is not currently possible to mine from an anonymous IP address. This may be because you are connected to the internet via: <ul><li>A VPN (Virtual Private Network)</li><li>Anonymous Proxy</li><li>TOR Onion Router</li></ul>To start mining please disconnect from your VPN / Proxy / Tor connection and use a valid IP address.<br><br>We have put these measures in place to prevent mining fraud.');
					setTimeout(function() { stopMining(); }, 3000);
				} else if (user.confirmed == false) {
					launchModal('You need to confirm your account before you start mining. Please check the email address provided and click the confirmation link in the welcome email.');
					setTimeout(function() { stopMining(); }, 3000);
				}
			});
		});

		JSEsocket.once('connect', function () { 
			console.log('JSE Socket Connected!');

			JSEsocket.on('disconnect', function() {
				console.log('JSE Socket Reset');
			});

			// start the miner up when we receive the first preHash
			JSEsocket.on('firstPreHash', function (blockPreHash) {
				console.log('JSE Initial Data Received: '+blockPreHash);
				preHash = blockPreHash;
			}); 

			window.hashesFoundThisBlock = 0;

			// update preHash variable when we receive a new preHash
			JSEsocket.on('blockPreHash', function (blockPreHash) {
				console.log('JSE Data Received: '+blockPreHash);
				preHash = blockPreHash;
				hashesFoundThisBlock = 0;
			}); 

			// submit a hash, string is preHash,hash,nonce separated by commars
			function processHashV2(hashSubmissionString) {
				sessionHashes ++;
				JSEsocket.emit('submitHash', hashSubmissionString);
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
								processHashV2(preHash+','+hashNonce+','+user.uid+','+user.jseUnique+',Platform Mining,0'); // this is a string preHash,hash,nonce,uid,uniq,siteid,subid
								console.log('<b>Found Hash! : '+hashNonce+'</b>');
								$('.fa-puzzle-piece').addClass('animated flash fa-3x');
								setTimeout(function() { $('.fa-puzzle-piece').removeClass('animated flash fa-3x'); }, 1000);
							}
						});
					} else {
						var hash = fallbackSHA256(targetTextWithNonce,x,function (hashNonce) {
							if (hashNonce.substr(0, difficulty) === variableDifficulty(difficulty)) {
								found = true; // stop mining to submit the hash
								hashesFoundThisBlock ++;
								processHashV2(preHash+','+hashNonce+','+user.uid+','+user.jseUnique+',Platform Mining,0');
								console.log('<b>Found Hash! : '+hashNonce+'</b>');
								$('.fa-puzzle-piece').addClass('animated flash fa-3x');
								setTimeout(function() { $('.fa-puzzle-piece').removeClass('animated flash fa-3x'); }, 1000);
							}
						});
					}
				}
				setTimeout(function() {
					// using the same CPU balancing from V1, could this be improved?
					var hashingFinished = new Date().getTime();
					var hashesCompleted = x - startNumber;
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
					speedTestCount ++; if (speedTestCount == 5) { speedTestCount = 0; console.log('Hashrate Speed Test: '+hps+' hashes/sec'); }
					
					window.jseMineV2(); // restart mining function with new hash rate based on previous seconds work total
				}, 1000);
			}
		});

		JSEsocket.emit('requestFirstPreHash', '2'); // 1 = publisher, 2 = self-mining
		shortMiningInterval();
		longMiningInterval();

		function checkConnected() {
			// wait for socketio connection to load and jseMineV2 function to be available
			if ( window.jseMineV2 ) {
				window.jseMineV2();
			} else {
				setTimeout(function() { checkConnected(); }, 1000);
			}
		}
		checkConnected();

	})
}


// restart socket and mining every 30 mins
setInterval(function() {
	console.log('Restarting JSE Socket.IO and Mining at 30 min Intervals');
	quitMining = true;
	JSEsocket.disconnect(true);
	JSEsocket.destroy();
	JSEsocket = {};
	
	setTimeout(function() { startMining(); }, 15000);
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


/* Authentication and page loading */
function checkAuth() {
	if (user && user.session) {
		return true;
	} else {
		//notify('You need to log in');
		document.location.href = 'https://platform.jsecoin.com';
	}
	return false;
}


function loadDashboard() {
	if (checkAuth()) {
		$("#content").load('dashboard.html',function() {

			$('.titletext').html('Welcome '+user.name);
			
			if (user.balance == 0.12 || user.balance == 0) {
				$('.jsebalance').html(user.balance+'<span style="margin-left: 50px"><button id="startminingbutton" class="btn btn-primary btn-lg dim" onclick="loadMining();" type="button">Try Mining</button></span>');
			} else {
				$('.jsebalance').html(user.balance);
			}
			
			$('.sharebuttoncontainer').html('<button class="btn btn-primary pull-right" onclick="sharePopUp();" type="button"><i class="fa fa-share-alt-square"></i> &nbsp; Share</button>');

			$('.accountdetails').html('<b>Account Number:</b> '+user.uid+'<br><br><b>Name:</b> '+user.name+'<br><br><b>Email:</b> '+user.email+'<br><br><b>Address:</b><br>'+user.address+'<br>'+user.country);
			if (user.statsToday) { $('.minedtoday').html(user.statsToday.c); }
			$('.minedlifetime').html(user.statsTotal.c);
			var transactionTable = '';
			//for (var i = user.history.length - 1; i >= 0; i--) {
			var reverseArray = [];
			for (var i in user.history) {
				reverseArray.push(user.history[i]);
			}
			for (var i = reverseArray.length - 1; i >= 0; i--) {
				var t = reverseArray[i]
				if (t.command && t.command == 'transfer') {
					//var transactionTime = new Date(t.ts);
					//t.utcdate = transactionTime.toUTCString();
					t.localTime = utcTS2local(t.ts);
					var fromRef = t.user1email || t.publicKey+'<br>'; 
					var toRef = t.user2email || t.toPublicKey; 
					transactionTable += '<tr><td><i class="fa fa-check green" aria-hidden="true"></i> '+t.value+'<small>JSE</small></td><td>'+fromRef+' &gt; '+toRef+'</td><td>'+t.reference+'</td><td>'+t.localTime+'</td></tr>';
				}
			}
			$('.transactiontable').html(transactionTable);

			var platformMiningCount = 0;
			var publisherMiningCount = 0;

			var transactionTable = '';
			//for (var i = user.mining.length - 1; i >= 0; i--) {
			var reverseArray = [];
			for (var i in user.mining) {
				reverseArray.push(user.mining[i]);
			}
			for (var i = reverseArray.length - 1; i >= 0; i--) {
				var t = reverseArray[i]
				if (t.command && t.command == 'mining') {
					if (t.siteid == 'Platform Mining') {
						platformMiningCount ++;
					} else {
						publisherMiningCount ++;
					}
					//var transactionTime = new Date(t.ts);
					//t.utcdate = transactionTime.toUTCString()
					t.localTime = utcTS2local(t.ts);
					transactionTable += '<tr><td>'+t.value+' JSE</td><td>'+t.siteid+'</td><td>'+t.localTime+'</td></tr>';
				}
			}
			$('.dashboardminingtable').html(transactionTable);

			var earningsChartData = [{
			label: "Platform Mining",
			data: platformMiningCount,
			color: "#1AB394",
			}, {
			label: "Publisher Mining",
			data: publisherMiningCount,
			color: "#1C84C6",
			}];

			//console.log(JSON.stringify(earningsChartData));

			var plotObj = $.plot($("#earningsbreakdown"), earningsChartData, {
				series: {
						pie: {
								innerRadius: 0.3,
								show: true
						}
				},
				grid: {
						hoverable: true
				},
				legend: {
						position: 'sw'
				},
				tooltip: true,
				tooltipOpts: {
						content: "%s - %p.0%", // show percentages, rounding to 2 decimal places
						shifts: {
								x: 20,
								y: 0
						},
						defaultTheme: false
				}
			});

			//notify('Dashboard loaded for '+user.email);
		});
	}
}

function loadFunds() {
	if (checkAuth()) {
		$("#content").load('funds.html',function() {
			$('.titletext').html('Funds');
			$('.wirereference').html('JSE'+user.uid);
		});
	}
}

function loadMerchant() {
	if (checkAuth()) {
		$("#content").load('merchant.html',function() {
			$('.titletext').html('Merchant Tools');

		});
	}
}

function loadTransfer() {
	if (checkAuth()) {
		$("#content").load('transfer.html',function() {
			$('.titletext').html('Transfer');			
			var transactionTable = '';
			var reverseArray = [];
			for (var i in user.history) {
				reverseArray.push(user.history[i]);
			}
			for (var i = reverseArray.length - 1; i >= 0; i--) {
				var t = reverseArray[i]
				if (t.command && t.command == 'transfer') {
					//var transactionTime = new Date(t.ts);
					//t.utcdate = transactionTime.toUTCString()
					t.localTime = utcTS2local(t.ts);
					var sentReceived = '<span class="label label-success">Received</span>';
					var fromRef = t.user1email || t.publicKey+'<br>'; 
					var toRef = t.user2email || t.toPublicKey; 
					if (t.user1email == user.email) {
						sentReceived = '<span class="label label-warning">Sent</span>';
					}
					transactionTable += '<tr><td><span class="label label-primary">Complete</span><br><br>'+sentReceived+'</td><td>'+t.value+'<small>JSE</small></td><td>'+t.localTime+'</td><td>'+fromRef+' &gt; '+toRef+'</td><td>'+t.reference+'</td><td>'+t.tid+'</td></tr>';
				}
			}
			$('.transactiontable').html(transactionTable);
		});
	}
}

function loadExport() {
	if (checkAuth()) {
		$("#content").load('export.html',function() {
			$('.titletext').html('Export / Import');
			$('.jsebalance').html(user.balance);
			var credentials = {};
			credentials.session = user.session;
			$.ajax({url:jseServer+'/myexports/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
				var returnObject = JSON.parse(data);
				var transactionTable = '';
				var reverseArray = [];

				for (var i in returnObject) {
					reverseArray.push(returnObject[i]);
				}
				reverseArray.sort(function(a,b){
					 return new Date(b.ts) - new Date(a.ts);
				});
				for (var i = 0; i < reverseArray.length; i++) {
					t = reverseArray[i];
					//var transactionTime = new Date(t.ts);
					//t.utcdate = transactionTime.toUTCString()
					t.localTime = utcTS2local(t.ts);
					if (t.used) {
						t.spent = '<span class="label label-warning">Used</span>';
					} else {
						t.spent = '<span class="label label-success">Available</span>';
					}
					transactionTable += '<tr><td class="breakword">'+t.coinCode+'</td><td>'+t.value+'</td><td>'+t.localTime+'</td><td>'+t.spent+'</td><td><button class="btn btn-sm btn-primary" onclick="$(\'#importcode\').val(\''+t.coinCode+'\'); importCoins(); $(this).addClass(\'animated tada\');" type="button">Import</button></td></tr>';
				}
				$('.exporttable').html(transactionTable);
	
			});
		});
	}
}

var rawData = [];
var chartData = [];
var series = [];
series.push({data:0});
var plot = {};

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

function longMiningInterval() {
	if (user) {
		var preEarnings = parseFloat($('.todayearnings').html());
		if (user.statsToday && (preEarnings < user.statsToday.c)) {
			$('.fa-money').addClass('animated flash fa-3x');
			setTimeout(function() { $('.fa-money').removeClass('animated flash fa-3x'); }, 1000);
		}
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
				transactionTable += '<tr><td>'+t.localTime+'</td><td>'+t.value+' JSE</td><td>'+t.siteid+'</td></tr>';
			}
		}
		$('.miningtable').html(transactionTable);
		$('.jsebalance').html(user.balance);
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
}

// Function for desktop app, needs testing rewriting
function loadAppMining() {

	console.log = function(message) {
		if($('#console').length !== 0) {
			$('#console').prepend('<p>' + message + '</p>');

			$('#console').html($('#console').html().substr(0, 1000));
		}
		if($('#iframe-console').length !== 0) {
			$('#iframe-console').html('<p>' + message + '</p>');
		}
	};

	if (localStorage.getItem("hashRateAccStored") !== null) {
		var hashRateStored = localStorage.getItem("hashRateAccStored");
		$('#hashrateacceleration').val(hashRateStored);
		//console.log(hashRateStored);
		updateHashRateAcceleration();
	}

	var container = $("#hashratechart");

	series = [{ data: chartData, lines: { fill: true } }];

	plot = $.plot(container, series, {
			grid: {  color: "#999999", tickColor: "#D4D4D4", borderWidth:0, minBorderMargin: 20, labelMargin: 10, backgroundColor: { colors: ["#ffffff", "#ffffff"] }, margin: { top: 8, bottom: 20, left: 20 },
					markings: function(axes) {
							var markings = [];
							var xaxis = axes.xaxis;
							for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
									markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "#fff" });
							}
							return markings;
					}
			},
			colors: ["#1ab394"],
			xaxis: { min: 0, max: 100 },
			yaxis: { min: 0, max: 100 },
			legend: { show: true }
	});

	shortMiningInterval();
	//longMiningInterval();
}

function loadMining() {
	if (checkAuth()) {
		$("#content").load('mining.html',function() {
			$('.titletext').html('Mining');
			if (user.statsToday) { $('.todayearnings').html(user.statsToday.c); }

			console.log = function(message) {
				if($('#console').length !== 0) {
					$('#console').prepend('<p>' + message + '</p>');

					$('#console').html($('#console').html().substr(0, 1000));
				}
				if($('#iframe-console').length !== 0) {
					$('#iframe-console').html('<p>' + message + '</p>');
				}
			};

			$('.jsebalance').html(user.balance);

			if (localStorage.getItem("hashRateAccStored") !== null) {
				var hashRateStored = localStorage.getItem("hashRateAccStored");
				$('#hashrateacceleration').val(hashRateStored);
				//console.log(hashRateStored);
				updateHashRateAcceleration();
			}

			var container = $("#hashratechart");

			if (quitMining == false) {
				$('#startminingbutton').html('<i class="fa fa-times"></i> &nbsp; Stop Mining');
			}

			series = [{ data: chartData, lines: { fill: true } }];

			plot = $.plot(container, series, {
					grid: {  color: "#999999", tickColor: "#D4D4D4", borderWidth:0, minBorderMargin: 20, labelMargin: 10, backgroundColor: { colors: ["#ffffff", "#ffffff"] }, margin: { top: 8, bottom: 20, left: 20 },
							markings: function(axes) {
									var markings = [];
									var xaxis = axes.xaxis;
									for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
											markings.push({ xaxis: { from: x, to: x + xaxis.tickSize }, color: "#fff" });
									}
									return markings;
							}
					},
					colors: ["#1ab394"],
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

			shortMiningInterval();
			longMiningInterval();

			
			// Update Todays Miners
			$.ajax({url:jseServer+'/stats/',type:'GET',contentType:'application/json'}).done(function(data) {
				publicStats = JSON.parse(data);
				//$('.selfMinersToday').html(publicStats.selfMiners);
				var totalSelfMiners = 0;
				for (var key in publicStats.clients) {
					if (publicStats.clients[key].selfMinersCount) { totalSelfMiners += publicStats.clients[key].selfMinersCount; }
				 }
				$('.selfMinersNow').html(totalSelfMiners);
			});

		});
	}
}

function loadPublishers() {
	var credentials = {};
	credentials.session = user.session;
	$.ajax({url:jseServer+'/pubstats/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		stats = JSON.parse(data);
		$("#content").load('publishers.html',function() {
			$('.titletext').html('Publishers');
			$('.lifetimehits').html(user.statsTotal.h || 0);
			$('.lifetimeuniques').html(user.statsTotal.u || 0);
			$('.lifetimeoptins').html(user.statsTotal.o || 0);
			$('.lifetimehashes').html(user.statsTotal.a || 0);
			$('.lifetimeearnings').html(user.statsTotal.c || 0);
			if (user.statsToday) {
				$('.todayhits').html(user.statsToday.h || 0);
				$('.todayuniques').html(user.statsToday.u || 0);
				$('.todayoptins').html(user.statsToday.o || 0);
				$('.todayhashes').html(user.statsToday.a || 0);
				$('.todayearnings').html(user.statsToday.c || 0);
			}
			var transactionTable = '';
			var reverseArray = [];
			for (var i in user.mining) {
				reverseArray.push(user.mining[i]);
			}
			for (var i = reverseArray.length - 1; i >= 0; i--) {
				var t = reverseArray[i]
				if (t.command && t.command == 'mining' && t.siteid !== 'Platform Mining') {
					//var transactionTime = new Date(t.ts);
					//t.utcdate = transactionTime.toUTCString()
					t.localTime = utcTS2local(t.ts);
					transactionTable += '<tr><td>'+t.localTime+'</td><td>'+t.value+' JSE</td><td>'+t.siteid+'</td></tr>';
				}
			}
			$('.publishertable').html(transactionTable);

			//var publisherChartData = [ [1, 34], [2, 25], [3, 19], [4, 34], [5, 32], [6, 44] ];
			var publisherCoinData = [];
			var publisherUniqueData = [];

			// convert object to array
			var statsDaily = [];
			for (var key in stats.statsDaily) {
				if (!stats.statsDaily.hasOwnProperty(key)) continue;
				statsDaily.push(stats.statsDaily[key]);
			}

			function getPastDate(daysAgo) {
				var date = new Date();
				date.setDate(date.getDate()-daysAgo);
				return date; //.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
			}
			// set the number of days to go back window.pubChartDays = 14; loadPublishers();
			var startDate = 0;
			if (!window.pubChartDays) {
				pubChartDays = 14;
			}
			if (statsDaily.length > pubChartDays) {
				startDate = statsDaily.length - pubChartDays;
			}
			for (var i = startDate; i < statsDaily.length; i++) {
				var theDate = getPastDate(statsDaily.length - i);
				publisherCoinData.push([theDate,statsDaily[i].c]);
				publisherUniqueData.push([theDate,statsDaily[i].u]);
			}
			function doPlot(position) {
				$.plot($("#publisherchart"), [{
						data: publisherCoinData,
						label: "JSE Coins Mined", color: "#2F4050",
						bars: {
								show: true, 
								align: "center",
								barWidth: 24 * 60 * 60 * 800,
								lineWidth:1
						}
				}, {
						data: publisherUniqueData,
						label: "Unique Impressions",
						yaxis: 2
				}], {
						xaxes: [{
								//mode: 'time',timeformat: "%m/%d/%y", tickSize: [1, "day"], tickLength: 0
								mode: 'time',timeformat: "", tickSize: [1, "day"], tickLength: 0
						}],
						yaxes: [{
								min: 0,
								axisLabel: 'JSE',
								axisLabelUseCanvas: true
						}, {
								// align if we are to the right
								axisLabel: 'Unique',
								alignTicksWithAxis: position == "right" ? 1 : null,
								position: position
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
								hoverable: true //IMPORTANT! this is needed for tooltip to work,
						},
						tooltip: true,
						tooltipOpts: {
								content: "%s : %y",
								onHover: function(flotItem, $tooltipEl) {
										// console.log(flotItem, $tooltipEl);
								}
						}
				});
			}
			doPlot("right");
		});
	});
}

function loadSiteIDs() {
	var transactionTable = '<table class="table table-hover"><thead><tr><th>Site ID</th><th>Earnings</th><th>Uniques</th><th>Hits</th><th>Opt-Ins</th><th>Hashes</th><th>Tools</th></tr></thead><tbody>';

	for (var i in stats.siteIDs) {
	//for (var i = user.siteids.length - 1; i >= 0; i--) {
		var t = stats.siteIDs[i];
		if (t.s == 'Platform Mining') {
			transactionTable += '<tr><td>'+t.s+'</td><td>'+t.c+' <small>JSE</small></td><td></td><td></td><td></td><td>'+t.a+'</td><td><button class="btn btn-sm btn-primary" onclick="loadMining(); $(\'#tmpmodal\').modal(\'hide\');">Platform Mining</button></td></tr>';
		} else {
			transactionTable += '<tr><td>'+t.s+'</td><td>'+t.c+' <small>JSE</small></td><td>'+t.u+'</td><td>'+t.h+'</td><td>'+(t.o || 0)+'</td><td>'+t.a+'</td><td><button class="btn btn-sm btn-primary" onclick="getCodeSiteID(\''+t.s+'\');">Get Code</button> <button class="btn btn-sm btn-primary disabled" onclick="notify(\'Advertising is currently not available\');">Advertising Not Available</button></td></tr>';
		}
	}
	transactionTable += '</tbody></table>';

	launchModal('SiteID Data',transactionTable);
}

function loadSubIDs() {
	var transactionTable = '<table class="table table-hover"><thead><tr><th>Sub ID</th><th>Earnings</th><th>Uniques</th><th>Hits</th><th>Opt-Ins</th><th>Hashes</th></tr></thead><tbody>';

	for (var i in stats.subIDs) {
	//for (var i = user.subids.length - 1; i >= 0; i--) {
		var t = stats.subIDs[i];
		transactionTable += '<tr><td>'+t.s+'</td><td>'+t.c+' <small>JSE</small></td><td>'+t.u+'</td><td>'+t.h+'</td><td>'+(t.o || 0)+'</td><td>'+t.a+'</td></tr>';
	}
	transactionTable += '</tbody></table>';

	launchModal('SubID Data',transactionTable);
}

function loadInvestors() {
	$("#content").load('investors.html',function() {
		$('.titletext').html('Investors');
	});
}

function loadSettings() {
	$("#content").load('settings.html',function() {
		$('.titletext').html('Settings');
		$('#publicKeyBox').html(user.publicKey);
		if (user.twoFactorAuth) {
			$('#switch2faon').removeClass('btn-default').addClass('btn-primary');
			$('#switch2faoff').removeClass('btn-danger').addClass('btn-default');
			$('.switch2fa').attr("onclick","remove2fa()");
		}
	});
}

function loadReferrals() {
	$("#content").load('referrals.html',function() {
		$('.titletext').html('Referrals');
		$('.afflink1').html('https://platform.jsecoin.com/?register=1&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=');
		$('.afflink2').html('https://jsecoin.com/?utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=');
		$('.afflink3').html('&lt;iframe src="https://platform.jsecoin.com/?lander=1&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=" style="border:1px #CCCCCC solid; border-radius: 3px;" name="jsecoiniframe" scrolling="auto" frameborder="no" align="center" height="800px" width="100%" &gt;&lt;/iframe&gt;');
		$('.afflink4').html('https://platform.jsecoin.com/?lander=1&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=');
		$('.afflink5').html('&lt;iframe src="https://platform.jsecoin.com/banner1.html?aff'+user.uid+'&utm_content="scrolling="auto" frameborder="no" align="center" width="300" height="250px" &gt;&lt;/iframe&gt;');
		$('.afflink6').html('https://jsecoin.com/o/?a='+user.uid);
		$('.afflink7').html('https://platform.jsecoin.com/?lander=2&utm_source=referral&utm_campaign=aff'+user.uid+'&utm_content=');
		
		if (user.affPayout) {
			$('.affpayout').html(user.affPayout);
		}

		var totalReferrals = 0;
		var totalEarnings = 0;

		var transactionTable = '';
		//for (var i = user.history.length - 1; i >= 0; i--) {
			var reverseArray = [];
			for (var i in user.history) {
				reverseArray.push(user.history[i]);
			}
			for (var i = reverseArray.length - 1; i >= 0; i--) {
				var t = reverseArray[i]
			if (t.reference && t.reference.indexOf('Referral Payment:') > -1) {
				totalReferrals ++;
				totalEarnings = round(totalEarnings + t.value);
				//var transactionTime = new Date(t.ts);
				//t.utcdate = transactionTime.toUTCString()
				t.localTime = utcTS2local(t.ts);
				transactionTable += '<tr><td>'+t.localTime+'</td><td>'+t.value+' JSE</td><td>'+t.reference+'</td></tr>';
			}
		}
		$('.referraltable').html(transactionTable);
		$('.totalreferrals').html(totalReferrals);
		$('.totalearnings').html(totalEarnings);


	});
}

/*
function fixIFrameHeight() {
	var iFrameHeight = $(document).height() - 40;
	$('#iframehomepage').css('height', iFrameHeight + 'px');
}
*/

function sendBTC() {
	var credentials = {};
	credentials.email = user.email;
	credentials.notification =  'New BTC Transfer Request';
	credentials.userid =  user.uid;
	credentials.amount = parseFloat($('#btcamount').val());
	if (typeof credentials.amount == 'undefined' || credentials.amount < 0.015) {
		notify('Bitcoin amount must be greater than 0.015');
	} else {
		$.ajax({url:jseServer+'/adminemail/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			$('#btcaddress').removeClass('hide');
			$('.btctosend').html(credentials.amount);
		});
	}
}

function sendETH() {
	var credentials = {};
	credentials.email = user.email;
	credentials.notification =  'New ETH Transfer Request';
	credentials.userid =  user.uid;
	credentials.amount = parseFloat($('#ethamount').val());
	if (typeof credentials.amount == 'undefined' || credentials.amount < 0.3) {
		notify('ETH amount must be greater than 0.3');
	} else {
		$.ajax({url:jseServer+'/adminemail/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
			$('#ethaddress').removeClass('hide');
			$('.ethtosend').html(credentials.amount);
		});
	}
}

/*
function loadIframe() {
	$("#content").load('iframe.html',function() {
		fixIFrameHeight();
		setTimeout(function() { $('.iframe-background').html('This site does not allow loading in an iframe :(<br><br>Try using the back button and opening it in a new tab'); }, 8000);
		$(window).on('resize', function(){
			fixIFrameHeight();
		});

		if (user.statsToday) { $('.todayearnings').html(user.statsToday.c); }
		$('.jsebalance').html(user.balance);
		$('.sessionhashes').html(sessionHashes);
		if (quitMining) {
			$('.stop-mining-iframe-button').hide();
		} else {
			$('.start-mining-iframe-button').hide();
		}

	});
}
*/

if (get.register || get.registration) {
	loadPage('Register');
} else if (get.login) {
	loadPage('Login');
} else if (get.lander) {
	if (get.lander == 1) {
		loadPage('Lander1');
	}
	if (get.lander == 2) {
		loadPage('Lander2');
	}
} else if (get.paypalfinish) {
	notify('Thanks your paypal transaction is complete. Funds will be added to your account within one working day');
	loadDashboard();
	$('body').append(saleTags);
	
	// Send notification email
	var credentials = {};
	credentials.email = user.email;
	credentials.notification =  'New Paypal Transaction';
	credentials.userid =  user.uid;
	//$.ajax({url:jseServer+'/adminemail/',type:'POST',contentType:'application/json',data: JSON.stringify(credentials)}).done(function(data) {
		
	//});
} else if (get.publishers) {
	loadPublishers();
} else {
	loadPage('Login');
	//loadDashboard(); // loads login.html if no user var
}

/* not used as moved big script with sign data in it
function checkLoaded() {
	if (typeof signData !== 'undefined') {
		$('#pageloadingcontainer').fadeOut();
	} else {
		setTimeout(function() {
			checkLoaded();
		}, 1000);
	}
}
//checkLoaded();
*/

$('#pageloadingcontainer').fadeOut();

if (localStorage.getItem('themeVal') !== null) {
	$('#JSE-updateTheme i').attr('class','fa fa-sun-o');
	$('<link />', {
		id: 'JSE-nightMode',
		rel: 'stylesheet',
		href: 'css/themes/nightMode.css'
	}).appendTo('head');
}

	
///////////// From Insipnia ///////////////////////////////
// Custom scripts
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

		// Fixed Sidebar
		// unComment this only whe you have a fixed-sidebar
						//    $(window).bind("load", function() {
						//        if($("body").hasClass('fixed-sidebar')) {
						//            $('.sidebar-collapse').slimScroll({
						//                height: '100%',
						//                railOpacity: 0.9,
						//            });
						//        }
						//    })

		$(window).bind("load resize click scroll", function() {
				if(!$("body").hasClass('body-small')) {
						fix_height();
				}
		})

		$("[data-toggle=popover]").popover();
	}
});


// Minimalize menu when screen is less than 768px
$(function() {
	$(window).bind("load resize", function() {
			if ($(this).width() < 769) {
					$('body').addClass('body-small')
			} else {
					$('body').removeClass('body-small')
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
https://jsecoin.com/en/developers/overview'+"\n"+'\
																		 '+"\n"+'\
Found a bug?:                        '+"\n"+'\
https://jsecoin.com/en/oddJobs/bugBounty'+"\n"+'\
																		 '+"\n"+'\
#####################################'+"\n");


})

window.SmoothlyMenu = function() {
		if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
				// Hide menu in order to smoothly turn on when maximize menu
				$('#side-menu').hide();
				// For smoothly turn on menu
				setTimeout(
						function () {
								$('#side-menu').fadeIn(500);
						}, 100);
		} else if ($('body').hasClass('fixed-sidebar')){
				$('#side-menu').hide();
				setTimeout(
						function () {
								$('#side-menu').fadeIn(500);
						}, 300);
		} else {
				// Remove all inline style from jquery fadeIn function to reset menu state
				$('#side-menu').removeAttr('style');
		}
};



