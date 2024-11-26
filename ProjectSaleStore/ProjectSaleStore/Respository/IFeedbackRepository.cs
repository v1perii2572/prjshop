using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Models;

namespace ProjectSaleStore.Respository
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<FeedbackVm>> GetAllFeedbacksAsync();
        Task<FeedbackVm> GetFeedbackByIdAsync(int id);
        Task AddFeedbackAsync(FeedbackVm feedbackVm);
        Task UpdateFeedbackAsync(int id, FeekbackVmm feedbackVm);
        Task DeleteFeedbackAsync(int id);
    }
}
