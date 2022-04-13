import { Curp } from '../models/Curp';
import { Provider } from '../models/Provider';

export class MexicanFinder {
  private readonly providers: Provider[];
  private state: string;

  constructor(...providers: Provider[]) {
    this.providers = providers;
    this.state = this.providers[0].constructor.name;
  }

  actualState() {
    return this.state;
  }

  async findByCurp(id: Curp) {
    for (const provider of this.providers) {
      const mexican = await provider.provide(id);
      this.state = provider.constructor.name;
      if (mexican !== null) {
        return mexican;
      }
    }
    throw new Error('Server error. CURP not found.');
  }
}
