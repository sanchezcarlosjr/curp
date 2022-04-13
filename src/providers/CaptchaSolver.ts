import * as Captcha from '2captcha';

export class CaptchaSolver {
  private solver: Captcha.Solver;
  constructor(private key: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    this.solver = new Captcha.Solver(this.key);
  }

  /**
   * Returns  the answer token (captcha solution)
   * https://2captcha.com/2captcha-api#solving_captchas
   */
  async solve(googlekey: string, pageurl: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    return (await this.solver.recaptcha(googlekey, pageurl)).data;
  }
}
