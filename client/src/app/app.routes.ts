import { Routes } from '@angular/router';
import { LoginForm } from './pages/login-form/login-form';
import { RegisterForm } from './pages/register-form/register-form';
import { BlogFeed } from './pages/blog-feed/blog-feed';
import { BlogDetails } from './pages/blog-details/blog-details';
import { Layout } from './components/layout/layout';
import { NewBlog } from './pages/new-blog/new-blog';
import { MyBookmarks } from './components/my-bookmarks/my-bookmarks';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'blog-feed',
        component: BlogFeed,
      },
      {
        path: 'blog-details',
        component: BlogDetails,
        title: 'Blog Details',
      },
      {
        path: 'new-blog',
        component: NewBlog,
        title: 'Create New Blog',
      },
      {
        path: '',
        component: BlogFeed,
        title: 'Blog Feed',
      },
      {
        path: 'bookmarks',
        component: MyBookmarks,
        title: 'My Bookmarks',
      },
      {
        path: ':blogid',
        component: BlogDetails,
        title: 'Blog Details',
      },
    ],
  },
  {
    path: 'login',
    component: LoginForm,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterForm,
    title: 'Register',
  },
];
