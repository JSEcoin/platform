'use strict';

import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, protocol } from 'electron'; // eslint-disable-line
import { join, normalize } from 'path';
import { autoUpdater } from 'electron-updater';
import {
	createProtocol,
	installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';

//version
const appVersion = '0.5.9';//process.env.VUE_APP_VERSION;
console.log(process.env.VUE_APP_VERSION);

//test
app.disableHardwareAcceleration();

//enable background mining when app is minimised
app.commandLine.appendSwitch('disable-renderer-backgrounding');

//set app id to enable notifications to work.
app.setAppUserModelId('com.jsecoin.desktop');

const isDevelopment = process.env.NODE_ENV !== 'production';
/*
if (!isDevelopment) {
	global.__static = join(__dirname, '/static').replace(/\\/g, '\\\\'); // eslint-disable-line
}
*/


let mainWindow;

//https://github.com/electron/electron/blob/master/docs/api/protocol.md
//change file protocal to enables recaptcha capabilities
protocol.registerStandardSchemes(['app'], { secure: true });

/**
 * Initialise and create application Window
 */
function createWindow() {
	//setup app ico
	let iconPath = join(__static, 'app/icon.png');
	let iconTrayPath = join(__static, 'app/trayIco.png');
	switch (process.platform) {
		case 'win32':
			iconPath = join(__static, 'app/windows-icon.png');
			iconTrayPath = join(__static, 'app/windows-trayIco.png');
		break;
		case 'sunos':
			iconPath = join(__static, 'app/sunos-icon.png');
			iconTrayPath = join(__static, 'app/sunos-trayIco.png');
		break;
		case 'linux':
			iconPath = join(__static, 'app/linux-icon.png');
			iconTrayPath = join(__static, 'app/linux-trayIco.png');
		break;
		case 'freebsd':
			iconPath = join(__static, 'app/freebsd-icon.png');
			iconTrayPath = join(__static, 'app/freebsd-trayIco.png');
		break;
		case 'darwin':
			//iconPath = join(__static, 'app/mac-icon.png');
			iconPath = join(__static, 'app/mac-trayIco.png');
			iconTrayPath = join(__static, 'app/mac-trayIco.png');
			// Don't show the app in the doc
			app.dock.hide();
		break;
	}

	//generate nativeImg app icon
	const appIcon = nativeImage.createFromPath(iconPath);

	//Initial window options
	mainWindow = new BrowserWindow({
		height: 226,//216,//656,
		show: false,
		useContentSize: false,
		width: 309,//216,//510,
		transparent: true,
		frame: false,
		resizable: false,
		icon: appIcon,
		maximizable: false,
		webPreferences: {
			backgroundThrottling: false,
			nodeIntegrationInWorker: true,
		},
	});

	//clean display of page loader approach
	//prevent flicker and display of loader until DOM ready
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	//force debug window
	mainWindow.webContents.openDevTools();

	//Load App
	if ((isDevelopment) || (process.env.IS_TEST)) {
		// Load the url of the dev server if in development mode
		mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) {
			mainWindow.webContents.openDevTools();
		}
	} else {
		protocol.registerServiceWorkerSchemes(['app']);
		createProtocol('app');
		// Load the index.html when not in development
		mainWindow.loadURL('app://./index.html');
	}

	//add tray icon support
	const trayIcon = nativeImage.createFromPath(iconPath);
	let tray = '';
	if (process.platform === 'darwin') {
		tray = new Tray(iconTrayPath);
		tray.setPressedImage(iconTrayPath);
	} else {
		tray = new Tray(iconPath);
	}

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

const gotTheLock = app.requestSingleInstanceLock();

//found second instance close this as prior is now open
if (!gotTheLock) {
  app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
		}
	});

	//on ready initialise app
	app.on('ready', async () => {
		if ((isDevelopment) && (!process.env.IS_TEST)) {
			// Install Vue Devtools
			await installVueDevtools();
		}
		//fix splash white bg
		setTimeout(createWindow, 100);
		//autoUpdater.checkForUpdatesAndNotify();
	});
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

//quit app
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}
