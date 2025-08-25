package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.student.webbangiay.dto.CustomerDto;
import vn.student.webbangiay.dto.LoginUserDto;
import vn.student.webbangiay.dto.RegisterDto;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Customer;
import vn.student.webbangiay.model.Role;
import vn.student.webbangiay.repository.CustomerRepository;
import vn.student.webbangiay.repository.OrderRepository;

import java.util.List;
import java.util.Date;

import vn.student.webbangiay.exception.InvalidCredentialsException;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private OrderRepository orderRepository;
    // Create a new customer
    public Customer createCustomer(CustomerDto customerDto) {
        Customer customer = new Customer();
        customer.setFullName(customerDto.getFullName());
        customer.setEmail(customerDto.getEmail());
        
        // If password is provided, use it; otherwise set default password "123456"
        String password = customerDto.getHashPassword();
        if (password == null || password.trim().isEmpty()) {
            password = "123456";
        }
        customer.setHashPassword(passwordEncoder.encode(password));
        
        customer.setEmailConfirmed(false); // Default to false, or set as needed
        customer.setPhone(customerDto.getPhone());
        customer.setAddress(customerDto.getAddress());
        customer.setAddress2(customerDto.getAddress2());
        customer.setCity(customerDto.getCity());
        customer.setCreatedAt(new Date());
        customer.setUpdatedAt(new Date());
        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }


      // Get customer by email
      public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with email: " + email));
    }
    // Get customer by ID
    public Customer getCustomerById(Integer customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
    }

    // Update a customer
    public Customer updateCustomer(Integer customerId, CustomerDto customerDto) {
        Customer existingCustomer = getCustomerById(customerId);
        existingCustomer.setFullName(customerDto.getFullName());
        existingCustomer.setEmail(customerDto.getEmail());
        
        // Only update password if a new one is provided
        if (customerDto.getHashPassword() != null && !customerDto.getHashPassword().trim().isEmpty()) {
            existingCustomer.setHashPassword(passwordEncoder.encode(customerDto.getHashPassword()));
        }
        // If no password provided, keep the existing password
        
        existingCustomer.setPhone(customerDto.getPhone());
        existingCustomer.setAddress(customerDto.getAddress());
        existingCustomer.setAddress2(customerDto.getAddress2());
        existingCustomer.setCity(customerDto.getCity());
        existingCustomer.setUpdatedAt(new Date());
        return customerRepository.save(existingCustomer);
    }

    // Delete a customer
    public void deleteCustomer(Integer customerId) {
        Customer existingCustomer = getCustomerById(customerId);
        customerRepository.delete(existingCustomer);
    }

     public Customer register(RegisterDto registerDto) {
        if (customerRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        Customer newCustomer = new Customer();
        newCustomer.setFullName(registerDto.getFullName());
        newCustomer.setEmail(registerDto.getEmail());
        newCustomer.setHashPassword(passwordEncoder.encode(registerDto.getPassword()));
        newCustomer.setEmailConfirmed(false); // Default to false
        newCustomer.setPhone(registerDto.getPhone());
        newCustomer.setAddress(registerDto.getAddress());
        newCustomer.setAddress2(registerDto.getAddress2());
        newCustomer.setCity(registerDto.getCity());
        newCustomer.setCreatedAt(new Date());
        newCustomer.setUpdatedAt(new Date());
        return customerRepository.save(newCustomer);
    }

    // Login functionality
    public String login(LoginUserDto loginDto) {
        Customer customer = customerRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginDto.getEmail()));

        if (!passwordEncoder.matches(loginDto.getPassword(), customer.getHashPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        // Generate JWT token
        return jwtService.generateToken(customer, Role.CUSTOMER);
    }

    public Customer toggleCustomerStatus(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        // Nếu đang active và muốn deactivate, kiểm tra xem có đơn hàng nào không
        if (customer.getIsActive() && hasOrders(customerId)) {
            throw new IllegalStateException("Không thể ngừng hoạt động khách hàng này vì đang có đơn hàng!");
        }

        customer.setIsActive(!customer.getIsActive());
        customer.setUpdatedAt(new Date());
        return customerRepository.save(customer);
    }

    private boolean hasOrders(Integer customerId) {
        return orderRepository.countByCustomerCustomerId(customerId) > 0;
    }
}
