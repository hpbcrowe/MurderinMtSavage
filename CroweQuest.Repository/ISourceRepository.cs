using CroweQuest.Models.Genealogy;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public interface ISourceRepository
    {
        Task<Source> UpsertAsync(SourceCreate sourceCreate, int applicationUserId);

        Task<List<Source>> GetAllAsync();

        Task<Source> GetAsync(int sourceId);

        Task<List<Source>> SearchAsync(string query);

        Task<int> DeleteAsync(int sourceId);
    }
}