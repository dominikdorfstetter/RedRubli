// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAYunlNSU6cLsZ4xVQc8qTgb1hZy8mORjw",
    authDomain: "ng-tod0.firebaseapp.com",
    databaseURL: "https://ng-tod0.firebaseio.com",
    projectId: "ng-tod0",
    storageBucket: "ng-tod0.appspot.com",
    messagingSenderId: "120480716594",
    appId: "1:120480716594:web:a7c84e40a5debfd4"
  },
  // the countries your user can choose
  // shared/pipes/countries.pipe.ts
  supportedCountries: [
    'AT', 'DE', 'CH', 'ES', 'IT'
  ]
};
