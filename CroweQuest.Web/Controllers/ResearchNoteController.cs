using CroweQuest.Models.Genealogy;
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
    public class ResearchNoteController : ControllerBase
    {
        private readonly IResearchNoteRepository _researchNoteRepository;

        public ResearchNoteController(IResearchNoteRepository researchNoteRepository)
        {
            _researchNoteRepository = researchNoteRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<ResearchNote>>> GetAll([FromQuery] int? ancestorProfileId)
        {
            if (ancestorProfileId.HasValue)
            {
                return Ok(await _researchNoteRepository.GetByAncestorProfileIdAsync(ancestorProfileId.Value));
            }

            return Ok(await _researchNoteRepository.GetAllAsync());
        }

        [HttpGet("{researchNoteId}")]
        public async Task<ActionResult<ResearchNote>> Get(int researchNoteId)
        {
            return Ok(await _researchNoteRepository.GetAsync(researchNoteId));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ResearchNote>> Create(ResearchNoteCreate researchNoteCreate)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _researchNoteRepository.UpsertAsync(researchNoteCreate, applicationUserId));
        }

        [Authorize]
        [HttpDelete("{researchNoteId}")]
        public async Task<ActionResult<int>> Delete(int researchNoteId)
        {
            return Ok(await _researchNoteRepository.DeleteAsync(researchNoteId));
        }
    }
}