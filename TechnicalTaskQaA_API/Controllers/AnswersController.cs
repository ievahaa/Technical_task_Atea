using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;
using TechnicalTaskQaA_API.Data;
using TechnicalTaskQaA_API.ModelsAPI;
using TechnicalTaskQaA_API.Services;

namespace TechnicalTaskQaA_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {

        private readonly AppDbContext_API _dbContext;
        private readonly JWTService _jwtService;

        public AnswersController(AppDbContext_API dbContext, JWTService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }
        

        [HttpGet("{questionId}")]
        [Authorize]
        public IActionResult GetAnswers(int questionId)
        {
            if (_dbContext.Answers == null)
            {
                return NotFound();
            }

            if (questionId < 1)
            {
                return BadRequest(new { message = "Id has to be positive integer" });
            }
            else
            {
                var question = _dbContext.Questions.FirstOrDefault(q => q.Id == questionId);
                if (question == null)
                {
                    return BadRequest(new { message = "No question with provided Id" });
                }
            }

            var matchingAnswers = _dbContext.Answers
        .Where(a => a.QuestionId == questionId)
        .ToList();

            string[] answerList = new string[matchingAnswers.Count];

            for (int i = 0; i<matchingAnswers.Count; i++)
            {
                answerList[i] = matchingAnswers[i].AnswerText;
            }

            return Ok(answerList);
        }

        [HttpPost("Create-answer")]
        [Authorize]
        public IActionResult CreateAnswer(AnswerCreate model)
        {
            if (model.QuestionId < 1)
            {
                return BadRequest(new { message = "Id has to be positive integer" });
            }
            else
            {
                var question = _dbContext.Questions.FirstOrDefault(q => q.Id == model.QuestionId);
                if (question == null)
                {
                    return BadRequest(new { message = "No question with provided Id" });
                }
                var answer = new Answer();
                answer.AnswerText = model.AnswerText;
                answer.QuestionId = model.QuestionId;
                answer.UserId = GetUserId();
                answer.CreatedAt = DateTime.Now;
                _dbContext.Answers.Add(answer);
                _dbContext.SaveChangesAsync();

                return Ok(answer.AnswerText);
            }
        }

        [HttpPut("update-answer")]
        [Authorize]
        public IActionResult UpdateAnswer(AnswerUpdate model)
        {
            if (model.Id < 1)
            {
                return BadRequest(new { message = "Id has to be positive integer" });
            }
            else
            {
                var answer = _dbContext.Answers.FirstOrDefault(q => q.Id == model.Id);
                if (answer == null)
                {
                    return BadRequest(new { message = "No Answer with provided Id" });
                }

                var userId = GetUserId();
                if (answer.UserId != userId)
                {
                    return BadRequest(new { message = "No access, you can edit only your own answers" });
                }

                answer.AnswerText = model.AnswerText;
                answer.CreatedAt = DateTime.Now;

                _dbContext.Entry(answer).State = EntityState.Modified;
                _dbContext.SaveChangesAsync();

                return Ok(answer);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<Answer>> DeleteAnswer(int id)
        {
            if (_dbContext.Answers == null)
            {
                return NotFound();
            }

            int userId = GetUserId();

            var answer = await _dbContext.Answers.FindAsync(id);

            if (answer == null)
            {
                return NotFound();
            }
            else if (answer.UserId != userId)
            {
                return BadRequest(new { message = "no access, you can delete only your own answers" });
            }
            _dbContext.Answers.Remove(answer);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "answer deleted" });
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
