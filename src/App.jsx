import React, { useState } from 'react';
import axios from 'axios';
import * as math from 'mathjs';

const WEATHER_API_KEY = `${import.meta.env.VITE_WEATHER_API}`;
const WEATHER_API_ENDPOINT = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=`;

export default function App() {
  const [location, setLocation] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regressionResult, setRegressionResult] = useState(null);
  const [locationError, setLocationError] = useState(false);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setPrediction(null);
    setLocationError(false);
  };

  const fetchWeatherData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${WEATHER_API_ENDPOINT}${location}&days=2`
      );
      const data = response.data;
      const historicalData = data.forecast.forecastday.map((day) => ({
        date: day.date,
        temp: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      }));

      const predictedWeather = applyRegressionAlgorithm(historicalData);
      setPrediction(predictedWeather);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('lokasi tidak ditemukan');
        setPrediction(null);
        setLocationError(true);
      }

      setLoading(false);
    }
  };

  const applyRegressionAlgorithm = (data) => {
    const dates = data.map((item) => item.date);
    const temps = data.map((item) => item.temp);

    const X = dates.map((date) => [1, new Date(date).getTime()]); // Include date menggunakan timestamp

    // menghitung koefisien regresi menggunakan metode normal equation
    const XTranspose = math.transpose(X);
    const XTX = math.multiply(XTranspose, X);
    const XTY = math.multiply(XTranspose, temps);
    const coefficients = math.multiply(math.inv(XTX), XTY);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowFeatures = [1, tomorrowDate.getTime()]; // ambil data besok (waktu)

    // prediksi temperatur besok berdasarkan data historis
    const tomorrowTemp = math.multiply(tomorrowFeatures, coefficients);

    // prediksi berdasarkan suhu atau temperatur
    let condition = '';
    let icon = '';

    if (tomorrowTemp >= 30) {
      condition = 'Cerah';
      icon = 'https://openweathermap.org/img/wn/01d.png';
    } else if (tomorrowTemp >= 20) {
      condition = 'Berawan';
      icon = 'https://openweathermap.org/img/wn/02d.png';
    } else {
      condition = 'Hujan';
      icon = 'https://openweathermap.org/img/wn/10d.png';
    }

    const regressionResult = {
      coefficients,
      tomorrowTemp: tomorrowTemp.toFixed(2),
      condition,
      icon,
    };

    setRegressionResult(regressionResult);

    console.table(regressionResult);
    return {
      temp: regressionResult.tomorrowTemp,
      condition: regressionResult.condition,
      icon,
    };
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-2">
        <div className="bg-white bg-opacity-20 rounded-xl p-3 border border-gray-300 ">
          <h1 className="text-xl font-bold mb-4 text-white">Prediksi Cuaca</h1>
          <div className="flex flex-col mb-4">
            <div className="flex items-center bg-white rounded-md py-2 px-3 mb-2">
              <input
                className="bg-white outline-none flex-grow text-slate-800 placeholder-slate-500"
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="Masukkan nama lokasi"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg"
                onClick={fetchWeatherData}
                disabled={location === '' || loading}
              >
                {loading ? 'Memuat...' : 'Prediksi'}
              </button>
            </div>
          </div>
          {loading && <p>Proses algoritma regresi sedang berjalan...</p>}
          {!loading && location !== '' && prediction && (
            <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-3 border border-gray-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-slate-600">
                  <img
                    src={prediction.icon}
                    alt="Weather Icon"
                    className="w-20 h-20 mr-3 object-contain"
                  />
                </div>
                <p className="text-lg font-bold mb-4 text-white">
                  Prediksi cuaca besok: {prediction.temp}°C,{' '}
                  {prediction.condition}
                </p>
              </div>
            </div>
          )}
          {!loading && location !== '' && !prediction && locationError && (
            <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-3 border border-gray-300">
              <div className="flex flex-col items-center">
                <p className="text-lg font-bold mb-4 text-white">
                  Lokasi tidak tersedia
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
