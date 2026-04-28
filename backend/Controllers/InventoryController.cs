using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        #region Categories
        [Authorize(Roles = "Admin,Staff,Customer")]
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var response = await _inventoryService.GetAllCategoriesAsync();
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            var response = await _inventoryService.CreateCategoryAsync(request);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryRequest request)
        {
            var response = await _inventoryService.UpdateCategoryAsync(id, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var response = await _inventoryService.DeleteCategoryAsync(id);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
        #endregion

        #region Parts
        [Authorize(Roles = "Admin,Staff,Customer")]
        [HttpGet("parts")]
        public async Task<IActionResult> GetParts([FromQuery] InventoryPaginationParams @params)
        {
            var response = await _inventoryService.GetPagedPartsAsync(@params);
            return Ok(response);
        }

        [HttpGet("parts/{id}")]
        public async Task<IActionResult> GetPart(Guid id)
        {
            var response = await _inventoryService.GetPartByIdAsync(id);
            if (!response.Success) return NotFound(response);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("parts")]
        public async Task<IActionResult> CreatePart([FromBody] CreatePartRequest request)
        {
            var response = await _inventoryService.CreatePartAsync(request);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("parts/{id}")]
        public async Task<IActionResult> UpdatePart(Guid id, [FromBody] CreatePartRequest request)
        {
            var response = await _inventoryService.UpdatePartAsync(id, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("parts/{id}")]
        public async Task<IActionResult> DeletePart(Guid id)
        {
            var response = await _inventoryService.DeletePartAsync(id);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpGet("parts/low-stock")]
        public async Task<IActionResult> GetLowStockParts()
        {
            var response = await _inventoryService.GetLowStockPartsAsync();
            return Ok(response);
        }
        #endregion
    }
}



