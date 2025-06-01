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
            fontColour: QuadroAnotacao.defaultColour,
            IDsConectados: new(), //visto que quadros recém criados não tem como possuir conexoes
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
            fontColour: request.fontColour,
            IDsConectados: default,

            lastModification: DateTime.Now
        );
    }

    public static QuadroAnotacao ToQuadro(this QuadrosEntity entity, List<string> _IDsConectados)
    {
        return new QuadroAnotacao(
            id: entity.localId,

            x: entity.x,
            y: entity.y,
            width: entity.width,
            height: entity.height,
            text: entity.text,
            colour: entity.colour,
            fontColour: entity.fontColour,

            IDsConectados: _IDsConectados,

            lastModification: entity.LastModification
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
            fontColour: quadroAnotacao.fontColour,
            IDsConectados: quadroAnotacao.IDsConectados ?? new(),
            lastModification: quadroAnotacao.LastModification
        );
    }

    public static QuadrosEntity ToQuadroEntity(this QuadroAnotacao quadroAnotacao)
    {
        return new QuadrosEntity(
            localId: quadroAnotacao.id,
            x: quadroAnotacao.x,
            y: quadroAnotacao.y,
            width: quadroAnotacao.width,
            height: quadroAnotacao.height,
            text: quadroAnotacao.text,
            colour: quadroAnotacao.colour,
            fontColour: quadroAnotacao.fontColour,
            lastModification: quadroAnotacao.LastModification
        );
    }
}