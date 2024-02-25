using System.Linq;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly AppDbContext _context;

        public QuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public Question Create(Question question)
        {
            _context.Questions.Add(question);
            question.Id = _context.SaveChanges();
            return question;
        }

        public Question GetById(int id)
        {
            return _context.Questions.FirstOrDefault(a => a.Id == id);
        }

        public Question Update(Question question)
        {
            _context.Questions.Update(question);
            _context.SaveChanges();
            return question;
        }

        public Question Delete(Question question)
        {
            _context.Questions.Remove(question);
            _context.SaveChanges();
            return question;
        }
    }
}
