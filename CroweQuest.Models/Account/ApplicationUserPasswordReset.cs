/**********************************
 *  MODEL TO RESET A PASSWORD
 *  VALIDATES THE ACCOUNT OWNER BY USERNAME AND EMAIL
 * **********************************/

using System.ComponentModel.DataAnnotations;

namespace CroweQuest.Models.Account
{
    public class ApplicationUserPasswordReset
    {
        [Required(ErrorMessage = "Username is Required")]
        [MinLength(5, ErrorMessage = "Must Be At Least 5 Characters")]
        [MaxLength(20, ErrorMessage = "Cannot Be More Than 20 Characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is Required")]
        [MaxLength(30, ErrorMessage = "No More Than Thirty Characters Are Allowed")]
        [EmailAddress(ErrorMessage = "Invalid Email Format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is Required")]
        [MinLength(10, ErrorMessage = "Must Be At Least 10 Characters")]
        [MaxLength(50, ErrorMessage = "Cannot Be More Than 50 Characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password is Required")]
        [Compare(nameof(Password), ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }
    }
}