using Microsoft.AspNetCore.Mvc;
using SaleStoreDecor.Models;
using ProjectSaleStore.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectSaleStore.ViewModels;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SliderController : ControllerBase
    {
        private readonly SliderService _sliderService;

        public SliderController(SliderService sliderService)
        {
            _sliderService = sliderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Slider>>> GetAll()
        {
            var sliders = await _sliderService.GetAllAsync();
            return Ok(sliders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Slider>> GetById(int id)
        {
            var slider = await _sliderService.GetByIdAsync(id);
            if (slider == null) return NotFound();
            return Ok(slider);
        }

        [HttpPost]
        public async Task<ActionResult<Slider>> Add(SliderVm slider)
        {
            var createdSlider = await _sliderService.AddAsync(slider);
            return CreatedAtAction(nameof(GetById), new { id = createdSlider.Id }, createdSlider);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Slider>> Update(int id, Slider slider)
        {
            var updatedSlider = await _sliderService.UpdateAsync(id, slider);
            if (updatedSlider == null) return NotFound();
            return Ok(updatedSlider);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _sliderService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
