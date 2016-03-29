var app = require('koa')()
    , koa = require('koa-router')()
    , logger = require('koa-logger')
    , json = require('koa-json')
    , views = require('koa-views')
    , session = require("koa-session")
    , flash = require('koa-flash')
    , mongo = require("koa-mongo");

var index = require('./routes/index');
var admin = require('./routes/admin');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  map:{
    html:"swig"
  }
}));

app.keys = ['blog'];

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(session(app));
app.use(flash());

app.use(mongo({
  db:"blog"
}));

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/admin', admin.routes(), admin.allowedMethods());

// mount root routes  
app.use(koa.routes());

app.use(function *(next){
  try{
    yield next();
  }catch (e){
    console.error(e.message);
  }
});

app.on('error', function(err, ctx){

  log.error('server error', err, ctx);
});

module.exports = app;
