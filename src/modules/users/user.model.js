const Model = require('../../core/model');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const tokenKey = process.env.TOKEN_KEY;

class User extends Model {
    constructor(){
        super('users');
    }
    //getAll already implemented in model
    //getOne already implemented in model
    //delete already implemented in model
    create(body, file) {
        return new Promise((accept, reject) => {
            if(!body.username || !body.password || !body.email) reject('Data is missing');
            else{
                this.collection.findOne({email: body.email}, (err, result) => {
                    if(result) reject('Mail already in use');
                    else {
                        let newUser = {
                            username: body.username,
                            password: bcrypt.hashSync(body.password, saltRounds),
                            email: body.email,
                            profile_picture: 'public/images/'+ (file.filename || null)
                        }
                        this.collection.insertOne(newUser);
                        accept('Success');
                    }
                });
            }
        });
    }

    update(id, body, file){
        return new Promise((accept, reject) => {
            this.collection.findOne({_id: ObjectId(id)}, (err, result) => {
                if(result){
                    let upgrade = {
                        username: body.username || result.username,
                        password: bcrypt.hashSync(body.password, saltRounds) || result.password,
                        email: body.email || result.email,
                        profile_picture: ('public/images/'+ file.filename) || result.profile_picture
                    }
                    accept(this.collection.updateOne({_id: ObjectId(id)}, {$set: upgrade}));
                } else{
                    reject("No user found");
                }
            });
        });
    }

    login(body){
        return new Promise((accept, reject) => {
            if(!body.email || !body.password) reject('Data is missing');
            else{
                this.collection.findOne({email: body.email}, (err, result)=> {
                    if(result){
                        if(bcrypt.compareSync(body.password, result.password)){
                            let payload = {
                                _id : result._id
                            }
                            let options = {
                                expiresIn: 60 * 60
                            };
                            accept(JSON.stringify({token : jwt.sign(payload, tokenKey, options)}));
                        }else{
                            reject("Wrong credentials");
                        }
                    }else{
                        reject("Not existing user");
                    }
                });
            }
        });
    }
}

module.exports = User;