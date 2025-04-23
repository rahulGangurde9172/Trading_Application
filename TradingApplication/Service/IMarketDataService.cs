using TradingApplication.Models;

namespace TradingApplication.Service
{
    public interface IMarketDataService
    {
        Task<IReadOnlyList<Bar>> GetLastNBarsAsync(string symbol, int count);
       
    }
}
