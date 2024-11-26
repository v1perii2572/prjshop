namespace SaleStoreDecor.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string UserId { get; set; }
        public int? CartId { get; set; } 
        public string Status { get; set; } = "Pending";
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }

        public User User { get; set; }
        public Cart Cart { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
