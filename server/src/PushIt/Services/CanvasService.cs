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

    public bool CreateQuadro(string canvasName, QuadroAnotacao quadro)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(this.canvasPseudoDatabase[canvasName].HasQuadro(quadro.id, out _)){ return false; }

        this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes.Add(quadro);
        return true;
    }

    public QuadroAnotacao? GetQuadro(string canvasName, string quadroId)
    {
        QuadroAnotacao? quadro;

        this.canvasPseudoDatabase.TryGetValue(canvasName, out Canvas? canvas);
        if(canvas is null){ return null; }

        canvas.HasQuadro(quadroId, out quadro);
        return quadro;
    }

    public List<QuadroAnotacao> GetAllQuadros(string canvasName)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return null; }
        return this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes;
    }

    public bool UpdateQuadro(string canvasName, string quadroId, QuadroAnotacao novoQuadro)
    {
         if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
         if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out QuadroAnotacao? quadro)){ return false; }
         
        this.canvasPseudoDatabase[canvasName].UpdateQuadro(quadro!.id, novoQuadro);
        return true;
    }

    public bool DeleteQuadro(string canvasName, string quadroId)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out _)){ return false; }

        this.canvasPseudoDatabase[canvasName].DeleteQuadro(quadroId);
        return true;
    }
}