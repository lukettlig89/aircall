import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallsContainerComponent } from './components/calls/calls-container.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectGuard } from './core/guards/redirect.guard';
import { CallDetailContainerComponent } from './components/call-detail/call-detail-container.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AppComponent, canActivate: [RedirectGuard] },
  { path: 'calls', component: CallsContainerComponent, canActivate: [AuthGuard] },
  { path: 'call', component: CallDetailContainerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RedirectGuard],
})
export class AppRoutingModule { }
