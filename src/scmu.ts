/**
 * External dependencies
 */
import { has } from 'lodash';
import minimist from 'minimist';

/**
 * Internal dependencies
 */
import fs from 'fs';
import { logger } from './lib/logger';
import { syncStringify } from './lib/sync-parse';

/**
 * Supported shops
 */
import { csCart } from './shops';

// Parse the command line arguments
const argv = minimist(process.argv.slice(2));

// Check to make sure the user typed in a file name
if (argv._.length < 1) {
  logger.error('You must include a file name.');
}

// Check for the shop flag
if (!has(argv, 's')) {
  logger.error('You must include the shop you want to migrate from.');
}

// Initialize the csv file string
const csvFileString: string[] = [];

// Try and load the file
argv._.forEach((filePath) => {
  try {
    csvFileString.push(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r+' }));
  } catch (err) {
    logger.error(`There was an error: ${err}`);
  }
});

let shopifyCSVStringsArray: any[] = [];

// Check to see if the shop exists in our list of supported migrations
switch (argv.s) {
  case 'cscart':
    shopifyCSVStringsArray = csCart(csvFileString);
    break;
  default:
    logger.error('Unsupported shop.');
}

// Write the file to the current folder
shopifyCSVStringsArray.forEach((csvString, index) => {
  fs.writeFileSync(`./csvs/shopify-customers-${index}.csv`, syncStringify(csvString), { encoding: 'utf8' });
});
