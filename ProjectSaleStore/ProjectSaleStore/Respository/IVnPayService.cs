using ProjectSaleStore.Models.VNPay;

namespace ProjectSaleStore.Respository
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
