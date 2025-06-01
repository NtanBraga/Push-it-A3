using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class QuadroAnotacao
{
    public const string defaultText = "Insira o texto aqui!";
    public const string defaultQuadroColour = "#FFE338";
    public const string defaultFontColour = "#000000";

    public string id { get; }
    public double x { get; }
    public double y { get; }
    public double width { get; }
    public double height { get; }
    public string text { get; }
    public string colour { get; }
    public string fontColour { get; }

    //Obter Através de query "SELECT *" na tabela Quadro_Aponta_Quadro
    public List<string>? IDsConectados { get; }

    public DateTime LastModification { get; }
    
    public QuadroAnotacao(string id, double x, double y, double width, double height, string text, string colour, string fontColour, List<string>? IDsConectados, DateTime lastModification)
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.colour = colour;
        this.fontColour = fontColour;
        this.IDsConectados = IDsConectados;
        this.LastModification = lastModification;
    }
}
