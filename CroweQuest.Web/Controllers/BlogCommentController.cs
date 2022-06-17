using CroweQuest.Models.BlogComment;
using CroweQuest.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogCommentController : ControllerBase
    {
        private readonly IBlogCommentRepository _blogCommentRepository;

        public BlogCommentController(IBlogCommentRepository blogCommentRepository)
        {
            _blogCommentRepository = blogCommentRepository;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BlogComment>> Create(BlogCommentCreate blogCommentCreate)
        {
            // Get user id from the claim in the token
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var createdBlogComment = await _blogCommentRepository.UpsertAsync(blogCommentCreate, applicationUserId);

            return Ok(createdBlogComment);
        }

        [HttpGet("{blogId}")]
        public async Task<ActionResult<List<BlogComment>>> GetAll(int blogId)
        {
            var blogComments = await _blogCommentRepository.GetAllAsync(blogId);

            return blogComments;

        }

        [Authorize]
        [HttpDelete("{blogCommentId}")]
        public async Task<ActionResult<int>> Delete(int blogCommentId)
        {
            // Get user id from the claim in the token
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var foundBlogComment = await _blogCommentRepository.GetAsync(blogCommentId);

            if (foundBlogComment == null) return BadRequest("Comment does not exist.");

            if (foundBlogComment.ApplicationUserId == applicationUserId)
            {
                var affectedRows = await _blogCommentRepository.DeleteAsync(blogCommentId);

                return Ok(affectedRows);

            }
            else
            {
                return BadRequest("This comment was not created by the current user.");
            }

        }
    }
}
