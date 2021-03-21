import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap, finalize } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from 'src/app/data.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  myControl = new FormControl();

  @ViewChild('tickername') tickername: any;

  options: any;
  filteredOptions: any;
  isLoading = false;
  emptyList = [];

  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit(): void {
    this.myControl.valueChanges.pipe(
      debounceTime(400),
      tap(() => {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false
        }, 700);
      }),
      switchMap(val => val !== '' && val != null ? this.dataService.getAutoCompleteData(val) : this.emptyList)
    ).subscribe(values => this.filteredOptions = values);
  }

  getDetails(): void {
    var ticker = this.tickername.nativeElement.value.toUpperCase();
    this.router.navigate(['/details', ticker])
  }
}
