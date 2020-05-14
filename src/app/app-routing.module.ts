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
        path: '',
        component: MainComponent
      },
      {
        path: 'addOperator',
        component: AddOperatorComponent,
        data: {title:'Add Operator'},
      },
      {
        path: 'operatorList',
        component: OperatorListComponent,
        data: {title:'Operator List'},
      },
      {
        path: 'createNotify',
        component: CreateNotifyComponent,
        data: {title:'Create Notifications'},
      },
      {
        path: 'createService',
        component: CreateServiceComponent,
        data: {title:'Service'},
      },
      {
        path: 'createSerCat',
        component: CreateSerCatComponent,
        data: {title:'Service Category'},
      },
      {
        path: 'createBroadcast',
        component: CreateBroadcastComponent,
        data: {title:'Create Broadcast'},

      },
      {
        path: 'addClient',
        component: AddClientComponent,
        data: {title:'Add Client'},
      },
      {
        path: 'clientList',
        component: ClientListComponent,
        data: {title:'Client List'},
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: {title:'Change Password'},
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path:'**',
    component: DashboardComponent,
    data: {title:'Dashboard'},
    canActivate: [AuthGuard]
  },
  {
    path:'',
    component: DashboardComponent,
    data: {title:'Dashboard'},
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
