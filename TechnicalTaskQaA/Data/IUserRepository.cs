using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User Delete(User user);
        User GetById(int id);
        User GetByNickName(string nickname);
        User Update(User user);
    }
}