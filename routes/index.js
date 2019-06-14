const router = require('koa-router')()
const fs = require('fs');
const _ = require('lodash');

router.get('/', (ctx, next) => {
  ctx.body = fs.readFileSync('data.json', { encoding: 'utf8' });
  ctx.set('Content-type', 'application/json');
})

router.get('/:platform', (ctx, next) => {
  const data = fs.readFileSync('data.json', { encoding: 'utf8' });
  const { platform } = ctx.params;
  const price = _.get(JSON.parse(data), `${platform.toLowerCase()}`);

  if(!price) ctx.status = 404;
  else ctx.body = price;
})

router.get('/:platform/:capacity', (ctx, next) => {
  const data = fs.readFileSync('data.json', { encoding: 'utf8' });
  const { platform, capacity } = ctx.params;
  const price = _.get(JSON.parse(data), `${platform.toLowerCase()}.${capacity.toLowerCase()}`);

  if(!price) ctx.status = 404;
  else ctx.body = price;
})

module.exports = router
