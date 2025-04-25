public class Canvas
{
    public string Name { get; }
    public List<QuadroAnotacao> QuadrosAnotacoes { get; }
    public DateTime CreatedDateTime { get; }
    public DateTime LastModification { get; }

    public Canvas(string name, List<QuadroAnotacao> quadrosAnotacoes, DateTime createdDateTime, DateTime lastModification)
    {
        Name = name;
        this.QuadrosAnotacoes = quadrosAnotacoes;
        CreatedDateTime = createdDateTime;
        LastModification = lastModification;
    }

    public bool IsValid()
    {
        if(this.Name.Length <= 0 || this.Name.Length > 32)
        {
            return false;
        }
        if(this.QuadrosAnotacoes.Count > 100)
        {
            return false;
        }

        return true;
    }
}