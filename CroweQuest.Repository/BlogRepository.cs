// using CroweQuest.Models.Blog;
// using Dapper;
// using Microsoft.Extensions.Configuration;
// using System;
// using System.Collections.Generic;
// using System.Data;
// using System.Data.SqlClient;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;

// namespace CroweQuest.Repository
// {
//     public class BlogRepository : IBlogRepository
//     {

//         //Iconfiguration allows access to appsettings.json
//         //to connect to the database DefaultConnection
//         private readonly IConfiguration _config;

//         public BlogRepository(IConfiguration config)
//         {
//             _config = config;
//         }

//         public async Task<int> DeleteAsync(int blogId)
//         {
//             int affectedRows = 0;

//             //Once we have type open a connection with sql server
//             //Establish connection with the database using the default connection
//             //string from appsettings.json
//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();

//                 affectedRows = await connection.ExecuteAsync(
//                     "Blog_Delete",
//                     new { BlogId = blogId },
//                     commandType: CommandType.StoredProcedure);

//             }

//             return affectedRows;

//         }

//         public async Task<PagedResults<Blog>> GetAllAsync(BlogPaging blogPaging)
//         {
//             var results = new PagedResults<Blog>();
//             // Open a connection
//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();
//                 using (var multi = await connection.QueryMultipleAsync("Blog_GetAll",
//                     new { 
//                         //calculate the offset
//                     Offset = (blogPaging.Page - 1) * blogPaging.PageSize,
//                     PageSize = blogPaging.PageSize
//                     },
//                     //read the first one
//                     commandType: CommandType.StoredProcedure))
//                 {
//                     results.Items = multi.Read<Blog>();

//                     //Stored procedure returns this, read the first one
//                     //SQL server results of stored procedure
//                     results.TotalCount = multi.ReadFirst<int>();
//                 }

//             }
//             return results;
//         }

//         public async Task<List<Blog>> GetAllByUserIdAsync(int applicationUserId)
//         {

//             //Create a list to put the blogs in
//             IEnumerable<Blog> blogs;

//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();
//                 blogs = await connection.QueryAsync<Blog>(
//                     "Blog_GetByUserId",
//                     new { ApplicationUserId = applicationUserId },
//                     commandType: CommandType.StoredProcedure);

//             }

//             return blogs.ToList();
//         }

//         public  async Task<List<Blog>> GetAllFamousAsync()
//         {

//             //Create a list to put the popular blogs in
//             IEnumerable<Blog> famousBlogs;

//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();
//                 famousBlogs = await connection.QueryAsync<Blog>(
//                     "Blog_GetAllFamous",
//                     new { },
//                     commandType: CommandType.StoredProcedure);

//             }

//             return famousBlogs.ToList();
//         }

//         public async Task<Blog> GetAsync(int blogId)
//         {
//             //Create a Blog to put the blog in
//             Blog blog;

//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();
//                blog = await connection.QueryFirstOrDefaultAsync<Blog>(
//                     "Blog_Get",
//                     new { BlogId = blogId },
//                     commandType: CommandType.StoredProcedure);

//             }

//             return blog;
//         }

//         public async Task<Blog> UpsertAsync(BlogCreate blogCreate, int applicationUserId)
//         {

//             var dataTable = new DataTable();
//             dataTable.Columns.Add("BlogId", typeof(int));
//             dataTable.Columns.Add("Title", typeof(string));
//             dataTable.Columns.Add("Content", typeof(string));
//             dataTable.Columns.Add("PhotoId", typeof(int));
//             //Add document Id here

//             dataTable.Rows.Add(blogCreate.BlogId, blogCreate.Title, blogCreate.Content, blogCreate.PhotoId);

