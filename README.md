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
docker run -p 4321:4321  ahmethuseyindok/twitter-scraper-server 
```

## Usage

```
GET http://localhost:4321/query?query=coding
```

It basically searches in the page then scrolls down, so if you want to get more results you can specify the scroll count on the query. Scroll count defaults to 20 if not provided.

```
GET http://localhost:4321/query?query=coding&scroll=50
```

