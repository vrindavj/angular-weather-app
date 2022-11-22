import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  apiKey: string = '1cb6ace31e50401f28b864f0b23fdc68';
  URL: string = `http://api.openweathermap.org/data/2.5/find?appid=${this.apiKey}&q=`;
  constructor(public http: HttpClient) {}

  /**
   * Function to call the weather api
   * @param cityname
   * @param unit - imperial or metric
   * @returns - weather data
   */
  fetchWeatherData(cityname: string, unit: string) {
    return this.http.get(`${this.URL}${cityname}&units=${unit}`);
  }
}
