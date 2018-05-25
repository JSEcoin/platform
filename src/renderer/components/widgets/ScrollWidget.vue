<template>
	<div id="JSEA-appBody" class="vb" v-bar :class="{'noSubNav': noSubNav}">
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
	props: {
		/**
		 * Does page have a subnav - changes position of scroll bar
		 */
		noSubNav: {
			type: Boolean,
			default: false,
		},
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
	overflow:hidden;
	border-radius:0px 0px 4px 4px;
}

#JSEA-appBody.noSubNav  {
	top:35px;
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
/* xApp ScrollBar */
</style>
