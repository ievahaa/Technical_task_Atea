using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserUpdateProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserUpdateProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPut("update-profile")]
        public IActionResult UpdateProfile(UserUpdate model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.GetByNickName(model.OldNickname);

                if (user == null)
                {
                    return NotFound("User Not Found");
                }

                user.Name = model.Name;
                user.Nickname = model.Nickname;

                _userRepository.Update(user);

                return Ok(user);
            }
            else
            {
                return BadRequest("Invalid modelstate");
            }
        }
    }
}
