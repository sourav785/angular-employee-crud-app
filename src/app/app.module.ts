import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FakeBackendInterceptor } from './_helpers/fake-backend';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EmployeeEffects, EmployeeReducers } from './states/employee';
import { EmployeeSignalStore } from './store/employee.signal-store';
import { LoaderComponent } from './shared/loader/loader.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LoaderComponent,
    AppRoutingModule,
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ employeesState: EmployeeReducers.employeeReducer }),
    EffectsModule.forRoot([EmployeeEffects]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
    EmployeeSignalStore
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
