<template>
	<AppWrapperWidget>
		<NavWidget activeNav="blockchainLatest"></NavWidget>
		<ScrollWidget v-bind="{noSubNav:true}">
      <div id="app" v-cloak>

          <!-- fixed header
          <header class="header-wrap">
              <div class="header-row flex-row flex-middle flex-space">
                  <div class="if-small">
                      <div class="form-input dark">
                          <div class="push-right">🔎</div>
                          <input type="text" v-model="search" placeholder="Search token..." />
                      </div>
                  </div>
                  <div class="text-primary if-medium">
                      <h1 class="text-nowrap text-condense shadow-text">Crypto 24h Change</h1>
                  </div>
                  <div class="flex-row flex-middle">
                  <div class="dropdown">
                      <div class="form-input text-nowrap shadow-box">▼ {{ limit }}</div>
                      <ul>
                          <li @click="setLimit( 0 )"><span class="text-faded">Show:</span> All</li>
                          <li @click="setLimit( 10 )"><span class="text-faded">Show:</span> 10</li>
                          <li @click="setLimit( 20 )"><span class="text-faded">Show:</span> 20</li>
                          <li @click="setLimit( 50 )"><span class="text-faded">Show:</span> 50</li>
                          <li @click="setLimit( 100 )"><span class="text-faded">Show:</span> 100</li>
                      </ul>
                  </div>
                  <div class="dropdown">
                      <div class="form-input text-nowrap shadow-box">▼ {{ sortLabel }}</div>
                      <ul>
                          <li @click="sortBy( 'token', 'asc' )"><span class="text-faded">Sort:</span> Token</li>
                          <li @click="sortBy( 'close', 'desc' )"><span class="text-faded">Sort:</span> Price</li>
                          <li @click="sortBy( 'assetVolume', 'desc' )"><span class="text-faded">Sort:</span> Volume</li>
                          <li @click="sortBy( 'percent', 'desc' )"><span class="text-faded">Sort:</span> Percent</li>
                          <li @click="sortBy( 'change', 'desc' )"><span class="text-faded">Sort:</span> Change</li>
                          <li @click="sortBy( 'trades', 'desc' )"><span class="text-faded">Sort:</span> Trades</li>
                      </ul>
                  </div>
                  <div class="dropdown">
                      <div class="form-input text-nowrap shadow-box">▼ {{ asset }}</div>
                          <ul>
                              <li @click="filterAsset( 'BTC' )"><span class="text-faded">Asset:</span> BTC</li>
                              <li @click="filterAsset( 'ETH' )"><span class="text-faded">Asset:</span> ETH</li>
                              <li @click="filterAsset( 'BNB' )"><span class="text-faded">Asset:</span> BNB</li>
                              <li @click="filterAsset( 'USDT' )"><span class="text-faded">Asset:</span> USDT</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </header>-->

          <!-- price list grid -->
          <main class="main-wrap">
              <div class="main-grid-list">
                  <div class="main-grid-item" v-for="c in coinsList" :key="c.symbol" :class="c.style">
                      <div class="main-grid-info flex-row flex-top flex-stretch">
                          <div class="push-right">
                              <img :src="c.icon" :alt="c.pair" />
                          </div>
                          <div class="flex-1 shadow-text">
                              <div class="flex-row flex-top flex-space">
                                  <div class="text-left text-clip push-right">
                                  <h1 class="text-primary text-clip">{{ c.token }}<small class="text-faded text-small text-condense">/{{ c.asset }}</small></h1>
                                  <h2 class="text-bright text-clip">{{ c.close | toFixed( asset ) }}</h2>
                                  </div>
                                  <div class="text-right">
                                  <div class="color text-big text-clip">{{ c.arrow }} {{ c.sign }}{{ c.percent | toFixed( 2 ) }}%</div>
                                  <div class="text-clip">{{ c.sign }}{{ c.change | toFixed( asset ) }} <small class="text-faded">24h</small></div>
                                  <div class="text-clip">{{ c.assetVolume | toMoney }} <small class="text-faded">Vol</small></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="main-grid-chart">
                          <linechart :width="600" :height="40" :values="c.history"></linechart>
                      </div>
                  </div>
              </div>
          </main>

          <!-- socket loader -->
          <div class="loader-wrap" :class="{ 'visible': loaderVisible }">
              <div class="loader-content">
                  <div v-if="status === 0"><i>📡</i> <br /> Connecting to Socket API ...</div>
                  <div v-else-if="status === 1"><i>💬</i> <br /> Waiting for data from Socket API ...</div>
                  <div v-else-if="status === 2"><i>😃</i> <br /> Connected to the Socket API</div>
                  <div v-else-if="status === -1"><i>😡</i> <br /> Error connecting to the Socket API</div>
              </div>
          </div>

      </div>
		</ScrollWidget>
	</AppWrapperWidget>
