public interface ICanvasService
{
    public bool TryCreateCanvas(Canvas canvasToCreate);
    public bool TryGetCanvas(string canvasName, out Canvas? canvas);
    public bool TryCreateQuadro(string canvasName, QuadroAnotacao quadro);
    public bool TryGetQuadro(string canvasName, string quadroId, out QuadroAnotacao? quadro);
    public bool TryGetAllQuadros(string canvasName, out List<QuadroAnotacao> quadros);
    public bool TryUpdateQuadro(string canvasName, string quadroId, QuadroAnotacao novoQuadro);
    public bool TryDeleteQuadro(string canvasName, string quadroId);
}