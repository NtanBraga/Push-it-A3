using Microsoft.AspNetCore.Http.HttpResults;
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
        if(!canvas.IsValid()) 
        {
            return BadRequest();
        }

        // Aqui salvaria na database ou lista em memória
        if(!this._canvasService.CreateCanvas(canvas))
        {
            return BadRequest();
        }

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
        Canvas? canvas = this._canvasService.GetCanvas(name);
        if(canvas is null)
        {
            return NotFound();
        }

        CanvasResponse response = canvas.ToCanvasResponse();
        return Ok(response);
    }

    [HttpPut("/canvas/{name}/quadros/{id}")]
    public IActionResult UpdateInsertQuadro(string name, string id)
    {
        return Ok();
    }



    //PUT /canvas/name
    // [HttpPut("/canvas/{name}")]
    // public IActionResult UpdateCanvas(string name, UpdateCanvasRequest request)
    // {
    //     return Ok(request);
    // }

    // //DELETE canvas/name
    // [HttpDelete("/canvas/{name}")]
    // public IActionResult DeleteCanvas(string name)
    // {
    //     return Ok(name);
    // }

}