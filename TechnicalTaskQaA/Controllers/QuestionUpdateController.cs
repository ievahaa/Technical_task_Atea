using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class QuestionUpdateController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionUpdateController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        [HttpPut("update-question")]
        public IActionResult UpdateQuestion(Question model)
        {
            if (ModelState.IsValid)
            {
                var question = _questionRepository.GetById(model.Id);

                if (question == null)
                {
                    return NotFound("question not found");
                }

                question.QuestionText = model.QuestionText;
                question.KeyWord1 = model.KeyWord1;
                question.KeyWord2 = model.KeyWord2;
                question.KeyWord3 = model.KeyWord3;

                _questionRepository.Update(question);

                return Ok("question updated");
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
