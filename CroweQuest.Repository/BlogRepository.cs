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
        private const int MaxOpenAttempts = 3;

        public BlogRepository(IConfiguration config)
        {
            _config = config;
        }

        private static bool IsTransientSqlException(SqlException ex)
        {
            foreach (SqlError error in ex.Errors)
            {
                switch (error.Number)
                {
                    case 64:    // A connection was successfully established with the server, but then an error occurred during login process.
                    case 233:   // The client was unable to establish a connection.
                    case 4060:  // Cannot open database requested by the login.
                    case 40197: // The service has encountered an error processing your request.
                    case 40501: // The service is currently busy.
                    case 40613: // Database is not currently available.
                    case 49918:
                    case 49919:
                    case 49920:
                    case 10053:
                    case 10054:
                    case 10060:
                    case 10928:
                    case 10929:
                        return true;
                }
            }

            return false;
        }

        private async Task<SqlConnection> CreateOpenConnectionAsync()
        {
            for (var attempt = 1; attempt <= MaxOpenAttempts; attempt++)
            {
                var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

                try
                {
                    await connection.OpenAsync();
                    return connection;
                }
                catch (SqlException ex) when (IsTransientSqlException(ex) && attempt < MaxOpenAttempts)
                {
                    connection.Dispose();
                    await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                }
                catch
                {
                    connection.Dispose();
                    throw;
                }
            }

            throw new InvalidOperationException("Unable to open SQL connection after retry attempts.");
        }

        public async Task<int> DeleteAsync(int blogId)
        {
            int affectedRows = 0;

            using (var connection = await CreateOpenConnectionAsync())
            {
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

            using (var connection = await CreateOpenConnectionAsync())
            {
                using (var multi = await connection.QueryMultipleAsync("Blog_GetAll",
                    new
                    {
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

            using (var connection = await CreateOpenConnectionAsync())
            {
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

            //string connectionSTring = _config.GetConnectionString("DefaultConnection");
            //Console.WriteLine("**********************  " + connectionSTring + "   *****************");

            using (var connection = await CreateOpenConnectionAsync())
            {
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

            using (var connection = await CreateOpenConnectionAsync())
            {
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
            dataTable.Columns.Add("AncestorProfileId", typeof(int));
            dataTable.Columns.Add("SourceId", typeof(int));
            dataTable.Columns.Add("AncestorName", typeof(string));
            dataTable.Columns.Add("RecordType", typeof(string));
            dataTable.Columns.Add("Location", typeof(string));
            dataTable.Columns.Add("FamilyBranch", typeof(string));
            dataTable.Columns.Add("Tags", typeof(string));
            dataTable.Columns.Add("ConfidenceLevel", typeof(string));
            dataTable.Columns.Add("ResearchStatus", typeof(string));


            dataTable.Rows.Add(
                blogCreate.BlogId,
                blogCreate.Title,
                blogCreate.Content,
                blogCreate.PhotoId ?? (object)System.DBNull.Value,
                blogCreate.AncestorProfileId ?? (object)System.DBNull.Value,
                blogCreate.SourceId ?? (object)System.DBNull.Value,
                blogCreate.AncestorName ?? (object)System.DBNull.Value,
                blogCreate.RecordType ?? (object)System.DBNull.Value,
                blogCreate.Location ?? (object)System.DBNull.Value,
                blogCreate.FamilyBranch ?? (object)System.DBNull.Value,
                blogCreate.Tags ?? (object)System.DBNull.Value,
                blogCreate.ConfidenceLevel ?? (object)System.DBNull.Value,
                blogCreate.ResearchStatus ?? (object)System.DBNull.Value);

            int? newBlogId;

            using (var connection = await CreateOpenConnectionAsync())
            {
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
