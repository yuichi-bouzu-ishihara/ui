# Node.jsのベースイメージを使用
FROM node:18-slim

ENV TZ Asia/Tokyo

# 作業ディレクトリを設定
WORKDIR /app

# セキュリティアップデートを含む最新のパッケージを確実にインストール
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    git \
    vim

# npmを特定のバージョンにアップグレード
RUN npm install -g npm@10.6.0

COPY . .
RUN npm install

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

RUN npm run docker-build

CMD ["npm", "run", "start"]