using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechnicalTaskQaA_API.Data;
using TechnicalTaskQaA_API.ModelsAPI;
using TechnicalTaskQaA_API.Services;

namespace TechnicalTaskQaA_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext_API _context;
        private readonly JWTService _jwtService;

        public ProfileController(AppDbContext_API context, JWTService jwtService)
        {
            _jwtService = jwtService;
            _context = context;
        }

        [HttpGet("profile-info")]
        [Authorize]
        public IActionResult GetProfile()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);

                return Ok(user);
            }
            catch
            {
                return Unauthorized(new { message = "Unauthorized" });
            }
        }

        [HttpPut("update-profile")]
        [Authorize]
        public IActionResult UpdateProfile(UserUpdate model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.Users.FirstOrDefault(u => u.Nickname == model.OldNickname);

                if (user == null)
                {
                    return NotFound("User Not Found");
                }

                user.Name = model.Name;
                user.Nickname = model.Nickname;

                _context.Entry(user).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(user);
            }
            else
            {
                return BadRequest("Invalid modelstate");
            }
        }

        [HttpPut("update-password")]
        [Authorize]
        public IActionResult UpdatePassword(UserUpdatePassword model)
        {
            if (ModelState.IsValid)
            {
                var user = _context.Users.FirstOrDefault(u => u.Nickname == model.Nickname);
                if (user != null && model.Password !=null && model.Password.Equals(model.ConfirmPassword))
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

                    _context.Entry(user).State = EntityState.Modified;
                    _context.SaveChanges();

                    return Ok(user);
                }
                else if (user == null)
                {
                    return NotFound(new { message = "User Not Found" });
                }
                else if (model.Password == null || model.ConfirmPassword == null)
                {
                    return BadRequest(new { message = "Password fields cannot be empty" });
                }
                else
                {
                    return BadRequest(new { message = "Passwords does not match" });
                }
            }
            else
            {
                return BadRequest("Invalid modelstate");
            }
        }

        [HttpDelete("delete-profile")]
        public async Task<ActionResult<User>> DeleteProfile()
        {
            var jwt = Request.Cookies["jwt"];
            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "user deleted" });
        }
    }
}
