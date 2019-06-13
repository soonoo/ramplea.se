const axios = require('axios');

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

for(const platform of Object.keys(urls)){
  axios.get(urls[platform])
    .then(({ data })=> {
      const { groupModelList: priceList } = data.lpList.find(i => {
        const model = i.strModelName;
        return model.includes('삼성') && model.includes('21300');
      });

      console.log(platform);
      for(const capacity of capacities.values()) {
        console.log(`${capacity}:${priceList.find(i => i.strBeginnerDicCondiname === capacity).longMinprice}`);
      }
    })
}
