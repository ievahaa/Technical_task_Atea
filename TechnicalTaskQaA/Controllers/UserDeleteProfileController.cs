using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserDeleteProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserDeleteProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpDelete("delete-profile")]
        public IActionResult DeleteProfile(User model)
        {
            if (ModelState.IsValid)
            {
                var user = _userRepository.GetById(model.Id);
                if (user != null)
                {
                    _userRepository.Delete(user);
                    Response.Cookies.Delete("jwt");
                    return Ok("user deleted");
                }
                else
                {
                    return NotFound("user not found");
                }
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
