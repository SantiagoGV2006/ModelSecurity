using System;
using Microsoft.VisualBasic;

namespace Entity.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreateAt { get; set; } 
        public DateTime DeleteAt { get; set; }

    }
}
