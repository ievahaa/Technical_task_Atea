using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class QuestionDeleteController : ControllerBase
    {
        private IQuestionRepository _questionRepository;

        public QuestionDeleteController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        [HttpDelete("delete-question")]
        public IActionResult DeleteQuestion(Question model)
        {
            if (ModelState.IsValid)
            {
                var question = _questionRepository.GetById(model.Id);
                if (question == null)
                {
                    return NotFound("question not found");
                }

                _questionRepository.Delete(question);

                return Ok("question deleted");
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
