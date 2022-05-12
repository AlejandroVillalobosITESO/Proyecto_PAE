const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bp = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const apiRoutes = require('./src/routes/routes');
const Database = require('./src/core/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/images', express.static(path.join(__dirname, 'public')));

app.get('/images/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'images', req.params.file));
});

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({
    extended: true
}));
app.use('/', apiRoutes);

const swaggerOptions = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Proyecto PAE',
            description: 'A forums web page',
            version: '1.0.0',
            servers: ['http://localhost:' + port]
        }
    },
    apis: ['./src/modules/**/*.routes.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

Database.connect().then(() => {
    // Listen to port
    server = app.listen(port, () => {
        console.log('App is listening to port ' + port);
    });
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowHeaders: ['Authorization'],
            credentials: true
        }
    });

    io.on('connection', socket => {
        console.log('alguien se conecto');

        socket.on('viewComments', (data) => {
            socket.join(data);
            console.log("alguien quiere comentarios del post " + data);
            Database.collection('comments').find({id_post: data}).toArray((err, results) => {
                socket.to(data).emit('viewComments', results);
            });
        });

        socket.on('viewPosts', (data) => {
            socket.join(data);
            console.log("alguien quiere posts del foro " + data);
            Database.collection('posts').find({id_forum: data}).toArray((err, results) => {
                socket.to(data).emit('viewPosts', results);
            });
        });

        socket.on('viewForums', (data) => {
            console.log("alguien quiere foros ");
            Database.collection('forums').find({}).toArray((err, results) => {
                socket.broadcast.emit("viewForums", results);
            });
        });
    });
});