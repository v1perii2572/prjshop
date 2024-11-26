using System.ComponentModel.DataAnnotations;

namespace SaleStoreDecor.ViewModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "UserName is required!")]
        public string UserName { get; set; }
        public string Address { get; set; }
        [Required(ErrorMessage = "Email is required!")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required!")]
        public string Password { get; set; }
    }
}
