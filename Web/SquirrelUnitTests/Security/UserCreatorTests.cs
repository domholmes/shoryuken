using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Squirrel.Security;
using Rhino.Mocks;

namespace SquirrelUnitTests.Security
{
    [TestClass]
    public class UserCreatorTests
    {
        [TestMethod]
        public void CreateUser_NameDoesntExist_NewUserCreated()
        {
            // Input
            var user = new GoogleUser()
            {
                Id = "plususer001",
                AccessCode = "code001"
            };
            
            // Mock
            var stubApiService = MockRepository.GenerateStub<GoogleApiService>();

            new UserCreator().CreateUserIfDoesntExist(user);
        }
    }
}
