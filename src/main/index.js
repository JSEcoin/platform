import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, protocol } from 'electron'; // eslint-disable-line
//import 'hazardous';
import { join, normalize } from 'path';
import { autoUpdater } from 'electron-updater';
//import { readFileSync } from 'fs';
//import crypto from 'crypto';

const appVersion = '0.5.5';

//test
app.disableHardwareAcceleration();

//app.commandLine.appendSwitch('inspect', '5858');
//app.commandLine.appendSwitch('ignore-certificate-errors');
//app.commandLine.appendSwitch('disable-web-security');
//enable background mining when app is minimised
app.commandLine.appendSwitch('disable-renderer-backgrounding');
//console.log(app.getAppPath());

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	//global.__static = join(__dirname, '/static');//.replace(/\\/g, '\\\\'); // eslint-disable-line
	global.__static = join(__dirname, '/static').replace(/\\/g, '\\\\'); // eslint-disable-line
}

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : 'jsecoin://index.html';//`file://${__dirname}/index.html`;//
//file:///C:/Users/xxx/AppData/Local/Programs/jse-…esources/app.asar/dist/electron/index.html#/login

/**
 * Initialise and create application Window
 */
function createWindow() {
	//setup app ico
	const iconPath = join(__static, 'android-chrome-192x192.png');
	const iconTrayPath = join(__static, 'favicon-16x16.png');
	const appIcon = nativeImage.createFromPath(iconPath);
	//..To review
	const iconName = process.platform === 'win32' ? 'windows-icon@2x.png' : 'iconTemplate.png';

	//Initial window options
	mainWindow = new BrowserWindow({
		height: 216,//656,
		show: false,
		useContentSize: false,
		width: 216,//510,
		transparent: true,
		frame: false,
		resizable: false,
		icon: appIcon,
		maximizable: false,
		webPreferences: {
			backgroundThrottling: false,
			nodeIntegrationInWorker: true,
			//If backgroundThrottling is disabled, the visibility state will remain visible even if the window is minimized, occluded, or hidden.
		},
	});

	//clean display of page loader approach
	//prevent flicker and display of loader until DOM ready
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	//force debug window
	//mainWindow.webContents.openDevTools();

	//Load App
	mainWindow.loadURL(winURL);

	//add tray icon support
	const trayIcon = nativeImage.createFromPath(iconPath);
	//trayIcon = trayIcon.resize({ width: 16, height: 16 });
	//const nimage = nativeImage.createFromPath(trayIcon);
	const tray = new Tray(iconPath);//appIcon iconPath

	mainWindow.on('show', () => {
		mainWindow.webContents.send('enableMiningChart'); //fix app freeze issue
		tray.setHighlightMode('always');
	});
	mainWindow.on('restore', () => {
		mainWindow.webContents.send('enableMiningChart'); //fix app freeze issue
		tray.setHighlightMode('always');
	});
	mainWindow.on('hide', () => {
		mainWindow.webContents.send('disableMiningChart'); //fix app freeze issue
		tray.setHighlightMode('never');
	});
	//easy targetable traymenu ref
	const arrayRef = [
		'title',
		'seperator_1',
		'startMining',
		'stopMining',
		'settings',
		'logout',
		'seperator_2',
		'hide',
		'show',
		'quit',
	];
	//tray menu arr structure
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Top Secret Control Panel',
			enabled: false,
			icon: iconTrayPath,
		},
		{ type: 'separator' },
		{
			label: 'Start Mining',
			enabled: false,
			visible: false,
			click: () => {
				mainWindow.webContents.send('miner', {
					action: 'start',
				});
			},
		},
		{
			label: 'Stop Mining',
			enabled: false,
			visible: false,
			click: () => {
				mainWindow.webContents.send('miner', {
					action: 'stop',
				});
			},
		},
		{
			label: 'Settings',
			enabled: false,
			click: () => {
				mainWindow.webContents.send('route', 'settings');
				//if in tray show
				if (!mainWindow.isVisible()) {
					mainWindow.show();
				}
			},
		},
		{
			label: 'Log Out',
			enabled: false,
			click: () => {
				mainWindow.webContents.send('logoutApp');
				//if in tray show
				if (!mainWindow.isVisible()) {
					mainWindow.show();
				}
			},
		},
		{ type: 'separator' },
		{
			label: 'Hide App',
			visible: true,
			/*click: () => {
				if (mainWindow.isVisible()) {
					mainWindow.hide();
				} else {
					mainWindow.show();
				}
			},*/
		},
		{
			label: 'Show App',
			visible: false,
		},
		{
			label: 'Quit JSECoin',
			click: () => {
				mainWindow.close();
				app.quit();
			},
		},
	]);

	contextMenu.items[arrayRef.indexOf('hide')].click = () => {
		mainWindow.hide();
		contextMenu.items[arrayRef.indexOf('hide')].visible = false;
		contextMenu.items[arrayRef.indexOf('show')].visible = true;
	};

	contextMenu.items[arrayRef.indexOf('show')].click = () => {
		mainWindow.show();
		contextMenu.items[arrayRef.indexOf('hide')].visible = true;
		contextMenu.items[arrayRef.indexOf('show')].visible = false;
	};

	//on tray icon click hide or show
	tray.on('click', () => {
		if (mainWindow.isVisible()) {
			mainWindow.hide();
			contextMenu.items[arrayRef.indexOf('hide')].visible = false;
			contextMenu.items[arrayRef.indexOf('show')].visible = true;
		} else {
			mainWindow.show();
			contextMenu.items[arrayRef.indexOf('hide')].visible = true;
			contextMenu.items[arrayRef.indexOf('show')].visible = false;
		}
	});

	//on close app hide it in tray
	ipcMain.on('hideApp', (event, arg) => {
		console.log('hide');
		mainWindow.hide();
		contextMenu.items[arrayRef.indexOf('hide')].visible = false;
		contextMenu.items[arrayRef.indexOf('show')].visible = true;
	});
	//on login update tray
	ipcMain.on('login', (event, arg) => {
		//
		//show start mining if both tray items are disabled
		if ((!contextMenu.items[arrayRef.indexOf('stopMining')].enabled) && (!contextMenu.items[arrayRef.indexOf('startMining')].enabled)){
			contextMenu.items[arrayRef.indexOf('startMining')].enabled = true;
			contextMenu.items[arrayRef.indexOf('startMining')].visible = true;
		}
		contextMenu.items[arrayRef.indexOf('settings')].enabled = true;
		contextMenu.items[arrayRef.indexOf('logout')].enabled = true;
	});
	//on logout update tray
	ipcMain.on('logout', (event, arg) => {
		//
		contextMenu.items[arrayRef.indexOf('settings')].enabled = false;
		contextMenu.items[arrayRef.indexOf('logout')].enabled = false;
		contextMenu.items[arrayRef.indexOf('startMining')].enabled = false;
		contextMenu.items[arrayRef.indexOf('startMining')].visible = false;
		contextMenu.items[arrayRef.indexOf('stopMining')].enabled = false;
		contextMenu.items[arrayRef.indexOf('stopMining')].visible = false;
	});
	//on mining start
	ipcMain.on('startedMining', (event, arg) => {
		//enable ability to stop mining
		contextMenu.items[arrayRef.indexOf('stopMining')].enabled = true;
		contextMenu.items[arrayRef.indexOf('stopMining')].visible = true;
		//hide and disable option as mining started
		contextMenu.items[arrayRef.indexOf('startMining')].enabled = false;
		contextMenu.items[arrayRef.indexOf('startMining')].visible = false;
	});
	//on mining stop
	ipcMain.on('stoppedMining', (event, arg) => {
		//enable ability to start mining
		contextMenu.items[arrayRef.indexOf('startMining')].enabled = true;
		contextMenu.items[arrayRef.indexOf('startMining')].visible = true;
		//hide and disable option as mining stopped
		contextMenu.items[arrayRef.indexOf('stopMining')].enabled = false;
		contextMenu.items[arrayRef.indexOf('stopMining')].visible = false;
	});
	//Retrieve app version and send
	ipcMain.on('getAppVersion', (event, arg) => {
		//event.sender.send('updateAppVersion', app.getVersion()); //returns electron ver not package.json ver???
		event.sender.send('updateAppVersion', appVersion);
	});
	//update progress bar display
	ipcMain.on('updateProgressBar', (event, val) => {
		mainWindow.setProgressBar(val);
	});
	//setup autoLaunch capabilities
	ipcMain.on('autoLaunch', (event, action) => {
		if (process.env.NODE_ENV !== 'development') {
			//setup autolauncher
			const AutoLaunch = require('auto-launch');

			//setup autolauncher
			const JSECoinAutoLauncher = new AutoLaunch({
				name: 'JSECoin',
				path: app.getPath('exe'),
			});
			if (action.start) {
				//JSECoinAutoLauncher.enable();
				JSECoinAutoLauncher.isEnabled().then((isEnabled) => {
					if (isEnabled){
						return;
					}
					JSECoinAutoLauncher.enable();
				}).catch((err) => {
					// handle error
					console.log(err);
				});
			} else {
				JSECoinAutoLauncher.disable();
			}
		}
	});
	//set tray icon tooltip
	tray.setToolTip('Right Click Icon for Options.');
	//add context menu options
	tray.setContextMenu(contextMenu);
	//before app quit store user session to enable autologin

	//mainWindow.hide();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

