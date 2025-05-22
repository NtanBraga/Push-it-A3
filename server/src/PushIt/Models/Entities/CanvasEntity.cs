using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Canvas")]
public class CanvasEntity
{
    public const int MaxQuadrosAmount = 100;
    public const int MaxNameLength = 32;

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    [Column("ID")]
    public int Id { get; set; }

    [Required]
    [MaxLength(MaxNameLength)]
    [Column("Name")]
    public string Name { get; set; }

    [Required]
    [Column("CreatedDateTime")]
    public DateTime CreatedDateTime { get; set; }

    [Required]
    [Column("LastModification")]
    public DateTime LastModification { get; set; }

    public CanvasEntity(int id, string name, DateTime createdDateTime, DateTime lastModification)
    {
        this.Id = id;
        this.Name = name;
        this.CreatedDateTime = createdDateTime;
        this.LastModification = lastModification;
    }
}