public record QuadroResponse
(
    string id,
    int x,
    int y,
    int width,
    int height,
    string text,
    string colour,

    DateTime lastModification
);