import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogEditComponent } from './components/blog-components/blog-edit/blog-edit.component';
import { BlogComponent } from './components/blog-components/blog/blog.component';
import { BlogsComponent } from './components/blog-components/blogs/blogs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PhotoAlbumComponent } from './components/photo-album/photo-album.component';
import { AncestorProfilesComponent } from './components/genealogy-components/ancestor-profiles/ancestor-profiles.component';
import { AncestorProfileComponent } from './components/genealogy-components/ancestor-profile/ancestor-profile.component';
import { AncestorProfileEditComponent } from './components/genealogy-components/ancestor-profile-edit/ancestor-profile-edit.component';
import { SourcesComponent } from './components/genealogy-components/sources/sources.component';
import { SourceEditComponent } from './components/genealogy-components/source-edit/source-edit.component';
import { ResearchNotesComponent } from './components/genealogy-components/research-notes/research-notes.component';
import { ResearchNoteEditComponent } from './components/genealogy-components/research-note-edit/research-note-edit.component';
import { NotificationsComponent } from './components/genealogy-components/notifications/notifications.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'blogs', component: BlogsComponent},
  {path: 'blogs/:id', component: BlogComponent},
  {path: 'photo-album', component: PhotoAlbumComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/:id', component: BlogEditComponent, canActivate: [AuthGuard]},
  {path: 'genealogy/ancestors', component: AncestorProfilesComponent},
  {path: 'genealogy/ancestors/:id', component: AncestorProfileComponent},
  {path: 'genealogy/ancestors/edit/:id', component: AncestorProfileEditComponent, canActivate: [AuthGuard]},
  {path: 'genealogy/sources', component: SourcesComponent},
  {path: 'genealogy/sources/edit/:id', component: SourceEditComponent, canActivate: [AuthGuard]},
  {path: 'genealogy/research-notes', component: ResearchNotesComponent},
  {path: 'genealogy/research-notes/edit/:id', component: ResearchNoteEditComponent, canActivate: [AuthGuard]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
