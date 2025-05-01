public static class CanvasMapping
{
    public static Canvas ToCanvas(this CreateCanvasRequest request)
    {
        return new Canvas(
            name: request.Name,
            quadrosAnotacoes: request.QuadrosAnotacoes,
            createdDateTime: request.CreatedDateTime,
            lastModification: DateTime.Now
        );
    }

    public static CanvasResponse ToCanvasResponse(this Canvas canvas)
    {
        return new CanvasResponse(
            Name:             canvas.Name,
            QuadrosAnotacoes: canvas.QuadrosAnotacoes,
            CreatedDateTime:  canvas.CreatedDateTime,
            LastModification: canvas.LastModification
        );
    }
}