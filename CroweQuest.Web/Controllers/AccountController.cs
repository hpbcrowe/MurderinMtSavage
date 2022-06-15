using BlogLab.Services;
using CroweQuest.Models.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Web.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<ApplicationUserIdentity> _userManager;
        private readonly SignInManager<ApplicationUserIdentity> _signInManager;

        public AccountController(
            ITokenService tokenService,
            UserManager<ApplicationUserIdentity> userManager,
            SignInManager<ApplicationUserIdentity> signInManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;    

        }
        /****************************
       * 5000/api/Account/register [Post]
       * ********************************/
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
            //Create password separately so it can be hashed separately
            var result = await _userManager.CreateAsync(applicationUserIdentity, applicationUserCreate.Password);

            if (result.Succeeded)
            {
                ApplicationUser applicationUser = new ApplicationUser()
                {
                    ApplicationUserId = applicationUserIdentity.ApplicationUserId,
                    Username = applicationUserIdentity.Username,
                    Email = applicationUserIdentity.Email,
                    FullName = applicationUserIdentity.Fullname,
                    LineOfDescent = applicationUserIdentity.LineOfDescent,
                    Token = _tokenService.CreateToken(applicationUserIdentity)
                };
                return Ok(applicationUser);

            }

            return BadRequest(result.Errors);
        }

        /*********************
         * HTTP POST /login
         * *********************/
        [HttpPost("login")]
        public async Task<ActionResult<ApplicationUser>> Login(ApplicationUserLogin applicationUserLogin)
        {
            var applicationUserIdentity = await _userManager.FindByNameAsync(applicationUserLogin.Username);

            if(applicationUserIdentity != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(
                    applicationUserIdentity,
                    applicationUserLogin.Password, false);
                if (result.Succeeded)
                {
                    ApplicationUser applicationUser = new ApplicationUser
                    {
                        ApplicationUserId = applicationUserIdentity.ApplicationUserId,
                        Username = applicationUserIdentity.Username,
                        Email = applicationUserIdentity.Email,
                        FullName = applicationUserIdentity.Fullname,
                        LineOfDescent = applicationUserIdentity.LineOfDescent,
                        Token = _tokenService.CreateToken(applicationUserIdentity)
                    };
                    return Ok(applicationUser);
                }
            }
            // if user not found or didn't get back a result
            return BadRequest("Invalid Login Attempt.");
        }
    }
}
