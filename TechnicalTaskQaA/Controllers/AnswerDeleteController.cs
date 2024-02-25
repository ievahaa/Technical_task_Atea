using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class AnswerDeleteController : ControllerBase
    {
        private readonly IAnswerRepository _answerRepository;

        public AnswerDeleteController(IAnswerRepository answerRepository)
        {
            _answerRepository = answerRepository;
        }

        [HttpDelete("delete-answer")]
        public IActionResult DeleteAnswer(Answer model)
        {
            if(ModelState.IsValid)
            {
                var answer = _answerRepository.GetById(model.Id);
                if (answer == null)
                {
                    return NotFound("answer not found");
                }

                _answerRepository.Delete(answer);

                return Ok("answer deleted");
            }
            else
            {
                return BadRequest("invalid modelstate");
            }
        }
    }
}
