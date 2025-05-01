public class CanvasService : ICanvasService 
{
    private readonly Dictionary<string, Canvas> canvasPseudoDatabase = new(); 
    //Definindo no Program.cs como singleton se mantém salvo por todo o tempo de execução do server
    public bool CreateCanvas(Canvas canvas)
    {
        if(this.canvasPseudoDatabase.ContainsKey(canvas.Name))
        {
            return false;
        }

        this.canvasPseudoDatabase.Add(canvas.Name, canvas);
        return true;
    }

    public Canvas? GetCanvas(string canvasName)
    {
        this.canvasPseudoDatabase.TryGetValue(canvasName, out Canvas? canvas);
        return canvas;
    }

    public bool UpdateInsertQuadro(string canvasName, string quadroId)
    {
        return default;
    }

  
}