using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectSaleStore.Models.Momo;
using ProjectSaleStore.Respository;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private IMomoService _momoService;
        public PaymentController(IMomoService momoService)
        {
            _momoService = momoService;

        }
        [HttpPost]
        [Route("CreatePaymentUrl")]
        public async Task<IActionResult> CreatePaymentUrl(OrderInfoModel model)
        {
            var response = await _momoService.CreatePaymentMomo(model);

            if (response == null || string.IsNullOrEmpty(response.PayUrl))
            {
                return BadRequest(new
                {
                    Message = "Không thể tạo URL thanh toán. Vui lòng kiểm tra lại thông tin đơn hàng hoặc cấu hình."
                });
            }

            return Ok(new
            {
                PaymentUrl = response.PayUrl
            });
        }



    }
}
