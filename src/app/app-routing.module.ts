import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallsContainerComponent } from './components/calls/calls-container.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectGuard } from './core/guards/redirect.guard';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [RedirectGuard] },
  { path: 'calls', component: CallsContainerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RedirectGuard],
})
export class AppRoutingModule { }
