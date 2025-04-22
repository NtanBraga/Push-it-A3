public record CanvasResponse
(
    Guid Id,
    string Name,
    DateTime CreatedDateTime,
    string dummyVariable,
    List<string> moreDummyVariables,
    DateTime LastModification
);