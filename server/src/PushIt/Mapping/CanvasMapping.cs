public static class CanvasMapping
{
    public static Canvas ToCanvas(this CreateCanvasRequest request)
    {
        return new Canvas(
            name: request.Name,
            quadrosAnotacoes: request.QuadrosAnotacoes ?? new(),
            createdDateTime: request.CreatedDateTime,
            lastModification: DateTime.Now
        );
    }

    public static Canvas ToCanvas(this CanvasEntity entity, List<QuadroAnotacao> quadros)
    {
        return new Canvas(
            name: entity.Name,
            quadrosAnotacoes: quadros ?? new(),
            createdDateTime: entity.CreatedDateTime,
            lastModification: DateTime.Now
        );
    }

    public static CanvasResponse ToCanvasResponse(this Canvas canvas)
    {
        return new CanvasResponse(
            Name: canvas.Name,
            QuadrosAnotacoes: canvas.QuadrosAnotacoes,
            CreatedDateTime: canvas.CreatedDateTime,
            LastModification: canvas.LastModification
        );
    }

    public static CanvasEntity ToCanvasEntity(this Canvas canvas)
    {
        return new CanvasEntity(
            name: canvas.Name,
            createdDateTime: canvas.CreatedDateTime,
            lastModification: canvas.LastModification
        );
    }
}