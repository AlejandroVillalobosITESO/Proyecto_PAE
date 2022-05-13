const Database = require('../../core/database');
const Model = require('../../core/model');
const {ObjectId} = require('mongodb');
const { reject } = require('bcrypt/promises');

class Comment extends Model {
    constructor(){
        super('comments');
    }
    //getAll already implemented in model
    //getOne already implemented in model
    //delete already implemented in model
    //update already implemented in model

    create(body){
        return new Promise((accept, reject) => {
            if(!body.id_post || !body.message || !body.id_user) reject("Data is missing");
            else{
                Database.collection('posts').findOne({_id: ObjectId(body.id_post)}, (err, result) => {
                    if(!result) reject('Not a real post');
                    else {
                        let newComment = {
                            id_post: body.id_post,
                            id_user: body.id_user,
                            message: body.message
                        };
                        this.collection.insertOne(newComment);
                        accept("Success");
                    }
                });
            }
        });
    }

    getAllcomentsPost(id){
        return new Promise((accept, reject) => {
            this.collection.find({id_post: id}).toArray((err, results) => {
                if (err) reject(err);
                else accept(results);
               });
        });
    }

}

module.exports = Comment;