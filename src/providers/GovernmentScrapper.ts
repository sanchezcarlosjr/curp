import { Provider } from '../models';
import { Curp } from '../models';
import { CaptchaSolver } from '../shared';
import axios from 'axios';

const genderISOConverter = new Map([
  ['HOMBRE', '1'],
  ['MUJER', '2'],
]);
const birthdayFormatFromRenapo = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/g;
const birthday = '$3-$2-$1T12:00:00.000Z';

export class GovernmentScrapper extends Provider {
  constructor(private captchaSolver: CaptchaSolver) {
    super();
  }

  private static async parseResponse(
    renapoResponse: { registros: any[] },
    curp: Curp
  ) {
    const register = renapoResponse.registros[0];
    return {
      curp: curp.value,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      fatherName: register.primerApellido,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      motherName: register.segundoApellido,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      name: register.nombres,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      gender: genderISOConverter.get(register.sexo),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      birthday: register.fechaNacimiento.replace(
        birthdayFormatFromRenapo,
        birthday
      ),
      // eslint-disable-next-line @typescript-eslint/await-thenable
      birthState: await curp.getIsoState(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      statusCurp: register.statusCurp,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      nationality: register.nacionalidad,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      probatoryDocument: register.docProbatorio,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      pdf: register.parametro,
      probatoryDocumentData: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ...register.datosDocProbatorio,
      },
    };
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async provide(curpId: Curp) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const captchaSolution = await this.captchaSolver.solve(
      '6LdJssgUAAAAAKkVr-Aj-xP5QQzclPeGZmhRwXeY',
      'https://www.gob.mx/curp'
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const renapoResponse: any = await axios(
      'https://www.gob.mx/v1/renapoCURP/consulta',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept',
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          referer: 'https://www.gob.mx/',
        },
        data: JSON.stringify({
          curp: curpId.value,
          tipoBusqueda: 'curp',
          ip: '127.0.0.1',
          response: captchaSolution,
        }),
        method: 'POST',
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    ).then(res => res.data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.ensure(renapoResponse.codigo);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (renapoResponse.registros == undefined) {
      return {
        curp: curpId.value,
        error: 'CURP not found',
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return GovernmentScrapper.parseResponse(renapoResponse, curpId);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private ensure(code: string) {
    switch (code) {
      case '01':
        return;
      case '02':
      case '03':
      case '04':
      case '05':
      case '07':
        throw new Error('Invalid 07');
      case '11':
      case '13':
        throw new Error('');
      case '180001':
      case '190001':
        return;
      default:
        throw new Error('');
    }
  }
}
