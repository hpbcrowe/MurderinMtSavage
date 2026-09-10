


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CroweQuest.Models.Account;
using BlogLab.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CroweQuest.Repository;

namespace CroweQuest.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<ApplicationUserIdentity> _userManager;
        private readonly SignInManager<ApplicationUserIdentity> _signInManager;
        private readonly IAccountRepository _accountRepository;

        public AccountController(
            ITokenService tokenService,
            UserManager<ApplicationUserIdentity> userManager,
            SignInManager<ApplicationUserIdentity> signInManager,
            IAccountRepository accountRepository)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _accountRepository = accountRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApplicationUser>> Register(ApplicationUserCreate applicationUserCreate)
        {
            var applicationUserIdentity = new ApplicationUserIdentity
            {
                Username = applicationUserCreate.Username,
                Email = applicationUserCreate.Email,
                Fullname = applicationUserCreate.Fullname,
                LineOfDescent = applicationUserCreate.LineOfDescent
            };

            var result = await _userManager.CreateAsync(applicationUserIdentity, applicationUserCreate.Password);

            if (result.Succeeded)
            {
                applicationUserIdentity = await _userManager.FindByNameAsync(applicationUserCreate.Username);

                ApplicationUser applicationUser = new ApplicationUser()
                {
                    ApplicationUserId = applicationUserIdentity.ApplicationUserId,
                    Username = applicationUserIdentity.Username,
                    Email = applicationUserIdentity.Email,
                    Fullname = applicationUserIdentity.Fullname,
                    LineOfDescent = applicationUserIdentity.LineOfDescent,
                    Token = _tokenService.CreateToken(applicationUserIdentity)
                };

                return Ok(applicationUser);
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApplicationUser>> Login(ApplicationUserLogin applicationUserLogin)
        {
            var applicationUserIdentity = await _userManager.FindByNameAsync(applicationUserLogin.Username);

            if (applicationUserIdentity != null)
            {
                var passwordIsValid = await _userManager.CheckPasswordAsync(
                    applicationUserIdentity,
                    applicationUserLogin.Password);

                if (passwordIsValid)
                {
                    ApplicationUser applicationUser = new ApplicationUser
                    {
                        ApplicationUserId = applicationUserIdentity.ApplicationUserId,
                        Username = applicationUserIdentity.Username,
                        Email = applicationUserIdentity.Email,
                        Fullname = applicationUserIdentity.Fullname,
                        LineOfDescent = applicationUserIdentity.LineOfDescent,
                        Token = _tokenService.CreateToken(applicationUserIdentity)
                    };

                    return Ok(applicationUser);
                }
            }

            return BadRequest("Invalid login attempt.");
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword(ApplicationUserPasswordReset applicationUserPasswordReset)
        {
            var applicationUserIdentity = await _userManager.FindByNameAsync(applicationUserPasswordReset.Username);

            if (applicationUserIdentity == null)
            {
                return BadRequest("Unable to reset password.");
            }

            var providedEmail = applicationUserPasswordReset.Email?.Trim();
            var storedEmail = applicationUserIdentity.Email?.Trim();

            if (!string.Equals(providedEmail, storedEmail, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Unable to reset password.");
            }

            var passwordHasher = new PasswordHasher<ApplicationUserIdentity>();
            applicationUserIdentity.PasswordHash = passwordHasher.HashPassword(
                applicationUserIdentity,
                applicationUserPasswordReset.Password);

            var updateResult = await _accountRepository.UpdatePasswordHashAsync(
                applicationUserIdentity,
                HttpContext.RequestAborted);

            if (updateResult.Succeeded)
            {
                return Ok("Password updated successfully. You can log in with your new password.");
            }

            return BadRequest("Unable to reset password.");
        }
    }
}
