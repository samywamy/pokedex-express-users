var React = require("react");

class Home extends React.Component {
  render() {
    console.log(this);

    const userpokes = this.props.id?(
      <div>
      <h1>My Pokemons</h1>
          <ul>
            {this.props.pokemon.filter(pokemon => pokemon.user_id == this.props.id).map(pokemon => (
              <li key={pokemon.id}>
                {pokemon.name}
              </li>
            ))}
          </ul>
      </div>
    ):"";

    return (
      <html>
        <head />
        <body>
          <h1>Welcome to Pokedex</h1>
          <ul>
            {this.props.pokemon.map(pokemon => (
              <li key={pokemon.id}>
                {pokemon.name}
              </li>
            ))}
          </ul>
          {userpokes}
        </body>
      </html>
    );
  }
}

module.exports = Home;
