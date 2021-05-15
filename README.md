# twitter-scraper-server

A basic server that queries latest tweets for a hashtag using puppeeter

## How does it work ?

When the url is called, it navigates to `https://twitter.com/hashtag/` then listen for requests. Then when the request with tweets returnes from twitter api, cancels the navigation and return the request body as a result.

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

### With a `count` param

```
GET http://localhost:4321/query?query=coding&count=40
```
