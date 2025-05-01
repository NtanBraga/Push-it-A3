public class QuadroAnotacao
{
    public string id { get; }
    public int x { get; }
    public int y { get; }
    public int width { get; }
    public int height { get; }
    public string text { get; }
    public string colour { get; }

    public QuadroAnotacao(string id, int x, int y, int width, int height, string text, string colour)
    {
         this.id = id;
         this.x = x;
         this.y = y;
         this.width = width;
         this.height = height;
         this.text = text;
         this.colour = colour;
    }
    
}
