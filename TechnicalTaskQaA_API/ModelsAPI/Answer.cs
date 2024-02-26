namespace TechnicalTaskQaA_API.ModelsAPI
{
    public partial class Answer
    {
        public int Id { get; set; }
        public string AnswerText { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public int QuestionId { get; set; }

        public virtual Question Question { get; set; }
        public virtual User User { get; set; }
    }
}
