import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { DetailsComponent } from './pages/details/details.component';
import { SearchComponent } from './pages/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