</template>

<script>
import Vue from 'vue';
import AppWrapperWidget from '@/components/widgets/AppWrapperWidget.vue';
import ContentWidget from '@/components/widgets/ContentWidget.vue';
import NavWidget from '@/components/widgets/NavWidget.vue';
import ScrollWidget from '@/components/widgets/ScrollWidget.vue';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';

// common number filters
Vue.filter('toFixed', (num, asset) => {
  if (typeof asset === 'number') return Number(num).toFixed(asset);
  return Number(num).toFixed(asset === 'USDT' ? 3 : 8);
});
Vue.filter('toMoney', num => Number(num)
    .toFixed(0)
    .replace(/./g, (c, i, a) => (i && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c)));

// component for creating line chart
Vue.component('linechart', {
  props: {
    width: { type: Number, default: 400, required: true },
    height: { type: Number, default: 40, required: true },
    values: { type: Array, default: [], required: true },
  },
  data() {
    return { cx: 0, cy: 0 };
  },
  computed: {
    viewBox() {
      return '0 0 ' + this.width + ' ' + this.height;
    },
    chartPoints() {
      const data = this.getPoints();
      const last = data.length ? data[data.length - 1] : { x: 0, y: 0 };
      const list = data.map(d => d.x - 10 + ',' + d.y);
      this.cx = last.x - 5;
      this.cy = last.y;
      return list.join(' ');
    },
  },
  methods: {
    getPoints() {
      this.width = parseFloat(this.width) || 0;
      this.height = parseFloat(this.height) || 0;
      const min = this.values.reduce(
        (min, val) => (val < min ? val : min),
        this.values[0],
      );
      const max = this.values.reduce(
        (max, val) => (val > max ? val : max),
        this.values[0],
      );
      const len = this.values.length;
      const half = this.height / 2;
      const range = max > min ? max - min : this.height;
      const gap = len > 1 ? this.width / (len - 1) : 1;
      const points = [];

      for (let i = 0; i < len; ++i) {
        const d = this.values[i];
        const val = 2 * ((d - min) / range - 0.5);
        const x = i * gap;
        const y = -val * half * 0.8 + half;
        points.push({ x, y });
      }
      return points;
    },
  },
  template: `
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
    <polyline class="color" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" :points="chartPoints" />
    <circle class="color" :cx="cx" :cy="cy" r="4" fill="#fff" stroke="none" />
  </svg>`,
});

/**
 * @description
 * <p>crypto wall</p>
 */
