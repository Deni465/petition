DROP TABLE IF EXISTS petition;

CREATE TABLE petition(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK(first != ''),
    last VARCHAR(255) NOT NULL CHECK(last != ''),
    signature TEXT NOT NULL CHECK(signature != '')
);