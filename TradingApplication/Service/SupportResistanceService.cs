using TradingApplication.Models;

namespace TradingApplication.Service
{
    public class SupportResistanceService : ISupportResistanceService
    {
        public decimal ComputeResistance(IEnumerable<Bar> bars)
            => bars.Max(b => b.High);

        public decimal ComputeSupport(IEnumerable<Bar> bars)
            => bars.Min(b => b.Low);
    }
}
