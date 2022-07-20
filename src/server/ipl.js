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



    