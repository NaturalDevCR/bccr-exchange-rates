// index.ts
import BCCRClient from './lib/BCCRClient.js';

export * from './lib/errors.js';
export type { BCCRClientOptions, ExchangeRateOptions, ExchangeRates } from './lib/BCCRClient.js';

export default BCCRClient;