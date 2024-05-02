const express = require("express");
const postgres = require("postgres");
const z = require ("zod");
const sha512 = require("js-sha512");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 8000;

/*
import('node-fetch').then(fetch => {
    fetch.default(`http://localhost:${port}/f2p-games`)
    console.log(fetch.json) // return undefined
});
*/


// Swagger needs to be open on "http://localhost:8000/api-docs/"
const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:8000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

console.log('Connexion...')
var sql;
try {
    sql = postgres({ db: "mydb", user: "user", password: "password" });
    testing(sql)
    console.log('Connecté!')
} catch (error) {
    console.log('Pas connecté!')
}

app.use(express.json());

const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    about: z.string(),
    price: z.number().positive()
});
const CreateProductSchema = ProductSchema.omit({ id: true });

const UserSchema = z.object({
    id_user: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string()
});
const CreateUserSchema = UserSchema.omit({ id_user: true });

const OrderSchema = z.object({
    id_order: z.string(),
    id_user: z.string(),
    id_product: z.string(),
    total: z.number().positive(),
    payment: z.boolean(),
    created_at: z.date(),
    updated_at: z.date()
});
const CreateOrderSchema = OrderSchema.omit({ id_order: true, created_at: true, updated_at: true, payment: true, total: true });

const PutOrderSchema = OrderSchema.omit({ id_order: true, created_at: true, updated_at: true });


app.post("/products", async (req, res) => {
    const result = await CreateProductSchema.safeParse(req.body);

    if (result.success) {
        const { name, about, price } = result.data;

        const product = await sql`
        INSERT INTO products (name, about, price)
        VALUES (${name}, ${about}, ${price})
        RETURNING *
        `;

        res.send(product[0]);
    } else {
        res.status(400).send(result);
    }
});

app.get("/products", async (req, res) => {
    const name = req.query.name
    const about = req.query.about
    const price = req.query.price

    const products = await sql`SELECT * FROM products
    ${name || about || price ? sql` WHERE` : sql``}
    ${name ? sql`  name LIKE ${'%' + name + '%'}` : sql``}
    ${(name && about) || (name && price) ? sql` AND` : sql``}
    ${about ? sql`  about LIKE ${'%' + about + '%'}` : sql``}
    ${about && price ? sql` AND` : sql``}
    ${price ? sql`  price = ${price}` : sql``}`;

    res.send(products);
});

