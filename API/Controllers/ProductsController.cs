using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _context;

        public ProductsController(StoreContext context)
        {
             _context = context;
        }

        [HttpGet]
        public async  Task<ActionResult<List<Product>>> GetProducts()
        {
            // var products = await context.Products.ToList();
            return await _context.Products.ToListAsync();
             
            //return Ok(products);
        }

        [HttpGet("{id}")]  // e.g api/products/2
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;

        }

    }
}
