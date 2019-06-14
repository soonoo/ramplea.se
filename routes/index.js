const router = require('koa-router')()
const { readdirSync, readFileSync } = require('fs');
const _ = require('lodash');

const toLowerCaseParams = (params) => {
  const newParams = {};
  Object.keys(params).forEach(k => newParams[k] = params[k].toLowerCase());

  return newParams;
};

router.use((ctx, next) => {
  try {
    const files = readdirSync('data').sort();
    const data = readFileSync(`data/${files.pop()}`, { encoding: 'utf8' }); 
    ctx.data = JSON.parse(data);
  } catch(e) {
    console.error(e);
    ctx.status = 500;
    return;
  }
  next();
});

router.get('/', (ctx, next) => {
  ctx.body = ctx.data;
});

router.get('/:locale', (ctx, next) => {
  const { locale } = toLowerCaseParams(ctx.params);
  const price = _.get(ctx.data, `${locale}`);

  if(!price) ctx.status = 404;
  else ctx.body = price;
});

router.get('/:locale/:platform', (ctx, next) => {
  const { locale, platform } = toLowerCaseParams(ctx.params);
  const price = _.get(ctx.data, `${locale}.${platform}`);

  if(!price) ctx.status = 404;
  else ctx.body = price;
});

router.get('/:locale/:platform/:capacity', (ctx, next) => {
  const { locale, platform, capacity } = toLowerCaseParams(ctx.params);
  const price = _.get(ctx.data, `${locale}.${platform}.${capacity}`);

  if(!price) ctx.status = 404;
  else ctx.body = price;
});

module.exports = router;

