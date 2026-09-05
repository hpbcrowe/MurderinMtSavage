using CroweQuest.Models.Genealogy;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public class SourceRepository : ISourceRepository
    {
        private readonly IConfiguration _config;

        public SourceRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection CreateConnection() => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        public async Task<int> DeleteAsync(int sourceId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "Source_Delete",
                new { SourceId = sourceId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<Source>> GetAllAsync()
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var sources = await connection.QueryAsync<Source>(
                "Source_GetAll",
                commandType: CommandType.StoredProcedure);

            return sources.ToList();
        }

        public async Task<Source> GetAsync(int sourceId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.QueryFirstOrDefaultAsync<Source>(
                "Source_Get",
                new { SourceId = sourceId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<Source>> SearchAsync(string query)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var sources = await connection.QueryAsync<Source>(
                "Source_Search",
                new { Query = query },
                commandType: CommandType.StoredProcedure);

            return sources.ToList();
        }

        public async Task<Source> UpsertAsync(SourceCreate sourceCreate, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var newSourceId = await connection.ExecuteScalarAsync<int?>(
                "Source_Upsert",
                new
                {
                    sourceCreate.SourceId,
                    sourceCreate.Title,
                    sourceCreate.SourceType,
                    sourceCreate.Citation,
                    sourceCreate.Description,
                    sourceCreate.DocumentDate,
                    sourceCreate.Location,
                    sourceCreate.Repository,
                    sourceCreate.AttachedFileUrl,
                    sourceCreate.FileId,
                    ApplicationUserId = applicationUserId
                },
                commandType: CommandType.StoredProcedure);

            newSourceId = newSourceId ?? sourceCreate.SourceId;

            return await GetAsync(newSourceId.Value);
        }
    }
}