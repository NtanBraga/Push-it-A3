using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSingleton<ICanvasService, CanvasService>();

//Adicionada essa função devido a erros de requisição 'fetch' da porta do React com a API
const string AllowAllPolicyName = "AllowAll";
builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowAllPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<PushItContext>(options =>
{
    const string connectionString = @"Data Source=.\Database\PushItDatabase.db;";
    options.UseSqlite(connectionString);
});

var app = builder.Build();

using (IServiceScope scope = app.Services.CreateScope()) //gera um service compatível com a keyword "using"
{
    PushItContext dbContext = scope.ServiceProvider.GetRequiredService<PushItContext>(); // Verifica se está caastrado internamente para funções de Dependcy Injection
    dbContext.Database.EnsureCreated(); // Garante que a Databse Existe
}

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

app.UseCors(AllowAllPolicyName); //Adicionado ao pipeline junto com a função AddCors
//app.UseHttpsRedirection();
app.MapControllers();
app.Run();

