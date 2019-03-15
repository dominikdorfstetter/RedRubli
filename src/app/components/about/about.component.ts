import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  version_number: Number = 0.1;
  creation_date: String = '24.03.2018';
  last_update: String = '24.03.2018';
  features = [
    {
      title: 'Angular (7) with SCSS'
    },
    {
      title: 'primeNg as a rich component-library'
    },
    {
      title: 'Googles Material as general style-guideline and component library'
    },
    {
      title: 'bootstrap-template for primeNg'
    },
    {
      title: 'configuration folders and loading system'
    },
    {
      title: 'logging'
    },
    {
      title: 'redux-store'
    }
  ];

  fonts = [
    {
      title: 'AppleSansAdjectives',
      style: 'applesans',
      usage: 'Console Font'
    },
    {
      title: 'OpenSans',
      style: 'opensans',
      usage: 'Basically every text on the website that is not highlighted'
    },
    {
      title: 'Cities_Typeface',
      style: 'cities',
      usage: 'Highlight Font, usable for Card-Titles and strong text'
    },
    {
      title: 'Inkferno',
      style: 'inkferno',
      usage: 'Highlight / Headline Font'
    },
    {
      title: 'LOVE',
      style: 'love',
      usage: 'Headline Font'
    },
    {
      title: 'Saros',
      style: 'saros',
      usage: 'Clear simple font'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
