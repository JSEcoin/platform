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
            self.listener();
            self.setupFrame(config);
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
                t.onload = () => {};
        
                t.src = config.embed.atlasPath || `/atlas/index.html`;
                //inject
                s.insertBefore(t, s.childNodes[0]);
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
                }
            }, false);
        }

        return {
            config: {},
            init: init,
            setupFrame: setupFrame,
            updateConf: updateConf,
            action: action,
            destroy: destroy,
            listener: listener
        };
    })();
}