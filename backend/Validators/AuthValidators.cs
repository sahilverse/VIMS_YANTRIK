using FluentValidation;
using Yantrik.DTOs;
using Yantrik.Entities;

namespace Yantrik.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required")
                .MaximumLength(200).WithMessage("Full Name cannot exceed 200 characters");
        }
    }

    public class StaffRegisterRequestValidator : AbstractValidator<StaffRegisterRequest>
    {
        public StaffRegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required");

            RuleFor(x => x.Role)
                .Must(x => x == UserRole.Staff || x == UserRole.Admin)
                .WithMessage("Role must be either Staff or Admin");
        }
    }

    public class CustomerWithVehicleRegisterRequestValidator : AbstractValidator<CustomerWithVehicleRegisterRequest>
    {
        public CustomerWithVehicleRegisterRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Customer name is required");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required");

            RuleFor(x => x.Email)
                .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
                .WithMessage("Invalid email format");

            RuleFor(x => x.PlateNumber)
                .NotEmpty().WithMessage("Vehicle Plate Number is required");

            RuleFor(x => x.Make)
                .NotEmpty().WithMessage("Vehicle Make is required");
        }
    }

    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}
