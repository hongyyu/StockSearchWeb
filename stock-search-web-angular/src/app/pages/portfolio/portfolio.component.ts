import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  // current data
  public portfolioData: any[] = [];
  public myPortfolio: any[] = [];

  // for warning and spiner
  public isLoading: boolean = true;
  public isEmpty: Boolean;

  // for modal
  public closeResult = '';
  public totalValue = '0.00'

  constructor(private dataService: DataService, private router : Router, private modalService: NgbModal) {
    this.portfolioData = JSON.parse(localStorage.getItem('portfolio') || '[]');
    if (this.portfolioData.length == 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
    }
  }

  ngOnInit(): void {
    // header buttons remove highlight
    document.getElementById('s-btn')!.classList.remove("active");
    document.getElementById('w-btn')!.classList.remove("active");
    document.getElementById('p-btn')!.classList.add("active");

    this.getAllData();

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  getAllData() {
    this.myPortfolio = [];
    for (let i = 0; i < this.portfolioData.length; i++) {
      let curPortfolio: any = this.portfolioData[i];
      this.myPortfolio.push({});

      this.dataService.getLastPrice(curPortfolio.ticker).subscribe((values: any) => {
        this.myPortfolio[i]['ticker'] = curPortfolio.ticker;
        this.myPortfolio[i]['name'] = curPortfolio.name;
        this.myPortfolio[i]['quantity'] = curPortfolio.quantity;
        this.myPortfolio[i]['total'] = Number(curPortfolio.total).toFixed(2);
        this.myPortfolio[i]['avgPerShare'] = Number(curPortfolio.total / curPortfolio.quantity).toFixed(2);
        this.myPortfolio[i]['change'] = Number(this.myPortfolio[i]['avgPerShare'] - values[0].last).toFixed(2);
        this.myPortfolio[i]['curPrice'] = values[0].last;
        this.myPortfolio[i]['marketValue'] = Number(values[0].last * curPortfolio.quantity).toFixed(2);

        if (this.myPortfolio[i]['avgPerShare'] - values[0].last < 0) {
          this.myPortfolio[i]['color'] = 'red';
        } else {
          this.myPortfolio[i]['color'] = 'green';
        }
      })
    }

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

  onKey(quantity: any, price: any) {
    if (quantity === 0) {
      this.totalValue = '0.00';
    }
    this.totalValue = Number(quantity * price).toFixed(2);
    // this.totalValue = Number(quantity * this.lastPriceData.last).toFixed(2);
  }

  clickBuyButton(quantity: any, ticker: string) {
    for (let i = 0; i < this.myPortfolio.length; i++) {
      if (this.myPortfolio[i].ticker === ticker) {
        this.myPortfolio[i].quantity = parseInt(this.myPortfolio[i].quantity) + parseInt(quantity);
        this.myPortfolio[i].total = Number(parseFloat(this.myPortfolio[i].total) + parseFloat(this.totalValue)).toFixed(2);
        this.myPortfolio[i].avgPerShare = Number(this.myPortfolio[i].total / this.myPortfolio[i].quantity).toFixed(2);
        this.myPortfolio[i].change = Number(parseFloat(this.myPortfolio[i].avgPerShare) - this.myPortfolio[i].curPrice).toFixed(2);
        this.myPortfolio[i].marketValue = Number(this.myPortfolio[i].quantity * this.myPortfolio[i].curPrice).toFixed(2);
      }
    }

    localStorage.setItem('portfolio', JSON.stringify(this.myPortfolio));
    this.modalService.dismissAll();
  }

  clickSellButton(quantity: any, ticker: string) {
    for (let i = 0; i < this.myPortfolio.length; i++) {
      if (this.myPortfolio[i].ticker === ticker) {
        if (parseInt(this.myPortfolio[i].quantity) - quantity <= 0) {
          this.myPortfolio = this.myPortfolio.slice(0, i).concat(this.myPortfolio.slice(i + 1, this.myPortfolio.length));
          break;
        } else {
          this.myPortfolio[i].quantity = parseInt(this.myPortfolio[i].quantity) - parseInt(quantity);
          this.myPortfolio[i].total = Number(parseFloat(this.myPortfolio[i].total) - parseFloat(this.totalValue)).toFixed(2);
          this.myPortfolio[i].avgPerShare = Number(this.myPortfolio[i].total / this.myPortfolio[i].quantity).toFixed(2);
          this.myPortfolio[i].change = Number(parseFloat(this.myPortfolio[i].avgPerShare) - this.myPortfolio[i].curPrice).toFixed(2);
          this.myPortfolio[i].marketValue = Number(this.myPortfolio[i].quantity * this.myPortfolio[i].curPrice).toFixed(2);
        }

      }
    }

    localStorage.setItem('portfolio', JSON.stringify(this.myPortfolio));
    this.modalService.dismissAll();
  }

  getFloat(quantity: any) {
    return parseFloat(quantity)
  }

}
