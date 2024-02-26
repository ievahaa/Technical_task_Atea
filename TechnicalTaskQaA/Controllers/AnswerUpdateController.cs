using Microsoft.AspNetCore.Mvc;
using System;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class AnswerUpdateController : ControllerBase
    {
        private readonly IAnswerRepository _answerRepository;

        public AnswerUpdateController(IAnswerRepository answerRepository)
        {
            _answerRepository = answerRepository;
        }

        [HttpPut("update-answer")]
        public IActionResult UpdateAnswer(Answer model)
        {
            if (ModelState.IsValid)
            {
                var answer = _answerRepository.GetById(model.Id);
                if (answer == null)
                {
                    return NotFound("answer not found");
                }

                answer.AnswerText = model.AnswerText;
                answer.CreatedAt = DateTime.Now;

                _answerRepository.Update(answer);

                return Ok(new { message = "answer updated" });
            }
            else
            {
                return BadRequest("Invalid modelstate");
            }
        }
    }
}
