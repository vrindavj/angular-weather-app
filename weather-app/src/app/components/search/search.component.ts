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
  /**
   * To handle click event on the document
   * @param event
   */
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
    retrievedObject = localStorage.getItem('cityWeatherDetails'); // getting storage object
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

  /**
   * Function on successful data fetch, weather data is mapped to city object
   * or dropdown shown with list of fetched city names
   * @param list - array of city object fetched from api
   * @param event - event details about click event
   */
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
      ); //setting storage object with selected city details
    } else {
      this.errorMessage = 'No city found';
    }
  }

  /**
   * Function to handle click event on submit button.
   * @param event - event details about click event
   */
  submitHandler(event: any) {
    if (this.city !== '') {
      this.weatherService.fetchWeatherData(this.city, this.unit).subscribe({
        next: (data: any) => {
          this.cityList = data.list;
        },
        error: (err) => {
          this.cityList = [];
          this.cityObject = {
            name: '',
            country: '',
            temp: '',
            feelsLike: '',
          };
          this.errorMessage = 'No city found';
        },
        complete: () => {
          if (this.cityList.length === 0) {
            this.cityObject = {
              name: '',
              country: '',
              temp: '',
              feelsLike: '',
            };
            this.errorMessage = 'No city found';
          } else {
            this.handleFetchedData(this.cityList, event);
          }
        },
      });
    }
  }

  /**
   * function to fetch weather details when toggle button for unit change is clicked
   */
  toggleHandler() {
    this.weatherService
      .fetchWeatherData(this.city ? this.city : this.cityObject.name, this.unit)
      .subscribe({
        next: (data: any) => {
          const unit = this.unit === 'metric' ? '°C' : '°F';
          if (data.list.length === 0) {
            this.cityList = [];
            this.errorMessage = 'No city found';
          } else {
            this.city = `${data.list[0].name},${data.list[0].sys.country}`; //setting input text
            this.cityObject.name = data.list[0].name;
            this.cityObject.feelsLike = `${data.list[0].main.feels_like} ${unit}`;
            this.cityObject.temp = `${data.list[0].main.temp} ${unit}`;
            this.cityObject.country = data.list[0].sys.country;
          }
        },
        error: (err) => {
          this.cityList = [];
          this.errorMessage = 'No city found';
          console.log(this.cityList, 'error');
        },
        complete: () => {},
      });
  }

  /**
   * Function called when city name dropdown option is selected
   * @param city - name of the selected city
   */
  selectCity(city: any) {
    const unit = this.unit === 'metric' ? '°C' : '°F';
    this.city = `${city.name},${city.sys.country}`; //setting input text
    this.cityObject.name = city.name;
    this.cityObject.feelsLike = `${city.main.feels_like} ${unit}`;
    this.cityObject.temp = `${city.main.temp} ${unit}`;
    this.cityObject.country = city.sys.country;
    localStorage.setItem('cityWeatherDetails', JSON.stringify(this.cityObject));
  }
}
