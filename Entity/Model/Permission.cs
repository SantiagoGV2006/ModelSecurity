using System.ComponentModel.DataAnnotations;

namespace Entity.Model
{
    public enum Permission
    {
        [Display(Name = "Create")]
        Neighbourhoods = 1,

        [Display(Name = "Read")]
        CreateNeighbourhoods = 2,

        [Display(Name = "Update")]
        EditNeighbourhoods = 3,

        [Display(Name = "Delete")]
        DeleteNeighbourhoods = 4,
    }
}