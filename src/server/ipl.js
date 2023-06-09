const Papa = require("papaparse");
const FileSystem = require("fs");
const { Console } = require("console");
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


function tossWinnerAndMatchWinner(){

let result = matchData.reduce((accumulator,currentValue)=>{
     if(!currentValue.id==""){
     if(currentValue.winner==currentValue.toss_winner){
          if(accumulator[currentValue.toss_winner])
          {
               accumulator[currentValue.toss_winner]++
          }
          else{
               accumulator[currentValue.toss_winner] = 1
          }
     }
     }
     return accumulator
},{})
return result
}
let tossAndMAtch = tossWinnerAndMatchWinner()
FileSystem.writeFile('/home/prasan/IPL/src/public/output/tossWinnerAndMatchWinner.json', JSON.stringify(tossAndMAtch), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});
function manOfTheMatch(){
    let seasonId = matchData.reduce((accumulator, currentValue) => {
        if (currentValue.season == 2016) {
             return [...accumulator, parseInt(currentValue["id"])];
        }
        return accumulator;
   }, []);
   
   
   let resulOfManOfTheMatch = matchData.reduce((accumulator, currentValue) => {
        if (!currentValue.id == " ") {
             if (accumulator[currentValue.season]) {
                  if (
                       accumulator[currentValue.season][
                            currentValue.player_of_match
                       ]
                  ) {
                       accumulator[currentValue.season][
                            currentValue.player_of_match
                       ]++;
                  } else {
                       accumulator[currentValue.season][
                            currentValue.player_of_match
                       ] = 1;
                  }
             } else {
                  accumulator[currentValue.season] = {};
             }
        }
        return accumulator;
   }, {});
   let arrayObject = Object.entries(resulOfManOfTheMatch).reduce(
        (accumulator, currentValue) => {
             let manOfTheMtch = Object.entries(currentValue[1])
                  .sort((value1, value2) => {
                       return value2[1] - value1[1];
                  })
                  .slice(0, 1);
             accumulator[currentValue[0]] = Object.fromEntries(manOfTheMtch);
             return accumulator;
        },
        {}
   );
   return arrayObject
}
let manOfMatchSeason = manOfTheMatch()
FileSystem.writeFile('/home/prasan/IPL/src/public/output/tossWinnerAndMatchWinner.json', JSON.stringify(manOfMatchSeason), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});

function strikeRate(){
     let player = deliveryData.filter(PlayerData=>{

          return PlayerData.batsman === "MS Dhoni"
     })
     
     let seasonData = player.map((seasonwise)=> {
          let year = matchData.filter((yearWise)=> {
               return yearWise.id===seasonwise.match_id
          })
          .map((yearWise)=> {
               return yearWise.season
          })
          seasonwise.season = year[0]
          return seasonwise
     })
     
     console.log("MS Dhoni")
     let StrikeRateOfBatsMAn = seasonData.reduce((accumulator,currentValue)=> {
          if(!currentValue.match_id ==" "){
                if(accumulator[currentValue.season]){
                    accumulator[currentValue.season]["runs"] += parseInt(currentValue.batsman_runs)
                    accumulator[currentValue.season]['balls'] ++
                    accumulator[currentValue.season]['StrikeRate'] = parseFloat((accumulator[currentValue.season]['runs']/accumulator[currentValue.season]['balls'])*100).toFixed(2)
                } else {
                    accumulator[currentValue.season] = {}
                    accumulator[currentValue.season]['runs'] = parseInt(currentValue.batsman_runs)
                    accumulator[currentValue.season]['balls'] = 1
               }
          }
          return accumulator
     },{})

     return StrikeRateOfBatsMAn
}
let StrikeRateOfBatsman = strikeRate()
FileSystem.writeFile('/home/prasan/IPL/src/public/output/strikeRateOfBatsMan.json', JSON.stringify(StrikeRateOfBatsman), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});
function dismissal(){

     let mostDismissedPlayer = {batsman : null, bowler : null, dismissals : 0};
 
      deliveryData.filter((ball) => {
         if (ball.dismissal_kind !== '' && ball.dismissal_kind !== 'run out') {
             return true;
         }
     })
     .reduce((accumulator, currentValue) => {
 
         if (accumulator[currentValue.batsman]) {
 
               if (accumulator[currentValue.batsman][currentValue.bowler]) 
               {
                    accumulator[currentValue.batsman][currentValue.bowler] ++
               } else {
                    accumulator[currentValue.batsman][currentValue.bowler] = 1
               }

               if (mostDismissedPlayer.dismissals < accumulator[currentValue.batsman][currentValue.bowler]) {
                    mostDismissedPlayer.batsman = currentValue.batsman;
                    mostDismissedPlayer.bowler = currentValue.bowler;
                    mostDismissedPlayer.dismissals = accumulator[currentValue.batsman][currentValue.bowler];
               }
          } else {
                    accumulator[currentValue.batsman] = {}
               }
         return accumulator;
     }, {});
     return mostDismissedPlayer
}
let dissmissesBatsman = dismissal()
console.log(dissmissesBatsman)

FileSystem.writeFile('/home/prasan/IPL/src/public/output/HighDissmissedOnePlayer.json', JSON.stringify(dissmissesBatsman), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});


function superoverEconomy(){
    let superOverBowler = deliveryData.reduce((accumulator,currentValue)=>{
        if(!currentValue.match_id==""){
             if(currentValue.is_super_over!=0){
                  if(accumulator[currentValue.bowler]){
                       accumulator[currentValue.bowler]['run'] += parseInt(currentValue.total_runs);
                       accumulator[currentValue.bowler]['ball']++;
                       accumulator[currentValue.bowler]['SuperOverEconomy'] = parseFloat(((accumulator[currentValue.bowler]['run']/(accumulator[currentValue.bowler]['ball']/6))).toFixed(2))
   
                  }else{
                       accumulator[currentValue.bowler]= {}
                       accumulator[currentValue.bowler]['run'] = parseInt(currentValue.total_runs);
                       accumulator[currentValue.bowler]['ball'] = 1
                  }
             }
        }
        return accumulator
   },{})
   
   let topEconomicalBowler = Object.fromEntries(Object.entries(superOverBowler).sort((firstValue,secondvalue)=>{
        if(firstValue[1].SuperOverEconomy >secondvalue[1].SuperOverEconomy){
             return 1;
        }
        else{
             return -1
        }
   }).slice(0,1).filter(bowler => {
           bowler[1] = parseFloat( bowler[1].SuperOverEconomy)
           return true;
       }));
   return topEconomicalBowler;
}
let superOverEconomyBowler = superoverEconomy()
FileSystem.writeFile('/home/prasan/IPL/src/public/output/topEconomicalBowlerInSuperOver.json', JSON.stringify(superOverEconomyBowler), (data, error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("File statement.");
    }
});
