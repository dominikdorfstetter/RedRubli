import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  color = 'secondary';
  mode = 'indeterminate';
  value = 50;

  constructor(private spinnerS: SpinnerService) { }

  ngOnInit() {
  }

  get loading(): boolean {
    return this.spinnerS.loading;
  }
}
