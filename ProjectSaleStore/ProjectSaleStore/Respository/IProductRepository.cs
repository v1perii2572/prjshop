using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<ProductVmm> GetByIdAsync(int id);
        Task<Product> AddAsync(ProductVm customerVmm);
        Task<Product> UpdateAsync(int id, ProductVmm customerVmm);
        Task<bool> DeleteAsync(int id);
        Product GetProductById(int id);
        void UpdateProduct(Product product);
        Task<List<Product>> GetProductsByIdsAsync(List<int> ids);

    }
}
