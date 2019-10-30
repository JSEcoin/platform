const ioclient = window.JSEsocket;//require('socket.io-client'); // for peer client connections

const socketClient = ioclient.connect('https://load.jsecoin.com', {
 secure: true, reconnect: true, transports: ['websocket'], heartbeatTimeout: 1800000, maxHttpBufferSize: 1000000000,
}); // connects to host defined in server.js

// max blocksize is hardcoded to 1000 instead of jseSettings, can't see this changing
socketClient.getBlockRef = function(blockNumber) {
	let blockRef = Math.round((blockNumber - (1000/2)) / (1000));
	if (blockRef < 0) { blockRef = 0; }
	return blockRef;
};


global.currentChain = {}; // store blockChain
socketClient.on('newBlock', function(myBlockRef,myBlockID,myBlock) {
	console.log('newBlock Received: '+myBlockRef+' / '+myBlockID);
	if (typeof global.currentChain[myBlockRef] === 'undefined') global.currentChain[myBlockRef] = {};
	global.currentChain[myBlockRef][myBlockID] = myBlock;
});

socketClient.emit('getLatestBlocks');
socketClient.emit('subscribeToNewBlocks', null);

socketClient.getNodeChainData = function(key) {
  return new Promise((resolve) => {
  	socketClient.emit('getChainData', key, (returnObject) => {
			const keySplit = (key.slice(-1) === '/') ? key.slice(0, -1).split('/') : key.split('/');
			keySplit.shift();
			if (keySplit.length === 2) {
				console.log('Writing new chain data for received block: '+keySplit[1]);
				// Check if key exists before setting anything to it
				if (typeof global.currentChain[keySplit[0]] === 'undefined') global.currentChain[keySplit[0]] = {};
				global.currentChain[keySplit[0]][keySplit[1]] = returnObject;
			}
			resolve(returnObject);
		});
  });
};

socketClient.getChainData = async function(key,callback) {
	// from db.js with data > global.currentChain, and keySplit.shift() line added
	// key is a firebase style key i.e. 'siteIDs/145/mywebsitecom/s'
	const keySplit = (key.slice(-1) === '/') ? key.slice(0, -1).split('/') : key.split('/');
	keySplit.shift();
	//console.log('KEYSPLIT: '+JSON.stringify(keySplit));
	if (keySplit.length === 1) {
		if (global.currentChain[keySplit[0]]) {
			callback(global.currentChain[keySplit[0]]);
			return;
		}
	} else if (keySplit.length === 2) {
		if (global.currentChain[keySplit[0]] && global.currentChain[keySplit[0]][keySplit[1]]) { // double check the parents exist to avoid errors, throw a null back if any keys are undefined
			callback(global.currentChain[keySplit[0]][keySplit[1]]);
			return;
		}
	} else if (keySplit.length === 3) {
		if (global.currentChain[keySplit[0]] && global.currentChain[keySplit[0]][keySplit[1]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]]) {
			callback(global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]]);
			return;
		}
	} else if (keySplit.length === 4) {
		if (global.currentChain[keySplit[0]] && global.currentChain[keySplit[0]][keySplit[1]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]]) {
			callback(global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]]);
			return;
		}
	} else if (keySplit.length === 5) {
		if (global.currentChain[keySplit[0]] && global.currentChain[keySplit[0]][keySplit[1]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]]) {
			callback(global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]]);
			return;
		}
	} else if (keySplit.length === 6) { // keys have a maximuim of five levels, think the most we use is four so this gives a bit of room just in case
		if (global.currentChain[keySplit[0]] && global.currentChain[keySplit[0]][keySplit[1]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]] && global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]][keySplit[5]]) {
			callback(global.currentChain[keySplit[0]][keySplit[1]][keySplit[2]][keySplit[3]][keySplit[4]][keySplit[5]]);
			return;
		}
	} else {
		console.log('ERROR socketio.js 540: Maximum field length reached'); // should never hit this.
	}
	// data doesn't exist locally try looking it up on the server
	console.log('Going to fetch '+key+' from node as no data locally for '+key);
	const result = await socketClient.getNodeChainData(key);
	console.log('Got result from node: '+typeof result+' : '+JSON.stringify(result));
	callback(result);
};

export { socketClient as default };
