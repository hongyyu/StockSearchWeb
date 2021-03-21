import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  // for local storage
  public myStorage = window.localStorage;
  public watchlist: [];

  // data
  // public metaDatas: any[] = [];
  // public lastPriceDatas: [] = [];
  public companyData: any[] = [];

  public isLoading: boolean = true;
  public isRemove: boolean = false;
  public isEmpty: boolean;

  constructor(private dataService: DataService, private router : Router) {
    // get watchlist from localstorage
    this.watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    if (this.watchlist.length == 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
  }

  ngOnInit(): void {
    // header buttons remove highlight
    document.getElementById('s-btn')!.classList.remove("active");
    document.getElementById('w-btn')!.classList.add("active");
    document.getElementById('p-btn')!.classList.remove("active");

    this.getAllData();

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    // setInterval(() => {this.getAllData()}, 15000);

  }

  getAllData() {
    this.companyData = [];
    for (let i = 0; i < this.watchlist.length; i++) {
        let curTicker = this.watchlist[i];
        this.companyData.push({});

        this.dataService.getMetadata(curTicker).subscribe((values: any) => {
          this.companyData[i]['ticker'] = values.ticker;
          this.companyData[i]['fullName'] = values.name;
        });
        this.dataService.getLastPrice(curTicker).subscribe((values: Array<any>) => {
          this.companyData[i]['lastPrice'] = values[0].last;
          this.companyData[i]['change'] = Number(values[0].last - values[0].prevClose).toFixed(2);;
          this.companyData[i]['changePercent'] = Number((values[0].last - values[0].prevClose) * 100 / values[0].prevClose).toFixed(2);
          if (values[0].last - values[0].prevClose < 0) {
            this.companyData[i]['color'] = 'red';
          } else {
            this.companyData[i]['color'] = 'green';
          }
        });
      }

  }

  getDetails(ticker: string): void {
    if (this.isRemove === false)
      this.router.navigate(['/details', ticker])
    this.isRemove = false;
  }

  removeFromWatchlist(ticker: string) {
    // if isRemove is true, should not route to detail page
    this.isRemove = true;

    // remove ticker from localstorage
    let curWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    curWatchlist = curWatchlist.filter((val: string) => val != ticker);
    localStorage.setItem('watchlist', JSON.stringify(curWatchlist));

    // remove corresponding card from page
    var newCompanyData = [];
    for (let i = 0; i < this.companyData.length; i++) {
      if (this.companyData[i]['ticker'] !== ticker) {
        newCompanyData.push(this.companyData[i]);
      }
    }
    this.companyData = newCompanyData;
    if (this.companyData.length == 0) {
      this.isEmpty = true;
    }

  }

}
