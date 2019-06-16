# ramplea.se
ramplea.se is a simple http API that provides a retail price of DRAM. You can check price of RAM in [ram.soonoo.me](https://ram.soonoo.me).

  
## Usage
Prices are in json file and you can use path of that json as path parameter in url.

sample [`data.json`](https://github.com/soonoo/ramplea.se/blob/master/sample.json):
```
{
  "kr": {
    "laptop": {"4g":"21080","8g":"36550","16g":"75710"},
    "desktop":{"4g":"20130","8g":"33140","16g":"68700"}
  },
  "us": {
    "laptop": {"4g":"21.91","8g":"44.14","16g":"81.03"},
    "desktop":{"4g":"22.12","8g":"42.60","16g":"84.71"}
  }
}
```

To get 16 gigabyes desktop RAM's price in US:  
(price is in [USD](https://en.wikipedia.org/wiki/United_States_dollar))

```
$ curl https://ram.soonoo.me/us/desktop/16g
84.71
```

To get RAM prices in Korea:  
(prices are in [KRW](https://en.wikipedia.org/wiki/South_Korean_won))
```
$ curl https://ram.soonoo.me/kr
{
  "kr": {
    "laptop": {"4g":"21080","8g":"36550","16g":"75710"},
    "desktop":{"4g":"20130","8g":"33140","16g":"68700"}
  }
}
```

## Q&A
- Q: Is this real time?
  - A: Prices are updated every 10 minutes and may not be accurate.
- Q: Where these prices are from?
  - A: kr: [enuri.com](http://www.enuri.com), us: [amazon.com](https://www.amazon.com)
