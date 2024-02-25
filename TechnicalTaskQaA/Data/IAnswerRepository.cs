using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public interface IAnswerRepository
    {
        Answer Create(Answer answer);
        Answer Delete(Answer answer);
        Answer GetById(int id);
        Answer Update(Answer answer);
    }
}