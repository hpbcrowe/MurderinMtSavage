using CroweQuest.Models.Genealogy;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public class AncestorProfileRepository : IAncestorProfileRepository
    {
        private readonly IConfiguration _config;

        public AncestorProfileRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection CreateConnection() => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        public async Task<int> AddFollowerAsync(int ancestorProfileId, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteScalarAsync<int>(
                "AncestorFollower_Upsert",
                new { AncestorProfileId = ancestorProfileId, ApplicationUserId = applicationUserId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> AddRelationshipAsync(AncestorRelationship ancestorRelationship)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "AncestorRelationship_Upsert",
                ancestorRelationship,
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> DeleteAsync(int ancestorProfileId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "AncestorProfile_Delete",
                new { AncestorProfileId = ancestorProfileId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<AncestorProfile>> GetAllAsync()
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var ancestors = await connection.QueryAsync<AncestorProfile>(
                "AncestorProfile_GetAll",
                commandType: CommandType.StoredProcedure);

            return ancestors.ToList();
        }

        public async Task<AncestorProfile> GetAsync(int ancestorProfileId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.QueryFirstOrDefaultAsync<AncestorProfile>(
                "AncestorProfile_Get",
                new { AncestorProfileId = ancestorProfileId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<AncestorProfile>> SearchAsync(string query)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var ancestors = await connection.QueryAsync<AncestorProfile>(
                "AncestorProfile_Search",
                new { Query = query },
                commandType: CommandType.StoredProcedure);

            return ancestors.ToList();
        }

        public async Task<AncestorProfile> UpsertAsync(AncestorProfileCreate ancestorProfileCreate, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var newAncestorProfileId = await connection.ExecuteScalarAsync<int?>(
                "AncestorProfile_Upsert",
                new
                {
                    ancestorProfileCreate.AncestorProfileId,
                    ancestorProfileCreate.FirstName,
                    ancestorProfileCreate.MiddleName,
                    ancestorProfileCreate.LastName,
                    ancestorProfileCreate.Suffix,
                    ancestorProfileCreate.Gender,
                    ancestorProfileCreate.BirthDate,
                    ancestorProfileCreate.BirthLocation,
                    ancestorProfileCreate.DeathDate,
                    ancestorProfileCreate.DeathLocation,
                    ancestorProfileCreate.Biography,
                    ancestorProfileCreate.ResearchStatus,
                    ancestorProfileCreate.FamilyBranch,
                    ancestorProfileCreate.Tags,
                    ancestorProfileCreate.ConfidenceLevel,
                    ancestorProfileCreate.ProfilePhotoId,
                    ApplicationUserId = applicationUserId
                },
                commandType: CommandType.StoredProcedure);

            newAncestorProfileId = newAncestorProfileId ?? ancestorProfileCreate.AncestorProfileId;

            return await GetAsync(newAncestorProfileId.Value);
        }

        public async Task<int> RemoveFollowerAsync(int ancestorProfileId, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "AncestorFollower_Delete",
                new { AncestorProfileId = ancestorProfileId, ApplicationUserId = applicationUserId },
                commandType: CommandType.StoredProcedure);
        }
    }
}