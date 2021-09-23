import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {LoaderService} from './app/shared/loader/loader.service';
import firebase from 'firebase/compat/app';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    loader: LoaderService;
    getServerTime: () => number;
    registerForMessage: () => void;
  }
}
// @ts-ignore
window.loader = window.loader || {};
window.getServerTime = () => firebase.firestore.Timestamp.now().seconds * 1000;
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
