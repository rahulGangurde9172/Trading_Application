using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TradingApplication.Service;

namespace TradingApplication.Controllers
{
    public class ChartController : Controller
    {
        private readonly IMarketDataService _md;
        private readonly ISupportResistanceService _sr;
        private readonly IVolumeProfileService _vp;

        public ChartController(IMarketDataService md, ISupportResistanceService sr, IVolumeProfileService vp)
        {
            _md = md; _sr = sr; _vp = vp;
        }

        public async Task<IActionResult> Index(string symbol = "MSFT")
        {
            var bars = await _md.GetLastNBarsAsync(symbol, 200);    
            var support = _sr.ComputeSupport(bars);
            var resistance = _sr.ComputeResistance(bars);
            var profile = _vp.Calculate(bars);

            ViewBag.Symbol = symbol;
            ViewBag.BarsJson = JsonConvert.SerializeObject(bars);
            ViewBag.Support = support;
            ViewBag.Resistance = resistance;
            ViewBag.Profile = JsonConvert.SerializeObject(profile);
            return View();
        }
    }

}
