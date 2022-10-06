DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS profiles;


CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    signature text NOT NULL,
    user_id INT NOT NULL REFERENCES users(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK(first != ''),
    last VARCHAR(255) NOT NULL CHECK(last != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
    age INT,
    city VARCHAR(255),
    homepage VARCHAR(255),
    user_id INT NOT NULL REFERENCES users(id)
)