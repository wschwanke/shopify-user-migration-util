/**
 * Internal dependencies
 */
import { isoStateConvert } from '../lib/iso-convert';
import { isoCountryConvert } from '../lib/iso-convert/iso-convert';
import { syncParse, syncStringify } from '../lib/sync-parse';

const csCartOptions = {
  delimiter: ';',
  transform: {
    /* tslint:disable:object-literal-sort-keys */
    'First Name': 'First name',
    'Last Name': 'Last name',
    'Email': 'E-mail',
    'Address1': 'Billing: address',
    'Address2': 'Billing: address (line 2)',
    'City': 'Billing: city',
    'Province': 'Billing: state',
    'Province Code': 'Billing: state',
    'Country': 'Billing: country',
    'Country Code': 'Billing: country',
    'Zip': 'Billing: zipcode',
    'Phone': 'Phone',
    'Accepts Marketing': 'no',
    'Total Spent': '',
    'Total Orders': '',
    'Tags': '',
    'Note': '',
    'Tax Exempt': 'Tax exempt',
    /* tslint:enable:object-literal-sort-keys */
  },
};

const csCart = (csvFileString: string) => {
  const csvArray = syncParse(csvFileString, ';');

  const migratedCustomers: any[] = [];

  csvArray.forEach((customer) => {
    const migratedCustomer = {};
    // Checks to make sure the user we are iterating over is a customer
    if (customer['User type'] === 'C') {
      migratedCustomers.push(Object.assign(migratedCustomer, {
        /* tslint:disable:object-literal-sort-keys */
        'First Name': customer[csCartOptions.transform['First Name']] || '',
        'Last Name': customer[csCartOptions.transform['Last Name']] || '',
        'Email': customer[csCartOptions.transform['Email']] || '',
        'Address1': customer[csCartOptions.transform['Address1']] || '',
        'Address2': customer[csCartOptions.transform['Address2']] || '',
        'City': customer[csCartOptions.transform['City']] || '',
        'Province': isoStateConvert(customer[csCartOptions.transform['Province']]) || '',
        'Province Code': customer[csCartOptions.transform['Province Code']] || '',
        'Country': isoCountryConvert(customer[csCartOptions.transform['Country']]) || '',
        'Country Code': customer[csCartOptions.transform['Country Code']] || '',
        'Zip': customer[csCartOptions.transform['Zip']] || '',
        'Phone': customer[csCartOptions.transform['Phone']] || '',
        'Accepts Marketing': customer[csCartOptions.transform['Accepts Marketing']] || '',
        'Total Spent': customer[csCartOptions.transform['Total Spent']] || '',
        'Total Orders': customer[csCartOptions.transform['Total Orders']] || '',
        'Tags': customer[csCartOptions.transform['Tags']] || '',
        'Note': customer[csCartOptions.transform['Note']] || '',
        'Tax Exempt': customer[csCartOptions.transform['Tax Exempt']] || '',
        /* tslint:enable:object-literal-sort-keys */
      }));
    }
  });

  return syncStringify(migratedCustomers);
};

export { csCart, csCartOptions };
