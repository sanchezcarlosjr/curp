import { Curp, Mexican, Provider } from '../models';
// @ts-ignore
import fetch from 'node-fetch';

export class Arsus extends Provider {
  private readonly URL: string =
    'https://us-west4-arsus-production.cloudfunctions.net/curp';
  constructor(private apiKey: string) {
    super();
  }
  async provide(curp: Curp): Promise<Mexican | { error: string } | null> {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return await fetch(`${this.URL}?curp=${curp}&apiKey=${this.apiKey}`).then(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (response: { json: () => any }) => response.json()
    );
  }
}
