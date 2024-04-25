export interface IApiResponse<T = unknown> {
  meta: {
    response_ref: string;
    response_desc: string;
    response_code: number | string;
    response_datetime: string;
  };
  data?: T;
}

export interface ILineProviderEnv {
  liffId: string;
  state: string;
  icon: string;
  name: string;
  clientId: string;
  clientSecret: string;
  pathCallback: string;
}

export type TChanelAuthen = 'PHONE' | 'EMAIL' | 'LINE';

export interface IFileObject {
  fileUrl: string;
  newName: string;
  object: string;
  originalName: string;
  size: number;
  type: string;
}
