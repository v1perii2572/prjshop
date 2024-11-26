using SaleStoreDecor.Models;
using ProjectSaleStore.Respository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using Microsoft.EntityFrameworkCore;

namespace ProjectSaleStore.Services
{
    public class SliderService : ISliderRepository
    {
        private readonly SaleStoreDbContext _context;

        public SliderService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Slider>> GetAllAsync()
        {
            return await _context.Sliders.ToListAsync();
        }

        public async Task<Slider> GetByIdAsync(int id)
        {
            return await _context.Sliders.FindAsync(id);
        }

        public async Task<Slider> AddAsync(SliderVm sliderVm)
        {
            var slider = new Slider
            {
                ImageUrl = sliderVm.ImageUrl,
                Title = sliderVm.Title,
                Description = sliderVm.Description,
                IsActive = sliderVm.IsActive,
                Order = sliderVm.Order,
                CreatedDate = DateTime.Now
            };

            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync(); 
            return slider;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var slider = await _context.Sliders.FindAsync(id);
            if (slider != null)
            {
                _context.Sliders.Remove(slider);
                await _context.SaveChangesAsync(); 
                return true;
            }
            return false;
        }

        public async Task<Slider> UpdateAsync(int id, Slider sliderVm)
        {
            var slider = await _context.Sliders.FindAsync(id);
            if (slider != null)
            {
                slider.ImageUrl = sliderVm.ImageUrl;
                slider.Title = sliderVm.Title;
                slider.Description = sliderVm.Description;
                slider.IsActive = sliderVm.IsActive;
                slider.Order = sliderVm.Order;

                await _context.SaveChangesAsync(); 
                return slider;
            }
            return null;
        }
    }
}
