var fs = require('fs'),
 util = require('util'),
 fs = require('fs'),
 jsoncsv = require('json-csv'),
 __ = require('underscore'),
 xml2js = require('xml2js');

var outputFilename = 'passDataWithIntervals.json';

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/f24.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        var events = result.Games.Game[0].Event;
        // filter all events to only include successful passes
        var passEvents = __.filter(events, function(event) {
            return (event.$.type_id == 1 && event.$.outcome == 1);
        });
        var timer = 0;
        for(var i = 0; i<passEvents.length; i++) {
            if(i == 0) {
                passEvents[i].interval = timer;
            } else {
                timer+= parseInt(passEvents[i].$.min*60) + parseInt(passEvents[i].$.sec) - parseInt(passEvents[i-1].$.min*60) - parseInt(passEvents[i-1].$.sec);
                passEvents[i].interval = timer;
            }
        }
        // filter map data to required fields
        var pertinentPassData = __.map(passEvents, function(event) {
            var finalXPos, finalYPos;
            for(var i = 0; i < event.Q.length; i++) {
                if(event.Q[i].$.qualifier_id == 140) {
                    finalXPos = event.Q[i].$.value;
                }
                if(event.Q[i].$.qualifier_id == 141) {
                    finalYPos = event.Q[i].$.value;
                }
            }
            return {
                "min": event.$.min,
                "sec": event.$.sec,
                "team": event.$.team_id,
                "startXPos": event.$.x,
                "startYPos": event.$.y,
                "finalXPos": finalXPos, 
                "finalYPos": finalYPos,
                "interval": event.interval
            }
        });
        fs.writeFile(outputFilename, JSON.stringify(pertinentPassData), function(err) {
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
