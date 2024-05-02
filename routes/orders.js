/**
 * @swagger
 * components:
 *   schemas:
 *     Orders:
 *       type: object
 *       required:
 *         - id_user
 *         - id_product
 *       properties:
 *         id_order:
 *           type: string
 *           description: The auto-generated id of the order
 *         id_user:
 *           type: string
 *           description: The id of the associated user
 *         id_product:
 *           type: string
 *           description: The id of the associated product
 *         total:
 *           type: number
 *           description: The total value of the order
 *         payment:
 *           type: boolean
 *           description: Whether the order payment have been made
 *         created_at:
 *           type: string
 *           format: timestamp
 *           description: The date the order was added
 *         updated_at:
 *           type: string
 *           format: timestamp
 *           description: The date the order was updated
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 * /orders:
 *   get:
 *     summary: Lists every orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: The list of the orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The created order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 * /orders/{id}:
 *   get:
 *     summary: Get the order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: The order response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: The order was not found
 *   patch:
 *    summary: Update the order by the id
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *    responses:
 *      200:
 *        description: The order was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Order'
 *      404:
 *        description: The order was not found
 *      500:
 *        description: Some error happened 
 *   put:
 *    summary: Update the order by the id
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *    responses:
 *      200:
 *        description: The order was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Order'
 *      404:
 *        description: The order was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *
 *     responses:
 *       200:
 *         description: The order was deleted
 *       404:
 *         description: The order was not found
 */