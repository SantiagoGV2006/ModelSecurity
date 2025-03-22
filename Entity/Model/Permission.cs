namespace Entity
{
    public class Permission
    {

        public int Id { get; set; }
        public required string CanCreate { get; set; }
        public required string CanRead { get; set; }
        public required string CanUpdate { get; set; }
        public required string CanDelete { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime DeleteAt { get; set; }

    }
}
