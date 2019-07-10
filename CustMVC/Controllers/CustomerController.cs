using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CustMVC.Models;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CustMVC.Controllers
{
    [Route("api/Customer")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerContext _context;

        public CustomerController(CustomerContext context)
        {
            _context = context;

            if (_context.Customers.Count() == 0)
            {
                // Create a new if collection is empty,
                // which means you can't delete all.
                _context.Customers.Add(new Customer { FirstName = "Mickey", LastName="Mouse", PhoneNumber="123-456-7890", Email="abc@def.com", StartDate=DateTime.Now});
                _context.SaveChanges();
            }
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomerById(long id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        // POST
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer cust)
        {
            cust.StartDate = DateTime.Now;
            _context.Customers.Add(cust);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomers), new { id = cust.Id }, cust);
        }

        // PUT: api/Customer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(long id, Customer cust)
        {
            if (id != cust.Id)
            {
                return BadRequest();
            }

            _context.Entry(cust).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(long id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }


}
