using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemController : ControllerBase
    {
        private readonly ICartItemRepository _cartItemService;

        public CartItemController(ICartItemRepository cartItemService)
        {
            _cartItemService = cartItemService;
        }

        // GET: api/CartItem
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetAllCartItems()
        {
            var cartItems = await _cartItemService.GetAllAsync();
            return Ok(cartItems);
        }

        // GET: api/CartItem/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<CartItem>> GetCartItemById(int id)
        {
            var cartItem = await _cartItemService.GetByIdAsync(id);
            if (cartItem == null)
                return NotFound();

            return Ok(cartItem);
        }

        // POST: api/CartItem
        [HttpPost]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<CartItem>> AddCartItem([FromBody] CartItemVm cartItemVm)
        {
            if (cartItemVm == null)
                return BadRequest("Cart item data is required.");

            var addedCartItem = await _cartItemService.AddAsync(cartItemVm);

            // Return 201 Created status with location header
            return CreatedAtAction(nameof(GetCartItemById), new { id = addedCartItem.Id }, addedCartItem);
        }

        // PUT: api/CartItem/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<CartItem>> UpdateCartItem(int id, [FromBody] CartItemVm cartItemVm)
        {
            if (cartItemVm == null)
                return BadRequest("Cart item data is required.");

            var updatedCartItem = await _cartItemService.UpdateAsync(id, cartItemVm);
            if (updatedCartItem == null)
                return NotFound();

            return Ok(updatedCartItem);
        }

        // DELETE: api/CartItem/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<bool>> DeleteCartItem(int id)
        {
            var result = await _cartItemService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("exists/{cartId}/{productId}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<CartItem>> CheckIfProductInCart(int cartId, int productId)
        {
            var existingCartItem = await _cartItemService.GetByProductIdAndCartId(cartId, productId);

            if (existingCartItem == null)
                return NotFound();  // Product not in the cart
            else
                return Ok(existingCartItem);  // Product exists in the cart
        }

        [HttpGet("exists")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<bool>> CheckCartItemExists([FromQuery] int cartId, [FromQuery] int productId)
        {
            var exists = await _cartItemService.CheckCartItemExists(cartId, productId);
            return Ok(exists);
        }
    }
}