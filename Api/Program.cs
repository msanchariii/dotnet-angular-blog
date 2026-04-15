using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// using soumyadip_da_hw.Bal.Services;
// using soumyadip_da_hw.Bal.Services.Interfaces;
// using soumyadip_da_hw.Dal;
// using soumyadip_da_hw.Dal.Interface;
// using soumyadip_da_hw.Dal.Repositories;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<IBookmarkRepository, BookmarkRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IBookmarkService, BookmarkService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();

// builder.Services.AddDbContext<TestContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList();

        var response = new ApiResponse<object>
        {
            Success = false,
            Message = string.Join(", ", errors),
            StatusCode = 400,
        };

        return new BadRequestObjectResult(response);
    };
});
var app = builder.Build();

// Swagger UI

if (app.Environment.IsDevelopment()) // Often restricted to Development environment
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();


// dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
// dotnet add package Microsoft.EntityFrameworkCore.Design