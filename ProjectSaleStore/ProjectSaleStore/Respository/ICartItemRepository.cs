using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface ICartItemRepository
    {
        Task<IEnumerable<CartItem>> GetAllAsync();
        Task<CartItem> GetByIdAsync(int id);
        Task<CartItem> AddAsync(CartItemVm cartItemVm);
        Task<CartItem> UpdateAsync(int id, CartItemVm cartItemVm);
        Task<bool> DeleteAsync(int id);
        Task<CartItem> GetByProductIdAndCartId(int cartId, int productId);
        Task<bool> CheckCartItemExists(int cartId, int productId);
    }
}