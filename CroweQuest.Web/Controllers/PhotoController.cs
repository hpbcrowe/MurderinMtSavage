using BlogLab.Services;
using CroweQuest.Models.Photo;
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
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoRepository _photoRepository;
        private readonly IBlogRepository _blogRepository;
        private readonly IPhotoService _photoService;

        public PhotoController(
            IPhotoRepository photoRepository,
            IBlogRepository blogRepository,
            IPhotoService photoService
            )
        {
            _photoRepository = photoRepository;
            _blogRepository = blogRepository;
            _photoService = photoService;

        }

        //Authorize gives permission user can visit component
        //Authentication identifies user
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Photo>> UploadPhoto(IFormFile file)
        {
            //Assigned claims in token,  token has username and  userid 
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var uploadResult = await _photoService.AddPhotoAsync(file);

            if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

            var photoCreate = new PhotoCreate
            {
                PublicId = uploadResult.PublicId,
                ImageURL = uploadResult.SecureUrl.AbsoluteUri,
                Description = file.FileName
            };

            var photo = await _photoRepository.InsertAsync(photoCreate, applicationUserId);

            return Ok(photo);
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Photo>>> GetByApplicationUserId()
        {
            // Get user id from the claim in the token
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            // pass in the user id into the getallbyuserId (All of the photos
            // with this user id) in the photo repository
            var photos = await _photoRepository.GetAllByUserIdAsync(applicationUserId);

            return Ok(photos);
        }

        [HttpGet("{photoId}")]
        //grab the photo id from url and return a photo
        public async Task<ActionResult<Photo>> Get(int photoId)
        {
            var photo = await _photoRepository.GetAsync(photoId);

            return Ok(photo);
        }

        [Authorize]
        [HttpDelete("{photoId}")]
        public async Task<ActionResult<int>> Delete(int photoId)
        {
            // Get user id from the claim in the token
            int applicationUserId = int.Parse(User.Claims.First(i => i.Type == JwtRegisteredClaimNames.NameId).Value);

            var foundPhoto = await _photoRepository.GetAsync(photoId);

            if (foundPhoto != null)
            {
                if (foundPhoto.ApplicationUserId == applicationUserId)
                {
                    // get all of the blogs that have this user id
                    var blogs = await _blogRepository.GetAllByUserIdAsync(applicationUserId);

                    // If any of those blogs have a photo id that matches this 
                    //photo id load it into the variable used in blog
                    var usedInBlog = blogs.Any(b => b.PhotoId == photoId);

                    if (usedInBlog) return BadRequest("Cannot remove photo, it is being used in published blog(s).");

                    var deleteResult = await _photoService.DeletePhotoAsync(foundPhoto.PublicId);
                    if (deleteResult.Error != null) return BadRequest(deleteResult.Error.Message);

                    var affectRows = await _photoRepository.DeleteAsync(foundPhoto.PhotoId);

                    return Ok(affectRows);
                }
                else
                {
                    return BadRequest("Photo was not uploaded by the current user.");
                }

            }
            return BadRequest("Photo does not exist.");
        }

    }
}
