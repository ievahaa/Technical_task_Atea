using System.Linq;
using TechnicalTaskQaA.Models;

namespace TechnicalTaskQaA.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public User Create(User user)
        {
            _context.Users.Add(user);
            user.Id = _context.SaveChanges();
            return user;
        }

        public User GetByNickName(string nickname)
        {
            return _context.Users.FirstOrDefault(u => u.Nickname == nickname);
        }

        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public User Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
            return user;
        }

        public User Delete(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
            return user;
        }
    }
}
