using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using TechnicalTaskQaA_API.Controllers;
using TechnicalTaskQaA_API.Data;
using TechnicalTaskQaA_API.ModelsAPI;
using TechnicalTaskQaA_API.Services;

namespace TechnicalTaskQaA_API.Tests
{
    [TestClass]
    public class AuthenticationTests
    {
        private DbContextOptions<AppDbContext_API> _contextOptions;

        [TestInitialize]
        public void Setup()
        {
            _contextOptions = new DbContextOptionsBuilder<AppDbContext_API>()
                .UseInMemoryDatabase(databaseName: "InMemoryDatabase")
                .Options;
        }

        [TestMethod]
        public void SignUp_ReturnsOkResult()
        {
            // Arrange
            var context = new AppDbContext_API(_contextOptions);
            var jwtService = new JWTService();

            var controller = new AuthenticationController(context, jwtService);

            var userModel = new UserDto
            {
                Name = "TestUser",
                Nickname = "TestNickname",
                PasswordHash = "TestPassword"
            };

            // Act
            var result = controller.SignUp(userModel);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<User>));

            var objectResult = result as ActionResult<User>;
            Assert.IsNotNull(objectResult);
            Assert.IsInstanceOfType(objectResult.Result, typeof(OkObjectResult));

            var okObjectResult = objectResult.Result as OkObjectResult;
            Assert.AreEqual(200, okObjectResult.StatusCode);

            using (var dbContext = new AppDbContext_API(_contextOptions))
            {
                var createdUser = dbContext.Users.FirstOrDefault(u => u.Nickname == "TestNickname");
                Assert.IsNotNull(createdUser);
                Assert.AreEqual("TestUser", createdUser.Name);
            }
        }

        [TestMethod]
        public void SignIn_InvalidCredentials_ReturnsBadRequest()
        {
            // Arrange
            var context = new AppDbContext_API(_contextOptions);
            var jwtService = new JWTService();

            var controller = new AuthenticationController(context, jwtService);
            var sampleUser = new User { Id = 1, Name = "TestUser", Nickname = "TestNickname", PasswordHash = BCrypt.Net.BCrypt.HashPassword("TestPassword") };
            context.Users.Add(sampleUser);
            context.SaveChanges();

            var signInModel = new UserSignIn
            {
                Nickname = "TestNickname",
                PasswordHash = "InvalidPassword"
            };

            // Act
            var result = controller.SignIn(signInModel);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<User>));

            var actionResult = result as ActionResult<User>;
            Assert.IsNotNull(actionResult);

            var objectResult = actionResult.Result as ObjectResult;
            Assert.IsNotNull(objectResult);

            Assert.AreEqual(400, objectResult.StatusCode);

            var errorMessage = objectResult.Value.ToString();
            StringAssert.Contains(errorMessage, "Invalid Password");
        }
    }
}
