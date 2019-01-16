/**
 * Internal dependencies
 */
import { isoStateConvert } from '../lib/iso-convert';
import { isoCountryConvert } from '../lib/iso-convert/iso-convert';
import { logger } from '../lib/logger';
import { syncParse } from '../lib/sync-parse';

const options = {
  delimiter: ',',
  transform: {
    /* tslint:disable:object-literal-sort-keys */
    'First Name': 'firstname',
    'Last Name': 'lastname',
    'Email': 'email',
    'Address1': 'address',
    'Address2': '',
    'City': 'city',
    'Province': 'state',
    'Province Code': 'state',
    'Country': 'country',
    'Country Code': 'country',
    'Zip': 'zipcode',
    'Phone': 'phone',
    'Accepts Marketing': 'no',
    'Total Spent': '',
    'Total Orders': '',
    'Tags': '',
    'Note': '',
    'Tax Exempt': 'tax_exempt',
    /* tslint:enable:object-literal-sort-keys */
  },
};

const migrate = (csvFileString: string) => {
  const { transform } = options;
  const csvArray = syncParse(csvFileString, ';');
  const migratedCustomers: any[] = [[]];
  let stats = {
    invalidEmails: 0,
    invalidNames: 0,
    totalRecords: 0,
  };
  let split = 0;

  csvArray.forEach((customer, index) => {
    const migratedCustomer = {};

    // Check to see if there are blank emails or if our parser
    // included the original email key as the email in place of it being blank
    if (customer[transform.Email].trim() === '' || customer[transform.Email].trim() === transform.Email) {
      // logger.warn('Invalid email found.');
      stats = Object.assign({}, {
        ...stats,
        invalidEmails: (stats.invalidEmails + 1),
      });
      return false;
    }

    if (customer['First name'].trim() === '' && customer['Last name'].trim() === '') {
      // logger.warn('Invalid name found.');
      stats = Object.assign({}, {
        ...stats,
        invalidNames: (stats.invalidNames + 1),
      });
      return false;
    }

    // Checks to make sure the user we are iterating over is a customer
    if (customer['usertype'] === 'C') {
      migratedCustomers[split].push(Object.assign(migratedCustomer, {
        /* tslint:disable:object-literal-sort-keys */
        'First Name': customer[transform['First Name']] || '',
        'Last Name': customer[transform['Last Name']] || '',
        'Email': customer[transform['Email']] || '',
        'Address1': customer[transform['Address1']] || '',
        'Address2': customer[transform['Address2']] || '',
        'City': customer[transform['City']] || '',
        'Province': isoStateConvert(customer[transform['Province']]) || '',
        'Province Code': customer[transform['Province Code']] || '',
        'Country': isoCountryConvert(customer[transform['Country']]) || '',
        'Country Code': customer[transform['Country Code']] || '',
        'Zip': customer[transform['Zip']] || '',
        'Phone': customer[transform['Phone']] || '',
        'Accepts Marketing': customer[transform['Accepts Marketing']] || '',
        'Total Spent': customer[transform['Total Spent']] || '',
        'Total Orders': customer[transform['Total Orders']] || '',
        'Tags': customer[transform['Tags']] || '',
        'Note': customer[transform['Note']] || '',
        'Tax Exempt': customer[transform['Tax Exempt']] || '',
        /* tslint:enable:object-literal-sort-keys */
      }));
      stats = Object.assign({}, {
        ...stats,
        totalRecords: (stats.totalRecords + 1),
      });
    }

    if (index % 5000 === 0 && index !== 0) {
      split = split + 1;
      migratedCustomers.push([]);
    }
    return true;
  });

  // Log our stats after everything is finished
  if (stats.invalidEmails > 0) {
    logger.warn(`Total invalid emails: ${stats.invalidEmails}`);
  }
  if (stats.invalidNames > 0) {
    logger.warn(`Total invalid names: ${stats.invalidNames}`);
  }
  logger.info(`Total records: ${stats.totalRecords}`);

  return migratedCustomers;
};

const xCart = { migrate, options };

export { xCart };
