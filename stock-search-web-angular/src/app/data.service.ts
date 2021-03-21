import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private webReqService: WebRequestService) { }

  getAutoCompleteData(ticker: string) {
    return this.webReqService.getWithInfo('autocomplete', ticker);
  }

  getMetadata(ticker: string) {
    return this.webReqService.getWithInfo('metadata', ticker);
  }

  getLastPrice(ticker: string) {
    return this.webReqService.getWithInfo('lastPrice', ticker);
  }

  getDailyPrice(ticker: string) {
    return this.webReqService.getWithInfo('dailyPrice', ticker);
  }

  getHistoryPrice(ticker: string) {
    return this.webReqService.getWithInfo('historyPrice', ticker);
  }

  getNews(ticker: string) {
    return this.webReqService.getWithInfo('news', ticker);
  }

}
