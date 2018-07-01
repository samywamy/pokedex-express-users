DROP TABLE pokemon;

CREATE TABLE IF NOT EXISTS pokemon (
  id SERIAL PRIMARY KEY,
  num varchar(255),
  name varchar(255),
  img varchar(255),
  weight varchar(255),
  height varchar(255)
);

ALTER TABLE pokemon ADD user_id Integer; 

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  password_hash varchar(255),
  email varchar(255)
);

ALTER TABLE pokemon
ADD FOREIGN KEY (user_id) REFERENCES users(id); 