using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public interface IQuestionRepository
    {
        Question Create(Question question);
        Question Delete(Question question);
        Question GetById(int id);
        Question Update(Question question);
    }
}