DROP TABLE IF EXISTS petition;

CREATE TABLE petition(
    first VARCHAR(255) NOT NULL CHECK(first != ''),
    last VARCHAR(255) NOT NULL CHECK(last != ''),
    signature TEXT NOT NULL 
);