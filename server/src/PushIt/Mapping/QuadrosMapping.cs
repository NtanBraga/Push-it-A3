public static class QuadrosMapping
{
    public static QuadroAnotacao ToQuadro(this CreateQuadroRequest request)
    {
        return new QuadroAnotacao(
            id: request.id, 
            x: request.x,
            y: request.y,
            width: request.width,
            height: request.height,
            text: QuadroAnotacao.defaultText,
            colour: QuadroAnotacao.defaultColour,
            lastModification: DateTime.Now
        );
    }

    public static QuadroAnotacao ToQuadro(this UpdateQuadroRequest request, string _id)
    {
        return new QuadroAnotacao(
            id: _id, 
            x: request.x,
            y: request.y,
            width: request.width,
            height: request.height,
            text: request.text,
            colour: request.colour,
            lastModification: DateTime.Now
        );
    }

    public static QuadroResponse ToQuadroResponse(this QuadroAnotacao quadroAnotacao)
    {
        return new QuadroResponse(
            id: quadroAnotacao.id,
            x: quadroAnotacao.x,
            y: quadroAnotacao.y,
            width: quadroAnotacao.width,
            height: quadroAnotacao.height, 
            text: quadroAnotacao.text,
            colour: quadroAnotacao.colour,
            lastModification: quadroAnotacao.LastModification
        );
    }
}