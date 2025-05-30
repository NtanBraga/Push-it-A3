using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddScoped<ICanvasService, CanvasService>();

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

//garante que o diretório e a Database existam/serão criados
const string DatabaseDirectory = @".\Database\";
const string DatabaseFile = @"PushItDatabase.db";
if (!Directory.Exists(DatabaseDirectory) || !File.Exists(DatabaseDirectory + DatabaseFile))
{
    Directory.CreateDirectory(DatabaseDirectory);
    File.Create(DatabaseDirectory + DatabaseFile).Close();
}


builder.Services.AddDbContext<PushItContext>(options =>
{
    const string connectionString = @"Data Source=.\Database\PushItDatabase.db;";
    options.UseSqlite(connectionString);
});

builder.Services.AddHostedService<AutoDeleteCanvasService>();

var app = builder.Build(); //"constrói" um server de acordo com as configurações definidas anteriormente na pipeline

using (IServiceScope scope = app.Services.CreateScope()) //gera um service compatível com a keyword "using"
{
    PushItContext dbContext = scope.ServiceProvider.GetRequiredService<PushItContext>(); // Verifica se está cadastrado internamente para funções de Dependency Injection
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

