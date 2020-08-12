# naptan2gtfs
A tool to convert the NaPTAN dataset into its GTFS equivalent. Created as part of my Final Year Project @ Aston University.
Using the freely accessible NaPTAN dataset, one can create a GTFS stops file for nearly every transport link in the Great Britain.
This extends to over 480,000 different links ranging from Bus, Rail, Ferry etc.

It is suggested this data to be used in conjuction with a GTFS dataset that relies on the NaPTAN ATCO IDs for its stop_id values. (i.e. the TfWM
GTFS data feed).

# Usage
1. Unpack files
2. Run `npm install`. Wait for install to finish.
3. Run `node Convert.js`

- Set location of NaPTAN dataset files using `--data` flag. Defaults to 'data/'.
- Set location of ouput files using `--output` flag. Defaults to 'output/'

# Requirements
- NodeJS
- NPM
- NaPTAN dataset files in CSV format ([get them here](http://naptan.app.dft.gov.uk/DataRequest/Naptan.ashx?format=csv))
