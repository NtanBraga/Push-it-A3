public class QuadroAnotacao
{
    public const string defaultText = "";
    public const string defaultColour = "#FFE338";

    public string id { get; }
    public int x { get; }
    public int y { get; }
    public int width { get; }
    public int height { get; }
    public string text { get; }
    public string colour { get; }

    public DateTime LastModification { get; }

    public QuadroAnotacao(string id, int x, int y, int width, int height, string text, string colour, DateTime lastModification)
    {
         this.id = id;
         this.x = x;
         this.y = y;
         this.width = width;
         this.height = height;
         this.text = text;
         this.colour = colour;
         this.LastModification = lastModification;
    }
}
