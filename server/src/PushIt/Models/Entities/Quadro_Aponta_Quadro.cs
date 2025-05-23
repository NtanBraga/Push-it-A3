using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Quadro_Aponta_Quadro")]
public class Quadro_Aponta_Quadro
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    [Column("ID")]
    public int id { get; set; }

    [ForeignKey("QuadroComecoKey")]
    public QuadrosEntity QuadroComeco { get; init; }

    [Required]
    [Column("LocalIdDestino")]
    public string localIdQuadroDestino { get; set; }

    public Quadro_Aponta_Quadro(int id, QuadrosEntity quadroComeco, string localIdQuadroDestino) : this(id, localIdQuadroDestino)
    {
        this.QuadroComeco = quadroComeco;
    }

    private Quadro_Aponta_Quadro(int id, string localIdQuadroDestino) : base()
    {
        this.id = id;
        this.localIdQuadroDestino = localIdQuadroDestino;
    }

}