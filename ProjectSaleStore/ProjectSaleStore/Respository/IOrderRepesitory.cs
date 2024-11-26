using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface IOrderRepesitory
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order> GetByIdAsync(int id);
        Task<Order> AddAsync(OrderVm orderVm);
        Task<Order> UpdateAsync(int id, OrderVmm orderVm);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<OrderDetailsVm>> GetOrdersWithDetailsAsync();

    }
}
