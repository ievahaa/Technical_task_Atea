using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserUpdatePasswordController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserUpdatePasswordController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPut("update-password")]
        public IActionResult UpdatePassword(User model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.GetByNickName(model.Nickname);
                if (user != null)
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);

                    _userRepository.Update(user);

                    return Ok(user);
                }
                else
                {
                    return NotFound("User Not Found");
                }
            }
            else
            {
                return BadRequest("Invalid modelstate");
            }
        }
    }
}
