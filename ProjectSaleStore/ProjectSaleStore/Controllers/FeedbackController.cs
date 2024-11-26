using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectSaleStore.Respository;
using ProjectSaleStore.Service;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackService;

        public FeedbackController(IFeedbackRepository feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // GET: api/Feedback
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackVm>>> GetAllFeedbacks()
        {
            var feedbacks = await _feedbackService.GetAllFeedbacksAsync();
            return Ok(feedbacks);
        }

        // GET: api/Feedback/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FeedbackVm>> GetFeedbackById(int id)
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            if (feedback == null)
                return NotFound();

            return Ok(feedback);
        }

        // POST: api/Feedback
        [HttpPost]
        public async Task<ActionResult> AddFeedback(FeedbackVm feedbackVm)
        {
            await _feedbackService.AddFeedbackAsync(feedbackVm);
            return CreatedAtAction(nameof(GetFeedbackById), new { id = feedbackVm.ProductId }, feedbackVm);
        }

        // PUT: api/Feedback/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFeedback(int id, FeekbackVmm feedbackVm)
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            if (feedback == null)
                return NotFound();

            await _feedbackService.UpdateFeedbackAsync(id, feedbackVm);
            return NoContent();
        }

        // DELETE: api/Feedback/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFeedback(int id)
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            if (feedback == null)
                return NotFound();

            await _feedbackService.DeleteFeedbackAsync(id);
            return NoContent();
        }
    }
}
