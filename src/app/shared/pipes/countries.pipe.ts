import { Pipe, PipeTransform } from '@angular/core';
import { CountrySelect } from '../services/country.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'countriesSelect'
})
export class CountriesPipe implements PipeTransform {

  transform(values: Observable<CountrySelect[]>): any {
    return values.pipe(map(x => x.filter(el => {
      return !!environment.supportedCountries.includes(el.value);
    })));
  }

}
