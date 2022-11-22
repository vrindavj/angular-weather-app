import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
import { SearchComponent } from './search.component';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  // single data : Alleppey , Hervanta  ; multipledata : Oulu ,London
  let apiDataOulu = {
    message: 'accurate',
    cod: '200',
    count: 2,
    list: [
      {
        id: 643492,
        name: 'Oulu',
        coord: { lat: 65.0124, lon: 25.4682 },
        main: {
          temp: -3.94,
          feels_like: -6.32,
          temp_min: -3.94,
          temp_max: -3.94,
          pressure: 1021,
          humidity: 86,
        },
        dt: 1669068545,
        wind: { speed: 1.54, deg: 140 },
        sys: { country: 'FI' },
        rain: null,
        snow: null,
        clouds: { all: 100 },
        weather: [
          {
            id: 804,
            main: 'Clouds',
            description: 'overcast clouds',
            icon: '04n',
          },
        ],
      },
      {
        id: 643493,
        name: 'Oulu',
        coord: { lat: 65.2144, lon: 25.9645 },
        main: {
          temp: -4.25,
          feels_like: -4.25,
          temp_min: -4.25,
          temp_max: -4.25,
          pressure: 1022,
          humidity: 98,
          sea_level: 1022,
          grnd_level: 1016,
        },
        dt: 1669068563,
        wind: { speed: 1.23, deg: 110 },
        sys: { country: 'FI' },
        rain: null,
        snow: null,
        clouds: { all: 72 },
        weather: [
          {
            id: 803,
            main: 'Clouds',
            description: 'broken clouds',
            icon: '04n',
          },
        ],
      },
    ],
  };
  let apiDataAlleppey = {
    message: 'accurate',
    cod: '200',
    count: 1,
    list: [
      {
        id: 1278985,
        name: 'Alappuzha',
        coord: { lat: 9.49, lon: 76.3264 },
        main: {
          temp: 23.89,
          feels_like: 24.4,
          temp_min: 23.89,
          temp_max: 23.89,
          pressure: 1009,
          humidity: 79,
          sea_level: 1009,
          grnd_level: 1008,
        },
        dt: 1669068550,
        wind: { speed: 3.25, deg: 14 },
        sys: { country: 'IN' },
        rain: null,
        snow: null,
        clouds: { all: 6 },
        weather: [
          { id: 800, main: 'Clear', description: 'clear sky', icon: '01n' },
        ],
      },
    ],
  };
  let apiDataHervanta = {
    message: 'accurate',
    cod: '200',
    count: 1,
    list: [
      {
        id: 630752,
        name: 'Hervanta',
        coord: { lat: 61.4509, lon: 23.8514 },
        main: {
          temp: -2.97,
          feels_like: -7.15,
          temp_min: -3.13,
          temp_max: -1.4,
          pressure: 1015,
          humidity: 90,
        },
        dt: 1669112062,
        wind: { speed: 3.09, deg: 100 },
        sys: { country: 'FI' },
        rain: null,
        snow: null,
        clouds: { all: 75 },
        weather: [
          {
            id: 803,
            main: 'Clouds',
            description: 'broken clouds',
            icon: '04d',
          },
        ],
      },
    ],
  };
  let apiDataEmpty = {
    message: 'accurate',
    cod: '200',
    count: 1,
    list: [],
  };
  let singleCityObject = {
    id: 643492,
    name: 'Oulu',
    coord: { lat: 65.0124, lon: 25.4682 },
    main: {
      temp: -3.94,
      feels_like: -6.32,
      temp_min: -3.94,
      temp_max: -3.94,
      pressure: 1021,
      humidity: 86,
    },
    dt: 1669068545,
    wind: { speed: 1.54, deg: 140 },
    sys: { country: 'FI' },
    rain: null,
    snow: null,
    clouds: { all: 100 },
    weather: [
      {
        id: 804,
        main: 'Clouds',
        description: 'overcast clouds',
        icon: '04n',
      },
    ],
  };
  let event = {
    type: 'click',
    stopPropagation: function () {},
    preventDefault: function () {},
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        HttpClientTestingModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatInputModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
      ],
      providers: [WeatherService],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set cityName when input is entered', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const element: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector('#cityInput');
      element.value = 'Oulu';
      element.dispatchEvent(new Event('input'));
      expect(element.value).toEqual('Oulu');
      done();
    });
  });

  it('should set cityName in input field when model changes', (done) => {
    component.city = 'Tampere';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const element: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector('#cityInput');
      expect(element.value).toEqual('Tampere');
      done();
    });
  });

  it('should call searchHandler fn on search', () => {
    spyOn(component, 'searchHandler');
    const element: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector('#submitBtn');
    element.click();
    fixture.detectChanges();
    expect(component.searchHandler).toHaveBeenCalled();
  });

  it('searchhandler should create cityList when api returns multiple city weatherdata', () => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataOulu);
    });
    component.city = 'oulu';
    component.searchHandler(event);
    expect(component.cityList).toEqual(apiDataOulu.list);
  });

  it('searchhandler should show No city found message for invalid cityname', () => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataEmpty);
    });
    component.city = 'oprtretvvvvv';
    component.searchHandler(event);
    expect(component.cityObject.name).toEqual('');
    expect(component.errorMessage).toEqual('No city found');
    fixture.detectChanges();
  });

  it('should call handleFetchdata fn when api returns weatherdata for multiple cities', () => {
    spyOn(component, 'handleFetchedData');
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataOulu);
    });
    component.city = 'oulu';
    component.searchHandler(event);
    expect(component.handleFetchedData).toHaveBeenCalled();
  });

  it('handleFetchdata should set showDropDown true when api returns multiple city weatherdata ', fakeAsync(() => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataOulu);
    });
    component.city = 'oulu';

    component.searchHandler(event);
    expect(component.showDropDown).toEqual(true);
    fixture.detectChanges();
  }));

  it('handleFetchdata should set cityObject when api returns single city weatherdata ', fakeAsync(() => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataHervanta);
    });
    component.city = 'hervanta';
    component.searchHandler(event);
    expect(component.cityObject.name).toEqual('Hervanta');
    expect(component.cityObject.country).toEqual('FI');
    fixture.detectChanges();
  }));

  it('searchhandler fn should set error message when api throws error ', fakeAsync(() => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.returnValue(
      throwError(() => new Error('Api Error'))
    );
    component.city = 'sdsdsdsd';
    component.searchHandler(event);
    expect(component.errorMessage).toEqual('No city found');
    fixture.detectChanges();
  }));

  it('should call toggleHandler function fn on button toggle', () => {
    spyOn(component, 'toggleHandler');
    const toggleBtn = fixture.debugElement.query(By.css('#unitToggleBtn'));
    const clickableEl = toggleBtn.query(By.css('#imperial'));
    clickableEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.toggleHandler).toHaveBeenCalled();
  });

  it('should set unit to imperial when toggle button is clicked', () => {
    const toggleBtn = fixture.debugElement.query(By.css('#unitToggleBtn'));
    const clickableEl = toggleBtn.query(By.css('#imperial'));
    clickableEl.nativeElement
      .querySelector('.mat-button-toggle-button')
      .click();
    fixture.detectChanges();
    expect(component.unit).toEqual('imperial');
  });

  it('toggleHandler fn should set cityObject when api returns single city weatherdata ', () => {
    component.unit = 'imperial';
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.returnValue(of(apiDataAlleppey));
    component.toggleHandler();
    expect(component.cityObject.name).toEqual('Alappuzha');
    fixture.detectChanges();
  });

  it('toggleHandler fn should show No city found message fn when api returns no city weatherdata ', () => {
    component.unit = 'imperial';
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.returnValue(of(apiDataEmpty));
    component.toggleHandler();
    expect(component.errorMessage).toEqual('No city found');
    fixture.detectChanges();
  });

  it('toggleHandler fn should set an error message and empty citylist when api throws error ', () => {
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.returnValue(
      throwError(() => new Error('Api Error'))
    );
    component.toggleHandler();
    expect(component.cityList.length).toEqual(0);
    expect(component.errorMessage).toEqual('No city found');
  });

  it('dropdown should call selectCity function when an option is selected', fakeAsync(() => {
    spyOn(component, 'selectCity');
    let service = fixture.debugElement.injector.get(WeatherService);
    spyOn(service, 'fetchWeatherData').and.callFake(() => {
      return of(apiDataOulu);
    });
    component.city = 'oulu';
    component.searchHandler(event);
    fixture.detectChanges();
    expect(component.showDropDown).toBeTrue();
    const dropDownDiv = fixture.debugElement.query(By.css('.drop-down'));
    const clickableEl = dropDownDiv.query(By.css('.city-option'));
    clickableEl.nativeElement.click();
    expect(component.selectCity).toHaveBeenCalled();
  }));

  it('should set cityObject when dropDown option is selected', () => {
    component.unit = 'metric';
    component.selectCity(singleCityObject);
    expect(component.cityObject.temp).toEqual('-3.94 °C');
  });
});
