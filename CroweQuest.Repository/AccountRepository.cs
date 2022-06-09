

using CroweQuest.Models.Account;
using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public class AccountRepository : IAccountRepository
    {
        //Iconfiguration allows access to appsettings.json
        //to connect to the database DefaultConnection
        private readonly IConfiguration _config;

        public AccountRepository(IConfiguration config)
        {
            _config = config;
        }

        /*****************
         * CreateAsync()
         * Creates a user
         * *************/
        public async Task<IdentityResult> CreateAsync(ApplicationUserIdentity user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            //Creating a virtual table to represent type in the database
            var dataTable = new DataTable();
            dataTable.Columns.Add("Username", typeof(string));
            dataTable.Columns.Add("NormalizedUsername", typeof(string));
            dataTable.Columns.Add("Email", typeof(string));
            dataTable.Columns.Add("NormalizedEmail", typeof(string));
            dataTable.Columns.Add("Fullname", typeof(string));
            dataTable.Columns.Add("LineOfDescent", typeof(string));
            dataTable.Columns.Add("PasswordHash", typeof(string));

            dataTable.Rows.Add(
                user.Username,
                user.NormalizedUsername,
                user.Email,
                user.NormalizedEmail,
                user.Fullname,
                user.LineOfDescent,
                user.PasswordHash
                );
            //Once we have type open a connection with sql server
            //Establish connection with the database using the default connection
            //string from appsettings.json
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync(cancellationToken);
                //Insert into an account, stored procedure "Account_Insert" in DataBase
                await connection.ExecuteAsync("Account_Insert",
                    //dbo.AccountType is the same name as in SQL database "the type"
                    //Account_Insert took a type,  dbo.accounttype is that type that has the 
                    //Virtual table created above in it.
                    new { Account = dataTable.AsTableValuedParameter("dbo.AccountType") }, commandType: CommandType.StoredProcedure);

            }
            return IdentityResult.Success;
        }

        /**********************
         * GetByUsernameAsync()
         * Gets a user by their name.
         * 
         * *******************/
        public async Task<ApplicationUserIdentity> GetByUsernameAsync(string normalizedUsername, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            ApplicationUserIdentity applicationUser;

            //Once we have type open a connection with sql server
            //Establish connection with the database using the default connection
            //string from appsettings.json
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync(cancellationToken);

                //call Account_GetByUsername stored procedure and give it the normalizedUsername entered by 
                //That we pass it
                applicationUser = await connection.QuerySingleOrDefaultAsync<ApplicationUserIdentity>(
                    "Account_GetByUsername", new { NormalizedUsername = normalizedUsername },
                    commandType: CommandType.StoredProcedure
                    );



            }
            // return application user loaded from database
            return applicationUser;
        }
    }
}
