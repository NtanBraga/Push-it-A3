using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;

public class CanvasService : ICanvasService 
{
    private PushItContext dbContext { get; }
    
    public CanvasService(PushItContext dbContext)
    {
        this.dbContext = dbContext;
    }

    private readonly Dictionary<string, Canvas> canvasPseudoDatabase = new();
    //Definindo no Program.cs como singleton se mantém salvo por todo o tempo de execução do server

    public async Task<Canvas?> CreateCanvasAsync(Canvas canvas)
    {
        CanvasEntity canvasEntity = canvas.ToCanvasEntity();

        var queryResult = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasEntity.Name);
        if (queryResult is not null) { return null; }

        canvasEntity = (await dbContext.canvas.AddAsync(canvasEntity)).Entity;
        await dbContext.SaveChangesAsync();

        return canvasEntity.ToCanvas(new List<QuadroAnotacao>());
    }

    public bool TryGetCanvas(string canvasName, out Canvas? canvas)
    {
        return this.canvasPseudoDatabase.TryGetValue(canvasName, out canvas);
    }

    public async Task<QuadroAnotacao?> CreateQuadroAsync(string canvasName, QuadroAnotacao quadro)
    {
        //Verific se o Canvas Existe
        CanvasEntity? canvasEntity = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasName);
        if (canvasEntity is null) { return null; }


        //Verifica se o Canvas já atingiu quantidade máaxima de Push-its/Quadros 
        if (await dbContext.canvasQuadros.CountAsync<Canvas_Contem_Quadro>(entry => entry.nomeCanvas == canvasName) >= Canvas.MaxQuadrosAmount)
        { return null; }

        //verifica se o Quadro a ser criado já existe
        if (await dbContext.canvasQuadros.FirstOrDefaultAsync<Canvas_Contem_Quadro>
                                        (entry => entry.nomeCanvas == canvasName &&
                                         entry.quadro.localId == quadro.id) is not null)
        {
            return null;
        }


        //adiciona o quadro no banco de dados
        QuadrosEntity quadroEntity = quadro.ToQuadroEntity();
        quadroEntity = (await dbContext.quadros.AddAsync(quadroEntity)).Entity;

        //vincula o quadro criado a um canvas
        var canvasQuadroEntity = new Canvas_Contem_Quadro(canvasName, quadroEntity);
        await dbContext.canvasQuadros.AddAsync(canvasQuadroEntity);

        await dbContext.SaveChangesAsync();

        return quadro;
    }

    public async Task<QuadroAnotacao?> GetQuadroAsync(string canvasName, string quadroLocalId)
    {
        Canvas_Contem_Quadro? queryResult = await dbContext.canvasQuadros.Include("quadro") //"quadro" é o nome da propriedade (variável) que linka com a tabela QuadrosEntity
                                                                         .FirstOrDefaultAsync<Canvas_Contem_Quadro>
                                                                             (entry => entry.nomeCanvas == canvasName &&
                                                                              entry.quadro.localId == quadroLocalId);

        if (queryResult is null) { return null; }

        var idsConectadosQueryResult =  from entry in dbContext.conexoes
                                        where entry.QuadroComeco.localId == quadroLocalId
                                        select entry.localIdQuadroDestino;

        QuadrosEntity quadrosEntity = queryResult.quadro;
        List<string> idsConectados = idsConectadosQueryResult is null ?
                                                                new() :
                                                                await idsConectadosQueryResult.ToListAsync();

        return quadrosEntity.ToQuadro(idsConectados);
    }

    public bool TryGetAllQuadros(string canvasName, out List<QuadroAnotacao> quadros)
    {
        quadros = new();

        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }

        quadros = this.canvasPseudoDatabase[canvasName].QuadrosAnotacoes;
        return true;
    }

    public bool TryUpdateQuadro(string canvasName, string quadroId, QuadroAnotacao novoQuadro)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out QuadroAnotacao? quadro)){ return false; }
         
        return this.canvasPseudoDatabase[canvasName].UpdateQuadro(quadro!.id, novoQuadro);
    }

    public bool TryDeleteQuadro(string canvasName, string quadroId)
    {
        if(!this.canvasPseudoDatabase.ContainsKey(canvasName)){ return false; }
        if(!this.canvasPseudoDatabase[canvasName].HasQuadro(quadroId, out _)){ return false; }

        return this.canvasPseudoDatabase[canvasName].DeleteQuadro(quadroId);
    }
}