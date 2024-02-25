using Microsoft.AspNetCore.Mvc;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserSignOutController : ControllerBase
    {
        [HttpPost("sign-out")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok("logged out successfully");
        }
    }
}
