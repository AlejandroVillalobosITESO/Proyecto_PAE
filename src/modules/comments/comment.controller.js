const Comment = require('./comment.model');

const CommentsController = {
    getAll: (req, res) => {
        const comment = new Comment();
        comment.getAll().then(results => {
            res.send(results);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    getOne: (req, res) => {
        const comment = new Comment();
        comment.getOne(req.params.id).then(result => {
            if(result) res.send(result);
            else res.sendStatus(404);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    create: (req, res) => {
        const comment = new Comment();
        comment.create(req.body).then(result => {
            if(result) res.sendStatus(201);
        }).catch(err => {
            res.send(err);
        });
    },
    update: (req, res) => {
        const comment = new Comment();
        comment.update(req.params.id, req.body).then(result => {
            if(result) res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    delete: (req, res) => {
        const comment = new Comment();
        comment.delete(req.params.id).then(result => {
            if(result) res.sendStatus(200);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    count: (req, res) => {
        const comment = new Comment();
        comment.count().then(result => {
            if(result) res.status(200).send({count: result});
        }).catch(err => {
            res.sendStatus(500);
        });
    },
    getAllCommentsPost: (req, res) => {
        const comment = new Comment();
        comment.getAllcomentsPost(req.params.id).then(result => {
            if(result) res.status(200).send(result);
        }).catch(err => {
            res.sendStatus(500);
        });
    },
}

module.exports = CommentsController;