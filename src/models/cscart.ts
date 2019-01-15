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
  userFilter: ['User type', 'C'],
};

const csCart = () => {
  // nothing here
};

export { csCart, csCartOptions };
