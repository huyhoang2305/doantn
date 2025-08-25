package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.student.webbangiay.dto.CustomerDto;
import vn.student.webbangiay.dto.GuestDto;
import vn.student.webbangiay.dto.LoginUserDto;
import vn.student.webbangiay.dto.OrderDto;
import vn.student.webbangiay.dto.OrderItemDto;
import vn.student.webbangiay.dto.OrderRequestDto;
import vn.student.webbangiay.dto.RegisterDto;
import vn.student.webbangiay.exception.InvalidCredentialsException;
import vn.student.webbangiay.exception.ResourceNotFoundException;
import vn.student.webbangiay.model.Banner;
import vn.student.webbangiay.model.Customer;
import vn.student.webbangiay.model.Gender;
import vn.student.webbangiay.model.Guest;
import vn.student.webbangiay.model.Order;
import vn.student.webbangiay.response.CategoryResponse;
import vn.student.webbangiay.response.CustomerResponse;
import vn.student.webbangiay.response.OrderResponse;
import vn.student.webbangiay.response.ProductColorImageResponse;
import vn.student.webbangiay.response.ProductColorResponse;
import vn.student.webbangiay.response.ProductResponse;
import vn.student.webbangiay.response.ProductSizeResponse;
import vn.student.webbangiay.response.SubCategoryResponse;
import vn.student.webbangiay.service.BannerService;
import vn.student.webbangiay.service.CategoryService;
import vn.student.webbangiay.service.CustomerService;
import vn.student.webbangiay.service.OrderService;
import vn.student.webbangiay.service.ProductColorImageService;
import vn.student.webbangiay.service.ProductColorService;
import vn.student.webbangiay.service.ProductService;
import vn.student.webbangiay.service.ProductSizeService;
import vn.student.webbangiay.service.SubCategoryService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/home/")
public class HomeController {

    @Autowired
    private SubCategoryService subCategoryService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @Autowired
    private BannerService bannerService;

    @Autowired
    private ProductColorService productColorService;

    @Autowired
    private ProductSizeService productSizeService;

    @Autowired
    private ProductColorImageService productColorImageService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @GetMapping("/product-color/{productId}")
    public ResponseEntity<List<ProductColorResponse>> findByProductId(@PathVariable Integer productId) {
        List<ProductColorResponse> response = productColorService.findByProduct_ProductId(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        List<Banner> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(banners);
    }

    // Endpoint to get all categories
    @GetMapping("categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Endpoint to get subcategories based on categoryId and gender
    @GetMapping("subcategories")
    public ResponseEntity<List<SubCategoryResponse>> getSubCategories(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "gender", required = false) Gender gender) {

        List<SubCategoryResponse> subCategories = subCategoryService.getSubCategories(categoryId, gender);
        return ResponseEntity.ok(subCategories);
    }

        @GetMapping("products")
        public ResponseEntity<List<ProductResponse>> getAllProducts(
                @RequestParam(required = false) Integer subCategoryId,
                @RequestParam(required = false) Gender gender,
                @RequestParam(required = false) String productName) {

            // Fetch all products based on the provided filters
            List<ProductResponse> productResponses = productService.getAllProducts(subCategoryId, gender, productName);

            // Filter out products where isActive is false - only show active products to customers
            List<ProductResponse> activeProducts = productResponses.stream()
                    .filter(product -> product.getIsActive() != null && product.getIsActive()) // Check if product is active
                    .collect(Collectors.toList());

            return ResponseEntity.ok(activeProducts);
        }


    @GetMapping("product-size/product-color/{productColorId}")
    public ResponseEntity<List<ProductSizeResponse>> findByProductColorId(@PathVariable Integer productColorId) {
        List<ProductSizeResponse> response = productSizeService.findByProductColorId(productColorId);
        return ResponseEntity.ok(response);
    }

    // Get all images by Product Color ID
    @GetMapping("product-image/product-color/{productColorId}")
    public ResponseEntity<List<ProductColorImageResponse>> getImagesByProductColorId(
            @PathVariable Integer productColorId) {
        List<ProductColorImageResponse> productColorImages = productColorImageService
                .findByProductColorId(productColorId);
        return ResponseEntity.ok(productColorImages);
    }

    // Get product by ID
    @GetMapping("product/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        ProductResponse productResponse = productService.getProductById(productId);
        if (productResponse == null) {
            return ResponseEntity.notFound().build(); // Handle not found case
        }
        return ResponseEntity.ok(productResponse);
    }

    @PostMapping("orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        // Extract guest and order details from the request DTO
        GuestDto guestDto = orderRequestDto.getGuestDto();
        OrderDto orderDto = orderRequestDto.getOrderDto();
        int customerId = orderRequestDto.getCustomerId();
        List<OrderItemDto> orderItemDtos = orderRequestDto.getOrderItemDtos();

        OrderResponse orderResponse = orderService.createOrder(customerId, guestDto, orderDto, orderItemDtos);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("register")
    public ResponseEntity<Customer> register(@RequestBody RegisterDto registerDto) {
        try {
            Customer registeredCustomer = customerService.register(registerDto);
            return ResponseEntity.ok(registeredCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginUserDto loginDto) {
        try {
            String token = customerService.login(loginDto);
            return ResponseEntity.ok(token); // Return JWT token
        } catch (ResourceNotFoundException | InvalidCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }
    }

    @GetMapping("customer/{customerId}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        // Map the customer to a CustomerResponse
        CustomerResponse customerResponse = new CustomerResponse(
                customer.getCustomerId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getAddress2(),
                customer.getCity(),
                customer.getIsActive());

        return ResponseEntity.ok(customerResponse);
    }

    // Endpoint to get customer by email
    @GetMapping("customer/email/{email}")
    public ResponseEntity<CustomerResponse> getCustomerByEmail(@PathVariable("email") String email) {
        Customer customer = customerService.getCustomerByEmail(email);
        if (customer == null) {
            return ResponseEntity.notFound().build(); // Handle not found case
        }

        // Map the customer to a CustomerResponse
        CustomerResponse customerResponse = new CustomerResponse(
                customer.getCustomerId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getAddress2(),
                customer.getCity(),
                customer.getIsActive());

        return ResponseEntity.ok(customerResponse);
    }

      @PostMapping("/vnpay-payment")
    public ResponseEntity<?> createVNPayPayment(@RequestParam String orderId, @RequestParam long amount) {
        String paymentUrl = orderService.createVNPayPaymentUrl(orderId, amount);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> params) {
        String orderId = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");

        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công
            orderService.paidOrder(orderId);
            return ResponseEntity.ok("Thanh toán thành công! Đơn hàng #" + orderId + " đã được cập nhật.");
        } else {
            // Thanh toán thất bại
            return ResponseEntity.ok("Thanh toán không thành công! Vui lòng thử lại.");
        }
    }

}
