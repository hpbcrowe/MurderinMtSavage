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
