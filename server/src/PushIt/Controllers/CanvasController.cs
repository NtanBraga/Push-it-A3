using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

[ApiController]
//[Route("canvas")]
public class CanvasController : ControllerBase
{

    private readonly ICanvasService _canvasService;
    public CanvasController(ICanvasService canvasService)
    {
        this._canvasService = canvasService;
    }

    //POST /canvas
    [HttpPost("/canvas")]
    public async Task<IActionResult> CreateCanvasAsync(CreateCanvasRequest request)
    {
        //Converte request para formato interno do sistema
        Canvas? canvas = request.ToCanvas();
        if (!canvas.IsValid())
        {
            return BadRequest();
        }

        // Aqui salva na database ou lista em memória
        canvas = await this._canvasService.CreateCanvasAsync(canvas);
        if (canvas is null)
        {
            return BadRequest();
        }

        //Cria a response de acordo com o Contrato/DTO definido para o json
        CanvasResponse response = canvas.ToCanvasResponse();

        return CreatedAtAction(
            "GetCanvas", //DotNet identifica que o endpoint contém o termo "Async" e remove do nome da rota criada no background
            new { name = canvas.Name },
            response);
    }

    //GET /canvas/name
    [HttpGet("/canvas/{name}")]
    public async Task<IActionResult> GetCanvasAsync(string name)
    {
        Canvas? canvas = await this._canvasService.GetCanvasAsync(name);
        if (canvas is null)
        {
            return NotFound();
        }

        CanvasResponse response = canvas!.ToCanvasResponse();
        return Ok(response);
    }

    //POST /canvas/nomedocanvas/quadros
    [HttpPost("/canvas/{name}/quadros")]
    public async Task<IActionResult> CreateQuadroAsync(string name, CreateQuadroRequest request)
    {
        QuadroAnotacao? quadro = request.ToQuadro();

        quadro = await this._canvasService.CreateQuadroAsync(name, quadro);
        if (quadro is null)
        {
            return BadRequest();
        }

        QuadroResponse response = quadro.ToQuadroResponse();
        return CreatedAtAction(
            "GetQuadro", //DotNet identifica que o endpoint contém o termo "Async" e remove do nome da rota criada no background
            new { name = name, id = quadro.id },
            response);
    }

    //GET /canvas/nomecanvas/quadros/iddoquadro
    [HttpGet("/canvas/{name}/quadros/{id}")]
    public async Task<IActionResult> GetQuadroAsync(string name, string id)
    {
        QuadroAnotacao? quadro = await this._canvasService.GetQuadroAsync(name, id);
        if (quadro is null)
        {
            return NotFound();
        }

        QuadroResponse response = quadro!.ToQuadroResponse();
        return Ok(response);
    }

    //GET /canvas/nomedocanvas/quadros
    [HttpGet("/canvas/{name}/quadros")]
    public async Task<IActionResult> GetAllQuadrosAsync(string name)
    {
        List<QuadroAnotacao>? quadros = await this._canvasService.GetAllQuadrosAsync(name);
        if (quadros is null)
        {
            return BadRequest();
        }

        List<QuadroResponse> quadrosConvertidos = quadros.ConvertAll<QuadroResponse>(q => q.ToQuadroResponse());
        GetAllQuadrosResponse response = new(quadrosConvertidos);

        return Ok(response);
    }

    //PUT /canvas/nomecanvas/quadros/iddoquadro
    [HttpPut("/canvas/{name}/quadros/{id}")]
    public async Task<IActionResult> UpdateQuadroAsync(string name, string id, UpdateQuadroRequest request)
    {
        QuadroAnotacao quadro = request.ToQuadro(id);
        bool successful = await this._canvasService.TryUpdateQuadroAsync(name, id, quadro);

        if (!successful)
        {
            return NotFound();
        }

        return NoContent();
    }

    //DELETE /canvas/nomecanvas/quadros/iddoquadro
    [HttpDelete("/canvas/{name}/quadros/{id}")]
    public async Task<IActionResult> DeleteQuadro(string name, string id)
    {
        bool successful = await this._canvasService.TryDeleteQuadroAsync(name, id);

        if (!successful)
        {
            return NotFound();
        }

        return NoContent();
    }

    //POST /canvas/{CanvasName}/quadros/{LocalId}/conexoes
    [HttpPost("/CanvasName/{CanvasName}/quadros/{LocalId}/conexoes")]
    public async Task<IActionResult> CreateQuadroConexaoAsync(string CanvasName, string LocalId, CreateQuadroConexaoRequest request)
    {
        List<string>? IDsConectados = await this._canvasService.CreateQuadroConexaoAsync(CanvasName, LocalId, request.IdQuadroDestino);

        if (IDsConectados is null) { return BadRequest(); }

        GetAllQuadroConexoesResponse response = new(IDsConectados);
        return CreatedAtAction("GetAllQuadroConexoes",
                                new {name = CanvasName, LocalId = LocalId},
                                response);
    }

    //GET /canvas/{nomecanvas}/quadros/{iddoquadro}/conexoes
    [HttpGet("/canvas/{name}/quadros/{LocalId}/conexoes")]
    public async Task<IActionResult> GetAllQuadroConexoesAsync(string name, string LocalId)
    {
        QuadroAnotacao? quadro = await this._canvasService.GetQuadroAsync(name, LocalId);

        if (quadro is null) { return NotFound(); }

        GetAllQuadroConexoesResponse response = new(quadro.IDsConectados ?? new());
        return Ok(response);
    }
    
    //DELETE /canvas/{CanvasName}/quadros/{LocalId}/conexoes/{IdConexao}
    [HttpDelete("/canvas/{CanvasName}/quadros/{LocalId}/conexoes/{IdConexao}")]
    public async Task<IActionResult> DeleteQuadroConexaoAsync(string CanvasName, string LocalId, string IdConexao)
    {
        bool successful = await this._canvasService.TryDeleteQuadroConexaoAsync(CanvasName, LocalId, IdConexao);

        if(!successful){ return NotFound(); }

        return NoContent();
    }

}