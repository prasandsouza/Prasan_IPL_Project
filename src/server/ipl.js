const Papa = require("papaparse");
const FileSystem = require("fs");
let matches = FileSystem.readFileSync("/home/prasan/IPL/src/data/matches.csv", "utf-8");
let deliveries = FileSystem.readFileSync("/home/prasan/IPL/src/data/deliveries.csv", "utf-8");

const finalDataOfMatch = Papa.parse(matches, {
     header: true,
});
const matchData = finalDataOfMatch["data"];

const finalDatadeliveries = Papa.parse(deliveries, {
    header: true,
});
const deliveryData = finalDatadeliveries["data"];

function matchedPlayedPerYear(matchData){
    return matchData.reduce((finalValue, currentValue) => {
        if(currentValue['id']!==''){
     if (finalValue[currentValue.season]) {
          finalValue[currentValue.season]++;
     } else {
          finalValue[currentValue.season] = 1;
     }
    }
     return finalValue;
}, {});
}
const FirstProblem = matchedPlayedPerYear(matchData)
FileSystem.writeFile('/home/prasan/IPL/src/public/output/matchesPerTeam.json', JSON.stringify(FirstProblem), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});


function winnerperseason(){
    return matchData.reduce((finalValue, currentValue) => {
        if(currentValue['id']!==''){
         if (finalValue[currentValue.winner]) {
              if (finalValue[currentValue.winner][currentValue.season]) {
                   finalValue[currentValue.winner][currentValue.season]++;
              } else {
                   finalValue[currentValue.winner][currentValue.season] = 1;
              }
         }
         else{
            finalValue[currentValue.winner] = {}
            finalValue[currentValue.winner][currentValue.season] = 1;
         }
        }
         return finalValue;
    }, {});
    }
    const secondProblem = winnerperseason()
    
    FileSystem.writeFile('/home/prasan/IPL/src/public/output/winningPerSeason.json', JSON.stringify(secondProblem), (data, error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("File statement.");
        }
    });

function extraRunConceededfunction(){

let season2016 = matchData.reduce((accumulator, currentValue) => {
    if (currentValue.season == 2016) {
         return [...accumulator, parseInt(currentValue["id"])];
    }
    return accumulator;
}, []);


let extrarunconceeded = deliveryData.reduce((accumulator,currentValue)=>{
   if(season2016.includes(parseInt(currentValue.match_id))){
       if(accumulator[currentValue.bowling_team]){
           accumulator[currentValue.bowling_team] += parseInt(currentValue.extra_runs)
       }else{
           accumulator[currentValue.bowling_team] = parseInt(currentValue.extra_runs)
       }
   }
   return accumulator
},{})
return extrarunconceeded

}
const extraRunGiven = extraRunConceededfunction()

FileSystem.writeFile('/home/prasan/IPL/src/public/output/extraRunGiven.json', JSON.stringify(extraRunGiven), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});

function topEconomicalBowler(){
    let seasonMatch2015 = matchData.reduce((accumulator, currentValue) => {
        if (currentValue.season == 2015) {
             return [...accumulator, parseInt(currentValue["id"])];
        }
        return accumulator;
   }, []);
   
   let besteconomy = deliveryData.reduce((accumulator,currentValue)=>{
       if (seasonMatch2015.includes(parseInt(currentValue.match_id))){
           if (accumulator[currentValue.bowler]) {
               accumulator[currentValue.bowler]['runs_conceded'] += parseInt(currentValue.total_runs);
               accumulator[currentValue.bowler]['total_balls']++;
               accumulator[currentValue.bowler]['economy'] = (accumulator[currentValue.bowler]['runs_conceded'] / ((accumulator[currentValue.bowler]['total_balls']) / 6)).toFixed(2);
           }else{
               accumulator[currentValue.bowler] = {};
               accumulator[currentValue.bowler]['runs_conceded'] = parseInt(currentValue.total_runs);
               accumulator[currentValue.bowler]['total_balls'] = 1;
           }
       }  
       return accumulator         
   },{})
   
   let topEconomicalBowler = Object.fromEntries(Object.entries(besteconomy).sort((a, b) => a[1].economy - b[1].economy).slice(0, 10).filter(bowler => {
       bowler[1] = parseFloat( bowler[1].economy)
       return true;
   }));
  return topEconomicalBowler
}
const topTenBowler = topEconomicalBowler()
FileSystem.writeFile('/home/prasan/IPL/src/public/output/TopTenEconomicaBowler.json', JSON.stringify(topTenBowler), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});