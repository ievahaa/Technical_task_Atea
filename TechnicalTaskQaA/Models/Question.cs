using System.Collections.Generic;

namespace TechnicalTaskQaA.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public string KeyWord1 { get; set; }
        public string? KeyWord2 { get; set;}
        public string? KeyWord3 { get; set;}

        public int? UserId { get; set; }
        public User User { get; set; }

        public List<Answer> Answers { get; set; }
    }
}
