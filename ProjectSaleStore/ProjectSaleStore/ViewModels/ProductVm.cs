namespace ProjectSaleStore.ViewModels
{
    public class ProductVm
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; } = 0;
        public int CategoryId { get; set; }
        public string ImageUrl { get; set; }
    }
}
