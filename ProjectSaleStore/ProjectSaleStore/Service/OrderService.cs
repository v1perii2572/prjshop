using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class OrderService : IOrderRepesitory
    {
        private readonly SaleStoreDbContext _context;

        public OrderService(SaleStoreDbContext context)
        {
            _context = context;
        }

        // Thêm mới Order
        public async Task<Order> AddAsync(OrderVm orderVm)
        {
            var order = new Order
            {
                UserId = orderVm.UserId,
                CartId = orderVm.CartId,
                Status = orderVm.Status,
                TotalAmount = orderVm.TotalAmount,
                ShippingAddress = orderVm.ShippingAddress,
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        // Xóa Order theo ID
        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return false;
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }

        // Lấy danh sách tất cả Orders
        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems) // Bao gồm các OrderItem nếu cần
                .ToListAsync();
        }

        // Lấy Order theo ID
        public async Task<Order> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItems) // Bao gồm các OrderItem nếu cần
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        // Cập nhật Order
        public async Task<Order> UpdateAsync(int id, OrderVmm orderVm)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return null;
            }

            order.Status = orderVm.Status;
            order.TotalAmount = orderVm.TotalAmount;
            order.ShippingAddress = orderVm.ShippingAddress;

            await _context.SaveChangesAsync();
            return order;
        }
        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ToListAsync();
        }
        public async Task<IEnumerable<OrderDetailsVm>> GetOrdersWithDetailsAsync()
        {
            return await _context.Orders
                .Include(o => o.User) // Bao gồm User
                .Include(o => o.OrderItems) // Bao gồm OrderItems
                    .ThenInclude(oi => oi.Product) // Bao gồm Product
                .Select(o => new OrderDetailsVm
                {
                    OrderId = o.Id,
                    CustomerName = o.User != null ? o.User.FullName : "Unknown",
                    Items = o.OrderItems != null
                        ? o.OrderItems.Select(oi => new OrderItemVmmm // Thay vì OrderItemVm
                        {
                            ProductName = oi.Product != null ? oi.Product.Name : "Unknown",
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice
                        }).ToList()
                        : new List<OrderItemVmmm>(), // Danh sách rỗng nếu không có OrderItems
                    TotalPrice = o.TotalAmount,
                    Status = o.Status
                })
                .ToListAsync();
        }

    }
}
