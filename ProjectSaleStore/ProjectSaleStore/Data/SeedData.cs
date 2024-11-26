using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var context = serviceProvider.GetRequiredService<SaleStoreDbContext>();

        // Seed roles
        await CreateRoleIfNotExists(roleManager, "User");
        await CreateRoleIfNotExists(roleManager, "Admin");

        // Seed users
        await CreateDefaultUser(userManager, "admin@example.com", "Admin@123", "Admin", "123 Admin Street");
        await CreateDefaultUser(userManager, "hoang@example.com", "Hoang123@", "User", "123 Admin Street");

        // Seed Categories and Products
        await SeedCategoriesAndProducts(context);
    }

    private static async Task CreateRoleIfNotExists(RoleManager<IdentityRole> roleManager, string roleName)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    private static async Task CreateDefaultUser(
        UserManager<User> userManager,
        string email,
        string password,
        string role,
        string address)
    {
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                Address = address,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }
    }

    private static async Task SeedCategoriesAndProducts(SaleStoreDbContext context)
    {
        // Ensure the database is created
        await context.Database.EnsureCreatedAsync();

        // Seed Categories
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Furniture", Description = "Home decor furniture", CreatedDate = DateTime.UtcNow },
                new Category { Name = "Ceramics", Description = "Decorative ceramics and pottery", CreatedDate = DateTime.UtcNow },
                new Category { Name = "Lighting", Description = "Decorative lights and lamps", CreatedDate = DateTime.UtcNow },
                new Category { Name = "Wall Art", Description = "Paintings, posters, and decorative wall art", CreatedDate = DateTime.UtcNow },
                new Category { Name = "Textiles", Description = "Rugs, cushions, and curtains", CreatedDate = DateTime.UtcNow }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // Seed Products
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new Product { Name = "Modern Sofa", Description = "Stylish modern sofa", Price = 800m, StockQuantity = 10, CategoryId = 1, ImageUrl = "assets/images/modern-sofa.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Wooden Coffee Table", Description = "Handcrafted wooden coffee table", Price = 300m, StockQuantity = 15, CategoryId = 1, ImageUrl = "assets/images/coffee-table.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Ceramic Vase Set", Description = "Set of decorative ceramic vases", Price = 50m, StockQuantity = 50, CategoryId = 2, ImageUrl = "assets/images/vase-set.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Porcelain Bowl", Description = "Hand-painted porcelain bowl", Price = 35.00m, StockQuantity = 30, CategoryId = 2, ImageUrl = "assets/images/porcelain-bowl.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Pendant Lamp", Description = "Minimalist pendant lamp", Price = 120.00m, StockQuantity = 20, CategoryId = 3, ImageUrl = "assets/images/pendant-lamp.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Chandelier", Description = "Luxury crystal chandelier", Price = 600m, StockQuantity = 5, CategoryId = 3, ImageUrl = "assets/images/chandelier.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Abstract Painting", Description = "Large abstract painting", Price = 250.00m, StockQuantity = 12, CategoryId = 4, ImageUrl = "assets/images/abstract-painting.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Framed Poster", Description = "Vintage framed poster", Price = 75.00m, StockQuantity = 25, CategoryId = 4, ImageUrl = "assets/images/framed-poster.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Area Rug", Description = "Large woven area rug", Price = 180.00m, StockQuantity = 18, CategoryId = 5, ImageUrl = "assets/images/area-rug.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Velvet Cushion Set", Description = "Set of two velvet cushions", Price = 50.00m, StockQuantity = 40, CategoryId = 5, ImageUrl = "assets/images/velvet-cushion.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Side Table", Description = "Compact side table", Price = 150.00m, StockQuantity = 20, CategoryId = 1, ImageUrl = "assets/images/side-table.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Wall Shelf", Description = "Modern wall shelf", Price = 100m, StockQuantity = 25, CategoryId = 1, ImageUrl = "assets/images/wall-shelf.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Decorative Plate", Description = "Hand-painted decorative plate", Price = 40.00m, StockQuantity = 35, CategoryId = 2, ImageUrl = "assets/images/decorative-plate.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Floor Lamp", Description = "Adjustable floor lamp", Price = 150.00m, StockQuantity = 20, CategoryId = 3, ImageUrl = "assets/images/floor-lamp.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Tapestry", Description = "Bohemian wall tapestry", Price = 60.00m, StockQuantity = 30, CategoryId = 4, ImageUrl = "assets/images/tapestry.jpg", CreatedDate = DateTime.UtcNow },
                new Product { Name = "Throw Blanket", Description = "Cozy throw blanket", Price = 35.00m, StockQuantity = 45, CategoryId = 5, ImageUrl = "assets/images/throw-blanket.jpg", CreatedDate = DateTime.UtcNow },
                // Add more products to reach 30
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
