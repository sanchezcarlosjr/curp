import { Curp } from '../models';
import { Provider } from '../models';
import { Mexican } from '../models';

export class MexicanFinder {
  private readonly providers: Provider[];
  private state: string;
  private readonly startState: string;

  constructor(...providers: Provider[]) {
    this.providers = providers;
    this.startState = this.providers[0].constructor.name;
    this.state = this.startState;
  }

  finalState() {
    return this.state;
  }

  async findByCurp(id: Curp): Promise<Mexican | { error: string }> {
    this.state = this.startState;
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
