import * as firebase from 'firebase-admin';
const data = require('test-data.json');
import { CaptchaSolver, Curp, GovernmentScrapper } from '../src';

firebase.initializeApp();

describe('index', () => {
  describe('government scrapper', () => {
    it.skip('should return mexican when it exists in database', async () => {
      const governmentScrapper = new GovernmentScrapper(
        new CaptchaSolver('584e131dc55c1e6ef06ca7afe4f2fa0d')
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
