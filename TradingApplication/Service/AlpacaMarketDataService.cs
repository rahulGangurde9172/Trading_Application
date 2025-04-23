using Alpaca.Markets;
using TradingApplication.Models;
using Microsoft.Extensions.Configuration;

namespace TradingApplication.Service
{
    public class AlpacaMarketDataService : IMarketDataService
    {
        private readonly IAlpacaDataClient _client;

        public AlpacaMarketDataService(IConfiguration cfg)
        {
            
            _client = Alpaca.Markets.Environments.Paper.GetAlpacaDataClient(
                new SecretKey(
                        cfg["Alpaca:Key"],
                        cfg["Alpaca:Secret"]
                    ));
        }

        public async Task<IReadOnlyList<Bar>> GetLastNBarsAsync(string symbol, int count)
        {
            var fromDate = DateTime.UtcNow.AddDays(-1);
            var toDate = DateTime.UtcNow;

            var request = new HistoricalBarsRequest(symbol, fromDate, toDate, BarTimeFrame.Minute);

            var bars = await _client.ListHistoricalBarsAsync(request);

            return bars.Items
                .Skip(Math.Max(0, bars.Items.Count - count))
                .Select(static x => new Bar
                {
                    Time = x.TimeUtc,

                    Open = x.Open,
                    High = x.High,
                    Low = x.Low,
                    Close = x.Close,
                    Volume = (long)x.Volume
                }).ToList();
        }
    }
}
