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

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

app.UseCors(AllowAllPolicyName); //Adicionado ao pipeline junto com a função AddCors
//app.UseHttpsRedirection();
app.MapControllers();
app.Run();

