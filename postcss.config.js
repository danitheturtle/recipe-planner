export default (ctx) => ({
  plugins: {
    'postcss-preset-env': {
      stage: 2,
      enableClientSidePolyfills: false,
      features: {
        //disable features that need client-side polyfill library
        'blank-pseudo-class': false,
        'focus-visible-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'has-pseudo-class': false,
        'prefers-color-scheme-query': false,
      },
    },
  },
});
