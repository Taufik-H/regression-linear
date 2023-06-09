import React, { useState } from 'react';
import axios from 'axios';
import * as math from 'mathjs';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API;
const WEATHER_API_ENDPOINT = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=`;

export default function App() {
  const [location, setLocation] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regressionResult, setRegressionResult] = useState(null);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
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
      }));

      const predictedWeather = applyRegressionAlgorithm(historicalData);
      setPrediction(predictedWeather);
      setLoading(false);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data cuaca:', error);
      setLoading(false);
    }
  };

  const applyRegressionAlgorithm = (data) => {
    const dates = data.map((item) => item.date);
    const temps = data.map((item) => item.temp);

    const X = dates.map((date) => [1, new Date(date).getTime()]); // Include date using timestamp

    // Calculate regression coefficients using matrix operations
    const XTranspose = math.transpose(X);
    const XTX = math.multiply(XTranspose, X);
    const XTY = math.multiply(XTranspose, temps);
    const coefficients = math.multiply(math.inv(XTX), XTY);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowFeatures = [1, tomorrowDate.getTime()]; // Encode tomorrow's date

    // Predict tomorrow's temperature using regression coefficients
    const tomorrowTemp = math.multiply(tomorrowFeatures, coefficients);

    // Additional logic to predict weather condition based on temperature
    const condition =
      tomorrowTemp >= 25 ? 'Cerah' : tomorrowTemp >= 15 ? 'Berawan' : 'Hujan';

    const regressionResult = {
      coefficients,
      tomorrowTemp: tomorrowTemp.toFixed(2),
      condition,
    };

    setRegressionResult(regressionResult);

    return {
      temp: regressionResult.tomorrowTemp,
      condition,
    };
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-5">
        <div className="bg-white shadow-md rounded px-8 py-6">
          <h1 className="text-xl font-bold mb-4">Prediksi Cuaca</h1>
          <div className="flex mb-4">
            <input
              className="appearance-none rounded-r-none bg-white border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              type="text"
              value={location}
              onChange={handleLocationChange}
              placeholder="Masukkan nama lokasi"
            />
            <button
              className="bg-blue-500  hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-l-none"
              onClick={fetchWeatherData}
              disabled={location === '' || loading}
            >
              {loading ? 'Memuat...' : 'Dapatkan Prediksi Cuaca'}
            </button>
          </div>
          {loading && <p>Proses algoritma regresi sedang berjalan...</p>}
        </div>
        {regressionResult && (
          <div className="mt-4 bg-white shadow-md rounded px-8 py-6">
            <h3 className="text-lg font-bold mb-2">Hasil Algoritma Regresi</h3>
            <p className="mb-2">Rumus Algoritma Regresi:</p>
            <code className="mb-2">
              Y = {regressionResult.coefficients[0].toFixed(2)} +
              {regressionResult.coefficients[1].toFixed(2)} * X
            </code>
            <p className="mb-2">
              Nilai X (timestamp besok): {regressionResult.tomorrowTemp}
            </p>
            <p className="mb-2">
              Prediksi suhu cuaca besok: {regressionResult.tomorrowTemp}°C
            </p>
            <p>Kondisi cuaca besok: {regressionResult.condition}</p>
          </div>
        )}
        {prediction && (
          <div className="mt-4 bg-white shadow-md rounded px-8 py-6">
            <p className="mb-4">
              Prediksi cuaca besok: {prediction.temp}°C, {prediction.condition}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
