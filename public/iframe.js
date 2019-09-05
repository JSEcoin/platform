if (typeof(JSE) !== 'undefined') {
    console.error('Duplicate JSE Class found!');
} else {
    var JSE = (function() {
        /**
         * init
         * Initialises generates iframe embedded chatbot container.
         * 
         * @param {*} config //core config
         */
        var init = function(config) {
            var self = this;
            self.config = config;
            self.listener();
            //self.setupFrame(config);
            self.createButton(config);
            self.events();
        };
        /**
         * setupFrame
         * Generates and injects an iframe to embed the chatbot UI
         * 
         * @param {*} config 
         * @param {*} config.domPath //location to inject chatbot iframe
         * @param {*} config.atlasPath //location of atlas index path '/atlas/?theme=xxx'
         * @param {*} config.chatBotType // class name to add to iframe
         */
        var setupFrame = function(config) {
            var config = config || {};
            var self = this;
            self.config = config;
            if (document.getElementById('FB-atlasFrame') === null) {
                var t = document.createElement('iframe');
                var domPath = config.embed.domPath || 'body';
                var s = document.querySelector(domPath);
                t.id = 'FB-atlasFrame';
                t.frameBorder = '0';
                t.className= config.embed.chatBotType || '';
        
                //on script load initialise bot
                //t.onload = () => {};
        
                t.src = config.embed.atlasPath || `/atlas/index.html`;
                //inject
                s.insertBefore(t, s.childNodes[0]);
                setTimeout(self.resize, 100);
            }
        };
        /**
         * updateConf
         * 
         */
        var updateConf = function() {
    
        };
        /**
         * action
         * post message to iframe
         * 
         */
        var action = function(msg) {
            //var msg = JSON.stringify( {'user': user, 'email': email} );
            document.getElementById('FB-atlasFrame').contentWindow.postMessage(msg, '*');
        };
        /**
         * destroy
         * destroys iframe
         * 
         */
        var destroy = function() {
            var ele = document.getElementById('FB-atlasFrame').
            ele.parentNode.removeChild(ele);
        };
        
        var listener = function() {
            var self = this;
            window.addEventListener('message', function(e) {
                console.log('recieved msg', e);
                if (e.data.source === 'atlas') {
                    if (e.data.ready) {
                        self.config.source = 'updateAtlas';
                        self.config.init = true;
                        action(self.config);
                    }
                    if (typeof (e.data.showChatInterface) !== 'undefined') {
                        if (e.data.showChatInterface) {
                            document.getElementById('FB-CB').classList.remove('active');
                            document.getElementById('FB-atlasFrame').classList.remove('hide');
                        } else {
                            document.getElementById('FB-CB').classList.add('active');
                            document.getElementById('FB-atlasFrame').classList.add('hide');
                        }
                    }
                }
            }, false);
        }

        var createButton = function(config) {
            if (document.getElementById('FB-CB') === null) {
                var t = document.createElement('div');
                var domPath = config.embed.domPath || 'body';
                var s = document.querySelector(domPath);
                t.id = 'FB-CB';
                //t.className= 'active';//config.embed.chatBotType || '';
                //inject
                s.insertBefore(t, s.childNodes[0]);
            }
            
            setTimeout(function() {
                document.getElementById('FB-CB').classList.add('active');
            }, 3000);
        }

        var events = function(config) {
            const self = this;
            document.getElementById('FB-CB').addEventListener('click', function() {
                if (document.getElementById('FB-atlasFrame') === null) {
                    self.setupFrame(self.config);
                } else {
                    self.action({
                        source: 'updateAtlas',
                        commit: 'updateAppState',
                        key: 'showChatInterface',
                        val: true
                    });
                    document.getElementById('FB-atlasFrame').classList.remove('hide');
                }
                document.getElementById('FB-CB').classList.remove('active');
            });
            
            window.addEventListener('resize', function() {
                self.resize();
            });
        }

        
        var resizeTimer = null;
        var resize = function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                var iframe = document.getElementById('FB-atlasFrame');
                if (iframe !== null) {
                    //if (window.innerHeight < iframe.contentWindow.innerHeight) {
                        iframe.style.height = ((window.innerHeight - 60) + 'px');
                    //} else {
                    //    iframe.style.height = ((window.innerHeight - 60) + 'px');
                    //}
                }
            }, 250);
        }

        return {
            config: {},
            init: init,
            createButton: createButton,
            setupFrame: setupFrame,
            updateConf: updateConf,
            action: action,
            destroy: destroy,
            listener: listener,
            events: events,
            resize: resize
        };
    })();
}

JSE.init({
    embed: {
        domPath: 'body',
        atlasPath: '/atlas/',
        chatBotType: 'floatingButton',
    },
    config: {
        app: {
            debug: false,
            smoochAppID: '5bfc0dbdc8375600221023e1',
            theme: 'theme2',
            themeSize: 'med',
            initLander: 'Chat',
            appScreenType: 'atlasModel',
            exitAction: 'hide',
            hideButtonOnInterface: true,
            forceHideButton: true,
            fullScreen: true,
        },
        bot: {
            botName: 'I\'m Block - JSEcoins Virtual Assistant',
            botDescription: 'How can I help you today?',
            botIco: '/atlas/static/styleguide/atlas.svg',
        },
        tpl: {
            headerLogoPath: '',
            headerColor: '#222F3D', 
            showHeader: true,
            showSubHeader: false,
            actionsLocation: 'chat',
            userInfoDisplay: 'inline',
            appBackground: '#fff',
            enableAgentSwap: false,
            enableDownloadLog: false,
            enablePrint: false,
            enableNotification: false,
            enableDateDivide: false
        },
		conversation: {
			initBotMsg: ''
		}
    }
});

