public class Canvas
{
    public Guid Id { get; }
    public string Name { get; }
    public DateTime CreatedDateTime { get; }
    public string dummyVariable { get; }
    public List<string> moreDummyVariables { get; }

    public DateTime LastModification { get; }

    public Canvas(Guid id, string name, DateTime createdDateTime, string dummyVariable, List<string> moreDummyVariables, DateTime lastModification)
    {
        //Impor Regras de Negócio aqui!
        Id = id;
        Name = name;
        CreatedDateTime = createdDateTime;
        this.dummyVariable = dummyVariable;
        this.moreDummyVariables = moreDummyVariables;
        LastModification = lastModification;
    }
}