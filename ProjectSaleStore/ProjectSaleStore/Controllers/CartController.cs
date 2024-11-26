using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectSaleStore.Respository;
using ProjectSaleStore.Service;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartService;

        public CartController(ICartRepository cartService)
        {
            _cartService = cartService;
        }

        // GET: api/Cart
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetAllCarts()
        {
            var carts = await _cartService.GetAllAsync();
            return Ok(carts);
        }

        // GET: api/Cart/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Cart>> GetCartById(string id)
        {
            try
            {
                var cart = await _cartService.GetByIdAsync(id);

                if (cart == null)
                {
                    // Create new cart if none exists
                    var newCartVm = new CartVmm
                    {
                        UserId = id,
                        // Add any other required initialization
                    };

                    cart = await _cartService.AddAsync(newCartVm);
                }

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error processing cart request", Error = ex.Message });
            }
        }

        // POST: api/Cart
        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Cart>> AddCart([FromBody] CartVmm cartVmm)
        {
            if (cartVmm == null)
                return BadRequest("Cart data is required.");

            var addedCart = await _cartService.AddAsync(cartVmm);

            // Return 201 Created status with location header
            return CreatedAtAction(nameof(GetCartById), new { id = addedCart.Id }, addedCart);
        }

        // PUT: api/Cart/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<Cart>> UpdateCart(int id, [FromBody] CartVm cartVm)
        {
            if (cartVm == null)
                return BadRequest("Cart data is required.");

            var updatedCart = await _cartService.UpdateAsync(id, cartVm);
            if (updatedCart == null)
                return NotFound();

            return Ok(updatedCart);
        }

        // DELETE: api/Cart/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<bool>> DeleteCart(int id)
        {
            var result = await _cartService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("clear/{userId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            var result = await _cartService.ClearCartAsync(userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest(new { Message = "Failed to clear cart" });
        }
    }
}
