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

/**
 * Supported shops
 */
import { csCart } from './models';

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
let csvFileString = '';

// Try and load the file
try {
  csvFileString = fs.readFileSync(argv._[0], { encoding: 'utf8', flag: 'r+' });
} catch (err) {
  logger.error(`There was an error: ${err}`);
}

let shopifyCSVString = '';

// Check to see if the shop exists in our list of supported migrations
switch (argv.s) {
  case 'cscart':
    shopifyCSVString = csCart(csvFileString);
    break;
  default:
    logger.error('Unsupported shop.');
}

// Write the file to the current folder
fs.writeFileSync('./csvs/shopify-customers.csv', shopifyCSVString, { encoding: 'utf8' });
