using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore;

public class CanvasService : ICanvasService
{
    private PushItContext dbContext { get; }

    public CanvasService(PushItContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<Canvas?> CreateCanvasAsync(Canvas canvas)
    {
        CanvasEntity canvasEntity = canvas.ToCanvasEntity();

        var queryResult = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasEntity.Name);
        if (queryResult is not null) { return null; }

        canvasEntity = (await dbContext.canvas.AddAsync(canvasEntity)).Entity;
        await dbContext.SaveChangesAsync();

        return canvasEntity.ToCanvas(new List<QuadroAnotacao>());
    }

    public async Task<Canvas?> GetCanvasAsync(string canvasName)
    {
        CanvasEntity? canvasEntity = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasName);
        if (canvasEntity is null) { return null; }

        List<QuadroAnotacao>? quadros = await GetAllQuadrosAsync(canvasName);

        return canvasEntity.ToCanvas(quadros);
    }

    public async Task<QuadroAnotacao?> CreateQuadroAsync(string canvasName, QuadroAnotacao quadro)
    {
        //Verifica se o Canvas Existe
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

        var idsConectadosQueryResult = from entry in dbContext.conexoes
                                       where entry.QuadroComeco.localId == quadroLocalId
                                       select entry.localIdQuadroDestino;

        QuadrosEntity quadrosEntity = queryResult.quadro;
        List<string> idsConectados = idsConectadosQueryResult is null ?
                                                                new() :
                                                                await idsConectadosQueryResult.ToListAsync();

        return quadrosEntity.ToQuadro(idsConectados);
    }

    public async Task<List<QuadroAnotacao>?> GetAllQuadrosAsync(string canvasName)
    {
        //verifica se o canvas existe
        if (await dbContext.canvas.FirstOrDefaultAsync(c => c.Name == canvasName) is null) { return null; }

        //obtém todos os quadros do canvas (sem incluir as setas de conexão)
        var quadrosEntitiesQueryResult = from entry in dbContext.canvasQuadros.Include("quadro")
                                         where entry.nomeCanvas == canvasName
                                         select entry.quadro;

        if (quadrosEntitiesQueryResult is null) { return new(); }

        List<QuadroAnotacao> Quadros = new();

        //para cada quadro do canvas, obter e vincular suas setas de conexão
        //adicionando a lista de QuadrAnotações que será retornada
        foreach (QuadrosEntity quadroEntity in quadrosEntitiesQueryResult)
        {
            var idsConectadosQueryResult = from entry in dbContext.conexoes
                                           where entry.QuadroComeco.localId == quadroEntity.localId
                                           select entry.localIdQuadroDestino;

            List<string> idsConectados = idsConectadosQueryResult is null ?
                                                                    new() :
                                                                    await idsConectadosQueryResult.ToListAsync();

            Quadros.Add(quadroEntity.ToQuadro(idsConectados));
        }

        return Quadros;
    }

    public async Task<bool> TryUpdateQuadroAsync(string canvasName, string quadroLocalId, QuadroAnotacao novoQuadro)
    {
        //verifica se o Canvas existe
        if (await dbContext.canvas.FirstOrDefaultAsync(c => c.Name == canvasName) is null) { return false; }

        //verifica se o Quadro existe no Canvas
        Canvas_Contem_Quadro? canvasQuadro = await dbContext.canvasQuadros.Include("quadro")
                                                                          .FirstOrDefaultAsync(cq =>
                                                                            cq.nomeCanvas == canvasName &&
                                                                            cq.quadro.localId == quadroLocalId);
        if (canvasQuadro is null) { return false; }

        //atualiza a entrada da Tabela Quadros
        QuadrosEntity? quadroEntity = await dbContext.quadros.FindAsync(canvasQuadro.quadro.id);
            quadroEntity!.x = novoQuadro.x;
            quadroEntity.y = novoQuadro.y;
            quadroEntity.width = novoQuadro.width;
            quadroEntity.height = novoQuadro.height;
            quadroEntity.text = novoQuadro.text;
            quadroEntity.colour = novoQuadro.colour;
            quadroEntity.LastModification = novoQuadro.LastModification;
        await dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> TryDeleteQuadroAsync(string canvasName, string quadroLocalId)
    {
        CanvasEntity? canvasQuery = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasName);
        if (canvasQuery is null) { return false; }

        Canvas_Contem_Quadro? quadroQuery = await dbContext.canvasQuadros.Include("quadro")
                                                                         .FirstOrDefaultAsync<Canvas_Contem_Quadro>
                                                                              (entry => entry.nomeCanvas == canvasName &&
                                                                               entry.quadro.localId == quadroLocalId);

        if (quadroQuery is null) { return false; }

        await dbContext.quadros.Where<QuadrosEntity>(q => q.id == quadroQuery.quadro.id).ExecuteDeleteAsync();
        await dbContext.canvasQuadros.Where<Canvas_Contem_Quadro>(entry => entry.quadro.id == quadroQuery.quadro.id).ExecuteDeleteAsync();
        await dbContext.conexoes.Where<Quadro_Aponta_Quadro>(q => q.QuadroComeco.id == quadroQuery.quadro.id).ExecuteDeleteAsync();

        return true;
    }

    public async Task<List<string>?> CreateQuadroConexaoAsync(string canvasName, string quadroLocalId, string localIdQuadroDestino)
    {
        CanvasEntity? canvasQuery = await dbContext.canvas.FirstOrDefaultAsync<CanvasEntity>(c => c.Name == canvasName);
        if (canvasQuery is null) { return null; }

        Canvas_Contem_Quadro? quadroQuery = await dbContext.canvasQuadros.Include("quadro")
                                                                         .FirstOrDefaultAsync<Canvas_Contem_Quadro>
                                                                              (entry => entry.nomeCanvas == canvasName &&
                                                                               entry.quadro.localId == quadroLocalId);
        if (quadroQuery is null) { return null; }

        //Verifica se a Conexão/Seta já existe
        Quadro_Aponta_Quadro? conexaoQuery = await dbContext.conexoes.FirstOrDefaultAsync(
                                                                    entry => entry.QuadroComeco.id == quadroQuery.quadro.id &&
                                                                    entry.localIdQuadroDestino == localIdQuadroDestino);
        if (conexaoQuery is not null) { return null; }

        List<string> IDsConectados = await (from entry in dbContext.conexoes
                                            where entry.QuadroComeco.id == quadroQuery.quadro.id
                                            select entry.localIdQuadroDestino)
                                            .ToListAsync();

        return IDsConectados;
    }

    public async Task<bool> TryDeleteQuadroConexaoAsync(string canvasName, string localId, string idConexao)
    {
        CanvasEntity? canvasQuery = await dbContext.canvas.FirstOrDefaultAsync(c => c.Name == canvasName);
        if (canvasQuery == null) { return false; }

        Canvas_Contem_Quadro? quadroQuery = await dbContext.canvasQuadros.Include("quadro")
                                                                         .FirstOrDefaultAsync<Canvas_Contem_Quadro>
                                                                            (entry => entry.nomeCanvas == canvasName &&
                                                                             entry.quadro.localId == localId);
        if (quadroQuery is null) { return false; }

        await dbContext.conexoes.Where(entry => entry.QuadroComeco.id == quadroQuery!.quadro.id &&
                                       entry.localIdQuadroDestino == idConexao)
                                       .ExecuteDeleteAsync();


        return true;
    }

}