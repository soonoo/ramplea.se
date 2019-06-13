const axios = require('axios');
const fs = require('fs');

const mobile = `http://www.enuri.com/lsv2016/ajax/getListGoods_ajax.jsp\?random_seq=519
  &pageNum=1&pageGap=30&tabType=0&cate=070341&keyword=&brand=&factory=
  &shop_code=&prtmodelno=&gb1=&gb2=&sponsorList=&infoAdList=&IsDeliverySumPrice=N
  &IsJungoPriceRemove=N&m_price=&start_price=&end_price='`;
const pc = `http://www.enuri.com/lsv2016/ajax/getListGoods_ajax.jsp?random_seq=721
  &pageNum=1&pageGap=30&tabType=0&cate=070340&keyword=&brand=&factory=&shop_code=&prtmodelno=
  &gb1=&gb2=&sponsorList=&infoAdList=&IsDeliverySumPrice=N&IsJungoPriceRemove=N&m_price=
  &start_price=&end_price=`;

const urls = { mobile, pc };
const capacities = [ '4G', '8G', '16G' ];

const main = async () => {
  console.log('Fethcing DRAM prices ...');
  const results = {};

  for(const platform of Object.keys(urls)) {
    const { data } = await axios.get(urls[platform]);
    const { groupModelList: priceList } = data.lpList.find(i => {
      const model = i.strModelName;
      return model.includes('삼성') && model.includes('21300');
    });
    results[platform] = {};

    for(const capacity of capacities.values()) {
      const price = priceList.find(i => i.strBeginnerDicCondiname === capacity).longMinprice;
      results[platform][capacity] = price;
    }

  }
  console.log('Got DRAM prices!');
  fs.writeFileSync('data.json', JSON.stringify(results))
}

main();
