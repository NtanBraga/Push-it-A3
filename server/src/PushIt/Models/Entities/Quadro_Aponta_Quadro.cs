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

    [Required]
    [Column("LocalIdComeco")]
    public string idQuadroComeco { get; set; }

    [Required]
    [Column("LocalIdDestino")]
    public string localIdQuadroDestino { get; set; }

    public Quadro_Aponta_Quadro(int id, string idQuadroComeco, string localIdQuadroDestino)
    {
        this.id = id;
        this.idQuadroComeco = idQuadroComeco;
        this.localIdQuadroDestino = localIdQuadroDestino;
    }

}