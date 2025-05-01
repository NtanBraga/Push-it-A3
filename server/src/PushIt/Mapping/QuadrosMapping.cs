public static class QuadrosMapping
{
    public static QuadroAnotacao ToQuadro(this CreateQuadroRequest request)
    {
        return new QuadroAnotacao(
           
        );
    }

    public static QuadroResponse ToQuadroResponse(this QuadroAnotacao canvas)
    {
        return new QuadroResponse(

        );
    }
}