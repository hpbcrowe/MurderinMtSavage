using CroweQuest.Models.BlogComment;
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
    public class BlogCommentRepository : IBlogCommentRepository
    {

        //Iconfiguration allows access to appsettings.json
        //to connect to the database DefaultConnection
        private readonly IConfiguration _config;

        public BlogCommentRepository(IConfiguration config)
        {
            _config = config;
        }
        public async Task<int> DeleteAsync(int blogCommentId)
        {
            int affectedRows = 0;

            //Once we have type open a connection with sql server
            //Establish connection with the database using the default connection
            //string from appsettings.json
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync();

                affectedRows = await connection.ExecuteAsync(
                    //BlogComment_Delete is the name of the stored procedure
                    "BlogComment_Delete",
                    //blogCommentId is the parameter passed in 
                    // need to load it into the blogcomment model object that has
                    // a BlogCommentId Property ie getter and setter
                    new { BlogCommentId = blogCommentId },
                    commandType: CommandType.StoredProcedure);

            }

            return affectedRows;
        }

        public async Task<List<BlogComment>> GetAllAsync(int blogId)
        {
            //Create a list to put the blogs in
            IEnumerable<BlogComment> blogComments;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync();
                blogComments = await connection.QueryAsync<BlogComment>(
                    //BlogComment_GetAll is the name of the stored procedure
                    "BlogComment_GetAll",
                    //blogId is the parameter passed in 
                    // need to load it into the blog comment model object that has
                    // a BlogId Property ie getter and setter
                    new { BlogId = blogId },
                    commandType: CommandType.StoredProcedure);

            }

            return blogComments.ToList();
        }

        public async Task<BlogComment> GetAsync(int blogCommentId)
        {

            //Create a Photo to put the photo in
            BlogComment blogComment;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync();
                blogComment = await connection.QueryFirstOrDefaultAsync<BlogComment>(
                    //Call Blog Comment Stored Procedure
                    "BlogComment_Get",
                    //Insert the Blog Comment Id that was passed into the method
                    //blogCommentId is the parameter passed in 
                    // need to load it into the blogcomment model object that has
                    // a BlogCommentId Property ie getter and setter
                    new { BlogCommentId = blogCommentId },
                    commandType: CommandType.StoredProcedure);

            }

            return blogComment;
        }

        public async Task<BlogComment> UpsertAsync(BlogCommentCreate blogCommentCreate, int applicationUserId)
        {
            //Create a datatable and add the members of the blog comment create object created from
            //the model blogcommentcreate
            var dataTable = new DataTable();
            dataTable.Columns.Add("BlogCommentId", typeof(int));
            dataTable.Columns.Add("ParentBlogCommentId", typeof(int));
            dataTable.Columns.Add("BlogId", typeof(int));
            dataTable.Columns.Add("Content", typeof(string));

            //Insert the fields passed into the method into the BlogComment Data Table
            dataTable.Rows.Add(
                blogCommentCreate.BlogCommentId,
                blogCommentCreate.ParentBlogCommentId, 
                blogCommentCreate.BlogId, 
                blogCommentCreate.Content);

            int? newBlogCommentId;

            // Open a connection
            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                //If something goes wrong with .net core Identity cancel
                await connection.OpenAsync();

                newBlogCommentId = await connection.ExecuteScalarAsync<int>(
                    //Call the BlogComment Upsert Stored Procedure to upsert
                    "BlogComment_Upsert",
                    //Use the BlogComment type in the database to insert into the table
                    new { 
                        // Notice passing in a type instead of the name of the stored procedure
                        BlogComment = dataTable.AsTableValuedParameter("dbo.BlogCommentType"),
                        ApplicationUserId = applicationUserId

                    },
                    commandType: CommandType.StoredProcedure);

            }

            newBlogCommentId = newBlogCommentId ?? blogCommentCreate.BlogCommentId;
           BlogComment blogComment = await GetAsync(newBlogCommentId.Value);

            return blogComment;
        }
    }
}
