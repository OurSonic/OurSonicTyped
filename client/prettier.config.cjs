module.exports = {
  tabWidth: 2,
  singleQuote: true,
  printWidth: 120,
  bracketSpacing: false,
  trailingComma: 'es5',
  endOfLine: 'auto',
  plugins: [require('prettier-plugin-organize-imports'), require('prettier-plugin-tailwindcss')],
};
