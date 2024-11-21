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
            //Clear() default claim types such as given name, gender and 
            //We will creating our own: applicationUserId and username
            //applicationUserId and username will be our own claim type and claim key
             JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
             Configuration = config;
        }


       

        // This method gets called by the runtime. Use this method to add services to the container.
        //
        /**************************************************************
         * CONFIGURE SERVICES METHOD
         * Declaration of this method is not mandatory in startup class.
         * This method is used to configure services that are used by the app.
         * When the application is requested for the first time, it calls the Configure Services
         * Method. This Method must be declared with a public access modifier. so that environment
         * will be able to read the content from the metadata
         * 
         */
      
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
            services.AddIdentityCore<ApplicationUserIdentity>(options =>
            {
                //Don't require special characters
                options.Password.RequireNonAlphanumeric = false;
            })
                .AddUserStore<UserStore>()

                .AddDefaultTokenProviders()
                .AddSignInManager<SignInManager<ApplicationUserIdentity>>();
            services.AddControllers();
            //CORS
            services.AddCors();
            //currently jwtbearer 3.1.10
            //Creating data that will be used to create token
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
                            //See token service
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                            ClockSkew = TimeSpan.Zero
                        };
                    }
                );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /**********************************************
         * Configure Method:
         * This method is used to define how the application will respond on each
         * HTTP request. ie we can can control the ASP.net pipelin. This method is also used
         * to configure middleware in HTTP pipeline
         * This method accept IApplicationBuilder as a parameter.
         * This method may accept some optional parameter such as Ihosting environment
         * and Iloggerfactory (used for logging errors etc) When any service is added to configureservices method
         * it is available to use in this method.
         * ************************************/
        //THE FOLLOWING ITEMS IN CONFIGURE ARE ALL MIDDLEWARE
        // All of the app.UseDeveloperExceptionPage();  app.UseRouting();  app.UseAuthentication();
        // MIDDLEWARE
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
                //Might need to change the below 
                //you need to provide it with the types of headers, origin or methods that we will allow
                // to allow =>  app.UseCors(options => options.WithOrigins("https://ourwebsite.com"));
                app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            }
            
            //Enable controllers use
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
