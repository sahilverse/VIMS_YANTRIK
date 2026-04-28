using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Yantrik.Common;
using Yantrik.DTOs;
using Yantrik.Interfaces;

namespace Yantrik.Controllers
{
    [Authorize(Roles = "Admin")]
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
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var response = await _inventoryService.GetAllCategoriesAsync();
            return Ok(response);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            var response = await _inventoryService.CreateCategoryAsync(request);
            return Ok(response);
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryRequest request)
        {
            var response = await _inventoryService.UpdateCategoryAsync(id, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var response = await _inventoryService.DeleteCategoryAsync(id);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }
        #endregion

        #region Parts
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

        [HttpPost("parts")]
        public async Task<IActionResult> CreatePart([FromBody] CreatePartRequest request)
        {
            var response = await _inventoryService.CreatePartAsync(request);
            return Ok(response);
        }

        [HttpPut("parts/{id}")]
        public async Task<IActionResult> UpdatePart(Guid id, [FromBody] CreatePartRequest request)
        {
            var response = await _inventoryService.UpdatePartAsync(id, request);
            if (!response.Success) return BadRequest(response);
            return Ok(response);
        }

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



