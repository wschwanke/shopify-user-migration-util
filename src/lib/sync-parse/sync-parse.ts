/**
 * External dependencies
 */
import parse from 'csv-parse/lib/sync';
import stringify from 'csv-stringify/lib/sync';

const syncParse = (file: string, delimiter: string = ','): any[] => {
  return parse(file, {
    columns: true,
    delimiter,
  });
};

const syncStringify = (input: any[], delimiter: string = ','): string => {
  return stringify(input, {
    delimiter,
    header: true,
  });
};

export { syncParse, syncStringify };
