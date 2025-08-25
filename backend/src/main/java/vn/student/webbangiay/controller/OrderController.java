package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.webbangiay.response.OrderItemResponse;
import vn.student.webbangiay.response.OrderResponse;
import vn.student.webbangiay.service.OrderService;
import vn.student.webbangiay.dto.OrderRequestDto;
import vn.student.webbangiay.dto.GuestDto;
import vn.student.webbangiay.dto.OrderDto;
import vn.student.webbangiay.dto.OrderItemDto;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Get all orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }


    // Create a new order (fixed to use OrderRequestDto)
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        GuestDto guestDto = orderRequestDto.getGuestDto();
        OrderDto orderDto = orderRequestDto.getOrderDto();
        int customerId = orderRequestDto.getCustomerId();
        java.util.List<OrderItemDto> orderItemDtos = orderRequestDto.getOrderItemDtos();
        OrderResponse createdOrder = orderService.createOrder(customerId, guestDto, orderDto, orderItemDtos);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    // Update an existing order (stub, implement service logic as needed)
    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable String orderId, @RequestBody OrderDto orderDto) {
        // TODO: Implement updateOrder in OrderService to handle updating order fields
        OrderResponse updatedOrder = orderService.updateOrder(orderId, orderDto);
        if (updatedOrder != null) {
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        OrderResponse orderResponse = orderService.getOrderById(orderId);
        if (orderResponse != null) {
            return new ResponseEntity<>(orderResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
      // Get order items by order ID
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(@PathVariable String orderId) {
        try {
            List<OrderItemResponse> orderItems = orderService.getOrderItemsByOrderId(orderId);
            if (orderItems != null && !orderItems.isEmpty()) {
                return new ResponseEntity<>(orderItems, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Order not found
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // General error
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
