/**
 * Created by jack on 16/3/25.
 */

var router = require("koa-router")();
var User = require("../models/user");
var Post = require("../models/post");

var Config = require("../config.json");

router.get("/",checkLogin);
router.get("/", function *() {
    return this.redirect("/admin/posts");
});


router.get("/login",checkNotLogin);
router.get("/login", function *() {
    yield this.render("login",{
        title:"登录",
        flash:this.flash
    })
});

router.get("/posts",checkLogin);
router.get("/posts", function *() {
    this.redirect(router.url("posts",1));
});

router.get("/posts/:page",checkLogin);
router.get("posts","/posts/:page", function *() {
    var page = this.params.page <1?1:this.params.page;
    var docs = yield Post.getTen(this.mongo,{},page);

    yield this.render("posts",{
        posts:docs,
        title:"文章列表"
    });
});

router.get("/edit/:id",checkLogin);
router.get("/edit/:id", function *() {

    var id = this.params.id;
    var post = yield Post.getOne(this.mongo,id);

    yield this.render("edit",{
        post:post,
        title:"编辑文章",
        cate:Config.cate
    });
});


router.post("/post",checkLogin);
router.post("/post", function *() {

    var doc = this.request.body;

    var res = yield Post.save(this.mongo,doc,this.session.user);

    this.redirect("/posts");
});


router.get("/post/add",checkLogin);
router.get("/post/add", function *() {
    yield this.render("add",{
        title:"新增文章",
        cate:Config.cate
    });
});

router.post("/login", function *(next) {
    var name = this.request.body.username;
    var password = this.request.body.password;
    var user = yield User.get(this.mongo,name);

    if(!user){
        this.flash = {error:"用户名不存在!"};
        this.redirect("back");
    }
    else if(password !=user.password){
        this.flash = {error:"密码错误!"};
        this.redirect("back");
    }else{
        delete user.password;
        this.session.user = user;
        this.redirect("/admin");
    }
});




function* checkLogin(next){
    if(!this.session.user){
        this.flash = {"error":"未登录!"};
        return this.redirect("/admin/login");
    }
    yield arguments[arguments.length - 1];
}
function* checkNotLogin(next){
    if(this.session.user){
        return this.redirect("/admin");
    }
    yield next;
}

module.exports = router;