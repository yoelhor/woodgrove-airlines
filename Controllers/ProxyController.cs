using System.Dynamic;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace woodgrove_airlines.Controllers;

[ApiController]
[Route("[controller]")]
public class ProxyController : ControllerBase
{
    private static readonly string baseUrl = "https://wggdev.ciamlogin.com/wggdev.onmicrosoft.com/oauth2/v2.0";
    private static readonly string baseUrlParams = "?dc=ESTS-PUB-WUS2-AZ1-FD000-TEST1";

    private static readonly HttpClient client = new HttpClient();

    private readonly ILogger<ProxyController> _logger;

    public ProxyController(ILogger<ProxyController> logger)
    {
        _logger = logger;
    }

    [HttpPost("Initiate")]
    public async Task<IActionResult> OnPostInitiateAsync()
    {
        var response = await client.PostAsync($"{baseUrl}/initiate{baseUrlParams}", CreatePostData());
        var responseString = await response.Content.ReadAsStringAsync();

        return Ok(JsonSerializer.Deserialize<dynamic>(responseString));
    }

    [HttpPost("Challenge")]
    public async Task<IActionResult> OnPostChallengeAsync()
    {
        var response = await client.PostAsync($"{baseUrl}/challenge{baseUrlParams}", CreatePostData());
        var responseString = await response.Content.ReadAsStringAsync();

        return Ok(JsonSerializer.Deserialize<dynamic>(responseString));
    }

    [HttpPost("token")]
    public async Task<IActionResult> OnPostTokenAsync()
    {
        var response = await client.PostAsync($"{baseUrl}/token{baseUrlParams}", CreatePostData());
        var responseString = await response.Content.ReadAsStringAsync();

        return Ok(JsonSerializer.Deserialize<dynamic>(responseString));
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
