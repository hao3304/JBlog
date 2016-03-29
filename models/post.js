/**
 * Created by jack on 16/3/26.
 */

var marked = require("marked");
var moment = require("moment");
var trim = require("trim-html");

var ObjectID = require("mongodb").ObjectID;

var config = require("../config.json");

exports.save = function(mongo,doc,user){

    return function (callback) {

        var post = {
            title:doc.title,
            content:marked(doc.content),
            time:Date.now(),
            user:user.name,
            cate:doc.cate,
            comments:[],
            state:doc.state
        };

        mongo.collection("posts").insert(post, function (err,res) {
            if(err){
                console.error(err);
            }else{
                callback(null,res);
            }

        })
    }
};

exports.getTen = function (mongo,query,page) {

    return function (callback) {

        mongo.collection("posts")
        .find(query)
        .sort({"time":-1})
        .skip((page-1)*10)
        .limit(10)
        .toArray(function(err,docs){
            if(err){
                return console.error(err);
            }
            docs.forEach(function (doc) {
                doc.time = moment(doc.time).format("YYYY-MM-DD HH:mm");

                doc.content = trim(doc.content,{preserveTags:false}).html;

                doc.cate = (function(id){
                    for(var i in config.cate){
                        if(config.cate[i].id == id){
                            return config.cate[i].name;
                        }
                    }
                })(doc.cate);

            });
            callback(null,docs);
        })

    }

};

exports.getOne = function (mongo,id) {

    return function (callback) {

        mongo.collection("posts")
            .findAndModify({"_id":new ObjectID(id)},[],{"$inc":{pv:1}},{new:true}, function (err,doc) {

                if(err){
                    console.error(err);
                }else {

                    var post = doc.value;

                    post.time = moment(post.time).format("YYYY-MM-DD HH:mm");

                    callback(null,post);
                }

            })

    }

};