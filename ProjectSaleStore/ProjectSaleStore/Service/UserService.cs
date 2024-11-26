using Microsoft.AspNetCore.Identity;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class UserService : IUserRepository
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User> AddAsync(UserVmm userVmm)
        {
            var user = new User
            {
                UserName = userVmm.UserName,
                Email = userVmm.Email,
                FullName = userVmm.FullName,
                Address = userVmm.Address
            };

            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                return user;
            }
            throw new Exception("User creation failed.");
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return _userManager.Users.ToList();
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            return await _userManager.FindByIdAsync(id.ToString());
        }

        public async Task<User> UpdateAsync(Guid id, UserVm userVmm)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return null;

            user.UserName = userVmm.UserName;
            user.Email = userVmm.Email;
            user.FullName = userVmm.FullName;
            user.Address = userVmm.Address;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return user;
            }
            throw new Exception("User update failed.");
        }
    }
}
