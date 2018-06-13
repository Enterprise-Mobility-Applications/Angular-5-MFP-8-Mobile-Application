import { UtilService } from './shared/services/util.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MaskPipe } from './shared/pipes/mask.pipe';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/***** Services *****/
import { AdapterService } from './shared/services/adapter.service';
import { DataStoreService } from './shared/services/data-store.service';
import { GoogleAnalyticsEventsService } from './shared/services/google-analytics-events.service';
import { MockDataService } from './shared/services/mock-data.service';
import { AppConfigService } from './shared/services/app-config.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { AuthActivateGuard } from './authactivate.guard';
import { CustomDialogService } from './shared/services/custom-dialog.service';
import { NavigationService } from './shared/services/navigation.service';
import { CountdownTimerService } from './shared/services/countdown-timer.service';
import { ProfileComponent } from './components/dashboard/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    MaskPipe,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AdapterService,
    DataStoreService,
    MockDataService,
    AppConfigService,
    UtilService,
    AuthActivateGuard,
    GoogleAnalyticsEventsService,
    CustomDialogService,
    LocalStorageService,
    NavigationService,
    CountdownTimerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
