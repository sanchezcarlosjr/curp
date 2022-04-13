import { getFirestore } from 'firebase-admin/lib/firestore';
import { Curp } from '../models';
import { Provider } from '../models';
import { GovernmentScrapperCache } from './GovernmentScrapperCache';
import { Mexican } from '../models';

export class Firestore extends Provider implements GovernmentScrapperCache {
  constructor(
    private documentPath: (curpValue: string) => string = curpValue =>
      `id/${curpValue}`
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  save(mexican: Mexican): Promise<any> {
    if (mexican === undefined || mexican.curp === undefined) {
      throw new Error('Provider error');
    }
    return getFirestore().collection('id').doc(mexican.curp).set(mexican);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  provide(curp: Curp) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return getFirestore()
      .doc(this.documentPath(curp.value))
      .get()
      .then((document: { exists: any; data: () => any }) => {
        if (!document.exists) {
          return null;
        }
        const data = document.data();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.error) {
          return {
            curp: curp.value,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error: data.error,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      });
  }
}
