using System.Net.Http;
using System.Text.Json;
using TradingApplication.Models;

namespace TradingApplication.Service
{
    public class TwelveDataMarketDataService : IMarketDataService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "6a8b64b1f12d485083af0014086d0a3a"; 

        public TwelveDataMarketDataService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IReadOnlyList<Bar>> GetLastNBarsAsync(string symbol, int count)
        {
            var url = $"https://api.twelvedata.com/time_series?symbol={symbol}&interval=1min&outputsize={count}&apikey={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var json = JsonDocument.Parse(response);
            var bars = new List<Bar>();

            if (json.RootElement.TryGetProperty("values", out JsonElement values))
            {
                foreach (var item in values.EnumerateArray())
                {
                    bars.Add(new Bar
                    {
                        Time = DateTime.Parse(item.GetProperty("datetime").GetString()),
                        Open = decimal.Parse(item.GetProperty("open").GetString()),
                        High = decimal.Parse(item.GetProperty("high").GetString()),
                        Low = decimal.Parse(item.GetProperty("low").GetString()),
                        Close = decimal.Parse(item.GetProperty("close").GetString()),
                        Volume = long.Parse(item.GetProperty("volume").GetString())
                    });
                }
            }

            return bars.OrderBy(b => b.Time).ToList();
        }
    }
}
