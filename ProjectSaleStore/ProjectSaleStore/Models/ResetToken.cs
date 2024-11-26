namespace ProjectSaleStore.Models
{
    public class ResetToken
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Code { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
