/**
 * External dependencies
 */
import { get } from 'lodash';
/**
 * Internal dependencies
 */
import { isoStateConvert } from '../lib/iso-convert';
import { isoCountryConvert } from '../lib/iso-convert/iso-convert';
import { logger } from '../lib/logger';
import { Migrate } from '../lib/migrate';
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
    'Accepts Marketing': '',
    'Total Spent': '',
    'Total Orders': '',
    'Tags': '',
    'Note': '',
    'Tax Exempt': 'tax_exempt',
    /* tslint:enable:object-literal-sort-keys */
  },
};

const utils = new Migrate();

const replaceEmptyName = (customerName: string, addressName: string) => {
  if (typeof customerName === 'undefined' || customerName.trim() === '') {
    return addressName;
  }
  return customerName;
};

const fixAddress = (address: string): string => {
  if (typeof address !== 'undefined') {
    return address.replace(/(\r\n|\r|\n)/g, ' ');
  }
  return address;
};

const migrate = (csvFileStrings: string[]) => {
  const { transform } = options;
  const migratedCustomers: any[] = [[]];
  let customerAccounts: any[] = [];
  let customerAddresses: any[] = [];
  let customerOrders: any[] = [];
  let stats = {
    invalidEmails: 0,
    invalidNames: 0,
    totalRecords: 0,
  };
  let split = 0;

  if (csvFileStrings.length > 0) {
    csvFileStrings.forEach((fileString) => {
      const firstLine = fileString.substr(0, 100);
      if (firstLine.indexOf('usertype') !== -1) {
        customerAccounts = syncParse(fileString);
      }
      if (firstLine.indexOf('address') !== -1) {
        customerAddresses = syncParse(fileString, ',', 'userid');
      }
      if (firstLine.indexOf('orderid') !== -1) {
        customerOrders = syncParse(fileString, ',', 'userid');
      }
    });
  }

  customerAccounts.forEach((customer) => {
    const migratedCustomer = {};
    const customerId: string = get(customer, 'id');
    const orders = get(customerOrders, `${customerId}`);
    let address = get(customerAddresses, `${customerId}`);

    if (typeof orders === 'undefined') {
      return false;
    }

    if (typeof address === 'undefined') {
      address = {
        address: '',
        city: '',
        country: '',
        phone: '',
        state: '',
        zip: '',
      };
    }

    if (customer.firstname.trim() === '' && typeof address.firstname === 'undefined') {
      return false;
    }

    if (customer.lastname.trim() === '' && typeof address.lastname === 'undefined') {
      return false;
    }

    if (!utils.isValidEmail(customer[transform['Email']])) {
      return false;
    }

    // Checks to make sure the user we are iterating over is a customer
    if (customer['usertype'] === 'C') {
      migratedCustomers[split].push(Object.assign(migratedCustomer, {
        /* tslint:disable:object-literal-sort-keys */
        'First Name': replaceEmptyName(customer[transform['First Name']], address[transform['First Name']]),
        'Last Name': replaceEmptyName(customer[transform['Last Name']], address[transform['Last Name']]),
        'Email': customer[transform['Email']] || '',
        'Address1': fixAddress(address[transform['Address1']]) || '',
        'Address2': fixAddress(address[transform['Address2']]) || '',
        'City': address[transform['City']] || '',
        'Province': isoStateConvert(address[transform['Province']]) || '',
        'Province Code': address[transform['Province Code']] || '',
        'Country': isoCountryConvert(address[transform['Country']]) || '',
        'Country Code': address[transform['Country Code']] || '',
        'Zip': address[transform['Zip']] || '',
        'Phone': utils.stripPhone(address[transform['Phone']]) || '',
        'Accepts Marketing': customer[transform['Accepts Marketing']] || 'yes',
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

    if (stats.totalRecords % 5000 === 0 && stats.totalRecords !== 0) {
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
