var axios = require('axios');
const timeout = ms => new Promise(res => setTimeout(res, ms));
var myArgs = process.argv.slice(2);

var listOfStables = [
  {
    name : 'your-stable-name1',
    headers : {"User-Agent":"PostmanRuntime/7.28.4","Accept":"*/*", "Connection":"keep-alive", "Accept-Encoding":"gzip, deflate, br","Authorization":`Bearer <bearer_token>`},
    horses : ['horse-id-1a','horse-id-1b','horse-id-1c']
  },
  {
    name : 'your-stable-name2',
    headers : {"User-Agent":"PostmanRuntime/7.28.4","Accept":"*/*", "Connection":"keep-alive", "Accept-Encoding":"gzip, deflate, br","Authorization":`Bearer <bearer_token>`},
    horses : ['horse-id-2a','horse-id-2b']
  }
];

async function get(url, config) {
    const response = await axios.get(`${url}`, config);
    if (response.error) {
      return Promise.reject(
        new Error(`Error GET ${url} : ${JSON.stringify(response)}`)
      );
    }
    return response.data;
}

async function getForEachHorse({ headers, horses}){
  
  var result = [];
  for (let hkey in horses){
    let aHorse = await get(`https://api.zed.run/api/v1/horses/fatigue/${horses[hkey]}`, {headers}).catch(err => console.error(err.response.statusText));
    timeout(5000).then(console.log("rate limit request " + horses[hkey])); 
    result.push({
      'horse_id':horses[hkey],
      'fatigue': aHorse.current_fatigue,
      'power': 100-aHorse.current_fatigue});
  }
  return result;
}
function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

async function getFatigue (rid) {
  let todayd = new Date();
  let offset = todayd.getTimezoneOffset();

  console.log(new Date(todayd.getTime()+(offset*60*1000)).toUTCString());
   for (var key in listOfStables) {
      console.log(`Stable name : ${listOfStables[key].name}`);
      console.table(await getForEachHorse(listOfStables[key]));
    } 
}

getFatigue(myArgs);