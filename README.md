# twitter-scraper-server

A basic server that queries some of latest tweets for a hashtag using puppeeter

## Running with node

Setting up 
```
git clone https://github.com/AhmetHuseyinDOK/twitter-scraper-server.git
cd twitter-scraper-server
npm i
```

Start
```
npm start
```

## Running with docker

```
docker run ahmethuseyindok/twitter-scraper-server --expose 4321
```

## Usage

```
GET http://localhost:4321/query?query=coding
```
