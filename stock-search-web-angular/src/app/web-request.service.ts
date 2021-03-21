import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    // this.ROOT_URL = 'http://localhost:8080';
    this.ROOT_URL = '';
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }

  getWithInfo(uri: string, ticker: string) {
    return this.http.get<Array<any>>(`${this.ROOT_URL}/${uri}?ticker=${ticker}`);
  }

}
