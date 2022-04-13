import { Curp } from './Curp';
import { Mexican } from './Mexican';

export abstract class Provider {
  abstract provide(curp: Curp): Promise<Mexican | { error: string } | null>;
}
