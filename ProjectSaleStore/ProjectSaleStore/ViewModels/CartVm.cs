using SaleStoreDecor.Models;
using System.Text.Json.Serialization;

namespace ProjectSaleStore.ViewModels
{
    public class CartVm
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsActive { get; set; } = true;

        [JsonIgnore]
        public ICollection<CartItem> CartItems { get; set; }
    }
}
