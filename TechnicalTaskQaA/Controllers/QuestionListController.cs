using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechnicalTaskQaA.Data;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Controllers
{
    [Route("api")]
    [ApiController]
    public class QuestionListController : ControllerBase
    {
        private readonly AppDbContext _dbcontext;

        public QuestionListController(AppDbContext dbContext)
        {
            _dbcontext = dbContext;
        }

        [HttpGet("get-all-questions")]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            if (_dbcontext.Questions == null)
            {
                return NotFound("no db");
            }
            return await _dbcontext.Questions.Select(x => new Question()
            {
                Id = x.Id,
                QuestionText = x.QuestionText,
                KeyWord1 = x.KeyWord1,
                KeyWord2 = x.KeyWord2,
                KeyWord3 = x.KeyWord3,
                UserId = x.UserId,
                Answers = x.Answers,
            }).ToListAsync();
        }
    }
}
