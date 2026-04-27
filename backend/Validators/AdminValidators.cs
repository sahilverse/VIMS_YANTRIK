using FluentValidation;
using Yantrik.DTOs;

namespace Yantrik.Validators
{
    public class CreateVendorRequestValidator : AbstractValidator<CreateVendorRequest>
    {
        public CreateVendorRequestValidator()
        {
            RuleFor(x => x.CompanyName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.ContactPerson).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        }
    }

    public class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
        }
    }

    public class CreatePartRequestValidator : AbstractValidator<CreatePartRequest>
    {
        public CreatePartRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.SKU).NotEmpty().MaximumLength(50);
            RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.CostPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.StockQuantity).GreaterThanOrEqualTo(0);
            RuleFor(x => x.CategoryId).NotEmpty();
        }
    }

    public class CreatePurchaseRequestValidator : AbstractValidator<CreatePurchaseRequest>
    {
        public CreatePurchaseRequestValidator()
        {
            RuleFor(x => x.VendorId).NotEmpty();
            RuleFor(x => x.Items).NotEmpty().WithMessage("At least one part must be included in the purchase");
            RuleForEach(x => x.Items).SetValidator(new CreatePurchaseItemRequestValidator());
        }
    }

    public class CreatePurchaseItemRequestValidator : AbstractValidator<CreatePurchaseItemRequest>
    {
        public CreatePurchaseItemRequestValidator()
        {
            RuleFor(x => x.PartId).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.UnitPrice).GreaterThan(0);
        }
    }

    public class UpdateStaffRequestValidator : AbstractValidator<UpdateStaffRequest>
    {
        public UpdateStaffRequestValidator()
        {
            RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Phone).NotEmpty();
        }
    }
}