export default {
  name: 'Crypto',
	components: {
		AppWrapperWidget,
		ContentWidget,
		ScrollWidget,
		NavWidget,
		ButtonWidget,
	},
	data() {
		return {
      endpoint: 'wss://stream.binance.com:9443/ws/!ticker@arr',
      iconbase:
        'https://raw.githubusercontent.com/rainner/binance-watch/master/public/images/icons/',
      cache: {}, // coins data cache
      coins: [], // live coin list from api
      asset: 'BTC', // filter by base asset pair
      search: '', // filter by search string
      sort: 'assetVolume', // sort by param
      order: 'desc', // sort order ( asc, desc )
      limit: 50, // limit list
      status: 0, // socket status ( 0: closed, 1: open, 2: active, -1: error )
      sock: null, // socket inst
      cx: 0,
      cy: 0,
    };
  },

  // computed methods
  computed: {
    // process coins list
    coinsList() {
      let list = this.coins.slice();
      const search = this.search
        .replace(/[^\s\w\-\.]+/g, '')
        .replace(/[\r\s\t\n]+/g, ' ')
        .trim();

      if (this.asset) {
        list = list.filter(i => i.asset === this.asset);
      }
      if (search && search.length > 1) {
        const reg = new RegExp('^(' + search + ')', 'i');
        list = list.filter(i => reg.test(i.token));
      }
      if (this.sort) {
        list = this.sortList(list, this.sort, this.order);
      }
      if (this.limit) {
        list = list.slice(0, this.limit);
      }
      return list;
    },

    // show socket connection loader
    loaderVisible() {
      return this.status !== 2;
    },

    // sort-by label for buttons, etc
    sortLabel() {
      switch (this.sort) {
        case 'token':
          return 'Token';
        case 'percent':
          return 'Percent';
        case 'close':
          return 'Price';
        case 'change':
          return 'Change';
        case 'assetVolume':
          return 'Volume';
        case 'tokenVolume':
          return 'Volume';
        case 'trades':
          return 'Trades';
        default:
          return 'Default';
      }
    },
  },

  // custom methods
  methods: {
    // apply sorting and toggle order
    sortBy(key, order) {
      if (this.sort !== key) {
        this.order = order || 'asc';
      } else {
        this.order = this.order === 'asc' ? 'desc' : 'asc';
      }
      this.sort = key;
    },

    // filter by asset
    filterAsset(asset) {
      this.asset = String(asset || 'BTC');
    },

    // set list limit
    setLimit(limit) {
      this.limit = parseInt(limit) || 0;
    },

    // on socket connected
    onSockOpen(e) {
      this.status = 1; // open
      console.info(
        'WebSocketInfo:',
        'Connection open (' + this.endpoint + ').',
      );
    },

    // on socket closed
    onSockClose(e) {
      this.status = 0; // closed
      console.info(
        'WebSocketInfo:',
        'Connection closed (' + this.endpoint + ').',
      );
      setTimeout(this.sockInit, 10000); // try again
    },

    // on socket error
    onSockError(err) {
      this.status = -1; // error
      console.error('WebSocketError:', err.message || err);
      setTimeout(this.sockInit, 10000); // try again
    },

    // process data from socket
    onSockData(e) {
      const list = JSON.parse(e.data) || [];

      for (const item of list) {
        // cleanup data for each coin
        const c = this.getCoinData(item);
        // keep to up 100 previous close prices in hostiry for each coin
        c.history = this.cache.hasOwnProperty(c.symbol)
          ? this.cache[c.symbol].history
          : this.fakeHistory(c.close);
        if (c.history.length > 100) c.history = c.history.slice(c.history.length - 100);
        c.history.push(c.close);
        // add coin data to cache
        this.cache[c.symbol] = c;
      }
      // convert cache object to final prices list for each symbol
      this.coins = Object.keys(this.cache).map(s => this.cache[s]);
      this.status = 2; // active
    },

    // start socket connection
    sockInit() {
      if (this.status > 0) return;
      try {
        this.status = 0; // closed
        this.sock = new WebSocket(this.endpoint);
        this.sock.addEventListener('open', this.onSockOpen);
        this.sock.addEventListener('close', this.onSockClose);
        this.sock.addEventListener('error', this.onSockError);
        this.sock.addEventListener('message', this.onSockData);
      } catch (err) {
        console.error('WebSocketError:', err.message || err);
        this.status = -1; // error
        this.sock = null;
      }
    },

    // start socket connection
    sockClose() {
      if (this.sock) {
        this.sock.close();
      }
    },

    // come up with some fake history prices to fill in the initial line chart
    fakeHistory(close) {
      const num = close * 0.0001; // faction of current price
      const min = -Math.abs(num);
      const max = Math.abs(num);
      const out = [];

      for (let i = 0; i < 50; ++i) {
        const rand = Math.random() * (max - min) + min;
        out.push(close + rand);
      }
      return out;
    },

    // finalize data for each coin from socket
    getCoinData(item) {
      const reg = /^([A-Z]+)(BTC|ETH|BNB|USDT|TUSD)$/;
      const symbol = String(item.s)
        .replace(/[^\w\-]+/g, '')
        .toUpperCase();
      const token = symbol.replace(reg, '$1');
      const asset = symbol.replace(reg, '$2');
      const name = token;
      const pair = token + '/' + asset;
      const icon = this.iconbase + token.toLowerCase() + '_.png';
      const open = parseFloat(item.o);
      const high = parseFloat(item.h);
      const low = parseFloat(item.l);
      const close = parseFloat(item.c);
      const change = parseFloat(item.p);
      const percent = parseFloat(item.P);
      const trades = parseInt(item.n);
      const tokenVolume = Math.round(item.v);
      const assetVolume = Math.round(item.q);
      const sign = percent >= 0 ? '+' : '';
      const arrow = percent >= 0 ? '▲' : '▼';
      const info = [
        pair,
        close.toFixed(8),
        '(',
        arrow,
        sign + percent.toFixed(2) + '%',
        '|',
        sign + change.toFixed(8),
        ')',
      ].join(' ');
      let style = '';

      if (percent > 0) style = 'gain';
      if (percent < 0) style = 'loss';

      return {
        symbol,
        token,
        asset,
        name,
        pair,
        icon,
        open,
        high,
        low,
        close,
        change,
        percent,
        trades,
        tokenVolume,
        assetVolume,
        sign,
        arrow,
        style,
        info,
      };
    },

    // sort an array by key and order
    sortList(list, key, order) {
      return list.sort((a, b) => {
        let _a = a[key];
        let _b = b[key];

        if (_a && _b) {
          _a = typeof _a === 'string' ? _a.toUpperCase() : _a;
          _b = typeof _b === 'string' ? _b.toUpperCase() : _b;

          if (order === 'asc') {
            if (_a < _b) return -1;
            if (_a > _b) return 1;
          }
          if (order === 'desc') {
            if (_a > _b) return -1;
            if (_a < _b) return 1;
          }
        }
        return 0;
      });
    },
  },

  // app mounted
  mounted() {
    this.sockInit();
  },

  // app destroyed
  destroyed() {
    this.sockClose();
  },
};
</script>

