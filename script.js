async function getWeather() {
    const cityName = document.getElementById("city").value;

    // 1) Geocoding API
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
        document.getElementById("result").textContent = "Şehir bulunamadı.";
        return;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2) Weather API
    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    document.getElementById("result").textContent = JSON.stringify(weatherData, null, 2);
}
