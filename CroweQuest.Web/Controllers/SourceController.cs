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
    public class SourceController : ControllerBase
    {
        private readonly ISourceRepository _sourceRepository;

        public SourceController(ISourceRepository sourceRepository)
        {
            _sourceRepository = sourceRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Source>>> GetAll([FromQuery] string query)
        {
            if (!string.IsNullOrWhiteSpace(query))
            {
                return Ok(await _sourceRepository.SearchAsync(query));
            }

            return Ok(await _sourceRepository.GetAllAsync());
        }

        [HttpGet("{sourceId}")]
        public async Task<ActionResult<Source>> Get(int sourceId)
        {
            return Ok(await _sourceRepository.GetAsync(sourceId));
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Source>> Create(SourceCreate sourceCreate)
        {
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);
            return Ok(await _sourceRepository.UpsertAsync(sourceCreate, applicationUserId));
        }

        [Authorize]
        [HttpDelete("{sourceId}")]
        public async Task<ActionResult<int>> Delete(int sourceId)
        {
            return Ok(await _sourceRepository.DeleteAsync(sourceId));
        }
    }
}