namespace ProjectSaleStore.ViewModels
{
    public class OrderVm
    {
        public string UserId { get; set; }
        public int? CartId { get; set; }
        public string Status { get; set; } = "Pending";
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; }
    }
}
