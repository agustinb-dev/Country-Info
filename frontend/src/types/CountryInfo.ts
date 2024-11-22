import { PopulationInfo } from "@/types/PopulationInfo";
import { Border } from "@/types/Border";

export interface CountryInfo {
    borderCountries: Border[];
    populationData: PopulationInfo[];
    flagUrl: string;
    commonName: string;
}