//check if second instance is running.. and show focus current app if active
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
	// Someone tried to run a second instance, we should focus our window.
	if (mainWindow) {
		//if minimised restore
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		//if in tray show
		if (!mainWindow.isVisible()) {
			mainWindow.show();
		}
		//focus on app
		mainWindow.focus();
	}
});

//found second instance close this as prior is now open
if (isSecondInstance) {
  app.quit();
}
function sendStatusToWindow(text) {
	//log.info(text);
	mainWindow.webContents.send('message', text);
}
autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
	sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
	sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
	sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
	let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
	logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
	logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
	sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
	sendStatusToWindow('Update downloaded');
});

//https://github.com/electron/electron/blob/master/docs/api/protocol.md
//change file protocal to enables recaptcha capabilities
protocol.registerStandardSchemes(['jsecoin'], { secure: true });

//on ready initialise app
app.on('ready', () => {
	protocol.registerFileProtocol('jsecoin', (request, callback) => {
		//strip jsecoin://
		let url = request.url.substr(10);
		//strip index only needed onload.
		if (!url.endsWith('index.html/')) {
			url = url.replace(/index.html\//, '');
		}
		callback({
			path: normalize(`${__dirname}/${url}`),
		});
	}, (error) => {
		if (error) console.error('Failed to register protocol');
	});
	createWindow();
	//autoUpdater.checkForUpdatesAndNotify();
});

//quit app
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//create app
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
