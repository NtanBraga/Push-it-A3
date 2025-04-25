public class Canvas
{
    public string Name { get; }
    public List<QuadroAnotacao> QuadrosAnotacoes { get; }
    public DateTime CreatedDateTime { get; }
    public DateTime LastModification { get; }

    public Canvas(string name, List<QuadroAnotacao> quadrosAnotacoes, DateTime createdDateTime, DateTime lastModification)
    {
        //Impor Regras de Negócio aqui!
        Name = name;
        this.QuadrosAnotacoes = quadrosAnotacoes;
        CreatedDateTime = createdDateTime;
        LastModification = lastModification;
    }

    public static Canvas ToCanvas(CreateCanvasRequest request)
    {
        return new Canvas(
            name: request.Name,
            quadrosAnotacoes: request.QuadrosAnotacoes,
            createdDateTime: request.CreatedDateTime,
            lastModification: DateTime.Now
        );
    }
}