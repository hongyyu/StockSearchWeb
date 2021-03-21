import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-search-web-angular';

  pageChange(pageName: string):void {
    var linkList = document.querySelectorAll(".nav-item");

    for (let i = 0; i < linkList.length; i++) {
      var current = linkList[i];

      if (current.id === pageName) {
        current.classList.add("active");
      } else {
        current.classList.remove("active");
      }

    }
  }

}
