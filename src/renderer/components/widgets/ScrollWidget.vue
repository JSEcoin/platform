<template>
	<div id="JSEA-appBody" :class="{'vb':hasVirtualBar, 'no-vb':!hasVirtualBar, 'isChrome':isChrome, 'noSubNav': noSubNav, 'noNav': noNav}">
		<div>
			<!-- @slot Content to scroll -->
			<slot/>
		</div>
	</div>
</template>

<script>
/**
 * @description
 * Scroll bar wrapper widget
 */
export default {
	name: 'ScrollWidget',
	data() {
		return {
			hasVirtualBar: false,
			isChrome: false,
		};
	},
	props: {
		/**
		 * Does page have a subnav - changes position of scroll bar
		 */
		noSubNav: {
			type: Boolean,
			default: false,
		},
		/**
		 * Does page have a nav - changes position of scroll bar
		 */
		noNav: {
			type: Boolean,
			default: false,
		},
	},
	mounted() {
		const self = this;
		const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		if ((!isChrome) && (self.$store.getters.whichPlatform === 'web')) {
			self.isChrome = false;
			self.hasVirtualBar = true;
			self.$vuebar.initScrollbar(self.$el, {});
		} else {
			self.isChrome = true;
		}
	},
};
</script>

<!-- scoped not working with hypenated cssnames -->
<style>
.platformWeb.mobile #JSEA-desktop #JSEA-appBody {
	position:relative !important;
	top:0px;
}
#JSEA-appBody {
	top:73px;
	bottom:0px;
	left:0px;
	right:0px;
	border-radius:0px 0px 4px 4px;
	position: absolute !important;
	overflow:auto;
}
#JSEA-appBody.noNav  {
	top:0px;
}

#JSEA-appBody.noSubNav  {
	top:35px;
}

#JSEA-appBody.vb {
	overflow:hidden;
}

#JSEA-appBody.vb .vb-dragger {
    z-index: 100000;
    width: 12px;
    right: 0;
}

#JSEA-appBody.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    background-color: rgba(27,179,148,.5);
    /*margin: 5px 5px 5px 0;
    border-radius: 20px;*/
    height: 100%;/*calc(100% - 10px);*/
    display: block;
}

#JSEA-appBody.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(27,179,148,.3);
}

#JSEA-appBody.vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(27,179,148,.8);
    margin: 0px;
    height: 100%;
}

#JSEA-appBody.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: #1BB394;
    margin: 0px;
    height: 100%;
}

#JSEA-appBody.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: #1BB394;
}

/* Scrollbar */
.isChrome::-webkit-scrollbar {
	width: 10px;
	height: 10px;
}

.isChrome::-webkit-scrollbar-track-piece {
	background: transparent;
}
.isChrome::-webkit-scrollbar-track:hover {
	background: rgba(79,111,127,0.1);
}

.isChrome::-webkit-scrollbar-thumb {
	background-color: #b4c7d0;
	border: 3px solid transparent;
	background-clip: padding-box;
	border-radius: 5px;
}

.isChrome::-webkit-scrollbar-thumb {
	background-color: #3a5169;
}

.isChrome::-webkit-scrollbar-thumb:hover {
	background-color: #5b7f92;
}

/* xApp ScrollBar */
</style>
