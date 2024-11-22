import { Border } from '../types/Border';
import { PopulationInfo } from '../types/PopulationInfo';

export class CountryInfo {
  borderCountries: Border[];
  populationData: PopulationInfo[];
  flagUrl: string;
  commonName: string;

  constructor(
    borderCountries: Border[],
    populationData: PopulationInfo[],
    flagUrl: string,
    commonName: string,
  ) {
    this.borderCountries = borderCountries;
    this.populationData = populationData;
    this.flagUrl = flagUrl;
    this.commonName = commonName;
  }
}
