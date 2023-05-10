using API.Data;
using API.DTOs;
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
    public class BasketController : ControllerBase
    {

        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }


        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }

     


        [HttpPost]  //-- api/basket?productId=4&quantity=2
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            //--get basket
            var basket = await RetrieveBasket();

            //--create basket
            if (basket == null)
            {
               basket = CreateBasket();
            }

            //--get product by id
            var product = await _context.Products.FindAsync(productId);

            //--checking if productId is null
            if (product == null) return BadRequest(new ProblemDetails { Title= "Product not found" });

            // adding item to basket
            basket.AddItem(product, quantity);

            //--save changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });  
        }



        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //--get basket
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            //--remove item || reduce quantity
            basket.RemoveItem(productId, quantity);

            //--save changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }


        //---a method to retrieve basket
        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }


        //---a method to create new basket
        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            { 
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30),
                HttpOnly = false,
                SameSite = SameSiteMode.None,
                Secure = true
            };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{ BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket; 
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}   
