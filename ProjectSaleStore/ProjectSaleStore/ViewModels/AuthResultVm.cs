namespace SaleStoreDecor.ViewModels
{
    public class AuthResultVm
    {
        public string Token { get; set; } 
        public string RefreshToken { get; set; } 
        public DateTime ExpiresAt { get; set; }
        public string TokenId { get; set; }
    }
}
