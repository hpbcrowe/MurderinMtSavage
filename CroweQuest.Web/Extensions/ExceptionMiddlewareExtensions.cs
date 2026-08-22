using CroweQuest.Models.Exception;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CroweQuest.Web.Extensions
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app)
        {
            var env = app.ApplicationServices.GetService(typeof(IHostEnvironment)) as IHostEnvironment;
            var loggerFactory = app.ApplicationServices.GetService(typeof(ILoggerFactory)) as ILoggerFactory;
            var logger = loggerFactory?.CreateLogger("GlobalException");

            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        logger?.LogError(
                            contextFeature.Error,
                            "Unhandled exception for {Method} {Path}. TraceId: {TraceId}",
                            context.Request.Method,
                            context.Request.Path,
                            context.TraceIdentifier);

                        bool includeDetails = env != null && env.IsDevelopment();

                        await context.Response.WriteAsync(new ApiException()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = includeDetails ? contextFeature.Error.Message : "Internal Server Error",
                            Path = context.Request.Path,
                            TraceId = context.TraceIdentifier,
                            Source = contextFeature.Error.Source,
                            Detail = includeDetails ? contextFeature.Error.ToString() : null

                        }.ToString());
                    }
                });
            });
        }
    }
}
