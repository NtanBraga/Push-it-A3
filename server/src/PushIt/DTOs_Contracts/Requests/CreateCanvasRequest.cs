public record CreateCanvasRequest
(
    string Name,
    List<QuadroAnotacao> QuadrosAnotacoes,
    DateTime CreatedDateTime
);