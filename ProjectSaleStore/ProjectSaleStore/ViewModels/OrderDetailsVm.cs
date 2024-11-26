namespace ProjectSaleStore.ViewModels
{
    public class OrderDetailsVm
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public List<OrderItemVmmm> Items { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
    }

}