<style scoped>
*, *:before, *:after {
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background-color: transparent;
  text-transform: none;
  text-shadow: none;
  box-shadow: none;
  box-sizing: border-box;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-transform-style: flat;
          transform-style: flat;
  transition: border-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), background-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transition: border-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), background-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transition: border-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), background-color 300ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1), -webkit-transform 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

article, aside, details, figcaption, figure, footer, header, hgroup,
menu, nav, section, main, summary, div, h1, h2, h3, h4, h5, h6, hr,
p, ol, ul, form, img {
  display: block;
}

html, body {
  display: block;
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
}

html {
  overflow: hidden;
  overflow-y: scroll;
}

body {
  font-family: monospace;
  font-weight: 600;
  font-size: calc( 15px - 6px );
  line-height: 1.2em;
  background-color: #0c0d0f;
  color: #8d8d8d;
}
@media only screen and (min-width: 420px) {
  body {
    font-size: calc( 15px - 4px );
  }
}
@media only screen and (min-width: 720px) {
  body {
    font-size: calc( 15px - 2px );
  }
}
@media only screen and (min-width: 1200px) {
  body {
    font-size: 15px;
  }
}

h1, h2, h3, h4, h5, h6 {
  display: block;
  font-weight: inherit;
  line-height: 1.2em;
}

hr {
  display: block;
  overflow: hidden;
  margin: 1em 0;
  height: 0;
  border: 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}

input, button, select, option, textarea {
  display: block;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}

.if-small {
  display: none;
}
@media only screen and (min-width: 420px) {
  .if-small {
    display: initial;
  }
}

.if-medium {
  display: none;
}
@media only screen and (min-width: 720px) {
  .if-medium {
    display: initial;
  }
}

.if-large {
  display: none;
}
@media only screen and (min-width: 1200px) {
  .if-large {
    display: initial;
  }
}

.hidden, [hidden], [v-cloak] {
  display: none;
}

.disabled, [disabled] {
  pointer-events: none;
  opacity: 0.5;
}

.card {
  padding: 1em;
  background-color: #1e2126;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.push-top {
  margin-top: 1em;
}

.push-right {
  margin-right: 1em;
}

.push-bottom {
  margin-bottom: 1em;
}

.push-left {
  margin-left: 1em;
}

.push-all {
  margin: 1em;
}

.pad-top {
  padding-top: 1em;
}

.pad-right {
  padding-right: 1em;
}

.pad-bottom {
  padding-bottom: 1em;
}

.pad-left {
  padding-left: 1em;
}

.pad-all {
  padding: 1em;
}

.border-top {
  border-top: 2px solid rgba(255, 255, 255, 0.04);
}

.border-right {
  border-right: 2px solid rgba(255, 255, 255, 0.04);
}

.border-bottom {
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}

