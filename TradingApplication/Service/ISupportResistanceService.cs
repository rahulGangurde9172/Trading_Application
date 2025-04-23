using TradingApplication.Models;

namespace TradingApplication.Service
{
    public interface ISupportResistanceService
    {
        decimal ComputeResistance(IEnumerable<Bar> bars);
        decimal ComputeSupport(IEnumerable<Bar> bars);
    }
}
