using System.ComponentModel.DataAnnotations;

public class AuthenticationRequest
{
    [StringLength(50)]
    public required string Email { get; set; }

    [StringLength(50)]
    public required string Password { get; set; }
}
