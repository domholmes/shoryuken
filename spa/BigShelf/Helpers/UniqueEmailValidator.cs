using System.ComponentModel.DataAnnotations;
using System.Linq;
using BigShelf.Models;

namespace BigShelf.Helpers
{
    public static class UniqueEmailValidator
    {
        public static ValidationResult Validate(string emailAddress, ValidationContext context)
        {
            bool isValid;

            int id = ((BigShelf.Models.Profile)(context.ObjectInstance)).Id;
            BigShelfEntities bse = new BigShelfEntities();


            if (bse.Profiles.Where(p => p.Id == id && p.EmailAddress == emailAddress).Count() == 1)
            {
                //Email is the same as the one in the database for this user
                isValid = true;
            }
            else
            {
                isValid = bse.Profiles.Where(p => p.EmailAddress == emailAddress).Count() == 0;
            }

            if (isValid)
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult("The email address is already taken by another user");
            }
        }
    }
}