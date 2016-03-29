var router = require('koa-router')();
var Post = require("../models/post");

router.get('/', function *() {

  var page = this.query.page||1;

  var docs = yield Post.getTen(this.mongo,{},page);

  yield this.render('index', {
    title: 'Jack Home',
    posts:docs
  });

});

router.get("post/:id", function *() {
  var id = this.params.id;
  var post = yield Post.getOne(this.mongo,id);
  yield this.render("post",{
    title:post.title,
    post:post
  });

});



module.exports = router;
