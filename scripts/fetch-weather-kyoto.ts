#!/usr/bin/env bun
// Fetches today's weather for Kyoto Shimogyo-ku from Open-Meteo
// and writes weather/kyoto-shimogyo.json.
//
// Run from repo root: bun run scripts/fetch-weather-kyoto.ts
// Used by .github/workflows/weather-kyoto.yml.

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=34.9986&longitude=135.7575&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=1"

type OpenMeteoResp = {
  daily: {
    time: string[]
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

const wmoMap: Record<number, { text: string; emoji: string }> = {
  0: { text: "晴れ", emoji: ":sunny:" },
  1: { text: "晴れ", emoji: ":sunny:" },
  2: { text: "晴れ時々曇り", emoji: ":partly_sunny:" },
  3: { text: "曇り", emoji: ":cloud:" },
  45: { text: "霧", emoji: ":fog:" },
  48: { text: "霧", emoji: ":fog:" },
  51: { text: "霧雨", emoji: ":rain_cloud:" },
  53: { text: "霧雨", emoji: ":rain_cloud:" },
  55: { text: "霧雨", emoji: ":rain_cloud:" },
  56: { text: "霧雨", emoji: ":rain_cloud:" },
  57: { text: "霧雨", emoji: ":rain_cloud:" },
  61: { text: "雨", emoji: ":rain_cloud:" },
  63: { text: "雨", emoji: ":rain_cloud:" },
  65: { text: "雨", emoji: ":rain_cloud:" },
  66: { text: "雨", emoji: ":rain_cloud:" },
  67: { text: "雨", emoji: ":rain_cloud:" },
  71: { text: "雪", emoji: ":snowflake:" },
  73: { text: "雪", emoji: ":snowflake:" },
  75: { text: "雪", emoji: ":snowflake:" },
  77: { text: "みぞれ", emoji: ":snowflake:" },
  80: { text: "にわか雨", emoji: ":rain_cloud:" },
  81: { text: "にわか雨", emoji: ":rain_cloud:" },
  82: { text: "にわか雨", emoji: ":rain_cloud:" },
  85: { text: "雪のにわか", emoji: ":snowflake:" },
  86: { text: "雪のにわか", emoji: ":snowflake:" },
  95: { text: "雷雨", emoji: ":thunder_cloud_and_rain:" },
  96: { text: "雷雨とひょう", emoji: ":thunder_cloud_and_rain:" },
  99: { text: "雷雨とひょう", emoji: ":thunder_cloud_and_rain:" },
}

const res = await fetch(URL)
if (!res.ok) {
  console.error(`Open-Meteo HTTP ${res.status}`)
  process.exit(1)
}
const data = (await res.json()) as OpenMeteoResp
const code = data.daily.weathercode[0]
const mapped = wmoMap[code] ?? { text: "不明", emoji: ":question:" }

const output = {
  date: data.daily.time[0],
  fetched_at: new Date().toISOString(),
  source: "open-meteo",
  location: "Kyoto Shimogyo-ku",
  weather_text: mapped.text,
  slack_emoji: mapped.emoji,
  max_c: Math.round(data.daily.temperature_2m_max[0]),
  min_c: Math.round(data.daily.temperature_2m_min[0]),
  wmo_code: code,
}

await Bun.write(
  "weather/kyoto-shimogyo.json",
  `${JSON.stringify(output, null, 2)}\n`,
)
console.log(JSON.stringify(output, null, 2))
