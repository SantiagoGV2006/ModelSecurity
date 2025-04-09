using Microsoft.EntityFrameworkCore;
using Entity.Model;

namespace Entity.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets actuales
        public DbSet<User> Users { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<RolUser> RolUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔗 Configuración explícita de la tabla pivote RolUser (muchos a muchos)
            modelBuilder.Entity<RolUser>()
                .HasKey(ru => ru.Id); // O podrías usar UserId + RolId como clave compuesta si prefieres

            modelBuilder.Entity<RolUser>()
                .HasOne(ru => ru.User)
                .WithMany(u => u.RolUser)
                .HasForeignKey(ru => ru.UserId);

            modelBuilder.Entity<RolUser>()
                .HasOne(ru => ru.Rol)
                .WithMany(r => r.RolUser)
                .HasForeignKey(ru => ru.RolId);
        }
    }
}
