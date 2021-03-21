import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

// external js functions for rerendering UI
declare function headerLinkStyle(idName: string): void;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  chageStyle(idName: string) {
    headerLinkStyle(idName);
  }

  searchStock(name: string) {
    this.dataService.getInfoByTicker(name).subscribe((res: any) => {
      console.log(res);

    })
  }

}
