using Microsoft.AspNetCore.Mvc;

[ApiController]
//[Route("canvas")]
public class CanvasController : ControllerBase{

    private readonly ICanvasService _canvasService;
    public CanvasController(ICanvasService canvasService)
    {
        this._canvasService = canvasService;
    }

    [HttpPost("/canvas")]

    public IActionResult CreateCanvas(CreateCanvasRequest request)
    {
        //Converte request para formato interno do sistema
        Canvas canvas = Canvas.ToCanvas(request);

        // Aqui salvaria na database ou lista em memória
        this._canvasService.CreateCanvas(canvas);

        //Cria o json para devolver na response
        CanvasResponse response = new CanvasResponse
        (
            canvas.Id,
            canvas.Name,
            canvas.CreatedDateTime,
            canvas.dummyVariable,
            canvas.moreDummyVariables,
            canvas.LastModification
        );

        return CreatedAtAction(
            nameof(GetCanvas), 
            new{ name = canvas.Name },  
            response);
    }

    [HttpGet("/canvas/{name}")]
    public IActionResult GetCanvas(string name)
    {
        Canvas canvas = this._canvasService.GetCanvas(name);
        var response = new CanvasResponse
        (
            canvas.Id,
            canvas.Name,
            canvas.CreatedDateTime,
            canvas.dummyVariable,
            canvas.moreDummyVariables,
            canvas.LastModification
        );
        
        return Ok(response);
    }

    [HttpPut("/canvas/{name}")]
    public IActionResult UpdateCanvas(string name, UpdateCanvasRequest request)
    {
        return Ok(request);
    }

    [HttpDelete("/canvas/{name}")]
    public IActionResult DeleteCanvas(string name)
    {
        return Ok(name);
    }

}