using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Canvas")]
public class Canvas
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

    //Obter Através de query "SELECT *" na tabela Canvas_Contem_Quadro
    public List<QuadroAnotacao> QuadrosAnotacoes { get; set; } = new();

    [Required]
    [Column("CreatedDateTime")]
    public DateTime CreatedDateTime { get; set; }

    [Required]
    [Column("LastModification")]
    public DateTime LastModification { get; set; }

    public Canvas(string name, List<QuadroAnotacao> quadrosAnotacoes, DateTime createdDateTime, DateTime lastModification)
    {
        this.Name = name;
        this.QuadrosAnotacoes = quadrosAnotacoes;
        this.CreatedDateTime = createdDateTime;
        this.LastModification = lastModification;
    }

    public bool IsValid()
    {
        if (this.Name.Length <= 0 || this.Name.Length > MaxNameLength)
        {
            return false;
        }
        if (this.QuadrosAnotacoes.Count > MaxQuadrosAmount)
        {
            return false;
        }

        return true;
    }

    public bool HasQuadro(string id, out QuadroAnotacao? quadro)
    {
        quadro = this.QuadrosAnotacoes.Find(
            q => q.id == id
        );

        return quadro is not null;
    }

    public bool UpdateQuadro(string quadroId, QuadroAnotacao novoQuadro)
    {
        int index = this.QuadrosAnotacoes.FindIndex(
            q => q.id == quadroId
        );

        if (index < 0) { return false; }

        this.QuadrosAnotacoes[index] = novoQuadro;
        this.LastModification = DateTime.Now;

        return true;
    }

    public bool DeleteQuadro(string quadroId)
    {
        int index = this.QuadrosAnotacoes.FindIndex(
            q => q.id == quadroId
        );

        if (index < 0) { return false; }

        this.QuadrosAnotacoes.RemoveAt(index);
        this.LastModification = DateTime.Now;

        return true;
    }
}