using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace woodgrove_airlines.Controllers;

//[Authorize]
[ApiController]
[Route("[controller]")]
public class ProfileController : ControllerBase
{

    private readonly ILogger<ProfileController> _logger;

    public ProfileController(ILogger<ProfileController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public IActionResult Post()
    {
        Response.Headers.Add("Access-Control-Allow-Origin", "*");

        // var accessTokenHeader = Request.Headers[HeaderNames.Authorization];
        // var accessToken = string.Empty;

        // if (accessTokenHeader.Count == 1)
        // {
        //     accessToken = accessTokenHeader[0].Replace("Bearer ", "");
        // }
        // else
        // {
        //     if (!string.IsNullOrEmpty(Request.Query["accesstoken"]))
        //     {
        //         accessToken = Request.Query["accesstoken"];
        //     }
        //     else
        //     {
        //         return Unauthorized("Bearer token not found.");
        //     }
        // }

        try
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(Request.Form["accessToken"]);

            IDictionary<string, string> claims = new Dictionary<string, string>();
            foreach (var claim in token.Claims)
            {
                claims.Add(claim.Type, claim.Value);
            }

            return Ok(claims);
        }
        catch (System.Exception)
        {
            return Ok("Can't read the access token");
        }


        
    }
}
