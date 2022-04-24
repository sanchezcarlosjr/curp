const data = require('./test-data.json');
import { Curp, GovernmentScrapper } from '../src';
import { CaptchaSolver } from '../src/shared';
import { Arsus } from '../src';

describe('index', () => {
  describe('arsus api', () => {
    it('should return mexican when it calls Arsus API', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const arsus = new Arsus(data['arsus_api_key']);
      const mexican = await arsus.provide(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        new Curp(data['mexicans'][0]['curp'])
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(mexican).toEqual(data['mexicans'][0]);
    });
  });
  describe('government scrapper', () => {
    it.skip('should return mexican when it exists in database', async () => {
      const governmentScrapper = new GovernmentScrapper(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        new CaptchaSolver(data['2captcha_api_key'])
      );
      const mexican = await governmentScrapper.provide(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        new Curp(data['mexicans'][0]['curp'])
      );
      expect(mexican).not.toBeNull();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(mexican).toEqual(data['mexicans'][0]);
    }, 80000);
  });
});
