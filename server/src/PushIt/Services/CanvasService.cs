public class CanvasService : ICanvasService 
{
    private readonly Dictionary<string, Canvas> canvasPseudoDatabase = new(); 
    //Definindo no Program.cs como singleton se mantém salvo por todo o tempo de execução do server
    public bool TryCreateCanvas(Canvas canvas)
    {
        if(this.canvasPseudoDatabase.ContainsKey(canvas.Name))
        {
            return false;
        }

        this.canvasPseudoDatabase.Add(canvas.Name, canvas);
        return true;
    }

    public bool TryGetCanvas(string canvasName, out Canvas? canvas)
    {
        return this.canvasPseudoDatabase.TryGetValue(canvasName, out canvas);
    }

    public bool TryCreateQuadro(string canvasName, QuadroAnotacao quadro)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(this.canvasPseudoDatabase[canvasName].HasQuadro(quadro.id, out _)){ return false; }
        if(this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes.Count >= Canvas.MaxQuadrosAmount){ return false; }

        this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes.Add(quadro);
        return true;
    }

    public bool TryGetQuadro(string canvasName, string quadroId, out QuadroAnotacao? quadro)
    {
        quadro = default;
        if(!this.canvasPseudoDatabase.TryGetValue(canvasName, out Canvas? canvas))
        { 
            return false; 
        }

        return canvas.HasQuadro(quadroId, out quadro);
    }

    public bool TryGetAllQuadros(string canvasName, out List<QuadroAnotacao> quadros)
    {
        quadros = new();

        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }

        quadros = this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes;
        return true;
    }

    public bool TryUpdateQuadro(string canvasName, string quadroId, QuadroAnotacao novoQuadro)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out QuadroAnotacao? quadro)){ return false; }
         
        return this.canvasPseudoDatabase[canvasName].UpdateQuadro(quadro!.id, novoQuadro);
    }

    public bool TryDeleteQuadro(string canvasName, string quadroId)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out _)){ return false; }

        return this.canvasPseudoDatabase[canvasName].DeleteQuadro(quadroId);
    }
}