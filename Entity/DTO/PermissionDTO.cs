namespace Bussines
{
    public class PermissionDTO
    {
        public int Id { get; set; }
        public required string CanCreate { get; set; }
        public required string CanRead { get; set; }
        public required string CanUpdate { get; set; }
        public required string CanDelete { get; set; }
    }
}
