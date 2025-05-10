public record QuadroResponse
(
    string id,
    double x,
    double y,
    double width,
    double height,
    string text,
    string colour,

    DateTime lastModification
);