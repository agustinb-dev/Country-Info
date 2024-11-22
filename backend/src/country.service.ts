import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AvailableCountry } from './types/AvailableCountry';
import { CountryInfo } from './dto/CountryInfo.dto';

@Injectable()
export class CountryService {
  private readonly nagerBaseUrl: string;
  private readonly countriesNowBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Assign the API URL from environment variables
    this.nagerBaseUrl = this.configService.get<string>('NAGER_BASE_URL');
    this.countriesNowBaseUrl = this.configService.get<string>(
      'COUNTRIESNOW_BASE_URL',
    );
  }

  async getAvailableCountries(): Promise<AvailableCountry[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.nagerBaseUrl + '/api/v3/AvailableCountries'),
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }
  }

  async getCountryInfo(countryCode: string): Promise<CountryInfo> {
    try {
      const countryInfoResponse = await firstValueFrom(
        this.httpService.get(
          this.nagerBaseUrl + `/api/v3/CountryInfo/${countryCode}`,
        ),
      );

      const borderCountries = countryInfoResponse.data.borders;
      const countryName = countryInfoResponse.data.commonName;

      const populationResponse = await firstValueFrom(
        this.httpService.post(
          this.countriesNowBaseUrl + '/api/v0.1/countries/population',
          {
            country: countryName, // Pass the country name as required by the API
          },
          {
            headers: { 'Content-Type': 'application/json' }, // Set headers explicitly
          },
        ),
      );

      const populationData = populationResponse.data.data.populationCounts;

      const flagResponse = await firstValueFrom(
        this.httpService.post(
          this.countriesNowBaseUrl + '/api/v0.1/countries/flag/images',
          {
            iso2: countryCode,
          },
        ),
      );
      const flagUrl = flagResponse.data.data.flag;

      return new CountryInfo(
        borderCountries,
        populationData,
        flagUrl,
        countryName,
      );
    } catch (error) {
      throw new Error(`Failed to fetch country info: ${error.message}`);
    }
  }
}
