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

ALTER TABLE pokemon ADD FOREIGN KEY (user_id) REFERENCES users(id); 

CREATE TABLE IF NOT EXISTS types (
	type varchar(255) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS pokemon_types (
	pokemon_id integer,
	type varchar(255)
);

ALTER TABLE pokemon_types ADD FOREIGN KEY (pokemon_id) REFERENCES pokemon(id); 
ALTER TABLE pokemon_types ADD FOREIGN KEY (type) REFERENCES types(type); 
