## AUTH

| Method | Endpoint           | Description       | Body                                     | Response              |
| ------ | ------------------ | ----------------- | ---------------------------------------- | --------------------- |
| POST   | /api/auth/login    | Login user        | { email, password }                      | { userId, firstName } |
| POST   | /api/auth/register | Register new user | { firstName, lastName, email, password } | { userId }            |

## Blogs

| Method | Endpoint                              | Description       | Body                                                    | Query Params | Response     |
| ------ | ------------------------------------- | ----------------- | ------------------------------------------------------- | ------------ | ------------ |
| GET    | /api/blogs                            | Get all blogs     | -                                                       | -            | List<Blog>   |
| GET    | /api/blogs/get-blogs-by-user/{userId} | Get blogs by user | -                                                       | -            | List<Blog>   |
| GET    | /api/blogs/{id}                       | Get single blog   | -                                                       | -            | Blog         |
| POST   | /api/blogs                            | Create blog       | { userId, title, content, categoryId?, tags: string[] } | -            | Created Blog |
| PUT    | /api/blogs/{id}                       | Update blog       | { userId, title, content, categoryId?, tags: string[] } | -            | Updated Blog |
| DELETE | /api/blogs/{id}                       | Soft delete blog  | -                                                       | userId       | Success      |

### Blogs Request Examples

Create Blog (`POST /api/blogs`)

```json
{
  "userId": "4e3c9e86-3c81-44bd-aed1-9cf98d9552f8",
  "title": "Getting Started with Dapper",
  "content": "This is a sample blog content",
  "categoryId": "1dd8d15e-d2db-4d1c-b70f-5b2f2671a6ad",
  "tags": ["dotnet", "dapper", "postgres"]
}
```

Update Blog (`PUT /api/blogs/{id}`)

```json
{
  "userId": "4e3c9e86-3c81-44bd-aed1-9cf98d9552f8",
  "title": "Updated title",
  "content": "Updated content",
  "categoryId": "1dd8d15e-d2db-4d1c-b70f-5b2f2671a6ad",
  "tags": ["api", "blog"]
}
```

## TAGS

| Method | Endpoint  | Description  | Body | Response  |
| ------ | --------- | ------------ | ---- | --------- |
| GET    | /api/tags | Get all tags | -    | List<Tag> |

### Tags Response Shape

`[{ tagId, tagName, slug }]`

## CATEGORIES

| Method | Endpoint        | Description        | Body | Response       |
| ------ | --------------- | ------------------ | ---- | -------------- |
| GET    | /api/categories | Get all categories | -    | List<Category> |

### Categories Response Shape

[{ categoryId, categoryName, slug }]

## BOOKMARKS

| Method | Endpoint              | Description         | Body               | Query Params | Response   |
| ------ | --------------------- | ------------------- | ------------------ | ------------ | ---------- |
| POST   | /api/bookmarks/toggle | Add/remove bookmark | { userId, blogId } | -            | Success    |
| GET    | /api/bookmarks        | Get user bookmarks  | -                  | userId       | List<Blog> |

### Bookmarks Request Example

Toggle Bookmark (`POST /api/bookmarks/toggle`)

```json
{
  "userId": "4e3c9e86-3c81-44bd-aed1-9cf98d9552f8",
  "blogId": "9341cf7f-3ad2-4fbc-bf07-0e4a332f63b2"
}
```

### Bookmarks Response Shape

- Toggle: `{ isBookmarked: boolean }`
- Get user bookmarks: same as `List<Blog>` shape from Blogs API

## DATA MODELS

Blog:

- id
- title
- content
- author
- categoryId
- tags: string[]
- createdAt

Tag:

- id
- tagName
- slug

Category:

- id
- categoryName
- slug

[x] back button
[x] is_published
My Blogs Page
[x] is_published er badge in My Blogs
[x] navbar fixed
[x] input field red ta bondho korbo =====> Navigated to Feed
[x] add toaster
[x] bookmark outline -> filled
[x] Publish -> Submit Blog
