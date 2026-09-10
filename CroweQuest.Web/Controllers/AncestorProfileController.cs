using CroweQuest.Models.Genealogy;
using CroweQuest.Models.Photo;
using CroweQuest.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AncestorProfileController : ControllerBase
    {
        private readonly IAncestorProfileRepository _ancestorProfileRepository;

        public AncestorProfileController(IAncestorProfileRepository ancestorProfileRepository)
        {
            _ancestorProfileRepository = ancestorProfileRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<AncestorProfile>>> GetAll([FromQuery] string query)
        {
            if (!string.IsNullOrWhiteSpace(query))
            {
                return Ok(await _ancestorProfileRepository.SearchAsync(query));
            }

            return Ok(await _ancestorProfileRepository.GetAllAsync());
        }

        [HttpGet("{ancestorProfileId}")]
        public async Task<ActionResult<AncestorProfile>> Get(int ancestorProfileId)
        {
            return Ok(await _ancestorProfileRepository.GetAsync(ancestorProfileId));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<AncestorProfile>> Create(AncestorProfileCreate ancestorProfileCreate)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _ancestorProfileRepository.UpsertAsync(ancestorProfileCreate, applicationUserId));
        }

        [Authorize]
        [HttpDelete("{ancestorProfileId}")]
        public async Task<ActionResult<int>> Delete(int ancestorProfileId)
        {
            return Ok(await _ancestorProfileRepository.DeleteAsync(ancestorProfileId));
        }

        [Authorize]
        [HttpPost("{ancestorProfileId}/followers")]
        public async Task<ActionResult<int>> Follow(int ancestorProfileId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _ancestorProfileRepository.AddFollowerAsync(ancestorProfileId, applicationUserId));
        }

        [Authorize]
        [HttpDelete("{ancestorProfileId}/followers")]
        public async Task<ActionResult<int>> Unfollow(int ancestorProfileId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _ancestorProfileRepository.RemoveFollowerAsync(ancestorProfileId, applicationUserId));
        }

        [Authorize]
        [HttpPost("{ancestorProfileId}/relationships")]
        public async Task<ActionResult<int>> AddRelationship(int ancestorProfileId, AncestorRelationship ancestorRelationship)
        {
            ancestorRelationship.AncestorProfileId = ancestorProfileId;
            return Ok(await _ancestorProfileRepository.AddRelationshipAsync(ancestorRelationship));
        }

        [HttpGet("{ancestorProfileId}/photos")]
        public async Task<ActionResult<List<Photo>>> GetPhotos(int ancestorProfileId)
        {
            return Ok(await _ancestorProfileRepository.GetPhotosAsync(ancestorProfileId));
        }

        [Authorize]
        [HttpPost("{ancestorProfileId}/photos/{photoId}")]
        public async Task<ActionResult<int>> AddPhoto(int ancestorProfileId, int photoId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _ancestorProfileRepository.AddPhotoAsync(ancestorProfileId, photoId, applicationUserId));
        }

        [Authorize]
        [HttpDelete("{ancestorProfileId}/photos/{photoId}")]
        public async Task<ActionResult<int>> RemovePhoto(int ancestorProfileId, int photoId)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _ancestorProfileRepository.RemovePhotoAsync(ancestorProfileId, photoId, applicationUserId));
        }
    }
}