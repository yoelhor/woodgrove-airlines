using System.Dynamic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace woodgrove_airlines.Controllers;

[ApiController]
[Route("[controller]")]
public class ProxyController : ControllerBase
{
    private static readonly string baseUrl = "https://KaushikTrialTenantSKZv6b6b.ciamlogin.com/89892c1c-be76-45dc-81f8-2cf4168182ec";
    private static readonly string baseUrlParams = "?dc=ESTS-PUB-NEULR1-AZ1-FD000-TEST1";

    //private static readonly string baseUrl = "https://wggdev.ciamlogin.com/wggdev.onmicrosoft.com";
    //private static readonly string baseUrlParams = "?dc=ESTS-PUB-WUS2-AZ1-FD000-TEST1";

    private static readonly HttpClient client = new HttpClient();

    private readonly ILogger<ProxyController> _logger;

    public ProxyController(ILogger<ProxyController> logger)
    {
        _logger = logger;
    }

    private async Task<IActionResult> Proxy(string Url)
    {
        var response = await client.PostAsync(Url, CreatePostData());
        var responseString = await response.Content.ReadAsStringAsync();
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        return Ok(JsonSerializer.Deserialize<dynamic>(responseString));
    }

    [HttpPost("signup/start")]
    public async Task<IActionResult> SignupStartAsync()
    {
        return await Proxy($"{baseUrl}/signup/v1.0/start{baseUrlParams}");
    }

    [HttpPost("signup/challenge")]
    public async Task<IActionResult> SignupChallengeAsync()
    {
        return await Proxy($"{baseUrl}/signup/v1.0/challenge{baseUrlParams}");
    }

    [HttpPost("signup/continue")]
    public async Task<IActionResult> SignupContinueAsync()
    {
        return await Proxy($"{baseUrl}/signup/v1.0/continue{baseUrlParams}");
    }

    [HttpPost("Initiate")]
    public async Task<IActionResult> OnPostInitiateAsync()
    {
        return await Proxy($"{baseUrl}/oauth2/v2.0/initiate{baseUrlParams}");
    }

    [HttpPost("Challenge")]
    public async Task<IActionResult> OnPostChallengeAsync()
    {
        return await Proxy($"{baseUrl}/oauth2/v2.0/challenge{baseUrlParams}");
    }

    [HttpPost("token")]
    public async Task<IActionResult> OnPostTokenAsync()
    {
        return await Proxy($"{baseUrl}/oauth2/v2.0/token{baseUrlParams}");
    }

    private FormUrlEncodedContent CreatePostData()
    {

        var values = new Dictionary<string, string>();
        foreach (var item in Request.Form)
        {
            values.Add(item.Key, item.Value);
        }

        return new FormUrlEncodedContent(values);
    }
}
