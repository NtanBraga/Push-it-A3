using Microsoft.EntityFrameworkCore;

public class PushItContext : DbContext
{
    public DbSet<Canvas> canvas { get; set; } = null!;
    public DbSet<QuadroAnotacao> quadros { get; set; } = null!;

    public PushItContext(DbContextOptions<PushItContext> options) : base(options) { }
}