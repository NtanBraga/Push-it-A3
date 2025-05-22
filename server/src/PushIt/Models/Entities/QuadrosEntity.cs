using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Quadros")]
public class QuadrosEntity
{
    public const string defaultText = "";
    public const string defaultColour = "#FFE338";

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    [Column("ID")]
    public string id { get; }

    [Required]
    [Column("LocalID")]
    public string localId { get; }

    [Required]
    [Column("X")]
    public double x { get; }

    [Required]
    [Column("Y")]
    public double y { get; }

    [Required]
    [Column("Width")]
    public double width { get; }

    [Required]
    [Column("Height")]
    public double height { get; }

    [Column("Text")]
    public string text { get; }

    [Required]
    [Column("Colour")]
    public string colour { get; }

    [Required]
    [Column("LastModification")]
    public DateTime LastModification { get; }

    public QuadrosEntity(string id, string localId, double x, double y, double width, double height, string text, string colour, DateTime lastModification)
    {
        this.id = id;
        this.localId = localId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.colour = colour;
        this.LastModification = lastModification;
    }
}
