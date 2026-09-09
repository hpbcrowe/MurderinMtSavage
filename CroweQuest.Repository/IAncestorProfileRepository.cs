using CroweQuest.Models.Genealogy;
using CroweQuest.Models.Photo;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public interface IAncestorProfileRepository
    {
        Task<AncestorProfile> UpsertAsync(AncestorProfileCreate ancestorProfileCreate, int applicationUserId);

        Task<List<AncestorProfile>> GetAllAsync();

        Task<AncestorProfile> GetAsync(int ancestorProfileId);

        Task<List<AncestorProfile>> SearchAsync(string query);

        Task<int> DeleteAsync(int ancestorProfileId);

        Task<int> AddFollowerAsync(int ancestorProfileId, int applicationUserId);

        Task<int> RemoveFollowerAsync(int ancestorProfileId, int applicationUserId);

        Task<int> AddRelationshipAsync(AncestorRelationship ancestorRelationship);

        Task<List<Photo>> GetPhotosAsync(int ancestorProfileId);

        Task<int> AddPhotoAsync(int ancestorProfileId, int photoId, int applicationUserId);

        Task<int> RemovePhotoAsync(int ancestorProfileId, int photoId, int applicationUserId);
    }
}