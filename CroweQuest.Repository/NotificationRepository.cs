using CroweQuest.Models.Genealogy;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CroweQuest.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly IConfiguration _config;

        public NotificationRepository(IConfiguration config)
        {
            _config = config;
        }

        private SqlConnection CreateConnection() => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        public async Task<List<Notification>> GetAllByApplicationUserIdAsync(int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            var notifications = await connection.QueryAsync<Notification>(
                "Notification_GetByApplicationUserId",
                new { ApplicationUserId = applicationUserId },
                commandType: CommandType.StoredProcedure);

            return notifications.ToList();
        }

        public async Task<int> MarkAllAsReadAsync(int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "Notification_MarkAllRead",
                new { ApplicationUserId = applicationUserId },
                commandType: CommandType.StoredProcedure);
        }

        public async Task<int> MarkAsReadAsync(int notificationId, int applicationUserId)
        {
            using var connection = CreateConnection();
            await connection.OpenAsync();

            return await connection.ExecuteAsync(
                "Notification_MarkRead",
                new { NotificationId = notificationId, ApplicationUserId = applicationUserId },
                commandType: CommandType.StoredProcedure);
        }
    }
}