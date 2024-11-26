using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectSaleStore.Models;
using ProjectSaleStore.Service;
using ProjectSaleStore.ViewModels;
using SaleStoreDecor.Data;
using SaleStoreDecor.Models;
using SaleStoreDecor.ViewModels;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace SaleStoreDecor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SaleStoreDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            SaleStoreDbContext context,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordVm changePasswordVm)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.ChangePasswordAsync(user, changePasswordVm.CurrentPassword, changePasswordVm.NewPassword);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            var updatedToken = await GenerateJWTToken(user);

            return Ok(new
            {
                message = "Password changed successfully",
                token = updatedToken.Token,
                expiresAt = updatedToken.ExpiresAt
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordVm ForgotPasswordVm)
        {
            var user = await _userManager.FindByEmailAsync(ForgotPasswordVm.Email);
            if (user == null)
                return BadRequest("User not found");

            Random random = new Random();
            string verificationCode = random.Next(100000, 999999).ToString();

            var passwordResetToken = new PasswordResetToken
            {
                Email = ForgotPasswordVm.Email,
                Code = verificationCode,
                ExpiryTime = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            await _context.PasswordResetTokens.AddAsync(passwordResetToken);
            await _context.SaveChangesAsync();

            using (var client = new SmtpClient())
            {
                client.Host = _configuration["EmailSettings:SmtpServer"];
                client.Port = int.Parse(_configuration["EmailSettings:SmtpPort"]);
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(
                    _configuration["EmailSettings:SmtpUsername"],
                    _configuration["EmailSettings:SmtpPassword"]
                );

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["EmailSettings:FromEmail"]),
                    Subject = "Password Reset Code",
                    Body = $"Your password reset code is: {verificationCode}. This code will expire in 15 minutes.",
                    IsBodyHtml = false,
                };
                mailMessage.To.Add(ForgotPasswordVm.Email);

                try
                {
                    await client.SendMailAsync(mailMessage);
                    return Ok("Verification code has been sent to your email");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error sending email: " + ex.Message);
                }
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordVm ResetPasswordVm)
        {
            var resetToken = await _context.PasswordResetTokens
                .Where(t => t.Email == ResetPasswordVm.Email && !t.IsUsed)
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();

            if (resetToken == null)
                return BadRequest("No valid reset token found");

            if (resetToken.ExpiryTime < DateTime.UtcNow)
                return BadRequest("Reset token has expired");

            if (resetToken.Code != ResetPasswordVm.Code)
                return BadRequest("Invalid reset code");

            var user = await _userManager.FindByEmailAsync(ResetPasswordVm.Email);
            if (user == null)
                return BadRequest("User not found");

            var identityToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, identityToken, ResetPasswordVm.NewPassword);

            if (!result.Succeeded)
                return BadRequest("Failed to reset password");

            resetToken.IsUsed = true;
            _context.PasswordResetTokens.Update(resetToken);
            await _context.SaveChangesAsync();

            return Ok("Password has been reset successfully");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel registerVm)
        {
            var userExists = await _userManager.FindByEmailAsync(registerVm.Email);
            if (userExists != null)
            {
                return BadRequest($"User {registerVm.Email} already exists!");
            }

            var user = new User
            {
                UserName = registerVm.UserName,
                Address = registerVm.Address,
                Email = registerVm.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, registerVm.Password);
            if (!result.Succeeded)
            {
                return BadRequest("User could not be created");
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                return BadRequest("Failed to assign role to user");
            }

            return Created(nameof(Register), $"User {registerVm.Email} created and assigned to 'user' role!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel loginVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("All fields are required!");
            }

            var user = await _userManager.FindByEmailAsync(loginVm.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginVm.Password))
            {
                var authResult = await GenerateJWTToken(user);
                return Ok(authResult);
            }

            return Unauthorized("Invalid login credentials.");
        }

        [HttpPost("refresh-token")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
                return BadRequest("Token is required.");

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(request.Token) as JwtSecurityToken;

                if (jsonToken == null)
                    return BadRequest("Invalid token format");

                var userId = jsonToken.Claims.First(claim => claim.Type == "nameid").Value;

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Unauthorized("User not found");

                var newAuthToken = await GenerateJWTToken(user);

                return Ok(new
                {
                    Token = newAuthToken.Token,
                    Expiration = newAuthToken.ExpiresAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest("Error processing token");
            }
        }

        [HttpGet("me")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                fullName = user.FullName,
                address = user.Address,
                username = user.UserName
            });
        }

        [HttpPost("revoke-token")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RevokeToken([FromBody] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest("Refresh token is required.");

            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            if (storedToken == null || storedToken.IsRevoked)
                return BadRequest("Invalid token.");

            storedToken.IsRevoked = true;
            _context.RefreshTokens.Update(storedToken);
            await _context.SaveChangesAsync();

            return Ok("Token has been revoked.");
        }

        private async Task<AuthResultVm> GenerateJWTToken(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim("fullname", user.FullName??""),
                new Claim("username", user.UserName),
                new Claim("userId", user.Id),
                new Claim("address", user.Address),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim("roles", role));
            }

            if (!string.IsNullOrEmpty(user.PhoneNumber))
            {
                authClaims.Add(new Claim("phone", user.PhoneNumber));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.UtcNow.AddMinutes(10),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            var refreshToken = new RefreshToken
            {
                JwtId = token.Id,
                IsRevoked = false,
                UserId = user.Id,
                DateAdded = DateTime.UtcNow,
                DateExpire = DateTime.UtcNow.AddMonths(6),
                Token = Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString()
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            var authResult = new AuthResultVm
            {
                Token = jwtToken,
                RefreshToken = refreshToken.Token,
                ExpiresAt = token.ValidTo,
                TokenId = token.Id
            };

            return authResult;
        }
    }
}
