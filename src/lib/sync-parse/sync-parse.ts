/**
 * External dependencies
 */
import parse from 'csv-parse/lib/sync';
import stringify from 'csv-stringify/lib/sync';

/**
 * Parses a csv file synchronously
 * @param file the path to a file you want to parse
 * @param delimiter used to tell the csv parser where a value ends
 */
const syncParse = (file: string, delimiter: string = ','): any[] => {
  return parse(file, {
    columns: true,
    delimiter,
  });
};

/**
 * Synchronously creates a csv string from an array of objects
 * @param input an array that will be used to generate the csv values
 * @param delimiter the character that will be used to determin the end of a value
 */
const syncStringify = (input: any[], delimiter: string = ','): string => {
  return stringify(input, {
    delimiter,
    header: true,
  });
};

export { syncParse, syncStringify };
