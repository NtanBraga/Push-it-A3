using Microsoft.EntityFrameworkCore;

public class PushItContext : DbContext
{
    public DbSet<CanvasEntity> canvas { get; set; } = null!;
    public DbSet<QuadrosEntity> quadros { get; set; } = null!;
    public DbSet<Quadro_Aponta_Quadro> conexoes { get; set; } = null!;
    public DbSet<Canvas_Contem_Quadro> canvasQuadros { get; set; } = null!;

    public PushItContext(DbContextOptions<PushItContext> options) : base(options) { }
}