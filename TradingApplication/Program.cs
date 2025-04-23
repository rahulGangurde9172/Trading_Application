using TradingApplication.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Register your custom services
builder.Services.AddHttpClient<IMarketDataService, TwelveDataMarketDataService>();

//builder.Services.AddSingleton<IMarketDataService, AlpacaMarketDataService>();
builder.Services.AddTransient<ISupportResistanceService, SupportResistanceService>();
builder.Services.AddTransient<IVolumeProfileService, VolumeProfileService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// Set ChartController as default if needed
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Chart}/{action=Index}/{id?}");

app.Run();
