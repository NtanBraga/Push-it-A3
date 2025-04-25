public interface ICanvasService
{
    public bool CreateCanvas(Canvas canvasToCreate);
    public Canvas? GetCanvas(string canvasName);
}