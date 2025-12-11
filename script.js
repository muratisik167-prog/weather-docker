// --- API ANAHTARINI BURAYA GİR (OpenWeatherMap) ---
const API_KEY = 'SENIN_API_ANAHTARIN'; 

const searchBox = document.querySelector('#searchBox');
const searchBtn = document.querySelector('#searchBtn');
const errorMsg = document.querySelector('.error-msg');
const weatherCard = document.querySelector('.weather-card');

// Olay Dinleyicileri
searchBtn.addEventListener('click', () => checkWeather(searchBox.value));
searchBox.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') checkWeather(searchBox.value);
});

async function checkWeather(city) {
    if(!city) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (response.status === 404) {
            errorMsg.style.display = 'block';
            weatherCard.style.display = 'none';
            // Hata durumunda arka planı varsayılana döndür
            document.body.className = 'default-bg';
        } else {
            const data = await response.json();
            errorMsg.style.display = 'none';
            weatherCard.style.display = 'block';

            // Verileri HTML'e yerleştir
            document.querySelector('#city').innerHTML = `${data.name}, ${data.sys.country}`;
            // Tarihi formatla (Örn: 12 Aralık 2023, Salı)
            const date = new Date();
            document.querySelector('#date').innerHTML = date.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            document.querySelector('#temperature').innerHTML = Math.round(data.main.temp);
            document.querySelector('#weatherCondition').innerHTML = data.weather[0].description;
            document.querySelector('#humidity').innerHTML = data.main.humidity + '%';
            document.querySelector('#windSpeed').innerHTML = Math.round(data.wind.speed) + ' km/s';
            document.querySelector('#cloudiness').innerHTML = data.clouds.all + '%';

            // İkonu API'den çek (daha kaliteli ikonlar için yerel dosyalar kullanılabilir)
            const iconCode = data.weather[0].icon;
            document.querySelector('#weatherIconImg').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            // --- KRİTİK NOKTA: ARKA PLANI GÜNCELLE ---
            updateBackground(data.weather[0].main, iconCode);
        }

    } catch (error) {
        console.error("Hata:", error);
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = "Bağlantı hatası oluştu.";
    }
}

// Hava durumuna ve gece/gündüz durumuna göre arka plan sınıfını değiştirir
function updateBackground(weatherMain, iconCode) {
    const body = document.body;
    // İkon kodunun son harfi 'n' ise gecedir, 'd' ise gündüzdür.
    const isNight = iconCode.includes('n');

    // Önce tüm sınıfları temizle
    body.className = '';

    switch (weatherMain.toLowerCase()) {
        case 'clear':
            body.classList.add(isNight ? 'clear-night' : 'clear-day');
            break;
        case 'clouds':
            body.classList.add('clouds');
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            body.classList.add('rain'); // Yağmurlu görseli tetiklenir
            break;
        case 'snow':
            body.classList.add('snow');
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'fog':
            body.classList.add('atmosphere');
            break;
        default:
            body.classList.add('default-bg');
            break;
    }
}
