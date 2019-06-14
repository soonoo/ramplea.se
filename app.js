const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const logger = require('koa-logger')

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(logger())

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;

