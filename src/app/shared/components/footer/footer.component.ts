import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  topHover = false;
  showBubble: boolean;
  constructor() {
  }

  ngOnInit() {
    this.showBubble = false;

    if (document.getElementById('toTheTop') !== null) {
      document.getElementById('toTheTop').addEventListener('click', () => {
        this.showBubble = true;
        this.backToTop();
      });
      document.getElementById('toTheTop').addEventListener('mouseover', () => {
        this.showBubble = true;
      });
      document.getElementById('toTheTop').addEventListener('mouseleave', () => {
        this.showBubble = false;
      });
    }
  }

  backToTop = () => {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 30);
  }
}
