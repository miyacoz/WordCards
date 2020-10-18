### development

run once:
`$ yarn fe`

run every time you update B/E:
`$ rm -f ./src/backend/index.js; yarn ship && node ./src/backend/index.js`
and you sadly need to reload F/E because it's also built as production
