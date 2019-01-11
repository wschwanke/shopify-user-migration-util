/**
 * External dependencies
 */
import minimist from 'minimist';

/**
 * Internal dependencies
 */
import { logger } from './lib/logger';

const argv = minimist(process.argv.slice(2));

logger.info(argv);