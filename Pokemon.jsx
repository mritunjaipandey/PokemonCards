import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=150";
  const typesAPI = "https://pokeapi.co/api/v2/type";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      setLoading(false);
      setError(error);
    }
  };

  const fetchPokemonTypes = async () => {
    try {
      const res = await fetch(typesAPI);
      const data = await res.json();
      const typeNames = data.results.map((type) => type.name);
      setPokemonTypes(["all", ...typeNames]); 
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
    }
  };

  useEffect(() => {
    fetchPokemon();
    fetchPokemonTypes();
  }, []);

  
  const searchData = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
  );


  const filteredPokemon = selectedType === "all" || selectedType === ""
    ? searchData
    : searchData.filter((curPokemon) =>
        curPokemon.types.some((typeInfo) => typeInfo.type.name === selectedType)
      );

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <header>
          <h1> Lets Catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="pokemon-filter">
          <label htmlFor="type-filter">Filter by Type:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={handleTypeChange}
          >
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <ul className="cards">
            {filteredPokemon.map((curPokemon) => (
              <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};