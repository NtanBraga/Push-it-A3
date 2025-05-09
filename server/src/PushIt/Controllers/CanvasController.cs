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

    //POST /canvas/nomedocanvas/quadros
    [HttpPost("/canvas/{name}/quadros")]
    public IActionResult CreateQuadro(string name, CreateQuadroRequest request)
    {
        QuadroAnotacao quadro = request.ToQuadro();
        if(!this._canvasService.CreateQuadro(name, quadro))
        {
            return BadRequest();
        }

        QuadroResponse response = quadro.ToQuadroResponse();
        return CreatedAtAction(
            nameof(GetQuadro),
            new {name = name, id = quadro.id},
            response);
    }

    //GET /canvas/nomecanvas/quadros/iddoquadro
    [HttpGet("/canvas/{name}/quadros/{id}")]
    public IActionResult GetQuadro(string name, string id)
    {
        QuadroAnotacao? quadro = this._canvasService.GetQuadro(name, id);
        if(quadro is null)
        {
            return NotFound();
        }

        QuadroResponse response = quadro.ToQuadroResponse();
        return Ok(response);
    }

    //GET /canvas/nomedocanvas/quadros
    [HttpGet("/canvas/{name}/quadros")]
    public IActionResult GetAllQuadros(string name)
    {
        List<QuadroAnotacao> quadros = this._canvasService.GetAllQuadros(name);
        if(quadros is null)
        { 
            return BadRequest(); 
        }

        List<QuadroResponse> response = quadros.ConvertAll<QuadroResponse>( q => q.ToQuadroResponse() ); 
        return Ok(response);
    }

    //PUT /canvas/nomecanvas/quadros/iddoquadro
    [HttpPut("/canvas/{name}/quadros/{id}")]
    public IActionResult UpdateQuadro(string name, string id, UpdateQuadroRequest request)
    {
         QuadroAnotacao quadro = request.ToQuadro(id);
         if(!this._canvasService.UpdateQuadro(name, id, quadro))
         {
            return NotFound();
         }

         return NoContent();
    }


    //DELETE /canvas/nomecanvas/quadros/iddoquadro
    [HttpDelete("/canvas/{name}/quadros/{id}")]
    public IActionResult DeleteQuadro(string name, string id)
    {
        if(!this._canvasService.DeleteQuadro(name, id))
        {
            return NotFound();
        }

        return NoContent();
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