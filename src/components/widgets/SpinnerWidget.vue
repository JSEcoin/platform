<template>
	<div class="Spinners">
		<span class="Spinner Spinner--pulse"></span>
	</div>	
</template>

<script>
/**
 * @description
 * Spinner Widget - animated loading display
 */
export default {
	name: 'SpinnerWidget',
};
</script>

<style scoped>

.Spinners {
	display:none;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
          flex-flow: row wrap;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
}
.Spinners.active {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.Spinners .Spinner {
  margin: 2.75rem;
}




/* spinner globals */
.Spinner {
  position: relative;
  display: block;
  font-size: 10px;
  width: 4em;
  height: 4em;
}
.Spinner::before, .Spinner::after {
  position: absolute;
  display: block;
  content: "";
}

/* disc */
.Spinner--disc {
  background-color: #2196F3;
  border-radius: 50%;
  -webkit-transform-origin: 50% 50%;
          transform-origin: 50% 50%;
  -webkit-animation: disc 1200ms cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
          animation: disc 1200ms cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
}
.Spinner--disc::before {
  top: 0.4em;
  left: 1.6em;
  width: 0.8em;
  height: 0.8em;
  background-color: #fff;
  border-radius: 50%;
}

@-webkit-keyframes disc {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotate(0);
            transform: translate3d(0, 0, 0) rotate(0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0) rotate(360deg);
            transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes disc {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotate(0);
            transform: translate3d(0, 0, 0) rotate(0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0) rotate(360deg);
            transform: translate3d(0, 0, 0) rotate(360deg);
  }
}
/* radar */
.Spinner--radar {
  -webkit-animation: radar 1200ms cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
          animation: radar 1200ms cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
}
.Spinner--radar::before {
  width: 100%;
  height: 100%;
  border-style: solid;
  border-width: 0.6em;
  border-color: #CFD8DC transparent;
  border-radius: 50%;
}
.Spinner--radar::after {
  top: 1.2em;
  left: 1.2em;
  width: 1.6em;
  height: 1.6em;
  background-color: #2196F3;
  border-radius: 50%;
}

@-webkit-keyframes radar {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotate(0);
            transform: translate3d(0, 0, 0) rotate(0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0) rotate(360deg);
            transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes radar {
  0% {
    -webkit-transform: translate3d(0, 0, 0) rotate(0);
            transform: translate3d(0, 0, 0) rotate(0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0) rotate(360deg);
            transform: translate3d(0, 0, 0) rotate(360deg);
  }
}
/* path */
.Spinner--path::before, .Spinner--path::after {
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  -webkit-animation-duration: 900ms;
          animation-duration: 900ms;
  -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
}
.Spinner--path::before {
  background-color: #2196F3;
  -webkit-transform: translate3d(0, 1.2em, 0);
          transform: translate3d(0, 1.2em, 0);
  -webkit-animation-name: pathRightUpAndBack;
          animation-name: pathRightUpAndBack;
}
.Spinner--path::after {
  background-color: #CFD8DC;
  -webkit-transform: translate3d(2.4em, 1.2em, 0);
          transform: translate3d(2.4em, 1.2em, 0);
  -webkit-animation-name: pathLeftDownAndBack;
          animation-name: pathLeftDownAndBack;
}

@-webkit-keyframes pathRightUpAndBack {
  0% {
    -webkit-transform: translate3d(0, 1.2em, 0);
            transform: translate3d(0, 1.2em, 0);
  }
  25% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  50% {
    -webkit-transform: translate3d(1.2em, 0, 0);
            transform: translate3d(1.2em, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 1.2em, 0);
            transform: translate3d(0, 1.2em, 0);
  }
}

@keyframes pathRightUpAndBack {
  0% {
    -webkit-transform: translate3d(0, 1.2em, 0);
            transform: translate3d(0, 1.2em, 0);
  }
  25% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  50% {
    -webkit-transform: translate3d(1.2em, 0, 0);
            transform: translate3d(1.2em, 0, 0);
  }
  75% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 1.2em, 0);
            transform: translate3d(0, 1.2em, 0);
  }
}
@-webkit-keyframes pathLeftDownAndBack {
  0% {
    -webkit-transform: translate3d(2.4em, 1.2em, 0);
            transform: translate3d(2.4em, 1.2em, 0);
  }
  25% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  50% {
    -webkit-transform: translate3d(1.2em, 2.4em, 0);
            transform: translate3d(1.2em, 2.4em, 0);
  }
  75% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  100% {
    -webkit-transform: translate3d(2.4em, 1.2em, 0);
            transform: translate3d(2.4em, 1.2em, 0);
  }
}
@keyframes pathLeftDownAndBack {
  0% {
    -webkit-transform: translate3d(2.4em, 1.2em, 0);
            transform: translate3d(2.4em, 1.2em, 0);
  }
  25% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  50% {
    -webkit-transform: translate3d(1.2em, 2.4em, 0);
            transform: translate3d(1.2em, 2.4em, 0);
  }
  75% {
    -webkit-transform: translate3d(1.2em, 1.2em, 0);
            transform: translate3d(1.2em, 1.2em, 0);
  }
  100% {
    -webkit-transform: translate3d(2.4em, 1.2em, 0);
            transform: translate3d(2.4em, 1.2em, 0);
  }
}
/* pulse */
.Spinner--pulse::before, .Spinner--pulse::after {
  top: 1em;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  -webkit-animation-duration: 600ms;
          animation-duration: 600ms;
  -webkit-animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
          animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
}
.Spinner--pulse::before {
  left: 0;
  background-color: #2196F3;
  -webkit-transform: scale(1);
          transform: scale(1);
  -webkit-animation-name: pulseOut;
          animation-name: pulseOut;
}
.Spinner--pulse::after {
  right: 0;
  background-color: #CFD8DC;
  -webkit-transform: scale(0.5);
          transform: scale(0.5);
  -webkit-animation-name: pulseIn;
          animation-name: pulseIn;
}

@-webkit-keyframes pulseOut {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}

@keyframes pulseOut {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}
@-webkit-keyframes pulseIn {
  0% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  50% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
}
@keyframes pulseIn {
  0% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  50% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
}
</style>