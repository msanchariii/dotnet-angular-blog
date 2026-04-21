import { Routes } from '@angular/router';
import { LoginForm } from './pages/login-form/login-form';
import { RegisterForm } from './pages/register-form/register-form';
import { BlogFeed } from './pages/blog-feed/blog-feed';
import { BlogDetails } from './pages/blog-details/blog-details';
import { Layout } from './components/layout/layout';
import { NewBlog } from './pages/new-blog/new-blog';
import { MyBookmarks } from './components/my-bookmarks/my-bookmarks';
import { MyBlog } from './pages/my-blog/my-blog';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminBlogs } from './pages/admin-blogs/admin-blogs';

export const routes: Routes = [
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
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'blog',
      },
      {
        path: 'new-blog',
        component: NewBlog,
        title: 'Create New Blog',
      },
      {
        path: 'bookmarks',
        component: MyBookmarks,
        title: 'My Bookmarks',
      },
      {
        path: 'profile',
        component: MyBlog,
        title: 'My Blogs',
      },
      {
        path: 'admin/blogs',
        component: AdminBlogs,
        title: 'Manage Blogs',
        canActivate: [adminGuard],
      },
      {
        path: 'blog/:blogid',
        component: BlogDetails,
        title: 'Blog Details',
      },
      {
        path: 'blog',
        component: BlogFeed,
        title: 'Blog Feed',
      },
    ],
  },
];
