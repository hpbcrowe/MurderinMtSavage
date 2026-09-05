using CroweQuest.Models.Genealogy;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public interface IResearchNoteRepository
    {
        Task<ResearchNote> UpsertAsync(ResearchNoteCreate researchNoteCreate, int applicationUserId);

        Task<List<ResearchNote>> GetAllAsync();

        Task<ResearchNote> GetAsync(int researchNoteId);

        Task<List<ResearchNote>> GetByAncestorProfileIdAsync(int ancestorProfileId);

        Task<int> DeleteAsync(int researchNoteId);
    }
}