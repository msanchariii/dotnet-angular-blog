using System;
using System.Collections.Generic;
using Api.Dal.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Dal.Helper;

public partial class BlogDbContext : DbContext
{
    public BlogDbContext()
    {
    }

    public BlogDbContext(DbContextOptions<BlogDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("blogs_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.AuthorNavigation).WithMany(p => p.Blogs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("blogs_author_fkey");

            entity.HasOne(d => d.Category).WithMany(p => p.Blogs).HasConstraintName("blogs_category_fkey");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("category_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tag_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.HasMany(d => d.Blogs).WithMany(p => p.Tags)
                .UsingEntity<Dictionary<string, object>>(
                    "TagBlog",
                    r => r.HasOne<Blog>().WithMany()
                        .HasForeignKey("BlogId")
                        .HasConstraintName("tag_blog_blog_id_fkey"),
                    l => l.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .HasConstraintName("tag_blog_tag_id_fkey"),
                    j =>
                    {
                        j.HasKey("TagId", "BlogId").HasName("tag_blog_pk");
                        j.ToTable("tag_blog");
                        j.HasIndex(new[] { "BlogId" }, "idx_tag_blog_blog_id");
                        j.HasIndex(new[] { "TagId" }, "idx_tag_blog_tag_id");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("tag_id");
                        j.IndexerProperty<Guid>("BlogId").HasColumnName("blog_id");
                    });
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
