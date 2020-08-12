import fs = require('fs');
import { existsSync, mkdirSync } from 'fs';
import { Stop, VehicleType } from './Stop';
import { LatLon } from './LatLon';
const readline = require('readline');
let stopData: Array<string[]>, railData: Array<string[]>, ferryData: Array<string[]>;


const runner = async() => {
    console.log("==== naptan2gtfs ====")

    let dataLocation = __dirname + '/data/';
    let outputLocation = __dirname + '/output/';

    const args: any = getArgs();
    if(args.data) {
        dataLocation = args.data;
    } else {
        console.log(`--data flag not set, using default data location.`)
        console.log(dataLocation);
    }

    if(args.output) {
        outputLocation = args.data;
    } else {
        console.log(`--output flag not set, using default output location.`)
        console.log(outputLocation);
    }

    console.log("Loading files...")

    try {
        if (existsSync(dataLocation + 'Stops.csv')) {
            stopData = await parser(dataLocation + 'Stops.csv');
        } else {
            throw("Stops.csv file missing from " + dataLocation);
        }
        if (existsSync(dataLocation + 'RailReferences.csv')) {
            railData = await parser(dataLocation + 'RailReferences.csv');
        } else {
            throw("RailReferences.csv file missing from " + dataLocation);
        }
        if (existsSync(dataLocation + 'FerryReferences.csv')) {
            ferryData = await parser(dataLocation + 'FerryReferences.csv');
        } else {
            throw("FerryReferences.csv file missing from " + dataLocation);
        }
    } catch (err) {
        console.log(err);
        return;
    }
    console.log("NaPTAN files loaded.")

    console.log("Creating GTFS stops...")
    const stops: Stop[] = stopData
        .filter(stopRecord => isActive(stopRecord))
        .filter(stopRecord => isValid(stopRecord))
        .map(stopRecord => {
            const id: string = stopRecord[0];
            const code: string = stopRecord[1] || getCode(id, getVehicleType(stopRecord[31]));
            const name: string = getCleanName(stopRecord[4], stopRecord[14])
            const timeZone: string = 'Europe/London';
            const lat: string = stopRecord[30];
            const lon: string = stopRecord[29];
            const vehicleType: VehicleType = getVehicleType(stopRecord[31]);

            return new Stop(id, code, name, timeZone, new LatLon(lat, lon), vehicleType);
        })
    console.log("GTFS stops created.")
    
    
    const output: string[] = [];
    const header = ['stop_id', 'stop_code', 'stop_name','stop_lat', 'stop_lon', 'stop_timezone', 'vehicle_type'];
    output.push(header.join(','))

    stops.forEach(stop => output.push(stop.toGtfsRecord()));

    outputter('stops.txt', outputLocation, output.join('\n'));

    console.log('naptan2gtfs finished. Goodbye!');
}

const parser = (file : string): Promise<Array<string[]>> => {
    let lines : Array<string[]> = [];
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return new Promise(resolve => {
        rl.on('line', (line) => {
            line = line.replace(/['"]+/g, '');
            lines.push(line.split(","));
        }).on('close', function() {
            lines.splice(0, 1);
            resolve(lines);
        })
    })
}

const outputter = (fileName: string, dirLocation: string, fileContents: string) => {
    if (!existsSync(dirLocation)) mkdirSync(dirLocation);
    fs.writeFileSync(dirLocation + fileName, fileContents);
    console.log('GTFS files saved.');
};

const getVehicleType = (stopType: string) => {
    switch(stopType) {
        case 'MET':
            return VehicleType.SUBWAY;
        case 'RLY':
        case 'RPL':
            return VehicleType.RAIL;
        case 'BCT':
        case 'BCS':
            return VehicleType.BUS;
        case 'FER':
            return VehicleType.FERRY;
        default: 
            return;
    }
}

const getCleanName = (stopName: string, stopIndicator: string) => {
    const indicatorRegEx: RegExp = RegExp(/^(Stop|Bay|Stand|Entrance)( \w+)?$/, 'i');

    if(stopIndicator.length && indicatorRegEx.test(stopIndicator)) {
        return stopName + ' (' + stopIndicator + ')';
    } else {
        return stopName;
    }
}

const getCode = (stopId: string, vehicleType: number) => {
    let relatedRecord: string[];
    switch(vehicleType) {
        case 2: 
            relatedRecord = railData.find(record => record[0] === stopId); 
            if(relatedRecord) {
                return relatedRecord[2];
            } else {
                return '';
            }
        case 4:
            relatedRecord = ferryData.find(record => record[0] === stopId); 
            if(relatedRecord) {
                return relatedRecord[1];
            } else {
                return '';
            }
    }
}

const isValid = (stopRecord: string[]) => {
    if(getVehicleType(stopRecord[31])) {
        return true;
    } else {
        return false;
    }
}

const isActive = (stopRecord: string[]) => {
    if((stopRecord[stopRecord.length - 1] === 'act')) {
        return true;
    } else {
        return false;
    }
}

const getArgs = () => {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1,arg.length).split('');
            flags.forEach(flag => {
            args[flag] = true;
            });
        }
    });
    return args;
}


runner();