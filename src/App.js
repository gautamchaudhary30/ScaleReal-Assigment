import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('episode');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedFilms, setSelectedFilms] = useState([]);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const response = await fetch('https://swapi.dev/api/films/?format=json');
      const data = await response.json();
      setFilms(data.results);
      setFilteredFilms(data.results);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const searchFilms = query => {
    setSearchQuery(query);
    const filtered = films.filter(film => film.title.toLowerCase().includes(query.toLowerCase()));
    setFilteredFilms(filtered);
  };

  const sortFilms = sortBy => {
    setSortBy(sortBy);
    let sorted;
    if (sortBy === 'episode') {
      sorted = [...filteredFilms].sort((a, b) => a.episode_id - b.episode_id);
    } else if (sortBy === 'year') {
      sorted = [...filteredFilms].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    }
    setFilteredFilms(sorted);
  };

  const filterFilms = type => {
    setTypeFilter(type);
    let filtered;
    if (type === 'all') {
      filtered = films;
    } else {
      filtered = films.filter(film => film.title.toLowerCase().includes(type.toLowerCase()));
    }
    setFilteredFilms(filtered);
  };

  const addToSelectedFilms = film => {
    setSelectedFilms([...selectedFilms, film]);
  };

  const removeFromSelectedFilms = film => {
    setSelectedFilms(selectedFilms.filter(selectedFilm => selectedFilm !== film));
  };

  return (
    <div className="App">
      <div className='header'>
        <div className='box1'>
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortBy} onChange={e => sortFilms(e.target.value)}>
            <option value="episode">Episode</option>
            <option value="year">Release Year</option>
          </select>
        </div>
        <div className='box2'>
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={e => searchFilms(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className='box3'><p>ScaleReal</p></div>
        
      </div>
      <div className='container'>
        <div className="films-container">
          {filteredFilms.map(film => (
            <div key={film.episode_id} className="film-card">
              <h3>{film.title}</h3>
              <button onClick={() => addToSelectedFilms(film)}>Add</button>
            </div>
          ))}
        </div>
        <div className='add-container'>
          {selectedFilms.length === 0 && <p className="message">No films added yet.</p>}
          {selectedFilms.map(film => (
            <div key={film.episode_id} className="selected-film full-width">
              <h3>{film.title}</h3>
              <p>Episode: {film.episode_id}</p>
              <p>Release Date: {film.release_date}</p>
              <p>Director: {film.director}</p>
              <p>Producer: {film.producer}</p>
              <p>Opening Crawl: {film.opening_crawl}</p>
              <p>
                <button onClick={() => removeFromSelectedFilms(film)}>Remove</button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
