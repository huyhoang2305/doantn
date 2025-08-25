package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.dto.CustomerDto;
import vn.student.webbangiay.response.CustomerResponse;
import vn.student.webbangiay.model.Customer;
import vn.student.webbangiay.service.CustomerService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Create a new customer
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@RequestBody CustomerDto customerDto) {
        Customer createdCustomer = customerService.createCustomer(customerDto);
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(createdCustomer.getCustomerId());
        response.setFullName(createdCustomer.getFullName());
        response.setEmail(createdCustomer.getEmail());
        response.setPhone(createdCustomer.getPhone());
        response.setAddress(createdCustomer.getAddress());
        response.setAddress2(createdCustomer.getAddress2());
        response.setCity(createdCustomer.getCity());
        response.setIsActive(createdCustomer.getIsActive());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        List<CustomerResponse> responseList = customers.stream()
                .map(customer -> {
                    CustomerResponse response = new CustomerResponse();
                    response.setCustomerId(customer.getCustomerId());
                    response.setFullName(customer.getFullName());
                    response.setEmail(customer.getEmail());
                    response.setPhone(customer.getPhone());
                    response.setAddress(customer.getAddress());
                    response.setAddress2(customer.getAddress2());
                    response.setCity(customer.getCity());
                    response.setIsActive(customer.getIsActive());
                    return response;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // Get customer by ID
    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(customer.getCustomerId());
        response.setFullName(customer.getFullName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());
        response.setAddress(customer.getAddress());
        response.setAddress2(customer.getAddress2());
        response.setCity(customer.getCity());
        response.setIsActive(customer.getIsActive());
        return ResponseEntity.ok(response);
    }

    // Update a customer
    @PutMapping("/{customerId}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Integer customerId, @RequestBody CustomerDto customerDto) {
        Customer updatedCustomer = customerService.updateCustomer(customerId, customerDto);
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(updatedCustomer.getCustomerId());
        response.setFullName(updatedCustomer.getFullName());
        response.setEmail(updatedCustomer.getEmail());
        response.setPhone(updatedCustomer.getPhone());
        response.setAddress(updatedCustomer.getAddress());
        response.setAddress2(updatedCustomer.getAddress2());
        response.setCity(updatedCustomer.getCity());
        response.setIsActive(updatedCustomer.getIsActive());
        return ResponseEntity.ok(response);
    }

    // Delete a customer
    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{customerId}/toggle-status")
    public ResponseEntity<?> toggleCustomerStatus(@PathVariable Integer customerId) {
        try {
            Customer customer = customerService.toggleCustomerStatus(customerId);
            return ResponseEntity.ok(customer);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
