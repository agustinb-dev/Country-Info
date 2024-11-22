export interface Border {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders?: Border[];
}
