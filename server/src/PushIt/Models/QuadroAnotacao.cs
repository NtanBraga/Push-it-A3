using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("QuadroAnotacao")]
public class QuadroAnotacao
{
    public const string defaultText = "";
    public const string defaultColour = "#FFE338";


    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    [Column("ID")]
    public string id { get; }

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

    //Obter Através de query "SELECT *" na tabela Quadro_Aponta_Quadro
    public List<string> IDsConectados { get; }

    [Required]
    [Column("LastModification")]
    public DateTime LastModification { get; }

    public QuadroAnotacao(string id, double x, double y, double width, double height, string text, string colour, List<string> IDsConectados, DateTime lastModification)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.colour = colour;
        this.IDsConectados = IDsConectados;
        this.LastModification = lastModification;
    }
}
