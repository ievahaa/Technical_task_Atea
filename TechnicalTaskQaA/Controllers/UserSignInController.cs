using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;
using TechnicalTaskQaA.Services;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserSignInController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JWTService _jwtService;

        public UserSignInController(IUserRepository userRepository, JWTService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        [HttpPost("sign-in")]
        public IActionResult SignIn(User model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.GetByNickName(model.Nickname);

                if (user == null)
                {
                    return BadRequest(new { message = "Incorrect nickname" });
                }

                if (!BCrypt.Net.BCrypt.Verify(model.PasswordHash, user.PasswordHash))
                {
                    return BadRequest(new { message = "Incorrect password" });
                }

                var jwt = _jwtService.Generate(user.Id);

                Response.Cookies.Append("jwt", jwt, new CookieOptions
                {
                    HttpOnly = true
                });

                return Ok(user);
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
