import { ClientListComponent } from './pages/client-list/client-list.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CreateSerCatComponent } from './pages/create-ser-cat/create-ser-cat.component';
import { CreateNotifyComponent } from './pages/create-notify/create-notify.component';
import { CreateBroadcastComponent } from './pages/create-broadcast/create-broadcast.component';
import { OperatorListComponent } from './pages/operator-list/operator-list.component';
import { AddOperatorComponent } from './pages/add-operator/add-operator.component';
import { MainComponent } from './components/main/main.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateServiceComponent } from './pages/create-service/create-service.component';
import { NotifListComponent } from './pages/notif-list/notif-list.component';


const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    data: {title: 'Login'},
    canActivate: [AuthGuard]
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    data: {title:'Dashboard'},
    children: [
      {
        path: 'home',
        component: MainComponent,
        data: {title:'Dashboard'},
      },
      {
        path: 'operator/add',
        component: AddOperatorComponent,
        data: {title:'Add Operator'},
      },
      {
        path: 'operators',
        component: OperatorListComponent,
        data: {title:'All Operator'},
      },
      {
        path: 'notifications',
        component: NotifListComponent,
        data: {title:'Notifications'},
      },
      {
        path: 'notifications/add',
        component: CreateNotifyComponent,
        data: {title:'Notifications'},
      },
      {
        path: 'services',
        component: CreateServiceComponent,
        data: {title:'Service'},
      },
      {
        path: 'categories',
        component: CreateSerCatComponent,
        data: {title:'Service Category'},
      },
      {
        path: 'createBroadcast',
        component: CreateBroadcastComponent,
        data: {title:'Broadcast'},
      },
      {
        path: 'client/add',
        component: AddClientComponent,
        data: {title:'Add Client'},
      },
      {
        path: 'clients',
        component: ClientListComponent,
        data: {title:'All Client'},
      },
      {
        path: 'password',
        component: ChangePasswordComponent,
        data: {title:'Change Password'},
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
