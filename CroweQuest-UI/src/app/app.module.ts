/*****
 * App.Module
 * This is like the Startup.CS
 * for Angular
 * This is where everything is bundled up so the
 * App knows about them.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummaryPipe } from './pipes/summary.pipe';
import { BlogComponent } from './components/blog-components/blog/blog.component';
import { BlogCardComponent } from './components/blog-components/blog-card/blog-card.component';
import { BlogEditComponent } from './components/blog-components/blog-edit/blog-edit.component';
import { BlogsComponent } from './components/blog-components/blogs/blogs.component';
import { FamousBlogsComponent } from './components/blog-components/famous-blogs/famous-blogs.component';
import { CommentBoxComponent } from './components/comment-components/comment-box/comment-box.component';
import { CommentSystemComponent } from './components/comment-components/comment-system/comment-system.component';
import { CommentsComponent } from './components/comment-components/comments/comments.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PhotoAlbumComponent } from './components/photo-album/photo-album.component';
import { RegisterComponent } from './components/register/register.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

//declarations are to declare components, pipes and directives in the current module
@NgModule({
  declarations: [
    AppComponent,
    SummaryPipe,
    BlogComponent,
    BlogCardComponent,
    BlogEditComponent,
    BlogsComponent,
    FamousBlogsComponent,
    CommentBoxComponent,
    CommentSystemComponent,
    CommentsComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    NotFoundComponent,
    PhotoAlbumComponent,
    RegisterComponent,
  ],

  //IMPORTS are to import custom modules into the app
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    PopoverModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    

  ],

  //PROVIDERS ARE INJECTED SERVICES REQUIRED BY THE COMPONENTS DIRECTIVES OR PIPES IN THE CURRENT MODULE
  providers: [
    HttpClient,
    //hook interceptors int app module MULTI MEANS
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
