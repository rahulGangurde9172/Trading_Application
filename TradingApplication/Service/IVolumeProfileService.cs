using TradingApplication.Models;

namespace TradingApplication.Service
{
    public interface IVolumeProfileService
    {
        VolumeProfileResult Calculate(IEnumerable<Bar> bars, int buckets = 100);
    }
}
