using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class CartService : ICartRepository
    {
        private readonly SaleStoreDbContext _context;

        public CartService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cart>> GetAllAsync()
        {
            return await _context.Carts
                .Include(c => c.User) // Optional: Include related Customer data
                .Include(c => c.CartItems) // Optional: Include related CartItems data
                .ToListAsync();
        }

        public async Task<Cart> GetByIdAsync(string id)
        {
            var cart = await _context.Carts
                .Include(c => c.User) // Optional: Include related Customer data
                .Include(c => c.CartItems) // Optional: Include related CartItems data
                .FirstOrDefaultAsync(c => c.UserId == id);

            return cart;
        }

        public async Task<Cart> AddAsync(CartVmm cartVmm)
        {
            var cart = new Cart
            {
                UserId = cartVmm.UserId,
                IsActive = cartVmm.IsActive
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            return cart;
        }

        public async Task<Cart> UpdateAsync(int id, CartVm cartVm)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null) return null;

            // Update properties based on CartVm
            cart.UserId = cartVm.UserId;
            cart.IsActive = cartVm.IsActive;

            _context.Carts.Update(cart);
            await _context.SaveChangesAsync();

            return cart;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cart = await _context.Carts.FindAsync(id);
            if (cart == null) return false;

            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return false;
            }

            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<Cart?> GetByUserIdAsync(string userId)
        {
            return await _context.Carts
                .Include(c => c.CartItems) // Bao gồm các `CartItem`
                .FirstOrDefaultAsync(c => c.UserId == userId && c.IsActive);
        }

    }
}
