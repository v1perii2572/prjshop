namespace SaleStoreDecor.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
