using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Dal.Entities;

[Table("blogs")]
[Index("Author", Name = "idx_blogs_author")]
[Index("CreatedAt", Name = "idx_blogs_created_at", AllDescending = true)]
[Index("IsDeleted", Name = "idx_blogs_is_deleted")]
public partial class Blog
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("author")]
    public Guid Author { get; set; }

    [Column("blog_title")]
    [StringLength(100)]
    public string BlogTitle { get; set; } = null!;

    [Column("blog_content")]
    public string BlogContent { get; set; } = null!;

    [Column("created_at", TypeName = "timestamp without time zone")]
    public DateTime? CreatedAt { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [Column("category_id")]
    public Guid? CategoryId { get; set; }

    [Column("is_published")]
    public bool IsPublished { get; set; }

    [ForeignKey("Author")]
    [InverseProperty("Blogs")]
    public virtual User AuthorNavigation { get; set; } = null!;

    [ForeignKey("CategoryId")]
    [InverseProperty("Blogs")]
    public virtual Category? Category { get; set; }

    [ForeignKey("BlogId")]
    [InverseProperty("Blogs")]
    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
