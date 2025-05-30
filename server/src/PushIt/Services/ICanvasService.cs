public interface ICanvasService
{
    public Task<Canvas?> CreateCanvasAsync(Canvas canvasToCreate);
    public Task<Canvas?> GetCanvasAsync(string canvasName);
    public Task<QuadroAnotacao?> CreateQuadroAsync(string canvasName, QuadroAnotacao quadro);
    public Task<QuadroAnotacao?> GetQuadroAsync(string canvasName, string quadroLocalId);
    public Task<List<QuadroAnotacao>?> GetAllQuadrosAsync(string canvasName);
    public Task<bool> TryUpdateQuadroAsync(string canvasName, string quadroLocalId, QuadroAnotacao novoQuadro);
    public Task<bool> TryDeleteQuadroAsync(string canvasName, string quadroId);
    public Task<List<string>?> CreateQuadroConexaoAsync(string CanvasName, string quadroLocalId, string IdQuadroDestino);
    public Task<bool> TryDeleteQuadroConexaoAsync(string canvasName, string localId, string idConexao);
}