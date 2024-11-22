import { Controller, Get, Query } from '@nestjs/common';
import { CountryService } from './country.service';
import { AvailableCountry } from './types/AvailableCountry';
import { CountryInfo } from './dto/CountryInfo.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('available')
  getHello(): Promise<AvailableCountry[]> {
    return this.countryService.getAvailableCountries();
  }

  @Get('info')
  async getCountryInfo(
    @Query('code') countryCode: string,
  ): Promise<CountryInfo> {
    return this.countryService.getCountryInfo(countryCode);
  }
}
