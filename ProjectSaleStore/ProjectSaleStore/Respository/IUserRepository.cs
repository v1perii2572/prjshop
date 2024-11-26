using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(Guid id);
        Task<User> AddAsync(UserVmm userVmm);
        Task<User> UpdateAsync(Guid id, UserVm userVmm);
        Task<bool> DeleteAsync(Guid id);
    }
}
