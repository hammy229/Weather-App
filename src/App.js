import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import LinkedInImage from './linkme.PNG'; // Import the image file

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [activities, setActivities] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      });
    }
  }, []);

  const getWeatherByLocation = async (lat, lon) => {
    try {
      setError('');
      const apiKey = process.env.REACT_APP_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const weatherResponse = await axios.get(weatherUrl);
      const forecastResponse = await axios.get(forecastUrl);

      setWeather(weatherResponse.data);
      setActivities(getActivitiesBasedOnWeather(weatherResponse.data.weather[0].main));

      const filteredForecast = forecastResponse.data.list.filter((entry) =>
        entry.dt_txt.includes('12:00:00')
      );
      setForecast(filteredForecast);

      const today = new Date().toISOString().split('T')[0];
      const filteredHourly = forecastResponse.data.list.filter((entry) =>
        entry.dt_txt.includes(today)
      );
      setHourlyForecast(filteredHourly);
    } catch (err) {
      setError('Unable to retrieve weather data.');
      setWeather(null);
      setForecast([]);
      setHourlyForecast([]);
    }
  };

  const getWeather = async () => {
    try {
      setError('');
      const apiKey = process.env.REACT_APP_API_KEY;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      const weatherResponse = await axios.get(weatherUrl);
      const forecastResponse = await axios.get(forecastUrl);

      setWeather(weatherResponse.data);
      setActivities(getActivitiesBasedOnWeather(weatherResponse.data.weather[0].main));

      const filteredForecast = forecastResponse.data.list.filter((entry) =>
        entry.dt_txt.includes('12:00:00')
      );
      setForecast(filteredForecast);

      const today = new Date().toISOString().split('T')[0];
      const filteredHourly = forecastResponse.data.list.filter((entry) =>
        entry.dt_txt.includes(today)
      );
      setHourlyForecast(filteredHourly);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
      setForecast([]);
      setHourlyForecast([]);
    }
  };

  const getActivitiesBasedOnWeather = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'Great day for a walk or outdoor sports!';
      case 'clouds':
        return 'Perfect weather to visit a museum or have a cozy day indoors with a book.';
      case 'rain':
        return 'How about visiting a cafe or watching movies at home?';
      case 'snow':
        return 'Ideal time for skiing or building a snowman!';
      case 'thunderstorm':
        return 'Better to stay indoors. A movie marathon might be a good idea.';
      default:
        return 'Enjoy your day!';
    }
  };

  const showInfo = () => {
    alert("PM Accelerator is a program focused on training and accelerating Product Management skills and careers. Visit their LinkedIn page for more information.");
  };

  return (
    <div className="app">
      <div className="search-container">
        <h1 className="title">Weather Finder</h1>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="search-input"
        />
        <button onClick={getWeather} className="search-button">Get Weather</button>
        {error && <p className="error">{error}</p>}
      </div>

      {weather && (
        <div className="weather-container">
          <h2 className="city-name">{weather.name}</h2>
          <p className="temperature">{Math.round(weather.main.temp)}°C</p>
          <p className="weather-description">{weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <div className="weather-details">
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </div>
          <div className="activities-suggestions">
            <h3>Suggested Activities</h3>
            <p>{activities}</p>
          </div>
        </div>
      )}

      <div className="linkedin-section">
        <img 
          src={LinkedInImage} 
          alt="Arham Doshi" 
          className="linkedin-image" 
        />
        <p>
          <a href="https://www.linkedin.com/in/arham-doshi-2460a2274" target="_blank" rel="noopener noreferrer" className="linkedin-link">
            View My LinkedIn
          </a>
        </p>
      </div>

      {forecast.length > 0 && (
        <div className="forecast-container">
          <h3>5-Day Forecast</h3>
          <div className="forecast">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                <p>{Math.round(day.main.temp)}°C</p>
                <p>{day.weather[0].description}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="forecast-icon"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {hourlyForecast.length > 0 && (
        <div className="hourly-forecast-container">
          <h3>Today's Hourly Forecast</h3>
          <div className="hourly-forecast">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-forecast-hour">
                <p>{new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{Math.round(hour.main.temp)}°C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                  alt={hour.weather[0].description}
                  className="hourly-forecast-icon"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="info-button" onClick={showInfo}>Info about PM Accelerator</button>
    </div>
  );
}

export default App;
