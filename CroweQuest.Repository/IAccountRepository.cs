/****************************
 * CROWEQUEST REPOSITORY IACCOUNTREPOSITORY
 * INTERFACE FOR ACCOUNT REPOSITORY
 * 
 * This was taken from a Udemy Course
 *  Building a Blog with ASP.NET and Angular
 * ********************/


using CroweQuest.Models.Account;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public interface IAccountRepository
    {
        public Task<IdentityResult> CreateAsync(ApplicationUserIdentity user,
            CancellationToken cancellationToken);

        public Task<ApplicationUserIdentity> GetByUsernameAsync(string normalizedUsername,
            CancellationToken cancellationToken);
    }
}
