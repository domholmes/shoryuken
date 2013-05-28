using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Squirrel.Security;

namespace SquirrelUnitTests.Security
{
    [TestClass]
    public class GoogleUserTests
    {
        [TestMethod]
        public void IsValid_IdAndCode_IsValid()
        {
            var user = new GoogleUser()
            {
                Id = "plus001",
                AccessCode = "1110000"
            };

            Assert.IsTrue(user.IsValid);
        }

        [TestMethod]
        public void IsValid_CodeNull_IsValid()
        {
            var user = new GoogleUser()
            {
                Id = "plus001",
                AccessCode = null
            };

            Assert.IsTrue(user.IsValid);
        }

        [TestMethod]
        public void IsValid_CodeEmpty_IsValid()
        {
            var user = new GoogleUser()
            {
                Id = "plus001",
                AccessCode = ""
            };

            Assert.IsTrue(user.IsValid);
        }

        [TestMethod]
        public void IsValid_IdNull_IsNotValid()
        {
            var user = new GoogleUser()
            {
                Id = null,
                AccessCode = "1110000"
            };

            Assert.IsFalse(user.IsValid);
        }

        [TestMethod]
        public void IsValid_IdEmpty_IsNotValid()
        {
            var user = new GoogleUser()
            {
                Id = "",
                AccessCode = "1110000"
            };

            Assert.IsFalse(user.IsValid);
        }
    }
}
