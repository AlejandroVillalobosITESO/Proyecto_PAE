const Post = require('./post.model');

const PostsController = {
    getAll: (req, res) => {
        const post = new Post();
        post.getAll().then(results => {
            res.send(results);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    getOne: (req, res) => {
        const post = new Post();
        post.getOne(req.params.id).then(result => {
            if(result) res.send(result);
            else res.sendStatus(404);
        }).catch(err => {
            res.send(500);
        });
    },
    create: (req, res) => {
        const post = new Post();
        post.create(req.body, req.file).then(result => {
            if(result) res.sendStatus(201);
        }).catch(err => {
            res.send(err);
        });
    },
    update: (req, res) => {
        const post = new Post();
        post.update(req.params.id, req.body, req.file).then(result => {
            if(result) res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    delete: (req, res) => {
        const post = new Post();
        post.delete(req.params.id).then(result => {
            if(result) res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    count:(req, res) => {
        const post = new Post();
        post.count().then(result => {
            if(result) res.status(200).send({count: result});
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    getPostOfForum:(req, res) => {
        const post = new Post();
        post.getPostOfForum(req.params.id).then(results => {
            if(results) res.status(200).send(results);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    getPostsOfUser:(req, res) => {
        const post = new Post();
        post.getPostsOfUser(req.params.id).then(results => {
            if(results) res.status(200).send(results);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
}

module.exports = PostsController;