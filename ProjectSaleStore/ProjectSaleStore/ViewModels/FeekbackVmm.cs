using SaleStoreDecor.Models;

namespace ProjectSaleStore.ViewModels
{
    public class FeekbackVmm
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string UserId { get; set; }
        public int? OrderId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string? ImageUrl { get; set; }
        
    }
}