app.get("/products/:id", async (req, res) => {
    const product = await sql`SELECT * FROM products WHERE id=${req.params.id}`;

    if (product.length > 0) {
        res.send(product[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.delete("/products/:id", async (req, res) => {
    const product = await sql`DELETE FROM products WHERE id=${req.params.id}`;

    if (product.length > 0) {
        res.send(product[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.post("/users", async (req, res) => {
    const result = await CreateUserSchema.safeParse(req.body);

    if (result.success) {
        const { username, password, email } = result.data;

        hashedPassword = sha512.hmac('Bla_bla', password)
        const user = await sql`
        INSERT INTO users (username, password, email)
        VALUES (${username}, ${hashedPassword}, ${email})
        RETURNING *
        `;

        res.send(user[0]);
    } else {
        res.status(400).send(result);
    }
});

app.get("/users", async (req, res) => {
    const users = await sql`SELECT * FROM users`;

    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const user = await sql`SELECT * FROM users WHERE id_user=${req.params.id}`;

    if (user.length > 0) {
        res.send(user[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.put("/users/:id", async (req, res) => {
    const result = await CreateUserSchema.safeParse(req.body);

    if (result.success) {
        const { username, password, email } = result.data;

        hashedPassword = sha512.hmac('Bla_bla', password)
        const user = await sql`
        UPDATE users
        SET username = ${username},
            password = ${hashedPassword},
            email = ${email}
        WHERE id_user = ${req.params.id}
        RETURNING *
        `;

        res.send(user[0]);
    } else {
        res.status(400).send(result);
    }
});

app.patch("/users/:id", async (req, res) => {
    const userRequest = await sql`SELECT * FROM users WHERE id_user=${req.params.id}`;

    if (userRequest) {
        let userInDatabase = userRequest[0]
        if (req.body.username) {
            if (userInDatabase.username != req.body.username) {
                userInDatabase.username = req.body.username;
            }
        }

        if (req.body.email) {
            if (userInDatabase.email != req.body.email) {
                userInDatabase.email = req.body.email;
            }
        }


        if (req.body.password) {
            hashedPassword = sha512.hmac('Bla_bla', req.body.password)
            if (userInDatabase.password != hashedPassword) {
                userInDatabase.password = hashedPassword;
            }
        }

        const user = await sql`
        UPDATE users
        SET username = ${userInDatabase.username},
            password = ${userInDatabase.password},
            email = ${userInDatabase.email}
        WHERE id_user = ${req.params.id}
        RETURNING *
        `;

        res.send(user[0]);
    } else {
        res.status(400).send(result);
    }
});

app.post("/orders", async (req, res) => {
    const result = await CreateOrderSchema.safeParse(req.body);

    if (result.success) {
        const { id_user, id_product } = result.data;

        const product = await sql`SELECT * FROM products WHERE id=${id_product}`;
        const total = product[0].price * 1.2;

        const order = await sql`
        INSERT INTO orders (id_user, id_product, total)
        VALUES (${id_user}, ${id_product}, ${total})
        RETURNING *
        `;

        res.send(order[0]);
    } else {
        res.status(400).send(order);
    }
});

app.get("/orders", async (req, res) => {
    const orders = await sql`SELECT * FROM orders, users, products WHERE orders.id_user = users.id_user AND orders.id_product = products.id`;

    res.send(orders);
});

app.get("/orders/:id", async (req, res) => {
    const order = await sql`SELECT * FROM orders, users, products WHERE orders.id_user = users.id_user AND orders.id_product = products.id AND id_order=${req.params.id}`;

    if (order.length > 0) {
        res.send(order[0]);
    } else {
        res.status(404).send({ message: "Not found" });
    }
});

app.put("/orders/:id", async (req, res) => {
    const result = await PutOrderSchema.safeParse(req.body);

    if (result.success) {
        const { id_user, id_product, total, payment } = result.data;

        const user = await sql`
        UPDATE orders
        SET id_user = ${id_user},
            id_product = ${id_product},
            total = ${total},
            payment = ${payment},
            updated_at = CURRENT_TIMESTAMP
        WHERE id_order = ${req.params.id}
        RETURNING *
        `;

        res.send(user[0]);
    } else {
        res.status(400).send(result);
    }
});

app.patch("/orders/:id", async (req, res) => {
    const orderRequest = await sql`SELECT * FROM orders WHERE id_order=${req.params.id}`;

    if (orderRequest) {
        let orderInDatabase = orderRequest[0]
        if (req.body.id_user) {
            if (orderInDatabase.id_user != req.body.id_user) {
                orderInDatabase.id_user = req.body.id_user;
            }
        }

        if (req.body.id_product) {
            if (orderInDatabase.id_product != req.body.id_product) {
                orderInDatabase.id_product = req.body.id_product;
            }
        }


        if (req.body.total) {
            if (orderInDatabase.total != req.body.total) {
                orderInDatabase.total = req.body.total;
            }
        }

        if (req.body.payment) {
            if (orderInDatabase.payment != payment) {
                orderInDatabase.payment = payment;
            }
        }

        const user = await sql`
        UPDATE orders
        SET id_user = ${orderInDatabase.id_user},
            id_product = ${orderInDatabase.id_product},
            total = ${orderInDatabase.total},
            payment = ${orderInDatabase.payment},
            updated_at = CURRENT_TIMESTAMP
        WHERE id_order = ${req.params.id}
        RETURNING *
        `;

        res.send(user[0]);
    } else {
        res.status(400).send(result);
    }
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

async function testing(sql) {
    try {
        const test = await sql`SELECT * FROM products`
    } catch (err) {
        console.log(err)
    }
}