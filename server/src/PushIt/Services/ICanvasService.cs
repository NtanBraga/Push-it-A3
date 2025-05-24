public interface ICanvasService
{
    public Task<Canvas?> CreateCanvasAsync(Canvas canvasToCreate);
    public Task<Canvas?> GetCanvasAsync(string canvasName);
    public Task<QuadroAnotacao?> CreateQuadroAsync(string canvasName, QuadroAnotacao quadro);
    public Task<QuadroAnotacao?> GetQuadroAsync(string canvasName, string quadroLocalId);
    public Task<List<QuadroAnotacao>?> GetAllQuadrosAsync(string canvasName);
    public bool TryUpdateQuadro(string canvasName, string quadroId, QuadroAnotacao novoQuadro);
    public Task<bool> TryDeleteQuadroAsync(string canvasName, string quadroId);
}