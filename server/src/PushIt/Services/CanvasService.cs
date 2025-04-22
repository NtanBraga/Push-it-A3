public class CanvasService : ICanvasService 
{
    private readonly Dictionary<string, Canvas> canvasPseudoDatabase = new(); 
    //Definindo no Program.cs como singleton se mantém salvo por todo o tempo de execução do server
    public void CreateCanvas(Canvas canvasToCreate)
    {
        this.canvasPseudoDatabase.Add(canvasToCreate.Name, canvasToCreate);
    }

    public Canvas GetCanvas(string canvasName)
    {
        return this.canvasPseudoDatabase[canvasName];
    }
}