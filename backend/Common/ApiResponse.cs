using System.Collections.Generic;

namespace Yantrik.Common
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public IDictionary<string, string>? Errors { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
        {
            return new ApiResponse<T> { Success = true, Data = data, Message = message };
        }

        public static ApiResponse<T> FailureResponse(string message, IDictionary<string, string>? errors = null)
        {
            return new ApiResponse<T> { Success = false, Message = message, Errors = errors };
        }
        
        public static ApiResponse<T> FailureResponse(string message, string error)
        {
            return new ApiResponse<T> 
            { 
                Success = false, 
                Message = message, 
                Errors = new Dictionary<string, string> { { "General", error } } 
            };
        }
    }
}



