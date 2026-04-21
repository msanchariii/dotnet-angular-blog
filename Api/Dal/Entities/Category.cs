using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Dal.Entities;

[Table("category")]
[Index("CategoryName", Name = "unique_category_name", IsUnique = true)]
[Index("Slug", Name = "unique_category_slug", IsUnique = true)]
public partial class Category
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("category_name")]
    [StringLength(255)]
    public string CategoryName { get; set; } = null!;

    [Column("slug")]
    [StringLength(255)]
    public string Slug { get; set; } = null!;

    [InverseProperty("Category")]
    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}
