/**
 * Created by jack on 16/3/25.
 */

exports.get = function (mongo,name) {
    return function (callback) {
        mongo
            .collection("users")
            .findOne({name:name}, function (err,doc) {
                if(err){
                    console.error(err.message);
                }else{
                    callback(null,doc);
                }
            });
    }
};

exports.save = function (mongo,doc) {
    return function (callback) {
        mongo
        .collection("users")
        .insert(doc, function (err,result) {
            if(err){
                console.error(err.message);
            }else{
                callback(null,result);
            }
        })
    }
};