public interface ICanvasService
{
    public bool CreateCanvas(Canvas canvasToCreate);
    public Canvas? GetCanvas(string canvasName);
    public bool CreateQuadro(string canvasName, QuadroAnotacao quadro);
    public QuadroAnotacao? GetQuadro(string canvasName, string quadroId);
    public List<QuadroAnotacao> GetAllQuadros(string canvasName);
}