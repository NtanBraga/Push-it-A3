public record CanvasResponse
(
    string Name,
    List<QuadroAnotacao> QuadrosAnotacoes,
    DateTime CreatedDateTime,
    DateTime LastModification
);