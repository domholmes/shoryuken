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
    public class GoogleSignInCallbackHandlerTests
    {
        //[TestMethod]
        //public void LoginUser_ValidUser_ReturnsTrueCallsCreateUserCallsSetCookie()
        //{
        //    // Input            
        //    string authCode = "authCode";
            
        //    // Mock
        //    var stubAuthService = MockRepository.GenerateStub<GoogleAuthService>();
        //    var mockUserCreator = MockRepository.GenerateMock<UserCreator>();
        //    var mockFormsAuth = MockRepository.GenerateMock<FormsAuthenticator>();
        //    var stubValidUser = MockRepository.GenerateStub<GoogleUser>();
        //    stubValidUser.Stub(u => u.IsValid).Return(true);
        //    stubValidUser.Id = "gplusid001";
        //    stubAuthService.Stub(a => a.GetAuthenticatedUser(authCode)).Return(stubValidUser);

        //    // Execute
        //    bool result = new GoogleSignInCallbackHandler(stubAuthService, mockUserCreator, mockFormsAuth)
        //        .LoginUser(authCode);

        //    // Assert
        //    Assert.IsTrue(result);

        //    mockUserCreator.AssertWasCalled(u => u.CreateUserIfDoesntExist(stubValidUser));
        //    mockFormsAuth.AssertWasCalled(a => a.SetAuthCookie(stubValidUser.Id));
        //}

        //[TestMethod]
        //public void LoginUser_InvalidUser_ReturnsFalseDoesNotCallCreateUserOrSetCookie()
        //{
        //    // Input            
        //    string authCode = "authCode";

        //    // Mock
        //    var stubAuthService = MockRepository.GenerateStub<GoogleAuthService>();
        //    var mockUserCreator = MockRepository.GenerateMock<UserCreator>();
        //    var mockFormsAuth = MockRepository.GenerateMock<FormsAuthenticator>();
        //    var stubValidUser = MockRepository.GenerateStub<GoogleUser>();
        //    stubValidUser.Stub(u => u.IsValid).Return(false);
        //    stubValidUser.Id = "gplusid001";
        //    stubAuthService.Stub(a => a.GetAuthenticatedUser(authCode)).Return(stubValidUser);

        //    // Execute
        //    bool result = new GoogleSignInCallbackHandler(stubAuthService, mockUserCreator, mockFormsAuth)
        //        .LoginUser(authCode);

        //    // Assert
        //    Assert.IsFalse(result);

        //    mockUserCreator.AssertWasNotCalled(u => u.CreateUserIfDoesntExist(Arg<GoogleUser>.Is.Anything));
        //    mockFormsAuth.AssertWasNotCalled(a => a.SetAuthCookie(Arg<string>.Is.Anything));
        //}
    }
}
