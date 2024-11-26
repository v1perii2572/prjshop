using Microsoft.EntityFrameworkCore;
using ProjectSaleStore.Respository;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Service
{
    public class FeedbackService : IFeedbackRepository
    {
        private readonly SaleStoreDbContext _context;

        public FeedbackService(SaleStoreDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FeedbackVm>> GetAllFeedbacksAsync()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.Product)
                .Include(f => f.User)
                .Include(f => f.Order)
                .ToListAsync();

            return feedbacks.Select(f => new FeedbackVm
            {
                ProductId = f.ProductId,
                UserId = f.UserId,
                OrderId = f.OrderId,
                Rating = f.Rating,
                Comment = f.Comment,
                ImageUrl = f.ImageUrl,
            });
        }

        public async Task<FeedbackVm> GetFeedbackByIdAsync(int id)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.Product)
                .Include(f => f.User)
                .Include(f => f.Order)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (feedback == null) return null;

            return new FeedbackVm
            {
                ProductId = feedback.ProductId,
                UserId = feedback.UserId,
                OrderId = feedback.OrderId,
                Rating = feedback.Rating,
                Comment = feedback.Comment,
                ImageUrl = feedback.ImageUrl,
            };
        }

        public async Task AddFeedbackAsync(FeedbackVm feedbackVm)
        {
            var feedback = new Feedback
            {
                ProductId = feedbackVm.ProductId,
                UserId = feedbackVm.UserId,
                OrderId = feedbackVm.OrderId,
                Rating = feedbackVm.Rating,
                Comment = feedbackVm.Comment,
                ImageUrl = feedbackVm.ImageUrl,
                CreatedDate = DateTime.Now
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFeedbackAsync(int id, FeekbackVmm feedbackVm)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback != null)
            {
                feedback.ProductId = feedbackVm.ProductId;
                feedback.UserId = feedbackVm.UserId;
                feedback.OrderId = feedbackVm.OrderId;
                feedback.Rating = feedbackVm.Rating;
                feedback.Comment = feedbackVm.Comment;
                feedback.ImageUrl = feedbackVm.ImageUrl;

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteFeedbackAsync(int id)
        {
            var feedback = await _context.Feedbacks.FindAsync(id);
            if (feedback != null)
            {
                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }
    }
}
