﻿namespace Entity.Model
{
    public class Module
    {

        public int Id { get; set; }
        public string Code { get; set; }
        public bool Active { get; set; }
        public DateTime CreateAt { get; set; }
        public DateTime DeleteAt { get; set; }

    }
}
