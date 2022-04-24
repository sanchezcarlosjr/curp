import { StringObject } from '../shared';

export class BadCurpFormat extends Error {
  constructor(curp: string) {
    super(`'${curp}' is an invalid curp`);
  }
}

export class Curp extends StringObject {
  private readonly curpIdPattern =
    /[A-Z][AEIXOU][A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM](AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z][0-9]/;

  constructor(curpId: string) {
    super(curpId);
    this.ensure();
  }

  get state(): string {
    const matches = this.curpIdPattern.exec(this.value);
    return matches === null ? '' : matches[3];
  }

  getIsoState(): Promise<string> {
    return new Promise(resolve => resolve(this.state));
  }

  private ensure() {
    this.isNotUndefined();
    this.toUpperCase();
    this.ensureCurpId();
  }

  private toUpperCase() {
    this.value = this.value.toUpperCase();
  }

  private ensureCurpId() {
    const match = this.curpIdPattern.exec(this.value);
    if (!match) {
      throw new BadCurpFormat(this.value);
    }
    this.value = match[0];
  }

  private isNotUndefined() {
    if (this.value === undefined) {
      throw new BadCurpFormat(this.value);
    }
  }
}
