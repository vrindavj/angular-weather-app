import { Component, HostListener } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

export interface cityDataObj {
  name: string;
  country: string;
  temp: string;
  feelsLike: string;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showDropDown = false;
  }

  showDropDown: boolean = false;
  unit: string = 'metric';
  city: string = '';
  cityList: any[] = [];
  errorMessage: string = '';
  cityObject: cityDataObj = {
    name: '',
    country: '',
    temp: '',
    feelsLike: '',
  };
  constructor(private weatherService: WeatherService) {}
  ngOnInit() {
    this.unit = 'metric';
    let retrievedObject: any;
    retrievedObject = localStorage.getItem('cityWeatherDetails');
    console.log('cityWeatherDetails: ', JSON.parse(retrievedObject));
    if (retrievedObject) {
      const weatherDetails: cityDataObj = JSON.parse(retrievedObject);
      this.cityObject = {
        name: weatherDetails.name,
        feelsLike: weatherDetails.feelsLike,
        country: weatherDetails.country,
        temp: weatherDetails.temp,
      };
    }
  }

  handleFetchedData(list: any[], event: any) {
    if (list.length > 1) {
      this.showDropDown = true;
      event.stopPropagation();
    } else if (list.length === 1) {
      const unit = this.unit === 'metric' ? '°C' : '°F';
      this.cityObject.name = list[0].name;
      this.cityObject.feelsLike = `${list[0].main.feels_like} ${unit}`;
      this.cityObject.temp = `${list[0].main.temp} ${unit}`;
      this.cityObject.country = list[0].sys.country;
      localStorage.setItem(
        'cityWeatherDetails',
        JSON.stringify(this.cityObject)
      );
    } else {
      this.errorMessage = 'No city found';
    }
  }

  /**
   * Function to handle form submit
   * @param event -
   */
  submitHandler(event: any) {
    if (this.city !== '') {
      this.weatherService.fetchWeatherData(this.city, this.unit).subscribe(
        (data: any) => {
          console.log(data);
          this.cityList = data.list;
          this.handleFetchedData(this.cityList, event);
        },
        (error) => {
          this.cityList = [];
          this.cityObject = {
            name: '',
            country: '',
            temp: '',
            feelsLike: '',
          };
          this.errorMessage = 'No city found';
          console.log(this.cityList, 'error');
        }
      );
    }
  }

  /**
   * function to fetch weather details when toggle button is clicked
   */
  toggleHandler() {
    this.weatherService
      .fetchWeatherData(this.city ? this.city : this.cityObject.name, this.unit)
      .subscribe(
        (data: any) => {
          // console.log(data);
          const unit = this.unit === 'metric' ? '°C' : '°F';
          this.city = `${data.list[0].name},${data.list[0].sys.country}`; //setting input text
          this.cityObject.name = data.list[0].name;
          this.cityObject.feelsLike = `${data.list[0].main.feels_like} ${unit}`;
          this.cityObject.temp = `${data.list[0].main.temp} ${unit}`;
          this.cityObject.country = data.list[0].sys.country;
        },
        (error) => {
          this.cityList = [];
          this.errorMessage = 'No city found';
          console.log(this.cityList, 'error');
        }
      );
  }
  /**
   * Function called when dropdown option is selected
   * @param city
   */
  selectCity(city: any) {
    console.log(city);
    const unit = this.unit === 'metric' ? '°C' : '°F';
    this.city = `${city.name},${city.sys.country}`; //setting input text
    this.cityObject.name = city.name;
    this.cityObject.feelsLike = `${city.main.feels_like} ${unit}`;
    this.cityObject.temp = `${city.main.temp} ${unit}`;
    this.cityObject.country = city.sys.country;
    localStorage.setItem('cityWeatherDetails', JSON.stringify(this.cityObject));
  }
}
