using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSaleStore.Service
{
    public class CategoryService : ICategoryRepository
    {
        private readonly SaleStoreDbContext _context;

        public CategoryService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category> UpdateAsync(int id, CategoryVmm categoryVm)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                category.Name = categoryVm.Name;
                category.Description = categoryVm.Description;

                await _context.SaveChangesAsync();
                return category;
            }
            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<Category> AddAsync(CategoryVm categoryVm)
        {
            var category = new Category
            {
                Name = categoryVm.Name,
                Description = categoryVm.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }
    }
}