.border-left {
  border-left: 2px solid rgba(255, 255, 255, 0.04);
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-left {
  justify-content: flex-start;
}

.flex-center {
  justify-content: center;
}

.flex-right {
  justify-content: flex-end;
}

.flex-space {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.flex-top {
  align-items: flex-start;
}

.flex-middle {
  align-items: center;
}

.flex-bottom {
  align-items: flex-end;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.flex-3 {
  flex: 3;
}

.flex-4 {
  flex: 4;
}

.flex-5 {
  flex: 5;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.text-justify {
  text-align: justify;
}

.text-uppercase {
  text-transform: uppercase;
}

.text-lowercase {
  text-transform: lowercase;
}

.text-capitalize {
  text-transform: capitalize;
}

.text-underline {
  text-decoration: underline;
}

.text-striked {
  text-decoration: line-through;
}

.text-italic {
  font-style: italic;
}

.text-bold {
  font-weight: bold;
}

.text-nowrap {
  white-space: nowrap;
}

.text-clip {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.text-primary {
  color: orange;
}

.text-secondary {
  color: #20acea;
}

.text-grey {
  color: #5c6776;
}

.text-bright {
  color: #f0f0f0;
}

.text-faded {
  color: white;
  opacity: 0.3;
}

.text-big {
  font-size: 120%;
  line-height: 1.212em;
}

.text-small {
  font-size: 70%;
  line-height: 1.14em;
}

.text-condense {
  letter-spacing: -1px;
}

.shadow-box {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.shadow-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-input {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0.7em 1em;
  color: #f0f0f0;
  background-color: #393e48;
  border-radius: 100px;
}
.form-input.dark {
  background-color: black;
}
.form-input > input {
  width: auto;
}

@-webkit-keyframes dropdownShow {
  0% {
    -webkit-transform: translateY(30px);
            transform: translateY(30px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}

@keyframes dropdownShow {
  0% {
    -webkit-transform: translateY(30px);
            transform: translateY(30px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    opacity: 1;
  }
}
.dropdown {
  display: block;
  position: relative;
  cursor: pointer;
}
.dropdown > ul {
  display: none;
  list-style: none;
  position: absolute;
  transition: none;
  -webkit-animation: dropdownShow 300ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
          animation: dropdownShow 300ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  right: 0;
  top: 50%;
  min-width: 200px;
  max-width: 400px;
  padding: 0.5em 0;
  background-color: #272a31;
  border-radius: 3px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
}
.dropdown > ul > li {
  display: block;
  padding: 0.5em 1em;
  background-color: rgba(0, 0, 0, 0);
  color: #f0f0f0;
  cursor: pointer;
}
.dropdown > ul > li + li {
  border-top: 2px solid rgba(255, 255, 255, 0.04);
}
.dropdown > ul > li:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.dropdown:hover > ul, .dropdown:active > ul {
  display: block;
}

.header-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #1e2126;
  background-image: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.header-wrap .header-row {
  height: 4em;
  padding: 1em;
}
.header-wrap .header-row .dropdown {
  margin-left: .4em;
}

.main-wrap {
  position: relative;
  padding: calc( 4em + 1em ) 1em 1em 1em;
}
.main-wrap .main-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1em;
}
@media only screen and (min-width: 420px) {
  .main-wrap .main-grid-list {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
}
.main-wrap .main-grid-list .main-grid-item {
  background-color: #1e2126;
  background-image: linear-gradient(65deg, rgba(255, 255, 255, 0.02) 40%, transparent 40%);
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.main-wrap .main-grid-list .main-grid-item.gain {
  background-color: #222a22;
}
.main-wrap .main-grid-list .main-grid-item.gain polyline.color {
  stroke: limegreen;
}
.main-wrap .main-grid-list .main-grid-item.gain circle.color {
  fill: limegreen;
}
.main-wrap .main-grid-list .main-grid-item.gain .color {
  color: limegreen;
}
.main-wrap .main-grid-list .main-grid-item.loss {
  background-color: #331a1f;
}
.main-wrap .main-grid-list .main-grid-item.loss polyline.color {
  stroke: crimson;
}
.main-wrap .main-grid-list .main-grid-item.loss circle.color {
  fill: crimson;
}
.main-wrap .main-grid-list .main-grid-item.loss .color {
  color: crimson;
}
.main-wrap .main-grid-list .main-grid-item .main-grid-info {
  padding: 1em;
}
.main-wrap .main-grid-list .main-grid-item .main-grid-info img {
  width: auto;
  height: 42px;
}
@media only screen and (min-width: 420px) {
  .main-wrap .main-grid-list .main-grid-item .main-grid-info img {
    height: 52px;
  }
}
@media only screen and (min-width: 720px) {
  .main-wrap .main-grid-list .main-grid-item .main-grid-info img {
    height: 64px;
  }
}
.main-wrap .main-grid-list .main-grid-item .main-grid-chart {
  padding: 1em;
  background-image: radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 60%);
}

.loader-wrap {
  display: none;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
  z-index: 9999;
}
.loader-wrap.visible {
  display: flex;
}
.loader-wrap .loader-content {
  padding: 1em 2em;
  background-color: #1e2126;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.loader-wrap .loader-content i {
  font-style: normal;
  font-size: 600%;
  line-height: normal;
}

</style>