//             int? newBlogId;
//             using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
//             {
//                 //If something goes wrong with .net core Identity cancel
//                 await connection.OpenAsync();
//                 newBlogId = await connection.ExecuteScalarAsync<int?>(
//                     "Blog_Upsert",
//                     new { Blog = dataTable.AsTableValuedParameter("dbo.BlogType"), applicationUserId = applicationUserId },
//                     commandType: CommandType.StoredProcedure
//                     );
//             }
//             //Update doesn't return anything back the
//             //insert returns a new blog id 
//             // Update grabs the orignal blogid, insert grabs the 
//             //new blogid
//             newBlogId = newBlogId ?? blogCreate.BlogId;

//             Blog blog = await GetAsync(newBlogId.Value);
//             return blog;
//         }
//     }
// }


using CroweQuest.Models.Blog;
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
    public class BlogRepository : IBlogRepository
    {
        private readonly IConfiguration _config;

        public BlogRepository(IConfiguration config)
        {
            _config = config;
        }

        public async Task<int> DeleteAsync(int blogId)
        {
            int affectedRows = 0;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                affectedRows = await connection.ExecuteAsync(
                    "Blog_Delete",
                    new { BlogId = blogId },
                    commandType: CommandType.StoredProcedure);
            }

            return affectedRows;
        }

        public async Task<PagedResults<Blog>> GetAllAsync(BlogPaging blogPaging)
        {
            var results = new PagedResults<Blog>();

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                using (var multi = await connection.QueryMultipleAsync("Blog_GetAll",
                    new { 
                        Offset = (blogPaging.Page - 1) * blogPaging.PageSize,
                        PageSize = blogPaging.PageSize
                    }, 
                    commandType: CommandType.StoredProcedure))
                {
                    results.Items = multi.Read<Blog>();

                    results.TotalCount = multi.ReadFirst<int>();
                }
            }

            return results;
        }

        public async Task<List<Blog>> GetAllByUserIdAsync(int applicationUserId)
        {
            IEnumerable<Blog> blogs;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                blogs = await connection.QueryAsync<Blog>(
                    "Blog_GetByUserId",
                    new { ApplicationUserId = applicationUserId },
                    commandType: CommandType.StoredProcedure);
            }

            return blogs.ToList();
        }

        public async Task<List<Blog>> GetAllFamousAsync()
        {
            IEnumerable<Blog> famousBlogs;

             string connectionSTring = _config.GetConnectionString("DefaultConnection");
            Console.WriteLine("**********************  " + connectionSTring + "   *****************");

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                famousBlogs = await connection.QueryAsync<Blog>(
                    "Blog_GetAllFamous",
                    new { },
                    commandType: CommandType.StoredProcedure);
            }

            return famousBlogs.ToList();
        }

        public async Task<Blog> GetAsync(int blogId)
        {
            Blog blog;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                blog = await connection.QueryFirstOrDefaultAsync<Blog>(
                    "Blog_Get",
                    new { BlogId = blogId },
                    commandType: CommandType.StoredProcedure);
            }

            return blog;
        }

        public async Task<Blog> UpsertAsync(BlogCreate blogCreate, int applicationUserId)
        {
            var dataTable = new DataTable();
            dataTable.Columns.Add("BlogId", typeof(int));
            dataTable.Columns.Add("Title", typeof(string));
            dataTable.Columns.Add("Content", typeof(string));
            dataTable.Columns.Add("PhotoId", typeof(int));

            dataTable.Rows.Add(blogCreate.BlogId, blogCreate.Title, blogCreate.Content, blogCreate.PhotoId);

            int? newBlogId;

            using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
            {
                await connection.OpenAsync();

                newBlogId = await connection.ExecuteScalarAsync<int?>(
                    "Blog_Upsert",
                    new { Blog = dataTable.AsTableValuedParameter("dbo.BlogType"), ApplicationUserId = applicationUserId },
                    commandType: CommandType.StoredProcedure
                    );
            }

            newBlogId = newBlogId ?? blogCreate.BlogId;

            Blog blog = await GetAsync(newBlogId.Value);

            return blog;
        }
    }
}
