using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase
    {
        private readonly IOrderItemRepository _orderItemRepository; // Chú ý sửa tên đối tượng

        public OrderItemController(IOrderItemRepository orderItemRepository)
        {
            _orderItemRepository = orderItemRepository;
        }

        // GET: api/OrderItem
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetAllOrderItems()
        {
            var orderItems = await _orderItemRepository.GetAllAsync();
            return Ok(orderItems);
        }

        // GET: api/OrderItem/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetOrderItemById(int id)
        {
            var orderItem = await _orderItemRepository.GetByIdAsync(id);
            if (orderItem == null)
            {
                return NotFound(new { Message = "OrderItem not found" });
            }
            return Ok(orderItem);
        }

        // POST: api/OrderItem
        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> CreateOrderItem([FromBody] OrderItemVm orderItemVm)
        {
            if (orderItemVm == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var orderItem = await _orderItemRepository.CreateOrderItemAsync(orderItemVm);
                return Ok(orderItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/OrderItem/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdateOrderItem(int id, [FromBody] OrderItemVmm orderVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedOrderItem = await _orderItemRepository.UpdateAsync(id, orderVm);
            if (updatedOrderItem == null)
            {
                return NotFound(new { Message = "OrderItem not found" });
            }

            return Ok(updatedOrderItem);
        }

        // DELETE: api/OrderItem/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var isDeleted = await _orderItemRepository.DeleteAsync(id);
            if (!isDeleted)
            {
                return NotFound(new { Message = "OrderItem not found" });
            }

            return NoContent();
        }

    }
}
