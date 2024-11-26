using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productService;

        public ProductController(IProductRepository productService)
        {
            _productService = productService;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // GET: api/Product/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductVmm>> GetProductById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // POST: api/Product
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> AddProduct([FromBody] ProductVm productVm)
        {
            if (productVm == null)
                return BadRequest("Product data is required.");

            var addedProduct = await _productService.AddAsync(productVm);

            // Return 201 Created status with location header
            return CreatedAtAction(nameof(GetProductById), new { id = addedProduct.Id }, addedProduct);
        }

        // PUT: api/Product/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] ProductVmm productVmm)
        {
            if (productVmm == null)
                return BadRequest("Product data is required.");

            var updatedProduct = await _productService.UpdateAsync(id, productVmm);
            if (updatedProduct == null)
                return NotFound();

            return Ok(updatedProduct);
        }

        // DELETE: api/Product/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<bool>> DeleteProduct(int id)
        {
            var result = await _productService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("{id}/updateQuantity")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult UpdateProductQuantity(int id, [FromBody] ProductVmmm request)
        {
            var product = _productService.GetProductById(id);

            if (product == null)
            {
                return NotFound();
            }

            product.StockQuantity += request.Quantity; 
            _productService.UpdateProduct(product); 

            return Ok(product);
        }

        [HttpPost("GetByIds")]
        public async Task<IActionResult> GetProductsByIds([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No product IDs provided.");
            }

            var products = await _productService.GetProductsByIdsAsync(ids);
            return Ok(products);
        }

    }
}
