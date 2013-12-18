var fs = require('fs'),
 util = require('util'),
 fs = require('fs'),
 jsoncsv = require('json-csv'),
 __ = require('underscore'),
 xml2js = require('xml2js');

var outputFilename = 'playsData.json';

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/f24.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        var events = result.Games.Game[0].Event;
        // filter all events to only include successful passes
        var plays = __.filter(events, function(event) {
            return (event.$.type_id == 1 || event.$.type_id == 3);
        });
        var timer = 0;
        for(var i = 0; i<plays.length; i++) {
            if(plays[i].$.type_id==3) {
                if(plays[i+1]) {
                    plays[i].finalXPos = plays[i+1].$.x;
                    plays[i].finalYPos = plays[i+1].$.y;
                } else {
                    plays[i].finalXPos = plays[i].$.x;
                    plays[i].finalYPos = plays[i].$.y;
                }
            }
            if(i == 0) {
                plays[i].interval = timer;
            } else {
                timer+= parseInt(plays[i].$.min*60) + parseInt(plays[i].$.sec) - parseInt(plays[i-1].$.min*60) - parseInt(plays[i-1].$.sec);
                plays[i].interval = timer;
            }
        }
        // filter map data to required fields
        var playData = __.map(plays, function(event) {
            for(var i = 0; i < event.Q.length; i++) {
                if(event.Q[i].$.qualifier_id == 140) {
                    event.finalXPos = event.Q[i].$.value;
                }
                else if(event.Q[i].$.qualifier_id == 141) {
                    event.finalYPos = event.Q[i].$.value;
                }
            }
            return {
                "min": event.$.min,
                "sec": event.$.sec,
                "team": event.$.team_id,
                "startXPos": event.$.x,
                "startYPos": event.$.y,
                "finalXPos": event.finalXPos, 
                "finalYPos": event.finalYPos,
                "interval": event.interval,
                "outcome": event.$.outcome,
                "type": event.$.type_id
            }
        });
        fs.writeFile(outputFilename, JSON.stringify(playData), function(err) {
            if(err) {console.log(err)}
            else {console.log('done')};
        });
        // convert data into csv
        // jsoncsv.toCSV({
        //     data: pertinentPassData,
        //     fields: [
        //         { name: "min",
        //           label: "Minute"
        //         },
        //         { name: "sec",
        //           label: "Second"
        //         },
        //         { name: "team",
        //           label: "Team"
        //         },
        //         { name: "startXPos",
        //           label: "startXPos"
        //         },
        //         { name: "startYPos",
        //           label: "startYPos"
        //         },
        //         { name: "finalXPos",
        //           label: "finalXPos"
        //         },
        //         { name: "finalYPos",
        //           label: "finalYPos"
        //         }
        //     ]},
        //     function(err, csv) {
        //         // save csv to file
        //         fs.writeFile(outputFilename, csv, function(err) {
        //             if(err) {console.log(err)}
        //             else {console.log('done')};
        //         });
        //     });
   });             
});
