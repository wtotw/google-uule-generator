# Google uule Generator

Google検索で使われるuuleのジェネレーター。

# 使い方

## 事前準備

```bash
cp .env.example .env

# API_KEYを設定
vi .env

pnpm install
```

## CLI

```bash
pnpm ts-node src/command/uule.ts -l "東京都品川区"
```

## CSV出力

事前にpublic/csv/inputにCSVを配置してください

```bash
pnpm ts-node src/csv.ts
```