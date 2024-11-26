namespace SaleStoreDecor.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UserId { get; set; }
        public int? OrderId { get; set; } 
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public Product Product { get; set; }
        public User User { get; set; }
        public Order Order { get; set; }
    }
}
