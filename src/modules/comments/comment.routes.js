const router = require('express').Router();
const controller = require('./comment.controller');

router.route('/')
  /**
   * @swagger
   *   /comments:
   *     get:
   *       tags:
   *       - Comments
   *       description: Get all commentss
   *       responses:
   *         200:
   *           description: Array with a list of commentss
   */
  .get(controller.getAll)
  /**
   * @swagger
   *   /comments:
   *     post:
   *       tags:
   *       - Comments
   *       description: Create a comment 
   *       parameters:
   *         - in: body
   *           name: comment
   *           description: who?, where? what? reply?
   *           schema:
   *              type: object
   *              optional:
   *                  - id_reply
   *              required:
   *                  - id_user
   *                  - id_post
   *                  - message
   *              properties:
   *                  id_user:
   *                      type: String
   *                  id_post:
   *                      type: String
   *                  id_reply:
   *                      type: String
   *                  message:
   *                      type: String
   *       responses:
   *         201:
   *           description: String with success message
   *         500:
   *           description: String with the error message
   */
  .post(controller.create);

  router.route('/post/:id')
  /**
   * @swagger
   *   /comments/getAll/{id}:
   *     get:
   *       tags:
   *       - Comments
   *       description: Get all the comments of a post
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: The post's unique ID
   *       responses:
   *         200:
   *           description: Array with the comments of that post
   *         500:
   *           description: String with the error message
   */
  .get(controller.getAllCommentsPost);

router.route('/count')
/**
 * @swagger
 *   /comments/count:
 *     get:
 *       tags:
 *       - Comments
 *       description: Get the total of comments
 *       responses:
 *         200:
 *           description: object with number of comments
 */
.get(controller.count);

router.route('/:id')
  /**
   * @swagger
   *   /comments/{id}:
   *     get:
   *       tags:
   *       - Comments
   *       description: Get one comment by ID
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: The comment's unique ID
   *       responses:
   *         200:
   *           description: An object with the comment data
   *         500:
   *           description: String with the error message
   */
  .get(controller.getOne)
  /**
   * @swagger
   *   /comments/{id}:
   *     put:
   *       tags:
   *       - Comments
   *       description: update one comment by his id
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: the comment forum id
   *         - in: body
   *           name: updates
   *           description: the changes you do to the comment
   *           schema:
   *              type: object
   *              optional:
   *                  - message
   *              properties:
   *                  message:
   *                      type: String
   *       responses:
   *         200:
   *           description: String with success message
   *         500:
   *           description: String with the error message
   */
  .put(controller.update)
  /**
   * @swagger
   *   /comments/{id}:
   *     delete:
   *       tags:
   *       - Comments
   *       description: delete a specific comment with the id
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           description: The comments unique ID
   *       responses:
   *         200:
   *           description: String success message
   *         500:
   *           description: String with the error message
   */
  .delete(controller.delete);

  

module.exports = router;
