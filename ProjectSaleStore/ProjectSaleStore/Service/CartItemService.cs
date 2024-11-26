using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class CartItemService : ICartItemRepository
    {
        private readonly SaleStoreDbContext _context;

        public CartItemService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetAllAsync()
        {
            return await _context.CartItems
                .Include(ci => ci.Cart) // Optional: Include Cart data if necessary
                .Include(ci => ci.Product) // Optional: Include Product data if necessary
                .ToListAsync();
        }

        public async Task<CartItem> GetByIdAsync(int id)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart) // Optional: Include Cart data if necessary
                .Include(ci => ci.Product) // Optional: Include Product data if necessary
                .FirstOrDefaultAsync(ci => ci.Id == id);
        }

        public async Task<CartItem> AddAsync(CartItemVm cartItemVm)
        {
            var cartItem = new CartItem
            {
                CartId = cartItemVm.CartId,
                ProductId = cartItemVm.ProductId,
                Quantity = cartItemVm.Quantity
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return cartItem;
        }

        public async Task<CartItem> UpdateAsync(int id, CartItemVm cartItemVm)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return null;

            // Update properties based on CartItemVm
            cartItem.CartId = cartItemVm.CartId;
            cartItem.ProductId = cartItemVm.ProductId;
            cartItem.Quantity = cartItemVm.Quantity;

            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            return cartItem;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) return false;

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CartItem> GetByProductIdAndCartId(int cartId, int productId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
        }

        public async Task<bool> CheckCartItemExists(int cartId, int productId)
        {
            // Check if the cart item exists in the database
            var cartItem = await _context.CartItems
                .Where(ci => ci.CartId == cartId && ci.ProductId == productId)
                .FirstOrDefaultAsync();

            return cartItem != null;  // Return true if the cart item exists, otherwise false
        }
    }
}