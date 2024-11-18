using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using CroweQuest.Models.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BlogLab.Services
{
    public class PhotoService: IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        //The parameter Cloudinary Options comes from the model settings/ cloudinaryOptions
        public PhotoService(IOptions<CloudinaryOptions> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            //IMageUploadResult comes from Cloudinary
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                //Set the upload parameters
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        //The following line is required by Cloudinary
                        File = new FileDescription(file.FileName, stream),
                        //Transform the image to fit this project, can provide different options
                        //crop(fill) won't distort photo
                        Transformation = new Transformation().Height(300).Width(500).Crop("fill")
                    };
                    uploadResult = await _cloudinary.UploadAsync(uploadParams);
                }
            }

            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deletionParams);

            return result;
        }
    }
}
