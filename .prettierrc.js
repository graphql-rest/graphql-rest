module.exports = {
   arrowParens: 'always',
   printWidth: 80,
   quoteProps: 'consistent',
   semi: false,
   singleQuote: true,
   tabWidth: 3,
   trailingComma: 'all',
   overrides: [
      {
         files: '*.md',
         options: {
            tabWidth: 2,
         },
      },
   ],
}
