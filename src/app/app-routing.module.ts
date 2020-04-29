import { OperatorListComponent } from './pages/operator-list/operator-list.component';
import { AddOperatorComponent } from './pages/add-operator/add-operator.component';
import { MainComponent } from './components/main/main.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { AuthGuard } from './services/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy } from '@angular/router';


const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'addOperator',
        component: AddOperatorComponent
      },
      {
        path: 'operatorList',
        component: OperatorListComponent
      },
      {
        path: 'addClient',
        component: AddClientComponent
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
