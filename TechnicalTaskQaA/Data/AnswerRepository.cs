using System.Linq;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly AppDbContext _context;

        public AnswerRepository(AppDbContext context)
        {
            _context = context;
        }

        public Answer Create(Answer answer)
        {
            _context.Answers.Add(answer);
            answer.Id = _context.SaveChanges();
            return answer;
        }

        public Answer GetById(int id)
        {
            return _context.Answers.FirstOrDefault(a => a.Id == id);
        }

        public Answer Update(Answer answer)
        {
            _context.Answers.Update(answer);
            _context.SaveChanges();
            return answer;
        }

        public Answer Delete(Answer answer)
        {
            _context.Answers.Remove(answer);
            _context.SaveChanges();
            return answer;
        }
    }
}
