using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class ProductService : IProductRepository
    {
        private readonly SaleStoreDbContext _context;

        public ProductService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products.Include(ci => ci.Category)
                .ToListAsync();
        }

        public async Task<ProductVmm> GetByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            // Map Product to ProductVmm
            return new ProductVmm
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryId = product.CategoryId,
                ImageUrl = product.ImageUrl,
                CreatedDate = product.CreatedDate,
                UpdatedDate = product.UpdatedDate
            };
        }

        public async Task<Product> AddAsync(ProductVm productVm)
        {
            var product = new Product
            {
                Name = productVm.Name,
                Description = productVm.Description,
                Price = productVm.Price,
                StockQuantity = productVm.StockQuantity,
                CategoryId = productVm.CategoryId,
                ImageUrl = productVm.ImageUrl,
                CreatedDate = DateTime.Now
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<Product> UpdateAsync(int id, ProductVmm productVmm)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            // Update properties
            product.Name = productVmm.Name;
            product.Description = productVmm.Description;
            product.Price = productVmm.Price;
            product.StockQuantity = productVmm.StockQuantity;
            product.CategoryId = productVmm.CategoryId;
            product.ImageUrl = productVmm.ImageUrl;
            product.UpdatedDate = DateTime.Now;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return product;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }

        public Product GetProductById(int id)
        {
            return _context.Products.Find(id);
        }

        public void UpdateProduct(Product product)
        {
            _context.Products.Update(product); 
            _context.SaveChanges();          
        }

        public async Task<List<Product>> GetProductsByIdsAsync(List<int> ids)
        {
            return await _context.Products.Where(p => ids.Contains(p.Id)).ToListAsync();
        }
    }
}
