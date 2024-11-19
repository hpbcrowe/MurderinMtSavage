using CroweQuest.Models.Account;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BlogLab.Services
{
    public class TokenService : ITokenService
    {
        //This is the key
        private readonly SymmetricSecurityKey _key;
        //This is the issuer
        private readonly string  _issuer;


        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            _issuer = config["Jwt:Issuer"];

        }

        /*************
         * Jwt Token Creation
         * ******************/
        public string CreateToken(ApplicationUserIdentity user)
        {
            //List of claims
            var claims = new List<Claim>
           {
               new Claim(JwtRegisteredClaimNames.NameId, user.ApplicationUserId.ToString()),
               new Claim(JwtRegisteredClaimNames.UniqueName, user.Username)
           };

            //need to sign new key pass the key and then sign it cryptographically
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //create the parameters that will go into the function that creates the token
            //This takes care of the jwt token creation
            var token = new JwtSecurityToken(
                _issuer,
                _issuer,
                claims,
                //The user is signed on for 60 minutes
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
