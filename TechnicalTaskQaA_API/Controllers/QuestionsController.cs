using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechnicalTaskQaA_API.Data;
using TechnicalTaskQaA_API.ModelsAPI;
using TechnicalTaskQaA_API.Services;

namespace TechnicalTaskQaA_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext_API _dbContext;
        private readonly JWTService _jwtService;

        public QuestionsController(AppDbContext_API dbContext, JWTService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        [HttpGet("get-questions")]
        [Authorize]
        public async Task<IActionResult> GetQuestions()
        {
            return Ok(await _dbContext.Questions.ToListAsync());
        }

        [HttpGet("{keyword}")]
        [Authorize]
        public IActionResult GetQuestion(string keyword)
        {
            if (_dbContext.Questions == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(keyword))
            {
                return BadRequest(new { message = "Keyword is required" });
            }

            var matchingQuestions = _dbContext.Questions
                .Where(q =>
                    EF.Functions.Like(q.QuestionText, $"%{keyword}%") ||
                    EF.Functions.Like(q.KeyWord1, $"%{keyword}%") ||
                    EF.Functions.Like(q.KeyWord2, $"%{keyword}%") ||
                    EF.Functions.Like(q.KeyWord3, $"%{keyword}%")
                )
                .ToList();

            return Ok(matchingQuestions);
        }

        [HttpPost("create-question")]
        [Authorize]
        public async Task<ActionResult<Question>> CreateQuestion(QuestionCreate model)
        {
            int userId = GetUserId();

            var question = new Question
            {
                QuestionText = model.QuestionText,
                KeyWord1 = model.KeyWord1,
                KeyWord2 = model.KeyWord2,
                KeyWord3 = model.KeyWord3,
                UserId = userId
            };

            _dbContext.Questions.Add(question);
            await _dbContext.SaveChangesAsync();

            return Ok(question);
        }

        [HttpPut("update-question")]
        [Authorize]
        public async Task<ActionResult> UpdateQuestion(QuestionUpdate model)
        {
            int userId = GetUserId();

            var question = await _dbContext.Questions.FindAsync(model.Id);
            if (question == null)
            {
                return NotFound("question not found");
            }
            else if (question.UserId != userId)
            {
                return BadRequest(new { message = "no access" });
            }
            else
            {
                question.QuestionText = model.QuestionText;
                question.KeyWord1 = model.KeyWord1;
                question.KeyWord2 = model.KeyWord2;
                question.KeyWord3 = model.KeyWord3;

                _dbContext.Entry(question).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok(question);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<Question>> DeleteQuestion(int id)
        {
            if (_dbContext.Questions == null)
            {
                return NotFound();
            }

            int userId = GetUserId();

            var question = await _dbContext.Questions.FindAsync(id);

            if (question == null)
            {
                return NotFound();
            }
            else if (question.UserId != userId)
            {
                return BadRequest(new { message = "no access" });
            }
            _dbContext.Questions.Remove(question);
            await _dbContext.SaveChangesAsync();
            return Ok(); ;
        }

        private int GetUserId()
        {
            var jwt = Request.Cookies["jwt"];
            var token = _jwtService.Verify(jwt);
            int userId = int.Parse(token.Issuer);
            return userId;
        }
    }
}
