const Model = require('../../core/model');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const {OAuth2Client } = require('google-auth-library');
const Database = require('../../core/database');
const { reject } = require('bcrypt/promises');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const saltRounds = 10;
const tokenKey = process.env.TOKEN_KEY;

class User extends Model {
    constructor(){
        super('users');
    }
    //getAll already implemented in model
    //getOne already implemented in model
    //delete already implemented in model
    create(body) {
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
                            profile_picture: 'public/images/defaultavatar'
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
                                _id : result._id,
                                username: result.username,
                                email: result.email
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

    googleLogin(body){
        return new Promise((accept, reject) => {
            googleClient.verifyIdToken({
                idToken: body.idToken
            }).then(response => {
                let email = response.payload.email
                Database.collection('users').findOne({email: email}).then(user => {
                    if(user){
                        let payload = {
                            _id : user._id,
                            username: user.username,
                            email: user.email
                        }
                        let options = {
                            expiresIn: 60 * 60
                        };
                        if(!user.googleId){
                            Database.collection('users').updateOne({email: email}, {$set: {googleId: body.idToken}}).then(() => {
                                accept(JSON.stringify({token : jwt.sign(payload, tokenKey, options)}));
                            });
                        } else{
                            accept(JSON.stringify({token : jwt.sign(payload, tokenKey, options)}));
                        }
                    } else {
                        reject('Not a real user');
                    }
                });
            }).catch(e => {
                reject(e);
            });
        });
    }
}

module.exports = User;