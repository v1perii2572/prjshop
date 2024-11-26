using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepesitory _orderService;

        public OrderController(IOrderRepesitory orderService)
        {
            _orderService = orderService;
        }


        // GET: api/Order
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        // GET: api/Order/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }
            return Ok(order);
        }

        // POST: api/Order
        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderVm orderVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newOrder = await _orderService.AddAsync(orderVm);
            return CreatedAtAction(nameof(GetOrderById), new { id = newOrder.Id }, newOrder);
        }

        // PUT: api/Order/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderVmm orderVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedOrder = await _orderService.UpdateAsync(id, orderVm);
            if (updatedOrder == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

            return Ok(updatedOrder);
        }

        // DELETE: api/Order/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var isDeleted = await _orderService.DeleteAsync(id);
            if (!isDeleted)
            {
                return NotFound(new { Message = "Order not found" });
            }

            return NoContent();
        }
        [HttpGet("details")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetOrdersWithDetails()
        {
            var orders = await _orderService.GetOrdersWithDetailsAsync();
            if (orders == null || !orders.Any())
            {
                return NotFound(new { Message = "No orders found." });
            }
            return Ok(orders);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(string userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }

    }
}
