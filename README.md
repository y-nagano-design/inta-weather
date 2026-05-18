# inta-weather

`RyukyuInteractive/inta` のプライベートリポジトリから `raw.githubusercontent.com` で参照できないため、京都市下京区の天気データを公開する目的だけの薄いリポジトリ。

## 仕組み

- `.github/workflows/fetch.yml` が 22:30 UTC（07:30 JST）に発火
- `scripts/fetch-weather-kyoto.ts` が Open-Meteo を叩く
- 結果を `weather/kyoto-shimogyo.json` にコミット

## 利用先

`RyukyuInteractive/inta` の `self-nagano-ohayo` スキル（リモートエージェント）が、毎朝 09:00 JST に下記URLから読む。

```
https://raw.githubusercontent.com/y-nagano-design/inta-weather/main/weather/kyoto-shimogyo.json
```

## 注意

- このリポジトリには天気データ以外の情報を入れない（公開リポジトリのため）
- スクリプトの修正は `RyukyuInteractive/inta` の `scripts/fetch-weather-kyoto.ts` を正本としてミラーする
