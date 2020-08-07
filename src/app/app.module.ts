import { JwtInterceptor } from './services/jwt.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { DndModule } from 'ngx-drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ClientSidebarComponent } from './components/client-sidebar/client-sidebar.component';
import { ClientMainComponent } from './components/client-main/client-main.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { ProfileComponent } from './components/client-sidebar/components/profile/profile.component';
import { DocumentComponent } from './components/client-sidebar/components/document/document.component';
import { ClientTicketCardComponent } from './components/client-main/components/client-ticket-card/client-ticket-card.component';
import { ClientOngticketsComponent } from './components/client-main/components/client-ongtickets/client-ongtickets.component';
import { ClientPPaymentComponent } from './components/client-main/components/client-p-payment/client-p-payment.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { AddOperatorComponent } from './pages/add-operator/add-operator.component';
import { OperatorListComponent } from './pages/operator-list/operator-list.component';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { CreateBroadcastComponent } from './pages/create-broadcast/create-broadcast.component';
import { CreateNotifyComponent } from './pages/create-notify/create-notify.component';
import { CreateSerCatComponent } from './pages/create-ser-cat/create-ser-cat.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { MinimizedchatboxComponent } from './components/minimizedchatbox/minimizedchatbox.component';
import { CreateServiceComponent } from './pages/create-service/create-service.component';
import { MenuComponent } from './components/menu/menu.component';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { NotifListComponent } from './pages/notif-list/notif-list.component';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

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
    ClientPPaymentComponent,
    AddClientComponent,
    AddOperatorComponent,
    OperatorListComponent,
    ClientListComponent,
    CreateBroadcastComponent,
    CreateNotifyComponent,
    CreateSerCatComponent,
    ChangePasswordComponent,
    MinimizedchatboxComponent,
    CreateServiceComponent,
    MenuComponent,
    SubmenuComponent,
    NotifListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    // for Router use:
    LoadingBarRouterModule,
    // for Core use:
    LoadingBarModule,
    NgCircleProgressModule.forRoot(
      {
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#78C000",
        innerStrokeColor: "#C7E596",
        animationDuration: 300,
      }
    ),
    DndModule
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
