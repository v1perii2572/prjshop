using Microsoft.AspNetCore.Identity;

namespace SaleStoreDecor.Models
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }
        public string Address { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
        public ICollection<Order> Orders { get; set; }
        public Cart Cart { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
    }
}
