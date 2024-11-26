using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class OrderItemService : IOrderItemRepository
    {
        private readonly SaleStoreDbContext _context;

        public OrderItemService(SaleStoreDbContext context)
        {
            _context = context;
        }

        // Thêm mới OrderItem
        public async Task<OrderItem> AddAsync(OrderItemVm orderVm)
        {
            var orderItem = new OrderItem
            {
                OrderId = orderVm.OrderId,
                ProductId = orderVm.ProductId,
                Quantity = orderVm.Quantity,
                UnitPrice = orderVm.UnitPrice
            };

            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();
            return orderItem;
        }

        public async Task<OrderItem> CreateOrderItemAsync(OrderItemVm orderItemVm)
        {
            // Kiểm tra xem OrderId có tồn tại trong cơ sở dữ liệu không
            var order = await _context.Orders.FindAsync(orderItemVm.OrderId);
            if (order == null)
            {
                throw new Exception($"Order with ID {orderItemVm.OrderId} not found.");
            }

            // Tạo OrderItem và lưu vào cơ sở dữ liệu
            var orderItem = new OrderItem
            {
                OrderId = orderItemVm.OrderId,
                ProductId = orderItemVm.ProductId,
                Quantity = orderItemVm.Quantity
            };

            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();

            return orderItem;
        }

        // Xóa OrderItem theo ID
        public async Task<bool> DeleteAsync(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return false;
            }

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();
            return true;
        }

        // Lấy danh sách tất cả OrderItems
        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _context.OrderItems
                .Include(oi => oi.Product) // Bao gồm thông tin Product nếu cần
                .Include(oi => oi.Order)  // Bao gồm thông tin Order nếu cần
                .ToListAsync();
        }

        // Lấy OrderItem theo ID
        public async Task<OrderItem> GetByIdAsync(int id)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product) // Bao gồm thông tin Product nếu cần
                .Include(oi => oi.Order)  // Bao gồm thông tin Order nếu cần
                .FirstOrDefaultAsync(oi => oi.Id == id);
        }

        // Cập nhật OrderItem
        public async Task<OrderItem> UpdateAsync(int id, OrderItemVmm orderVm)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return null;
            }

            orderItem.Quantity = orderVm.Quantity;
            orderItem.UnitPrice = orderVm.UnitPrice;

            await _context.SaveChangesAsync();
            return orderItem;
        }
    }
}
