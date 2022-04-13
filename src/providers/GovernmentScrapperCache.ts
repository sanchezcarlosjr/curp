import { Mexican } from '../models';

export interface GovernmentScrapperCache {
  save: (mexican: Mexican) => Promise<any>;
}
