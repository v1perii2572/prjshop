namespace SaleStoreDecor.Models
{
    public class Slider
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } 
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true; 
        public int Order { get; set; } 
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
