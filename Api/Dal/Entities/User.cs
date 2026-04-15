using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api.Dal.Entities;

[Table("users")]
[Index("Email", Name = "unique_user_email", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("first_name")]
    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [Column("last_name")]
    [StringLength(50)]
    public string LastName { get; set; } = null!;

    [Column("email")]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("password")]
    [StringLength(255)]
    public string Password { get; set; } = null!;

    [Column("created_at", TypeName = "timestamp without time zone")]
    public DateTime? CreatedAt { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    [InverseProperty("AuthorNavigation")]
    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}
