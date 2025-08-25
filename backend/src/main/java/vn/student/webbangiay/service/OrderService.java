package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.webbangiay.config.VNPAYConfig;
import vn.student.webbangiay.dto.GuestDto;
import vn.student.webbangiay.dto.OrderDto;
import vn.student.webbangiay.dto.OrderItemDto;
import vn.student.webbangiay.model.Customer;
import vn.student.webbangiay.model.Guest;
import vn.student.webbangiay.model.Order;
import vn.student.webbangiay.model.OrderItem;
import vn.student.webbangiay.model.OrderStatus;
import vn.student.webbangiay.model.PaymentMethod;
import vn.student.webbangiay.model.ProductSize;
import vn.student.webbangiay.repository.CustomerRepository;
import vn.student.webbangiay.repository.GuestRepository;
import vn.student.webbangiay.repository.OrderRepository;
import vn.student.webbangiay.repository.OrderItemRepository;
import vn.student.webbangiay.repository.ProductSizeRepository;
import vn.student.webbangiay.response.OrderItemResponse;
import vn.student.webbangiay.response.OrderResponse;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Transactional
    public OrderResponse createOrder(int customerId, GuestDto guestDto, OrderDto orderDto, List<OrderItemDto> orderItemDtos) {
        Guest savedGuest = null;
        Customer customer = null;

        // Handle the case when customerId is provided
        if (customerId != 0) {
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));
        } else if (guestDto != null) {
            // Handle the case when guestDto is provided
            Guest guest = new Guest();
            guest.setFullName(guestDto.getFullName());
            guest.setEmail(guestDto.getEmail());
            guest.setPhone(guestDto.getPhone());
            guest.setAddress(guestDto.getAddress());
            guest.setAddress2(guestDto.getAddress2());
            guest.setCity(guestDto.getCity());
            guest.setCreatedAt(new Date());
            guest.setUpdatedAt(new Date());

            savedGuest = guestRepository.save(guest);
        } else {
            throw new IllegalArgumentException("Either customerId or guestDto must be provided");
        }

        // Generate Order ID based on current date and time (ddMMyyyyHHmmss)
        String orderId = generateOrderId();

        // Create Order entity and map from OrderDto
        Order order = new Order();
        order.setOrderId(orderId);
        order.setCustomer(customer); // Associate the customer if provided
        order.setGuest(savedGuest); // Associate the guest if provided
        order.setTotalPrice(calculateTotalPrice(orderItemDtos)); // Calculate total price
        order.setIsPaid(orderDto.isPaid());
        order.setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
        order.setOrderNote(orderDto.getOrderNote());
        order.setOrderStatus(OrderStatus.PROCESSING);
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());

        // Save the order to the database
        Order savedOrder = orderRepository.save(order);

        // Map and save order items from OrderItemDto
        List<OrderItem> orderItems = orderItemDtos.stream().map(orderItemDto -> {
            ProductSize productSize = productSizeRepository.findById(orderItemDto.getProductSizeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product size ID"));
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductSize(productSize);
            orderItem.setQuantity(orderItemDto.getQuantity());
            orderItem.setUnitPrice(orderItemDto.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        // Save all order items
        orderItemRepository.saveAll(orderItems);

        // Return an OrderResponse
        return mapOrderToResponse(savedOrder, savedGuest, customer);
    }

    private String generateOrderId() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMyyyyHHmmss");
        return dateFormat.format(new Date());
    }

    private long calculateTotalPrice(List<OrderItemDto> orderItemDtos) {
        return orderItemDtos.stream()
                .mapToLong(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    private OrderResponse mapOrderToResponse(Order savedOrder, Guest savedGuest, Customer customer) {
        // Map savedOrder to OrderResponse
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(savedOrder.getOrderId());
        orderResponse.setOrderNote(savedOrder.getOrderNote());
        orderResponse.setPaymentMethod(savedOrder.getPaymentMethod());
        orderResponse.setTotalPrice(savedOrder.getTotalPrice());
        orderResponse.setOrderStatus(savedOrder.getOrderStatus());
    
        // Map guest or customer information based on association
        if (savedGuest != null) {
            orderResponse.setGuestName(savedGuest.getFullName());
            orderResponse.setGuestEmail(savedGuest.getEmail());
            orderResponse.setGuestPhone(savedGuest.getPhone());
        }
        if (customer != null) {
            orderResponse.setCustomerName(customer.getFullName());
            orderResponse.setCustomerEmail(customer.getEmail());
            orderResponse.setCustomerPhone(customer.getPhone());
        }
    
        return orderResponse;
    }
    
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    // Explicitly pass null for customer when no customer exists for the order
                    return mapOrderToResponse(order, order.getGuest(), order.getCustomer());
                })
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    // Explicitly pass null for customer when no customer exists for the order
                    return mapOrderToResponse(order, order.getGuest(), order.getCustomer());
                })
                .orElse(null);
    }
    

    private OrderItemResponse mapOrderItemToResponse(OrderItem orderItem) {
        OrderItemResponse orderItemResponse = new OrderItemResponse();
        orderItemResponse.setProductName(orderItem.getProductSize().getProductColor().getProduct().getProductName()); 
                                                                                         
        orderItemResponse.setColorName(orderItem.getProductSize().getProductColor().getColorName()); 
                                                                                      
        orderItemResponse.setSizeValue(orderItem.getProductSize().getSizeValue());
                                                                                     
        orderItemResponse.setQuantity(orderItem.getQuantity());
        orderItemResponse.setUnitPrice(orderItem.getUnitPrice());
        return orderItemResponse;
    }

    public List<OrderItemResponse> getOrderItemsByOrderId(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        return orderItemRepository.findByOrder(order).stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public void deleteOrder(String orderId) {
        // Fetch the order by its ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
    
        // Delete all OrderItems associated with the order
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        if (!orderItems.isEmpty()) {
            orderItemRepository.deleteAll(orderItems);
        }
    
        // Delete the order
        orderRepository.delete(order);
    }
    

    @Transactional
    public OrderResponse updateOrder(String orderId, OrderDto orderDto) {
        Order order = orderRepository.findById(orderId)
                .orElse(null);
        if (order == null) {
            return null;
        }
        // Update fields as needed
        if (orderDto.getOrderNote() != null) {
            order.setOrderNote(orderDto.getOrderNote());
        }
        order.setIsPaid(orderDto.isPaid());
        order.setUpdatedAt(new java.util.Date());
        // Optionally update other fields (add as needed)
        Order savedOrder = orderRepository.save(order);
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }

     public String createVNPayPaymentUrl(String orderId, long amount) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VNPAYConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay nhận số tiền theo đơn vị VND * 100
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VNPAYConfig.vnp_Returnurl);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        // Sắp xếp params theo thứ tự key (quan trọng để tạo chữ ký)
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String value = params.get(fieldName);
            if (value != null && !value.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)).append('&');
                query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)).append('&');
            }
        }

        // Xóa ký tự '&' cuối cùng
        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        // Tạo chữ ký bảo mật
        String secureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return VNPAYConfig.vnp_PayUrl + "?" + query.toString();
    }
  
    public OrderResponse paidOrder(String orderId) {
        // Fetch the order by ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Update the order status
 
        order.setOrderStatus(OrderStatus.PAYMENT_CONFIRMED);
            order.setPaidAt(new Date());
            order.setIsPaid(true);

        // Save the updated order
        Order updatedOrder = orderRepository.save(order);

        // Return the updated order response
        return mapOrderToResponse(updatedOrder, updatedOrder.getGuest(), updatedOrder.getCustomer());
    }
}
