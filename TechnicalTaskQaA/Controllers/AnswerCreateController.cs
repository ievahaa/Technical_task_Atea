using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class AnswerCreateController : ControllerBase
    {
        private readonly IAnswerRepository _answerRepository;
        private readonly IQuestionRepository _questionRepository;

        public AnswerCreateController(IAnswerRepository answerRepository, IQuestionRepository questionRepository)
        {
            _answerRepository = answerRepository;
            _questionRepository = questionRepository;
        }

        [HttpPost("create-answer")]
        public IActionResult CreateAnswer(Answer model)
        {
            if(ModelState.IsValid)
            {
                var question = _questionRepository.GetById(model.QuestionId);

                if (question == null)
                {
                    return NotFound("question not found");
                }

                var answer = new Answer
                {
                    AnswerText = model.AnswerText,
                    CreatedAt = DateTime.Now,
                    UserId = model.UserId,
                    QuestionId = model.QuestionId,
                };

                _answerRepository.Create(answer);

                return Ok(answer);
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
