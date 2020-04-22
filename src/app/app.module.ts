import { JwtInterceptor } from './services/jwt.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainComponent } from './components/main/main.component';
import { CookieService } from 'ngx-cookie-service';
import { BannerComponent } from './components/banner/banner.component';
import { TotalTicketComponent } from './components/tickets/components/total-ticket/total-ticket.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { TicketCardComponent } from './components/tickets/components/ticket-card/ticket-card.component';
import { OngoingTicketComponent } from './components/ongoing-ticket/ongoing-ticket.component';
import { ClientComponent } from './components/client/client.component';
import { ClientSidebarComponent } from './components/client/components/client-sidebar/client-sidebar.component';
import { ClientMainComponent } from './components/client/components/client-main/client-main.component';
import { ChatboxComponent } from './components/client/components/chatbox/chatbox.component';
import { ProfileComponent } from './components/client/components/client-sidebar/components/profile/profile.component';
import { DocumentComponent } from './components/client/components/client-sidebar/components/document/document.component';
import { ClientTicketCardComponent } from './components/client/components/client-main/components/client-ticket-card/client-ticket-card.component';
import { ClientOngticketsComponent } from './components/client/components/client-main/components/client-ongtickets/client-ongtickets.component';
import { ClientPPaymentComponent } from './components/client/components/client-main/components/client-p-payment/client-p-payment.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    ToolbarComponent,
    MainComponent,
    BannerComponent,
    TotalTicketComponent,
    TicketsComponent,
    TicketCardComponent,
    OngoingTicketComponent,
    ClientComponent,
    ClientSidebarComponent,
    ClientMainComponent,
    ChatboxComponent,
    ProfileComponent,
    DocumentComponent,
    ClientTicketCardComponent,
    ClientOngticketsComponent,
    ClientPPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot(
      {
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#78C000",
        innerStrokeColor: "#C7E596",
        animationDuration: 300,
      }
    )
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
