using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserCreateController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserCreateController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("sign-up")]
        public IActionResult SignUp(User model)
        {
            if (ModelState.IsValid)
            {
                var user = new User
                {
                    Name = model.Name,
                    Nickname = model.Nickname,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash),
                };
                _userRepository.Create(user);
                return Ok(user);
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
