using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface ICartRepository
    {
        Task<IEnumerable<Cart>> GetAllAsync();
        Task<Cart> GetByIdAsync(string id);
        Task<Cart> AddAsync(CartVmm customerVcartVmmm);
        Task<Cart> UpdateAsync(int id, CartVm cartVm);
        Task<bool> DeleteAsync(int id);
        Task<bool> ClearCartAsync(string userId);
        Task<Cart?> GetByUserIdAsync(string userId);

    }
}
