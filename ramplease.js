const axios = require('axios');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { get, set, toNumber } = require('lodash');
const cheerio = require('cheerio');
const dayjs = require('dayjs');

const kr_laptop = `http://www.enuri.com/lsv2016/ajax/getListGoods_ajax.jsp?random_seq=519
  &pageNum=1&pageGap=30&tabType=0&cate=070341&keyword=&brand=&factory=
  &shop_code=&prtmodelno=&gb1=&gb2=&sponsorList=&infoAdList=&IsDeliverySumPrice=N
  &IsJungoPriceRemove=N&m_price=&start_price=&end_price='`;
const kr_pc = `http://www.enuri.com/lsv2016/ajax/getListGoods_ajax.jsp?random_seq=721
  &pageNum=1&pageGap=30&tabType=0&cate=070340&keyword=&brand=&factory=&shop_code=&prtmodelno=
  &gb1=&gb2=&sponsorList=&infoAdList=&IsDeliverySumPrice=N&IsJungoPriceRemove=N&m_price=
  &start_price=&end_price=`;
const kr = {
  laptop: kr_laptop,
  pc: kr_pc,
};

const us_laptop = `https://www.amazon.com/s?k=samsung+21300+SODIMM&rh=n%3A172500&ref=nb_sb_noss`;
const us_pc = `https://www.amazon.com/s?k=samsung+21300+DIMM&rh=n%3A172500&ref=nb_sb_noss`;
const us = {
  laptop: us_laptop,
  pc: us_pc,
};

const capacities = [ '4G', '8G', '16G' ];

const main = async () => {
  const results = {};

  // Korea - enuri.com
  for(const [platform, url] of Object.entries(kr)) {
    const { data } = await axios.get(url);
    const { groupModelList: priceList } = data.lpList.find(i => {
      const model = i.strModelName;
      return model.includes('삼성') && model.includes('21300');
    });

    for(const capacity of capacities.values()) {
      const price = priceList.find(i => i.strBeginnerDicCondiname === capacity).longMinprice;
      set(results, `kr.${platform}.${capacity.toLowerCase()}`, price);
    }
  }

  // United States - amazon.com
  for(const [platform, url] of Object.entries(us)) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data)
    const list = $('.s-result-list').children();

    list.each(function(index, element) {
      const t = $(this).find('.a-size-medium').text().toLowerCase();
      const price = $(this).find('.a-offscreen').text().slice(1);

      const term = platform === 'pc' ? 'desktop' : platform;
      if(!t.includes(term)) return;

      for(const capacity of capacities.map(c => c.toLowerCase()).values()) {
        const path = `us.${platform}.${capacity}`;

        if(!t.includes(`samsung ${capacity}`)) continue;
        if(toNumber(get(results, path, Number.MAX_VALUE)) < toNumber(price)) continue;
        set(results, path, price);
      }
    })
  }

  const dirname = 'data';
  const filename = `${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.json`;
  if(!existsSync(dirname)) mkdirSync(dirname);
  writeFileSync(`${dirname}/${filename}`, JSON.stringify(results))
}

main();

