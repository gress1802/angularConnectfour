import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component : LoginComponent },
  { path: 'games/:gameId/players/:playerOption/computers/:computerOption', component : GameViewComponent, canActivate: [AuthGuard] },
  { path: 'list/:gameId', component : GameListComponent, canActivate: [AuthGuard] },
  { path: 'list', component : GameListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { };

