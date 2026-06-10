import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeFeedComponent } from './components/home-feed/home-feed.component';
import { PollDetailsComponent } from './components/poll-details/poll-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CreatePollComponent } from './components/create-poll/create-poll.component';
import { ManagePollsComponent } from './components/manage-polls/manage-polls.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'feed', component: HomeFeedComponent, canActivate: [authGuard] },
  { path: 'polls/:id', component: PollDetailsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/create-poll', component: CreatePollComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/manage-polls', component: ManagePollsComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: '**', redirectTo: 'feed' }
];
