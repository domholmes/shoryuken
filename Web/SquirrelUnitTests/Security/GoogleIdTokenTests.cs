using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Squirrel.Security;

namespace SquirrelUnitTests.Security
{
    [TestClass]
    public class GoogleIdTokenTests
    {
        [TestMethod]
        public void ExtractUserId_ValidToken_CorrectIdExtracted()
        {
            string tokenContent = @"eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0OTYxYzI5MjI5ZDQ4NDBlODA3ZjEzOGI4NmMxOWQ3MmU0YWYwYTQifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Im4tMGdtTVpaamUxaEpjVlJXdFhjV2ciLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdWQiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6InRoZWNhcHNhaWNpbmtpZEBnbWFpbC5jb20iLCJhenAiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3MDkwOTA2NjA1NzAyMzkyOTIiLCJpYXQiOjEzNjk3NzQyOTQsImV4cCI6MTM2OTc3ODE5NH0.t_4k09Hk_nlefO1BYwko6SWf9baQXTYDvCla_tMM1FElwjYsfJDwuyb7LYimQicSFR9Bi_UritKYIDJWfCl2KJ8iw187jNwaZ95LeqXon12ifb-0VDkpxmbhPfaXa_zwSqM6Q--CslhRFdg--SizTu1cP3xoiA7sHF2OXA5oNd8";

            string userId = new GoogleIdToken(tokenContent).ExtractUserId();

            Assert.AreEqual("109709090660570239292", userId);
        }

        [TestMethod]
        [ExpectedException(typeof(FormatException))]
        public void ExtractUserId_InvalidToken_ExceptionThrown()
        {
            string tokenContent = @"eyJdddhbGciOiJSUzI1NiIsImtpZCI6IjY0OTYxYzI5MjI5ZDQ4NDBlODA3ZjEzOGI4NmMxOWQ3MmU0YWYdfhhwYTQifQ.eyJpc3MiOiJhY2NvdthsdfhdfhdW50cy5nb29nbGUuY29tIiwiYXRdhdghdghfaGFzaCI6Im4tMGdtTVpaamUxaEpjVlJXdFhjV2ciLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdWQiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6InRoZWNhcHNhaWNpbmtpZEBnbWFpbC5jb20iLCJhenAiOiI3MTQyNTA5MjY0MzEuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3MDkwOTA2NjA1NzAyMzkyOTIiLCJpYXQiOjEzNjk3NzQyOTQsImV4cCI6MTM2OTc3ODE5NH0.t_4k09Hk_nlefO1BYwko6SWf9baQXTYDvCla_tMM1FElwjYsfJDwuyb7LYimQicSFR9Bi_UritKYIDJWfCl2KJ8iw187jNwaZ95LeqXon12ifb-0VDkpxmbhPfaXa_zwSqM6Q--CslhRFdg--SizTu1cP3xoiA7sHF2OXA5oNd8";

            string userId = new GoogleIdToken(tokenContent).ExtractUserId();

            Assert.IsNull(userId);
        }
    }
}
