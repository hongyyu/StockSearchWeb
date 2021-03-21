import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from './pages/search/search.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { DetailsComponent } from './pages/details/details.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'details/:ticker', component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
