using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA_API.Data;
using TechnicalTaskQaA_API.ModelsAPI;
using TechnicalTaskQaA_API.Services;

namespace TechnicalTaskQaA_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext_API _context;
        private readonly JWTService _jwtService;

        public AuthenticationController(AppDbContext_API context, JWTService jwtService)
        {
            _jwtService = jwtService;
            _context = context;
        }

        [HttpPost("SignUp")]
        public ActionResult<User> SignUp(UserDto model)
        {
            var user = new User();
            user.Name = model.Name;
            user.Nickname = model.Nickname;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }

        [HttpPost("SignIn")]
        public ActionResult<User> SignIn(UserSignIn model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Nickname == model.Nickname);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid Nickname" });
            }

            if (!BCrypt.Net.BCrypt.Verify(model.PasswordHash, user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid Password" });
            }

            var jwt = _jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true,
            });
            return Ok(jwt);
        }

        [HttpPost("SignOut")]
        [Authorize]
        public IActionResult LogOut()
        {

            Response.Cookies.Delete("jwt");
            return Ok(new { message = "SignOut successful" });
        }
    }
}
