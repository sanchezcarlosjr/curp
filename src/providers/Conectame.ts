// https://conectame.ddns.net/consola/login
import { Curp, Mexican, Provider } from '../models';
import axios from 'axios';
// @ts-ignore

export interface DatosFiscales {
  Rfc: string;
  Comprobado: string;
  Sncf: string;
  Subcontratacion: string;
}

export interface ConectameResponse {
  Response: 'correct' | 'Error';
  Curp: string;
  DatosFiscales: DatosFiscales;
  Paterno: string;
  Materno: string;
  Nombre: string;
  Sexo: string;
  FechaNacimiento: string;
  Nacionalidad: string;
  DocProbatorio: number;
  AnioReg: number;
  Foja: number;
  Tomo: number;
  Libro: number;
  NumActa: number;
  CRIP: string;
  NumEntidadReg: number;
  CveMunicipioReg: number;
  NumRegExtranjeros: string;
  FolioCarta: string;
  CveEntidadEmisora: string;
  StatusCurp: string;
}

const genderISOConverter = new Map([
  ['H', '1'],
  ['M', '2'],
]);

// https://conectame.ddns.net/consola/login
export class Conectame extends Provider {
  constructor(
    private user: string = 'prueba',
    private password: string = 'sC}9pW1Q]c'
  ) {
    super();
  }
  async provide(curp: Curp): Promise<Mexican | { error: string } | null> {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const response: ConectameResponse = await axios(this.URL(curp)).then(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      response => response.data
    );
    if (response.Response === 'Error') {
      return null;
    }
    return {
      curp: response.Curp,
      fatherName: response.Paterno,
      motherName: response.Materno,
      name: response.Nombre,
      gender: genderISOConverter.get(response.Sexo) ?? '',
      birthday: `${response.FechaNacimiento}T12:00:00.000Z`,
      birthState: await curp.getIsoState(),
      statusCurp: response.StatusCurp,
      // @ts-ignore
      probatoryDocument: response.DocProbatorio,
      // @ts-ignore
      probatoryDocumentData: {
        CRIP: response?.CRIP,
        NumEntidadReg: response?.NumEntidadReg,
        CveMunicipioReg: response?.CveMunicipioReg,
        NumRegExtranjeros: response?.NumRegExtranjeros,
        AnioReg: response?.AnioReg,
        Foja: response?.Foja,
        Tomo: response?.Tomo,
        Libro: response?.Libro,
        FolioCarta: response?.FolioCarta,
        CveEntidadEmisora: response?.CveEntidadEmisora,
      },
      fiscalData: response?.DatosFiscales,
    };
  }
  private URL(curp: Curp) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `https://conectame.ddns.net/rest/api.php?m=curp&user=${this.user}&pass=${this.password}&val=${curp}`;
  }
}
