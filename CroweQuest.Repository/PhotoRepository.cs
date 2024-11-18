﻿using CroweQuest.Models.Photo;
using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    //Iconfiguration allows access to appsettings.json
    //to connect to the database DefaultConnection
    public class PhotoRepository : IPhotoRepository
    {
        private readonly IConfiguration _config;

        
        public PhotoRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<int> DeleteAsync(int photoId)
        {
            int affectedRows = 0;

            //Once we have type open a connection with sql server
           //Establish connection with the database using the default connection
           //string from appsettings.json

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //Open a Connection to database

                await connection.OpenAsync();

                affectedRows = await connection.ExecuteAsync(
                    "Photo_Delete",
                    new { PhotoId = photoId },
                    commandType: CommandType.StoredProcedure);
            }

            return affectedRows;
        }

        public async Task<List<Photo>> GetAllByUserIdAsync(int applicationUserId)
        {
            //Create a list to put the photos in
            IEnumerable<Photo> photos;

            //Create a connection with database
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

               /// put the photos in a list
                photos = await connection.QueryAsync<Photo>(
                    "Photo_GetByUserId",
                    new { ApplicationUserId = applicationUserId },
                    commandType: CommandType.StoredProcedure);
            }

            return photos.ToList();

        }

        public async Task<Photo> GetAsync(int photoId)
        {
            //type photo individual photo
            Photo photo;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                photo = await connection.QueryFirstOrDefaultAsync<Photo>(
                    "Photo_Get",
                    new { PhotoId = photoId},
                    commandType: CommandType.StoredProcedure);
            }

            return photo;
        }

        public async Task<Photo> InsertAsync(PhotoCreate photoCreate, int applicationUserId)
        {
            var dataTable = new DataTable();
            dataTable.Columns.Add("PublicId", typeof(string));
            dataTable.Columns.Add("ImageUrl", typeof(string));
            dataTable.Columns.Add("Description", typeof(string));

            dataTable.Rows.Add(
                photoCreate.PublicId,
                photoCreate.ImageUrl,
                photoCreate.Description);

            int newPhotoId;

            //Create a connection with database
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                newPhotoId = await connection.ExecuteScalarAsync<int>(
                    "Photo_Insert",
                    new { 
                        Photo = dataTable.AsTableValuedParameter("dbo.PhotoType"),
                        ApplicationUserId = applicationUserId
                    },
                    commandType: CommandType.StoredProcedure);
            }

            Photo photo = await GetAsync(newPhotoId);

            return photo;
        }
    }
}
