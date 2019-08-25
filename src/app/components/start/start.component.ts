import { Component, OnInit } from '@angular/core';
import { QuotesService } from 'src/app/shared/services/quotes.service';
import { Quote } from '../../shared/services/quotes.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(private quoteS: QuotesService) {
    this.quoteS.getQuoteOfTheDay();
  }

  ngOnInit() {
  }

  open(event: any) {
    
  }

  get quoteOfTheDay(): Quote {
    return this.quoteS.quote;
  }
}
