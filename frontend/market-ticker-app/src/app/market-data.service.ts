import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private apiUrl = 'http://localhost:8080/api/search-pairs';

  constructor(private http: HttpClient) { }

  getAllPairs(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createPair(ticker1: string, ticker2: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {ticker1, ticker2});
  }

  searchPair(ticker1: string, ticker2: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?ticker1=${ticker1}&ticker2=${ticker2}`);
  }
  
  getMarketData(ticker1: string, ticker2: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/market-data?ticker1=${ticker1}&ticker2=${ticker2}&startDate=${startDate}&endDate=${endDate}`);
  }
}
