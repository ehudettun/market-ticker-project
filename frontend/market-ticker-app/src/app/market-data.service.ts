import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private baseUrl = environment.apiBaseUrl;
  private apiUrl = `${this.baseUrl}/api/search-pairs`;
  

  constructor(private http: HttpClient) { }

  getMarketData(ticker1: string, ticker2: string, startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/market-data?ticker1=${ticker1}&ticker2=${ticker2}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any>(url);
  }

  validateTicker(ticker: string): Observable<boolean> {
    const url = `${this.apiUrl}/validate/${ticker}`;
    return this.http.get<boolean>(url);
  }

  getSuggestedTickers(ticker: string): Observable<string[]> {
    const url = `${this.apiUrl}/suggested?ticker=${ticker}`;
    return this.http.get<string[]>(url);
  }
}
