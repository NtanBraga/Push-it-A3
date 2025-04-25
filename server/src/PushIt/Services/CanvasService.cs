public class CanvasService : ICanvasService 
{
    private readonly Dictionary<string, Canvas> canvasPseudoDatabase = new(); 
    //Definindo no Program.cs como singleton se mantém salvo por todo o tempo de execução do server
    public void CreateCanvas(Canvas canvas)
    {
        this.canvasPseudoDatabase.Add(canvas.Name, canvas);
    }

    public Canvas GetCanvas(string canvasName)
    {
        return this.canvasPseudoDatabase[canvasName];
    }

    public static Canvas Tocanvas(CreateCanvasRequest request)
}