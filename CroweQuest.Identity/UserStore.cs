﻿using CroweQuest.Models.Account;
using CroweQuest.Repository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CroweQuest.Identity
{
    public class UserStore :
        IUserStore<ApplicationUserIdentity>,
        IUserEmailStore<ApplicationUserIdentity>,
        IUserPasswordStore<ApplicationUserIdentity>
    {
        private readonly IAccountRepository _accountRepository;

        public UserStore(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }
        public async Task<IdentityResult> CreateAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            //Wait for the Create async method from the account repository and pass
            //in a user. We have to do it this way because we are using Dapper
            return await _accountRepository.CreateAsync(user, cancellationToken);

        }

        //This method is implemented this way because we are using Dapper if I used the 
        //Microsoft Entity Framework ORM I wouldn't have to do this.
        public async Task<ApplicationUserIdentity> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return await _accountRepository.GetByUsernameAsync(normalizedUserName, cancellationToken);

        }

        public Task<IdentityResult> DeleteAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

       
        public Task<ApplicationUserIdentity> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationUserIdentity> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

      

        public Task<string> GetEmailAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }

        public Task<string> GetNormalizedEmailAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task<string> GetNormalizedUserNameAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUsername);
        }

        public Task<string> GetPasswordHashAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<string> GetUserIdAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.ApplicationUserId.ToString()); 
        }

        public Task<string> GetUserNameAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Username);
        }

        public Task<bool> HasPasswordAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public Task SetEmailAsync(ApplicationUserIdentity user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        public Task SetEmailConfirmedAsync(ApplicationUserIdentity user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task SetNormalizedEmailAsync(ApplicationUserIdentity user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.FromResult(0);
        }

        public Task SetNormalizedUserNameAsync(ApplicationUserIdentity user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUsername = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetPasswordHashAsync(ApplicationUserIdentity user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(ApplicationUserIdentity user, string userName, CancellationToken cancellationToken)
        {
            user.Username = userName;
            return Task.FromResult(0);
        }

        public Task<IdentityResult> UpdateAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            //Nothing to dispose
        }

    }
}
