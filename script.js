/* --- ÇEKMECE (DRAWER) KONTROL FONKSİYONLARI --- */

// Çekmeceyi açar (Genişliği 250px yapar)
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

// Çekmeceyi kapatır (Genişliği 0 yapar)
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Çekmeceden şehir seçilince çalışan fonksiyon
function selectCity(cityName) {
    // 1. Input kutusunu seçilen şehirle doldur (görsellik için)
    const cityInput = document.getElementById("city");
    if (cityInput) {
        cityInput.value = cityName;
    }

    // 2. Çekmeceyi kapat
    closeNav();

    // 3. Hava durumu fonksiyonunu bu şehirle başlat
    getWeather(cityName);
}

/* --- HAVA DURUMU API FONKSİYONU --- */

async function getWeather(manuelSehirIsmi = null) {
    const resultDiv = document.getElementById("result");
    let cityName;

    // Eğer fonksiyona parametre geldiyse (Çekmeceden tıklandıysa) onu kullan
    if (manuelSehirIsmi && typeof manuelSehirIsmi === 'string') {
        cityName = manuelSehirIsmi;
    } else {
        // Parametre yoksa input kutusuna bak (Butona tıklandıysa)
        cityName = document.getElementById("city").value;
    }

    // Şehir adı boşsa uyarı ver
    if (!cityName) {
        resultDiv.textContent = "Lütfen bir şehir seçin veya yazın.";
        return;
    }

    resultDiv.textContent = "Veriler çekiliyor, lütfen bekleyin...";

    try {
        // 1) Geocoding API (Şehir isminden koordinat bulma)
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            resultDiv.textContent = "Şehir bulunamadı. Lütfen isimi kontrol edin.";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2) Weather API (Koordinattan hava durumu bulma)
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        // Sonucu ekrana basma (Okunabilir formatta)
        const output = {
            Durum: "Başarılı",
            Konum: `${name}, ${country}`,
            Sicaklik: `${weatherData.current_weather.temperature} °C`,
            Ruzgar: `${weatherData.current_weather.windspeed} km/h`,
            API_Detaylari: weatherData // Orijinal detaylı veri
        };

        resultDiv.textContent = JSON.stringify(output, null, 2);

    } catch (error) {
        console.error("Hata:", error);
        resultDiv.textContent = "Bir hata oluştu. İnternet bağlantınızı kontrol edin.";
    }
}
