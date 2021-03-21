import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// import highcharts related packages
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
IndicatorsCore(Highcharts)
vbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  // private variables
  private currentUrl: string;
  private ticker: string;

  // data files from api
  public metaData: any;
  public lastPriceData: any;
  public dailyData: any;
  public historyData: any;
  public newsData: any;
  public leftColNews: any;
  public rightColNews: any;

  // others
  public isLoading: boolean;
  public isMarketOpen: boolean;
  public isCaretIncrease: boolean;
  public invalidTicker: boolean;
  public cur_color: string;
  public star_clicked: boolean;

  // highcharts variable
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options;
  public historyChartOptions: Highcharts.Options;

  // modal window variables
  public closeResult = '';
  public totalValue = '0.00'

  // alert variables
  public alertType = 'success';  // success;danger;warning
  public watchlistDangerAlert: boolean = false;
  public watchlistSuccessAlert: boolean = false;
  public buyAlert: boolean = false;

  constructor(private dataService: DataService, private router : Router, private modalService: NgbModal) {
    // get current url which could be used to extract ticker
    this.currentUrl = this.router.url;

    // this is ticker
    this.ticker = this.currentUrl.split('/').pop()!;

    // determine if the market is opened or not
    this.isMarketOpen = true;

    // determine caret up or down
    this.isCaretIncrease = true;

    // initial isLoading to true at beginning
    this.isLoading = true;

    // initial invalid ticker false
    this.invalidTicker = false;

    // for highcharts
    this.chartOptions = {};
    this.historyChartOptions = {};

    // color is green if price increase, otherwise red
    this.cur_color = 'green';

    // star status
    this.star_clicked = false;

    // check market open or close
    // market open at 6:30 am PST and close at 1:00 pm PST
    let cur_date = new Date()
    if (cur_date.getDay() == 6 || cur_date.getDay() == 0) {
      this.isMarketOpen = false;
    } else if ((cur_date.getHours() <= 6 && cur_date.getMinutes() <= 30) || (cur_date.getHours() >= 13 && cur_date.getMinutes() > 0)) {
      this.isMarketOpen = false;
    }

  }

  ngOnInit(): void {
    // header buttons remove highlight
    document.getElementById('s-btn')!.classList.remove("active");
    document.getElementById('w-btn')!.classList.remove("active");
    document.getElementById('p-btn')!.classList.remove("active");

    // get company description info
    this.dataService.getMetadata(this.ticker).subscribe((values: Array<any>) => {
      if ('error' in values) {
        this.invalidTicker = true;
      } else {
        this.metaData = values;

            // star status
        let curWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (curWatchlist.includes(this.metaData.ticker)) {
          this.star_clicked = true;
        } else {
          this.star_clicked = false;
        }
      }
    });

    // get company last price info
    if (this.invalidTicker == false) {
      this.dataService.getLastPrice(this.ticker).subscribe((values: Array<any>) => {
        this.lastPriceData = values[0];

        // check caret up or down
        if (this.lastPriceData.last - this.lastPriceData.prevClose < 0) {
          this.isCaretIncrease = false;
          this.cur_color = 'red';
        }

      });
    }

    // get company history date for 6 months chart
    if (this.invalidTicker == false) {
      this.dataService.getDailyPrice(this.ticker).subscribe((values: Array<any>) => {
        this.dailyData = values;

        this.chartOptions = {
          rangeSelector:{
            enabled: false
          },
          title: {
            text: this.ticker
          },
          series: [{
            data: this.dailyData.daily,
            type: 'line',
            color: this.cur_color,
            name: this.ticker
          }]
        }
      })
    }

    // get news about current ticker
    if (this.invalidTicker == false) {
      this.dataService.getNews(this.ticker).subscribe((values: Array<any>) => {
        this.newsData = values;
        var n = this.newsData.length;
        this.leftColNews = this.newsData.slice(0, n / 2);
        this.rightColNews = this.newsData.slice(n / 2, n);
      })
    }

    if (this.invalidTicker == false) {
      this.dataService.getHistoryPrice(this.ticker).subscribe((values: any) => {
        var ohlc = values.ohlc;
        var vol = values.vol;

        this.historyChartOptions = {
          rangeSelector:{
            selected: 2
          },
          title:{
            text: this.ticker + ' History'
          },
          subtitle:{
            text: 'With SMA and Volume by Price technical indicators'
          },

          yAxis:[{
            startOnTick: false,
            endOnTick: false,
            labels: {align: 'right', x: -3},
            title: {text: 'OHLC'},
            height: '60%',
            lineWidth: 2,
            resize: {enabled: true}
          }, {
            labels: {align: 'right', x: -3},
            title: {text: 'Volume'},
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
          }],

          tooltip:{
            split:true
          },

          plotOptions:{
            series:{
              dataGrouping:{
                units:[['week', [1]], ['month', [1,2,3,4,6]]]
              }
            }
          },

          series: [{
            type: 'candlestick',
            name: this.ticker,
            id: 'aapl',
            zIndex: 2,
            data: ohlc
          }, {
            type:'column',
            name: 'Volume',
            id:'volume',
            data: vol,
            yAxis: 1
          }, {
            type:'vbp',
            linkedTo:'aapl',
            params:{volumeSeriesID:'volume'},
            dataLabels:{enabled:false},
            zoneLines:{enabled:false}
          }, {
            type:'sma',
            linkedTo:'aapl',
            zIndex:1,
            marker:{enabled:false}
          }]

        }
        this.isLoading = false;
      })
    }

    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 2000);

  }

  // star icon click action
  click_star(): void {

    // star currently is filled, set to empty and alert should be red
    if (this.star_clicked) {
      this.star_clicked = false;

      let curWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      curWatchlist = curWatchlist.filter((val: string) => val !== this.metaData.ticker);
      localStorage.setItem('watchlist', JSON.stringify(curWatchlist));

      this.watchlistDangerAlert = true;
      setTimeout(() => {
        this.watchlistDangerAlert = false;
      }, 5000);

    // star currently is not filled, set to filled and alert should be green
    } else {
      this.star_clicked = true;

      if (localStorage.getItem('watchlist') == null) {
        let newWatchlist = [this.metaData.ticker];
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      } else {
        let curWatchlist = JSON.parse(localStorage.getItem('watchlist')!);
        curWatchlist.push(this.metaData.ticker);
        localStorage.setItem('watchlist', JSON.stringify(curWatchlist));

      }

      this.watchlistSuccessAlert = true;
      setTimeout(() => {
        this.watchlistSuccessAlert = false;
      }, 5000);
    }

  }

  // get current timestamp
  getCurrentTimeStamp() {
    var date = new Date()
    var res = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMonth()}:${date.getSeconds()}`;

    return res
  }

  // for Modal window
  open(content: any) {
    this.totalValue = '0.00';
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // modal window to buy stock
  onKey(quantity: any) {
    if (quantity === 0) {
      this.totalValue = '0.00';
    }
    this.totalValue = Number(quantity * this.lastPriceData.last).toFixed(2);
  }

  clickBuyButton(quantity: any) {

    if (localStorage.getItem('portfolio') == null) {
      let newPortfolio = [{
        'quantity': parseFloat(quantity),
        'total': parseFloat(Number(quantity * this.lastPriceData.last).toFixed(2)),
        'ticker': this.metaData.ticker,
        'name': this.metaData.name
      }]
      localStorage.setItem('portfolio', JSON.stringify(newPortfolio));

    } else {
      let curPortfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
      let isDetect = false;

      for (let i = 0; i < curPortfolio.length; i++) {
        if (curPortfolio[i].ticker == this.metaData.ticker) {
          isDetect = true;
          curPortfolio[i]['quantity'] = parseFloat(curPortfolio[i]['quantity']) + parseFloat(quantity);
          curPortfolio[i]['total'] = parseFloat(curPortfolio[i]['total']) + parseFloat(Number(quantity * this.lastPriceData.last).toFixed(2));
        }
      }

      if (isDetect == false) {
        curPortfolio.push({
          'quantity': parseFloat(quantity),
          'total': parseFloat(Number(quantity * this.lastPriceData.last).toFixed(2)),
          'ticker': this.metaData.ticker,
          'name': this.metaData.name
        })
      }

      localStorage.setItem('portfolio', JSON.stringify(curPortfolio));
    }


    this.buyAlert = true;
    setTimeout(() => {
      this.buyAlert = false;
    }, 5000);
    this.modalService.dismissAll();
  }

}
