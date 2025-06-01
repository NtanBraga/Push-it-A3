public record CreateQuadroRequest
(
    string id,
    double x,
    double y,
    double width,
    double height,
    string text,
    string colour,
    string fontColour
);