/**
 * Internal dependencies
 */
import { us } from './states';

/**
 * Takes a country's abbreviation
 * @param countryAbv a string that represents a country's abbreviation
 */
const countryAbvToName = (countryAbv: string): string => {
  if (countryAbv === 'US' || countryAbv === 'Un') {
    return us.name;
  }
  return countryAbv;
};

const countryNameToAbv = (countryName: string): string => {
  if (countryName === 'United States of America' || countryName === 'United States') {
    return us.isoCode;
  }
  return countryName;
};

const stateAbvToName = (stateAbv: string): string => {
  const stateName: string = us.abvList[stateAbv];
  if (typeof stateName !== 'undefined') {
    return stateName;
  }
  return stateAbv;
};

const stateNameToAbv = (stateName: string): string => {
  const stateAbv: string = us.nameList[stateName];
  if (typeof stateName !== 'undefined') {
    return stateAbv;
  }
  return stateName;
};

const isoStateConvert = (state: string) => {
  if (state.length === 2) {
    return stateAbvToName(state);
  }
  return stateNameToAbv(state);
};

const isoCountryConvert = (country: string) => {
  if (country.length === 2) {
    return countryAbvToName(country);
  }
  return countryNameToAbv(country);
};

export { isoCountryConvert, isoStateConvert };
