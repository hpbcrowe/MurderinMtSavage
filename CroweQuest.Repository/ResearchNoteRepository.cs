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
    public class ResearchNoteRepository : IResearchNoteRepository
    {
        private readonly IConfiguration _config;

        public ResearchNoteRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection CreateConnection() => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        public async Task<int> DeleteAsync(int researchNoteId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "ResearchNote_Delete",
                new { ResearchNoteId = researchNoteId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ResearchNote>> GetAllAsync()
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var researchNotes = await connection.QueryAsync<ResearchNote>(
                "ResearchNote_GetAll",
                commandType: CommandType.StoredProcedure);

            return researchNotes.ToList();
        }

        public async Task<ResearchNote> GetAsync(int researchNoteId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.QueryFirstOrDefaultAsync<ResearchNote>(
                "ResearchNote_Get",
                new { ResearchNoteId = researchNoteId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ResearchNote>> GetByAncestorProfileIdAsync(int ancestorProfileId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var researchNotes = await connection.QueryAsync<ResearchNote>(
                "ResearchNote_GetByAncestorProfileId",
                new { AncestorProfileId = ancestorProfileId },
                commandType: CommandType.StoredProcedure);

            return researchNotes.ToList();
        }

        public async Task<ResearchNote> UpsertAsync(ResearchNoteCreate researchNoteCreate, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var newResearchNoteId = await connection.ExecuteScalarAsync<int?>(
                "ResearchNote_Upsert",
                new
                {
                    researchNoteCreate.ResearchNoteId,
                    researchNoteCreate.AncestorProfileId,
                    researchNoteCreate.Title,
                    researchNoteCreate.Content,
                    researchNoteCreate.Status,
                    researchNoteCreate.ConfidenceLevel,
                    researchNoteCreate.Tags,
                    ApplicationUserId = applicationUserId
                },
                commandType: CommandType.StoredProcedure);

            newResearchNoteId = newResearchNoteId ?? researchNoteCreate.ResearchNoteId;

            return await GetAsync(newResearchNoteId.Value);
        }
    }
}