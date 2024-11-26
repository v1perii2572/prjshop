using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface IOrderItemRepository
    {
        Task<IEnumerable<OrderItem>> GetAllAsync();
        Task<OrderItem> GetByIdAsync(int id);
        Task<OrderItem> AddAsync(OrderItemVm orderVm);
        Task<OrderItem> UpdateAsync(int id, OrderItemVmm orderVm);
        Task<bool> DeleteAsync(int id);
        Task<OrderItem> CreateOrderItemAsync(OrderItemVm orderItemVm);
    }
}
