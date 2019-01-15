/**
 * Internal dependencies
 */
import { us } from './states';

const countryAbrevToName = (countryAbrev: string): string => {
  if (countryAbrev === 'US' || countryAbrev === 'Un') {
    return us.name;
  }
  return countryAbrev;
};

const countryNameToAbrev = (countryName: string): string => {
  if (countryName === 'United States of America' || countryName === 'United States') {
    return us.isoCode;
  }
  return countryName;
};

const stateAbrevToName = (stateAbrev: string): string => {
  const stateName: string = us.abrevList[stateAbrev];
  if (typeof stateName !== 'undefined') {
    return stateName;
  }
  return stateAbrev;
};

const stateNameToAbrev = (stateName: string): string => {
  const stateAbrev: string = us.nameList[stateName];
  if (typeof stateName !== 'undefined') {
    return stateAbrev;
  }
  return stateName;
};

const isoStateConvert = (state: string) => {
  if (state.length === 2) {
    return stateAbrevToName(state);
  }
  return stateNameToAbrev(state);
};

const isoCountryConvert = (country: string) => {
  if (country.length === 2) {
    return countryAbrevToName(country);
  }
  return countryNameToAbrev(country);
};

export { isoCountryConvert, isoStateConvert };
