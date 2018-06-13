import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

function bootstrapApp(){
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
}
if (navigator &&
  navigator.userAgent.match(/(ipad|iPhone|Android|iPad)/) == null ||
  navigator.userAgent.match(/(ipad|iPhone|Android|iPad)/) == null ||
  document.URL.substring(0, 4) == "http"
) {
  bootstrapApp();
} else {
  document.addEventListener("deviceready", () => {
    bootstrapApp();
   }, false);
}