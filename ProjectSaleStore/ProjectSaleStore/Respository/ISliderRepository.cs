using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectSaleStore.Respository
{
    public interface ISliderRepository
    {
        Task<IEnumerable<Slider>> GetAllAsync();
        Task<Slider> GetByIdAsync(int id);
        Task<Slider> AddAsync(SliderVm sliderVm);
        Task<Slider> UpdateAsync(int id, Slider sliderVm);
        Task<bool> DeleteAsync(int id);
    }
}
