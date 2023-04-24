using API.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
              // 
        }

        // Db context for products
        public DbSet<Product> Products { get; set; }

        // Db context for baskets
        public DbSet<Basket> Baskets { get; set; }
      
    }
}
