// server file for get all API call

// create app from express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 8081;

// packages loads
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const { createSecretKey } = require('crypto');

// api key
const tiingo_token = 'b40d722db781b47d4be7a6930a6388d7d2e1dca6';
const news_token = '5afd8a5ea7534bf6b8ce0390d1ffa8fa';

// incoming data should be json type
app.use(bodyParser.json());
app.use(express.static(path.join( __dirname, 'stock-search-web-angular', 'dist', 'stock-search-web-angular')));

// For cors policy
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
// used for autocomplete
app.get('/autocomplete', (req, res) => {
    var symbol = req.query.ticker;
    var url = `https://api.tiingo.com/tiingo/utilities/search?query=${symbol}&token=${tiingo_token}`;

    axios.get(url).then((response) => {
        var data = response.data;
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

// used for getting metadata
app.get('/metadata', (req, res) => {
    var symbol = req.query.ticker;
    var url = `https://api.tiingo.com/tiingo/daily/${symbol}?token=${tiingo_token}`;

    axios.get(url).then((response) => {
        var data = response.data;
        res.json(data);
    }).catch((err) => {
        res.json({
            'error': 'invalid-ticker'
        });
        console.log(err);
    })
});

// used for getting last price of ticker
app.get('/lastPrice', (req, res) => {
    var symbol = req.query.ticker;
    var url = `https://api.tiingo.com/iex?tickers=${symbol}&token=${tiingo_token}`;

    axios.get(url).then((response) => {
        var data = response.data;
        res.json(data);
    }).catch((err) => {
        res.json({
            'error': 'invalid-ticker'
        });
        console.log(err);
    })
});

// used for getting daily price for summary tab
app.get('/dailyPrice', (req, res) => {
    var symbol = req.query.ticker;
    var urlTimeStamp = `https://api.tiingo.com/iex?tickers=${symbol}&token=${tiingo_token}`;

    axios.get(urlTimeStamp).then((response) => {
        var timeStamp = response.data[0].timestamp;
        var date = new Date(timeStamp);
        
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        // var now_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
        var now_time = `${yyyy}-${mm}-${dd}`;

        var url = `https://api.tiingo.com/iex/${symbol}/prices?startDate=${now_time}&resampleFreq=4min&token=${tiingo_token}`;

        axios.get(url).then((response) => {
            var daily_data = [];
            var response_data = response.data;
            for (let i = 0; i < response_data.length; i++) {
                let cur_obj = new Date(response_data[i]['date']);
                var year = cur_obj.getFullYear();
                var month = cur_obj.getMonth();
                var day = cur_obj.getDate();
                var hour = cur_obj.getHours();
                var minute = cur_obj.getMinutes();
                
                var pair = [Date.UTC(year, month, day, hour, minute), response_data[i]['close']]
                daily_data.push(pair);
            }
            
            res.json({
                'daily': daily_data
            });
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        res.json({
            'error': 'invalid-ticker'
        });
        console.log(err);
    })
});

// used for getting last price of ticker
app.get('/historyPrice', (req, res) => {
    var symbol = req.query.ticker;
    var urlTimeStamp = `https://api.tiingo.com/iex?tickers=${symbol}&token=${tiingo_token}`;

    axios.get(urlTimeStamp).then((response) => {
        var timeStamp = response.data[0].timestamp;
        var date = new Date(timeStamp);
        var now_time = `${date.getFullYear()-2}-${date.getMonth() + 1}-${date.getDay()}`;
        var url = `https://api.tiingo.com/iex/${symbol}/prices?startDate=${now_time}&resampleFreq=12hour&columns=open,high,low,close,volume&token=${tiingo_token}`;

        axios.get(url).then((response) => {
            var vol = [];
            var ohlc = []
            var response_data = response.data;
        
            // console.log(`Total number of history data: ${response_data.length}`);

            for (let i = 0; i < response_data.length; i++) {
                let cur_obj = new Date(response_data[i]['date']);
                var year = cur_obj.getFullYear();
                var month = cur_obj.getMonth() + 1;
                var day = cur_obj.getDate();
                var hour = cur_obj.getHours();
                var minute = cur_obj.getMinutes();
                
                // for price list
                var date2price = [Date.UTC(year, month, day, hour, minute), response_data[i].open, response_data[i].high, response_data[i].low, response_data[i].close]
                ohlc.push(date2price);

                // for volume list
                var date2vol = [Date.UTC(year, month, day, hour, minute), response_data[i].volume];
                vol.push(date2vol);
            }
            
            res.json({
                'ohlc': ohlc,
                'vol': vol
            });
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        res.json({
            'error': 'invalid-ticker'
        });
        console.log(err);
    })
});

// used for getting last price of ticker
app.get('/news', (req, res) => {
    var symbol = req.query.ticker;
    var url = `https://newsapi.org/v2/everything?apiKey=${news_token}&q=${symbol}`;

    axios.get(url).then((response) => {
        var data = response.data.articles;

        var monthNames = ["January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"];

        for (let i = 0; i < data.length; i++) {
            let d = new Date(data[i].publishedAt);
            var name = monthNames[d.getMonth()];
            data[i].publishedAt = `${name} ${d.getDate()}, ${d.getFullYear()}`;
        }

        res.json(data);
    }).catch((err) => {
        res.json({
            'error': 'invalid-ticker'
        });
        console.log(err);
    })
});

// Application listent to port 3000
app.listen(port, ()=>{
    console.log(`Server listening to port::${port}!`);
});

