using System.Linq;
using System.Web.Http;
using System.Web.Http.Data.EntityFramework;
using System.Web.Security;
using BigShelf.Models;

namespace BigShelf.Controllers
{
    public enum Sort
    {
        None,
        Title,
        Author,
        Rating,
        MightRead
    }

    // Todo: For all service method exposed here, add logic to ensure a user cannot modify another user's data

    [Authorize]
    public class BigShelfController : DbDataController<BigShelfEntities>
    {
        public IQueryable<Book> GetBooksForSearch(string profileIds, Sort sort, bool sortAscending)
        {
            // TODO: WebAPI doesn't support int[] in url?
            int[] profileIdInts = null;
            if (profileIds != null)
            {
                profileIdInts = profileIds.Split(',').Select(p => int.Parse(p)).ToArray();
            }

            IQueryable<Book> booksQuery = this.DbContext.Books;
            if (profileIds != null && profileIds.Length > 0)
            {
                // apply any profile ID filter
                booksQuery = booksQuery.Where(p => p.FlaggedBooks.Any(q => profileIdInts.Contains(q.ProfileId)));
            }

            return this.ApplyOrderBy(booksQuery, sort, sortAscending);
        }

        private IQueryable<Book> ApplyOrderBy(IQueryable<Book> booksQuery, Sort sort, bool sortAscending)
        {
            switch (sort)
            {
                case Sort.Title:
                    return sortAscending ? booksQuery.OrderBy(book => book.Title) : booksQuery.OrderByDescending(book => book.Title);
                case Sort.Author:
                    return sortAscending ? booksQuery.OrderBy(book => book.Author) : booksQuery.OrderByDescending(book => book.Author);
                case Sort.Rating:
                case Sort.MightRead:
                    // Non-Flagged books are always sorted to the end. Rated books sort based on
                    // their rating. Flagged books are sorted to the top for 'MightRead', and immediately
                    // after already rated books for 'Rating'.
                    int flaggedBookWeight = sort == Sort.Rating ? 0 : 6;
                    int authenticatedProfileId = this.GetUser().Id;

                    return
                        from book in booksQuery
                        let flaggedBook = book.FlaggedBooks.Where(p => p.ProfileId == authenticatedProfileId).FirstOrDefault()
                        let weighting = flaggedBook == null ? -1 : (flaggedBook.IsFlaggedToRead != 0 ? flaggedBookWeight : flaggedBook.Rating)
                        orderby sortAscending ? weighting : -weighting
                        select book;
                case Sort.None:
                default:
                    return booksQuery;
            }
        }

        public IQueryable<FlaggedBook> GetFlaggedBooksForUser() {
            int authenticatedProfileId = this.GetUser().Id;
            return this.DbContext.FlaggedBooks.Where(f => f.ProfileId == authenticatedProfileId);
        }

        public void InsertFlaggedBook(FlaggedBook entity)
        {
            entity.IsFlaggedToRead = entity.Rating == 0 ? 1 : 0;
            this.InsertEntity(entity);
        }

        public void UpdateFlaggedBook(FlaggedBook entity)
        {
            entity.IsFlaggedToRead = entity.Rating == 0 ? 1 : 0;
            this.UpdateEntity(entity);
        }

        public void DeleteFlaggedBook(FlaggedBook entity)
        {
            this.DeleteEntity(entity);
        }

        public IQueryable<Friend> GetFriends()
        {
            return this.DbContext.Friends;
        }

        public void InsertFriend(Friend entity)
        {
            this.InsertEntity(entity);
        }

        public void UpdateFriend(Friend entity)
        {
            this.UpdateEntity(entity);
        }

        public void DeleteFriend(Friend entity)
        {
            this.DeleteEntity(entity);
        }

        public IQueryable<Profile> GetProfiles()
        {
            return this.DbContext.Profiles;
        }

        public Profile GetProfileForSearch()
        {
            var authenticatedProfileId = this.GetUser().Id;
            return this.DbContext.Profiles.Include("Friends.FriendProfile").Include("FlaggedBooks").Single(p => p.Id == authenticatedProfileId);
        }

        public Profile GetProfileForProfileUpdate()
        {
            var authenticatedProfileId = this.GetUser().Id;
            return this.DbContext.Profiles.Include("Friends.FriendProfile").Single(p => p.Id == authenticatedProfileId);
        }

        private Profile GetUser()
        {
            string userName = this.ActionContext.ControllerContext.Request.GetUserPrincipal().Identity.Name;
            return this.DbContext.Profiles.Single(p => p.AspNetUserGuid == userName);
        }

        public void InsertProfile(Profile entity)
        {
            this.InsertEntity(entity);
        }

        public void UpdateProfile(Profile entity)
        {
            this.UpdateEntity(entity);
        }

        public void DeleteProfile(Profile entity)
        {
            this.DeleteEntity(entity);
        }
    }
}