
using System.Reflection.Metadata.Ecma335;
using Microsoft.EntityFrameworkCore;

public class AutoDeleteCanvasService : IHostedService, IDisposable
{
    private Timer? _timer;
    private const int intervalTimeHours = 24;
    private const double CanvasExpireTimeHours = 24d;

    private readonly IServiceProvider _serviceProvider;
    public AutoDeleteCanvasService(IServiceProvider serviceProvider)
    {
        this._serviceProvider = serviceProvider;
    }
    
    //inicia o processo cíclico (1 vez por dia) de varredura da Database 
    public Task StartAsync(CancellationToken cancellationToken)
    {
        this._timer = new Timer(this.DeleteOldCanvas, null, TimeSpan.Zero, TimeSpan.FromHours(intervalTimeHours));
        return Task.CompletedTask;
    }

    private void DeleteOldCanvas(object? _)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<PushItContext>();

        //busca por todos os canvas criados a mais de 24 horas
        var c_queryResult = dbContext.canvas.ToList()
                                            .Where(
                                            c => DateTime.Now.ToUniversalTime()
                                            .Subtract(c.CreatedDateTime.ToUniversalTime())
                                            .TotalHours >= CanvasExpireTimeHours);

        if (c_queryResult is not null)
        {
            List<CanvasEntity> expiredCanvas = c_queryResult.ToList();

            foreach (var canvasEntity in expiredCanvas)
            {
                //obter todos os quadros do canvas
                var cq_queryResult = from cq in dbContext.canvasQuadros.Include("quadro")
                                     where cq.nomeCanvas == canvasEntity.Name
                                     select cq.quadro;

                if (cq_queryResult is not null)
                {
                    List<QuadrosEntity> quadros = cq_queryResult.ToList();
                    
                    //deleta da Database todas as conexoes que partem daquele quadro e deleta o próprio quadro
                    foreach (QuadrosEntity quadro in quadros)
                    {
                        dbContext.conexoes.Where(con => con.QuadroComeco.id == quadro.id).ExecuteDelete();
                        dbContext.quadros.Remove(quadro);
                    }
                }
                //deleta da Database todas as entradas que vinculam o canvas a um quadro e deleta o próprio canvas
                dbContext.canvasQuadros.Where(cq => cq.nomeCanvas == canvasEntity.Name).ExecuteDelete();
                dbContext.Remove(canvasEntity);

                //para de fato salvar as alterações feitas pelo dbContext.Remove() 
                dbContext.SaveChanges();
            }
        }                                                
        
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        this._timer!.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        if(this._timer is not null)
        {
            this._timer.Dispose();
        }
    }
}