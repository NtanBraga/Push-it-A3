public class QuadroAnotacao
{
    public const string defaultText = "";
    public const string defaultColour = "#FFE338";

    public string id { get; }
    public double x { get; }
    public double y { get; }
    public double width { get; }
    public double height { get; }
    public string text { get; }
    public string colour { get; }

    public DateTime LastModification { get; }

    public QuadroAnotacao(string id, double x, double y, double width, double height, string text, string colour, DateTime lastModification)
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
