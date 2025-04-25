using Microsoft.AspNetCore.Mvc;

[ApiController]
//[Route("canvas")]
public class CanvasController : ControllerBase{

    private readonly ICanvasService _canvasService;
    public CanvasController(ICanvasService canvasService)
    {
        this._canvasService = canvasService;
    }

    //POST /canvas
    [HttpPost("/canvas")]
    public IActionResult CreateCanvas(CreateCanvasRequest request)
    {
        //Converte request para formato interno do sistema
        Canvas canvas = request.ToCanvas();

        // Aqui salvaria na database ou lista em memória
        this._canvasService.CreateCanvas(canvas);

        //Cria a response de acordo com o Contrato/DTO definido para o json
        CanvasResponse response = canvas.ToCanvasResponse();

        return CreatedAtAction(
            nameof(GetCanvas), 
            new{ name = canvas.Name },  
            response);
    }

    //GET /canvas/name
    [HttpGet("/canvas/{name}")]
    public IActionResult GetCanvas(string name)
    {
        Canvas canvas = this._canvasService.GetCanvas(name);

        var response = canvas.ToCanvasResponse();

        return Ok(response);
    }



    //PUT canvas/name
    [HttpPut("/canvas/{name}")]
    public IActionResult UpdateCanvas(string name, UpdateCanvasRequest request)
    {
        return Ok(request);
    }

    //DELETE canvas/name
    [HttpDelete("/canvas/{name}")]
    public IActionResult DeleteCanvas(string name)
    {
        return Ok(name);
    }

}