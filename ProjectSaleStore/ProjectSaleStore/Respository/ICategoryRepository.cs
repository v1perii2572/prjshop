using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSaleStore.Respository
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category> GetByIdAsync(int id);
        Task<Category> AddAsync(CategoryVm categoryVm);
        Task<Category> UpdateAsync(int id, CategoryVmm categoryVm);
        Task<bool> DeleteAsync(int id);
    }
}
