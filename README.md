# traffic-api

This repository hosts the code behind the API used by [TrafficExplorer](https://github.com/wbkd/mfund-dashboard).
The data can be imported using the [TrafficExplorer-importer](https://github.com/wbkd/traffic-etl/).

Requirements:
- Node.js >= v9
- npm >= v5
- MongoDB >= 3.4
- Docker (optional)

# Installation

First, clone the repository:
```
git clone https://github.com/wbkd/traffic-api
```

It is reccomended to install Node.js and npm using [nvm](https://github.com/creationix/nvm).
Then you can use the required Node.js version running the following command in the root project folder:
```
nvm use
```

MongoDB can run in a Docker container:
```
docker run --name traffic-mongo -d mongo
```

Install all npm dependencies running:
```
npm install
```

# Config

You can configure the database URI and access credentials, as well as all exposed routes in the `manifest.json` file.

# Usage

Start the API server running:
```
npm start
```

To learn about other commands just run:
```
npm run
```

# API docs

You can find the API docs at [https://traffic-vis.webkid.io/docs](https://traffic-vis.webkid.io/docs). Read the notes below for further information.

## v1

An example query would be [https://traffic-vis.webkid.io/api/data?land=TH](https://traffic-vis.webkid.io/api/data?land=TH). You can combine all fields in [model.js](https://github.com/wbkd/traffic-api/blob/master/lib/model.js).

The data aggregated by day can be retrieved using the `/api/data/by_day` endpoint in the same way you use `/api/data`.

You can call the following URL in order to get a list of all stations:
[https://traffic-vis.webkid.io/api/stations](https://traffic-vis.webkid.io/api/stations).

## v2

The second version of the API provides data from 2003 to 2016 for Autobahn and Bundesstraße.
The quey mechanism is similar to **v1**, so an example query is
```
https://traffic-vis.webkid.io/api/v2/data?land=HH&roadid=1&fromDate=2004-01-01&toDate=2004-01-02
```

The `/stations` endpoint is also similar, but it returns additional information about the queried station:
```
https://traffic-vis.webkid.io/api/v2/stations
```

Similarly to the `/data` endpoint you can combine the different fields into filters, so that you can for example get a single station by `nr` just calling:
```
https://traffic-vis.webkid.io/api/v2/stations?nr=9863
```

The `/range` route returns the data aggregated by the best timespan for the requested timespan.
```
https://traffic-vis.webkid.io/api/v2/range?roadid=1&fromDate=2015-01-01&toDate=2016-01-07
```
If the chosen timespan is smaller than 7 days, it will return data by hour.
If the timespan is greather than 7 days, it will return data aggregated by day.
If the timespan is greather than 31 days, it will return data aggregated by month.
If the timespan is greather than 365 days, it will return data aggregated by year.

The route `/avg/` can calculate the average of the values by day or by month:
```
https://traffic-vis.webkid.io/api/v2/data/avg/hourly
https://traffic-vis.webkid.io/api/v2/data/avg/by_month
```

The `/near` route can find stations near given coordinates:
```
https://traffic-vis.webkid.io/api/v2/near?lat=49.2307613&lng=7.0807342&distance=1
```

## OSM & Wikidata

You can find detailed information about each highway in the GeoJSONs available on the following routes:
```
https://traffic-vis.webkid.io/data/A1.geojson
https://traffic-vis.webkid.io/data/A2.geojson
...
```

# Deploy

Run:
```
npm run deploy
```
