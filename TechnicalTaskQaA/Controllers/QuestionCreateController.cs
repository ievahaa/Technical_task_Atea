using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class QuestionCreateController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserRepository _userRepository;

        public QuestionCreateController(IQuestionRepository questionRepository, IUserRepository userRepository)
        {
            _questionRepository = questionRepository;
            _userRepository = userRepository;
        }

        [HttpPost("create-question")]
        public IActionResult CreteQuestion(Question model)
        {
            if(ModelState.IsValid)
            {
                var question = new Question
                {
                    QuestionText = model.QuestionText,
                    KeyWord1 = model.KeyWord1,
                    KeyWord2 = model.KeyWord2,
                    KeyWord3 = model.KeyWord3,
                    UserId = model.UserId
                };

                _questionRepository.Create(question);
                return Ok("question created");
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
