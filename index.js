/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables.
		Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const pg = require('pg');
const sha256 = require('js-sha256');

// Do I need body-paser and jsonfile?

// Initialise postgres client
const config = {
	user: 'samywamy',
	host: '127.0.0.1',
	database: 'pokemons',
	port: 5432,
};

// if (config.user === 'samywamy') {
// 	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
// };

const pool = new pg.Pool(config);

pool.on('error', function(err) {
	console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(cookieParser());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

const getRoot = (request, response) => {
	// query database for all pokemon

	// respond with HTML page displaying all pokemon
	//
	const queryString = 'SELECT * from pokemon;';
	pool.query(queryString, (err, result) => {
		if (err) {
			console.error('Query error:', err.stack);
		} else {
			console.log('Query result:', result);

			// redirect to home page
			response.render('home', { pokemon: result.rows, id: request.cookies.user });
		}
	});
}

const getNew = (request, response) => {
	response.render('new');
}

const getPokemon = (request, response) => {
	let id = request.params['id'];
	const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
	pool.query(queryString, (err, result) => {
		if (err) {
			console.error('Query error:', err.stack);
		} else {
			console.log('Query result:', result);

			// redirect to home page
			response.render('pokemon', { pokemon: result.rows[0] });
		}
	});
}

const postPokemon = (request, response) => {
	let params = request.body;

	const queryString = 'INSERT INTO pokemon (name, height) VALUES ($1, $2);';
	const values = [params.name, params.height];
	const queryStringUser = 'INSERT INTO pokemon (name, height, user_id) VALUES ($1, $2, $3)';
	const valuesAgain = [params.name, params.height, request.cookies.user];

	let query;
	let vals;

	if (request.cookies.logged_in == 'true') {
        query = queryStringUser;
        vals = valuesAgain;
	} else {
        query = queryString;
        vals = values;
    }

	pool.query(query, vals, (err, result) => {
		if (err) {
			console.log('query error:', err.stack);
		} else {
			console.log('query result:', result);

			// redirect to home page
			response.redirect('/');
		}
	});
};

const editPokemonForm = (request, response) => {
	let id = request.params['id'];
	const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
	pool.query(queryString, (err, result) => {
		if (err) {
			console.error('Query error:', err.stack);
		} else {
			console.log('Query result:', result);

			// redirect to home page
			response.render('edit', { pokemon: result.rows[0] });
		}
	});
}

const updatePokemon = (request, response) => {
	let id = request.params['id'];
	let pokemon = request.body;
	const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
	const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
	console.log(queryString);
	pool.query(queryString, values, (err, result) => {
		if (err) {
			console.error('Query error:', err.stack);
		} else {
			console.log('Query result:', result);

			// redirect to home page
			response.redirect('/');
		}
	});
}


const deletePokemonForm = (request, response) => {
	let id = request.params['id'];
	const queryString = 'DELETE FROM pokemon WHERE id = $1';
	const values = [id];

	pool.query(queryString, values, (err, result) => {
		if (err) {
			console.log('query result:', err.stack);
		} else {
			console.log('query result:', result)
			response.redirect('/');
		}
	});
};

const deletePokemon = (request, response) => {
	let id = request.params['id'];
	const queryString = 'DELETE FROM pokemon WHERE id = $1';
	const values = [id];

	pool.query(queryString, values, (err, result) => {
		if (err) {
			console.log('query result:', err.stack);
		} else {
			console.log('query result:', result)
			response.redirect('/');
		}
	});
};

const regForm = (request, response) => {
	response.render('register');
};

const addUser = (request, response) => {
	let params = request.body;
	// console.log(params);
	const queryString = 'INSERT INTO users(email, password_hash) VALUES($1, $2)';
	const values = [params.email, sha256(params.password)];
		
	pool.query(queryString, values, (err, result) => {
		if (err) {
			console.log('query error:', err.stack);
		} else {
			console.log('query result:', result);
			response.redirect('/');
		}
	});
};

const logInForm = (request, response) => {
	response.render('login');
};

const loginUser = (request, response) => {
	let params = request.body;
	// console.log(params);
	const queryString = 'SELECT * FROM users where email = $1 AND password_hash = $2';
	const values = [params.email, sha256(params.password)];
		
	pool.query(queryString, values, (err, result) => {
		if (err) {
			console.log('query error:', err.stack);
		} else {
			if (result.rows.length == 0) {
				response.redirect('/login');
			} else {
				response.cookie('logged_in', 'true');
				response.cookie('user', result.rows[0].id);
				response.redirect('/');
			}
		}
	});
};

const logoutUser = (request, response) => {
	response.clearCookie('user');
    response.clearCookie('logged_in');
    response.redirect('/');
};

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);
app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);
app.post('/pokemon', postPokemon);
app.put('/pokemon/:id', updatePokemon);
app.delete('/pokemon/:id', deletePokemon);
app.get('/register', regForm);
app.post('/register', addUser);
app.get('/login', logInForm);
app.post('/login', loginUser);
app.get('/logout', logoutUser);

// TODO: New routes for creating users


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
	console.log('Recalling all ships to harbour...');
	server.close(() => {
		console.log('... all ships returned...');
		pool.end(() => {
			console.log('... all loot turned in!');
			process.exit(0);
		});
	});
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);