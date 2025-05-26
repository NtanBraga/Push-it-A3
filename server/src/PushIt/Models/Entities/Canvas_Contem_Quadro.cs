using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Canvas_Contem_Quadro")]
public class Canvas_Contem_Quadro
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    [Column("ID")]
    public int id { get; set; }

    [Required]
    [Column("nomeCanvas")]
    public string nomeCanvas { get; set; }

    [ForeignKey("QuadroKey")]
    public QuadrosEntity quadro { get; init; }

    public Canvas_Contem_Quadro(int id, string nomeCanvas, QuadrosEntity quadro) : this(id, nomeCanvas)
    {
        this.quadro = quadro;
    }

    private Canvas_Contem_Quadro(int id, string nomeCanvas) : base()
    {
        this.id = id;
        this.nomeCanvas = nomeCanvas;
    }

    public Canvas_Contem_Quadro(string nomeCanvas, QuadrosEntity quadro) : this(nomeCanvas)
    {
        this.quadro = quadro;
    }
    private Canvas_Contem_Quadro(string nomeCanvas) : base()
    {
        this.nomeCanvas = nomeCanvas;
    }
}