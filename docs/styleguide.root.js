import store from '../src/renderer/store';

export default previewComponent => {
	// https://vuejs.org/v2/guide/render-function.html
	return {
		store,
		render(createElement) {
			return createElement(previewComponent);
		},
	};
};
