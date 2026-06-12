export type WeatherResult = {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  unit: "C" | "F";
};

export async function getWeather(
  lat: number,
  lng: number,
): Promise<WeatherResult> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return getMockWeather();
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${apiKey}`,
  );

  if (!response.ok) {
    return getMockWeather();
  }

  const data = await response.json();

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0]?.description ?? "",
    icon: data.weather[0]?.icon ?? "01d",
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    unit: "F",
  };
}

function getMockWeather(): WeatherResult {
  return {
    temp: 95,
    feelsLike: 102,
    description: "hot and sunny",
    icon: "01d",
    humidity: 55,
    windSpeed: 8,
    unit: "F",
  };
}

export function hasWeatherApiKey(): boolean {
  return Boolean(process.env.OPENWEATHER_API_KEY);
}
