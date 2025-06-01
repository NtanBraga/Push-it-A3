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
    public int id { get; set; }

    [Required]
    [Column("LocalID")]
    public string localId { get; set; }

    [Required]
    [Column("X")]
    public double x { get; set; }

    [Required]
    [Column("Y")]
    public double y { get; set; }

    [Required]
    [Column("Width")]
    public double width { get; set; }

    [Required]
    [Column("Height")]
    public double height { get; set; }

    [Column("Text")]
    public string text { get; set; }

    [Required]
    [Column("Colour")]
    public string colour { get; set; }

    [Required]
    [Column("FontColour")]
    public string fontColour { get; set; }

    [Required]
    [Column("LastModification")]
    public DateTime LastModification { get; set; }

    public QuadrosEntity(int id, string localId, double x, double y, double width, double height, string text, string colour, string fontColour, DateTime lastModification)
    {
        this.id = id;
        this.localId = localId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.colour = colour;
        this.fontColour = fontColour;
        this.LastModification = lastModification;
    }

    public QuadrosEntity(string localId, double x, double y, double width, double height, string text, string colour, string fontColour, DateTime lastModification)
    {
        this.localId = localId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.colour = colour;
        this.fontColour = fontColour;
        this.LastModification = lastModification;
    }
}
