using BlogLab.Services;
using CroweQuest.Identity;
using CroweQuest.Models.Account;
using CroweQuest.Models.Settings;
using CroweQuest.Repository;
using CroweQuest.Web.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CroweQuest.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get;}
        public Startup(IConfiguration config)
        {
            //Clear defaults
             JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
             Configuration = config;
        }


       

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Add Cloudinary service
            services.Configure<CloudinaryOptions>(Configuration.GetSection("CloudinaryOptions"));
            //services.AddRazorPages();
            //Add JWT token service
            //Using scoped same within a request, but different within different requests(users)
            services.AddScoped<ITokenService, TokenService>();
            //Add Photo Service
            services.AddScoped<IPhotoService, PhotoService>();
            //Add the repositories
            services.AddScoped<IBlogRepository, BlogRepository>();
            services.AddScoped<IBlogCommentRepository, BlogCommentRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();

            //Hook into Asp.core Identity
            services.AddIdentityCore<ApplicationUserIdentity>(opt =>
            {
                //Don't require special characters
                opt.Password.RequireNonAlphanumeric = false;
            })
                .AddUserStore<UserStore>()
                .AddDefaultTokenProviders()
                .AddSignInManager<SignInManager<ApplicationUserIdentity>>();
            services.AddControllers();
            services.AddCors();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
                .AddJwtBearer
                (
                    options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.SaveToken = true;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = Configuration["Jwt:Issuer"],
                            ValidAudience = Configuration["Jwt:Issuer"],
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                            ClockSkew = TimeSpan.Zero
                        };
                    }
                );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }
            app.ConfigureExceptionHandler();

            //app.UseStaticFiles();

            app.UseRouting();

             
            //app.UseAuthorization();

          
            
          

            app.UseAuthentication();
            app.UseAuthorization();
            
              //Security feature, malicious website can't run script on this website
             //moved this to before UseAuthoriztion() instead of after it. This if else
             //was after UseAuthorization()
            if (env.IsDevelopment())
            {
                app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            }
            else
            {
                app.UseCors();
            }
            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
