/**
 * External dependencies
 */
import { has } from 'lodash';
import minimist from 'minimist';

/**
 * Internal dependencies
 */
import fs from 'fs';
import { isoStateConvert } from './lib/iso-convert';
import { logger } from './lib/logger';
import { syncParse, syncStringify } from './lib/sync-parse';

/**
 * Supported shops
 */
import { isoCountryConvert } from './lib/iso-convert/iso-convert';
import { csCart, csCartOptions } from './models';

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

// Check to see if the shop exists in our list of supported migrations

switch (argv.s) {
  case 'cscart':
    csCart();
    break;
  default:
    logger.error('Unsupported shop.');
}

let csvFileString = '';

try {
  csvFileString = fs.readFileSync(argv._[0], { encoding: 'utf8', flag: 'r+' });
} catch (err) {
  logger.error(`There was an error: ${err}`);
}

const csvArray = syncParse(csvFileString, ';');

const migratedCustomers: any[] = [];

csvArray.forEach((customer) => {
  const migratedCustomer = {};
  if (customer['User type'] === 'C') {
    migratedCustomers.push(Object.assign(migratedCustomer, {
      'First Name': customer[csCartOptions.transform['First Name']] || '""',
      'Last Name': customer[csCartOptions.transform['Last Name']] || '""',
      'Email': customer[csCartOptions.transform['Email']] || '""',
      'Address1': customer[csCartOptions.transform['Address1']] || '""',
      'Address2': customer[csCartOptions.transform['Address2']] || '""',
      'City': customer[csCartOptions.transform['City']] || '',
      'Province': isoStateConvert(customer[csCartOptions.transform['Province']]) || '""',
      'Province Code': customer[csCartOptions.transform['Province Code']] || '""',
      'Country': isoCountryConvert(customer[csCartOptions.transform['Country']]) || '""',
      'Country Code': customer[csCartOptions.transform['Country Code']] || '""',
      'Zip': customer[csCartOptions.transform['Zip']] || '""',
      'Phone': customer[csCartOptions.transform['Phone']] || '""',
      'Accepts Marketing': customer[csCartOptions.transform['Accepts Marketing']] || '""',
      'Total Spent': customer[csCartOptions.transform['Total Spent']] || '""',
      'Total Orders': customer[csCartOptions.transform['Total Orders']] || '""',
      'Tags': customer[csCartOptions.transform['Tags']] || '""',
      'Note': customer[csCartOptions.transform['Note']] || '""',
      'Tax Exempt': customer[csCartOptions.transform['Tax Exempt']] || '""',
    }));
  }
});

const csvString = syncStringify(migratedCustomers);

fs.writeFileSync('./shopifycsv.csv', csvString, { encoding: 'utf8' });
