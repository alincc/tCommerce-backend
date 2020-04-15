import { HttpService, Injectable, Logger } from '@nestjs/common';
import { SearchService } from '../shared/search/search.service';
import { ElasticCity } from './models/elastic-city.model';
import { autocompleteSettings } from '../shared/constants';
import { ClientSPFDto } from '../shared/dtos/client/spf.dto';
import { IFilter } from '../shared/dtos/shared-dtos/spf.dto';

@Injectable()
export class CityService {

  private logger = new Logger(CityService.name);

  constructor(private readonly http: HttpService, private readonly searchService: SearchService) {
  }

  async onApplicationBootstrap() {
    this.searchService.ensureCollection(ElasticCity.collectionName, new ElasticCity(), autocompleteSettings);
  }

  async loadCitiesToElastic() {
    this.searchService.ensureCollection(ElasticCity.collectionName, new ElasticCity(), autocompleteSettings);
    let cityCount = 0;
    try {
      let pageNumber = 0;
      let cities = [];
      do {
        pageNumber++;
        cities = await this.fetchCityCatalogPage(pageNumber);
        let esCities = cities.map(city => CityService.toEsCity(city));
        this.searchService.addDocuments(ElasticCity.collectionName, esCities);
        this.logger.log('Loaded 150 cities to ES. Bulk number ' + pageNumber);
        cityCount += cities.length;
      } while (cities.length != 0);
    } catch (ex) {
      this.logger.error('Failed to fetch cities');
      throw ex;
    }
    this.logger.log(`Loaded ${cityCount} cities to Elastic`);
  }

  private async fetchCityCatalogPage(cityBulkNumber: number) {
    let response = await this.http.post('http://api.novaposhta.ua/v2.0/json/Address/searchSettlements/',
      {
        'modelName': 'AddressGeneral',
        'calledMethod': 'getSettlements',
        'methodProperties': {
          'Page': cityBulkNumber,
          'Warehouse': '1'
        },
        'apiKey': 'fc458ea324bd4fea1f1013dba44cdd03'
      }).toPromise();
    return response.data.data;
  }

  private static toEsCity(city) {
    const cityPrefix = city.SettlementTypeDescription
      .replace(/селище міського типу/, 'смт.')
      .replace(/село/, 'с.')
      .replace(/селище/, 'с.')
      .replace(/місто/, 'м.');
    const regionsDescription = city.RegionsDescription ? ', ' + city.RegionsDescription : '';
    return {
      'id': city.Ref,
      'name': city.Description,
      'ruName': city.DescriptionRu,
      'fullName': `${cityPrefix} ${city.Description} (${city.AreaDescription}${regionsDescription})`
    };
  }

  async getCities(spf: ClientSPFDto) {
    let filters: IFilter[] = [{ fieldName: 'name|ruName', value: spf['filter'] }];
    const searchResponse = await this.searchService.searchByFilters(ElasticCity.collectionName, filters, 0, spf.limit);
    let cities = searchResponse[0]
      .map(esCity => ({ id: esCity.id, name: esCity.fullName }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      data: cities
    };
  }

}