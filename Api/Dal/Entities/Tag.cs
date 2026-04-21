using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Dal.Entities;

[Table("tag")]
[Index("Slug", Name = "unique_tag_slug", IsUnique = true)]
public partial class Tag
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("tag_name")]
    [StringLength(255)]
    public string TagName { get; set; } = null!;

    [Column("slug")]
    [StringLength(255)]
    public string Slug { get; set; } = null!;

    [ForeignKey("TagId")]
    [InverseProperty("Tags")]
    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}
