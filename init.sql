CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    about VARCHAR(500),
    price FLOAT
);

INSERT INTO products (name, about, price) VALUES ('My first game', 'This is an awesome game', 60);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(500),
    email VARCHAR(255)
);

INSERT INTO users (username, password, email) VALUES ('Toto', 'ABCD', 'toto@gmail.com');

CREATE TABLE orders (
    id_order SERIAL PRIMARY KEY,
    id_user SERIAL,
    id_product SERIAL,
    total FLOAT NOT NULL DEFAULT 0,
    payment Boolean NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY(id_user) REFERENCES users(id_user),
    FOREIGN KEY(id_product) REFERENCES products(id)
);