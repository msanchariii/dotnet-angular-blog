```
src/
 ├── app/
 │   ├── core/                # global stuff (once per app)
 │   │   ├── services/
 │   │   │    ├── api.service.ts
 │   │   │    ├── auth.service.ts
 │   │   ├── interceptors/
 │   │   ├── models/
 │   │   └── guards/
 │   │
 │   ├── shared/              # reusable UI components
 │   │   ├── components/
 │   │   │    ├── navbar/
 │   │   │    ├── loader/
 │   │   │    ├── input/
 │   │   └── pipes/
 │   │
 │   ├── features/            # main app features
 │   │   ├── auth/
 │   │   │    ├── login/
 │   │   │    └── register/ (optional)
 │   │   │
 │   │   ├── blog/
 │   │   │    ├── create-blog/
 │   │   │    ├── blog-list/
 │   │   │    ├── blog-detail/
 │   │   │
 │   │   ├── category/
 │   │   ├── tag/
 │   │
 │   ├── app-routing.module.ts
 │   └── app.component.ts
```

```
src/
 ├── app/
 │   ├── services/
 │   │    ├── auth.service.ts
 │   │    ├── blog.service.ts
 │   │    ├── category.service.ts
 │   │    ├── tag.service.ts
 │   │
 │   ├── pages/                # like React pages
 │   │    ├── login/
 │   │    ├── create-blog/
 │   │    ├── blog-list/
 │   │    ├── blog-detail/
 │   │
 │   ├── components/           # reusable UI
 │   │    ├── navbar/
 │   │    ├── loader/
 │   │
 │   ├── app-routing.module.ts
 │   └── app.component.ts
```
