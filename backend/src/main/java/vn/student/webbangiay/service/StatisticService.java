package vn.student.webbangiay.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vn.student.webbangiay.model.*;
import vn.student.webbangiay.repository.*;

import java.util.*;

@Service
public class StatisticService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BannerRepository bannerRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Get today's revenue and item statistics
    public Map<String, Object> getStatisticsToday() {
        try {
            Calendar today = Calendar.getInstance();
            int year = today.get(Calendar.YEAR);
            int month = today.get(Calendar.MONTH) + 1; // Months are 0-based in Calendar
            int day = today.get(Calendar.DAY_OF_MONTH);

            List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
            Map<String, Object> statistics = calculateStatistics(orders);

            statistics.put("totalBanners", bannerRepository.count());
            statistics.put("totalBrands", brandRepository.count());
            statistics.put("totalCategories", categoryRepository.count());
            statistics.put("totalCustomers", customerRepository.count());
            statistics.put("totalProducts", productRepository.count());
            statistics.put("totalOrders", orderRepository.countOrdersByDate(year, month, day));

            // Add best-selling products
            statistics.put("bestSellingProducts", getBestSellingProducts());

            return statistics;
        } catch (Exception e) {
            logger.error("Error getting today's statistics: ", e);
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("totalRevenue", 0.0);
            errorStats.put("totalQuantity", 0);
            errorStats.put("totalBanners", 0);
            errorStats.put("totalBrands", 0);
            errorStats.put("totalCategories", 0);
            errorStats.put("totalCustomers", 0);
            errorStats.put("totalProducts", 0);
            errorStats.put("totalOrders", 0);
            errorStats.put("bestSellingProducts", new ArrayList<>());
            return errorStats;
        }
    }

    // Get current month's revenue and item statistics
    public Map<String, Object> getStatisticsThisMonth() {
        Calendar today = Calendar.getInstance();
        int year = today.get(Calendar.YEAR);
        int month = today.get(Calendar.MONTH) + 1;

        List<Order> orders = orderRepository.findOrdersByMonth(year, month);
        Map<String, Object> statistics = calculateStatistics(orders);

        statistics.put("totalBanners", bannerRepository.count());
        statistics.put("totalBrands", brandRepository.count());
        statistics.put("totalCategories", categoryRepository.count());
        statistics.put("totalCustomers", customerRepository.count());
        statistics.put("totalProducts", productRepository.count());
        statistics.put("totalOrders", orderRepository.countOrdersByMonth(year, month));

        // Add best-selling products
        statistics.put("bestSellingProducts", getBestSellingProducts());

        return statistics;
    }

    // Get current year's revenue and item statistics
    public Map<String, Object> getStatisticsThisYear() {
        Calendar today = Calendar.getInstance();
        int year = today.get(Calendar.YEAR);

        List<Order> orders = orderRepository.findOrdersByYear(year);
        Map<String, Object> statistics = calculateStatistics(orders);

        statistics.put("totalBanners", bannerRepository.count());
        statistics.put("totalBrands", brandRepository.count());
        statistics.put("totalCategories", categoryRepository.count());
        statistics.put("totalCustomers", customerRepository.count());
        statistics.put("totalProducts", productRepository.count());
        statistics.put("totalOrders", orderRepository.countOrdersByYear(year));

        // Add best-selling products
        statistics.put("bestSellingProducts", getBestSellingProducts());

        return statistics;
    }

    // Get item quantity by category
    public Map<String, Integer> getItemQuantityByCategory() {
        Map<String, Integer> categoryQuantities = new HashMap<>();
        List<Order> orders = orderRepository.findOrdersByYear(Calendar.getInstance().get(Calendar.YEAR)); // Get orders for the current year

        for (Order order : orders) {
            List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
            for (OrderItem item : orderItems) {
                String categoryName = item.getProductSize().getProductColor().getProduct().getSubCategory().getCategory().getCategoryName();
                categoryQuantities.put(categoryName, categoryQuantities.getOrDefault(categoryName, 0) + item.getQuantity());
            }
        }

        return categoryQuantities;
    }

    // Calculate revenue and quantity from orders
    private Map<String, Object> calculateStatistics(List<Order> orders) {
        Map<String, Object> statistics = new HashMap<>();
        double totalRevenue = 0;
        int totalQuantity = 0;

        try {
            // Loop through all orders and order items to calculate revenue and quantity
            for (Order order : orders) {
                if (order != null) {
                    List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                    for (OrderItem item : orderItems) {
                        if (item != null && item.getQuantity() != null) {
                            totalRevenue += item.getUnitPrice() * item.getQuantity();
                            totalQuantity += item.getQuantity();
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error calculating statistics: ", e);
        }

        statistics.put("totalRevenue", totalRevenue);
        statistics.put("totalQuantity", totalQuantity);
        return statistics;
    }

    // Get best-selling products (most sold)
    private List<Map<String, Object>> getBestSellingProducts() {
        List<Map<String, Object>> bestSellingProducts = new ArrayList<>();
        try {
            List<Object[]> results = orderItemRepository.findBestSellingProducts(); // Assuming custom query to get top-selling products

            for (Object[] result : results) {
                if (result != null && result.length >= 2) {
                    Map<String, Object> productStats = new HashMap<>();
                    productStats.put("productName", result[0]); // Assuming result[0] is product name
                    productStats.put("totalQuantitySold", result[1]); // Assuming result[1] is total quantity sold
                    bestSellingProducts.add(productStats);
                }
            }
        } catch (Exception e) {
            logger.error("Error getting best selling products: ", e);
        }

        return bestSellingProducts;
    }

    // Get monthly statistics for the current year (for charting)
    public List<Map<String, Object>> getMonthlyStatisticsForCurrentYear() {
        try {
            int year = Calendar.getInstance().get(Calendar.YEAR); // Get the current year
            List<Map<String, Object>> monthlyStats = new ArrayList<>();

            for (int month = 1; month <= 12; month++) {
                Map<String, Object> stats = getStatisticsByMonth(year, month);  // Reuse existing method to get monthly stats
                stats.put("month", month);
                stats.put("year", year);
                monthlyStats.add(stats);
            }

            return monthlyStats;
        } catch (Exception e) {
            logger.error("Error getting monthly statistics for current year: ", e);
            return new ArrayList<>();
        }
    }

    // Get statistics by month (reused from previous implementation)
    private Map<String, Object> getStatisticsByMonth(int year, int month) {
        try {
            List<Order> orders = orderRepository.findOrdersByMonth(year, month);
            return calculateStatistics(orders);
        } catch (Exception e) {
            logger.error("Error getting statistics for year {} month {}: ", year, month, e);
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("totalRevenue", 0.0);
            errorStats.put("totalQuantity", 0);
            return errorStats;
        }
    }

    // Get daily statistics for a specific month (for charting)
    public List<Map<String, Object>> getDailyStatisticsForMonth(int year, int month) {
        // Generate statistics for each day in the month
        List<Map<String, Object>> dailyStats = new ArrayList<>();
        int daysInMonth = java.time.Month.of(month).length(java.time.Year.isLeap(year)); // Get the number of days in the month
        for (int day = 1; day <= daysInMonth; day++) {
            Map<String, Object> stats = getStatisticsByDay(year, month, day);
            dailyStats.add(stats);
        }
        return dailyStats;
    }
    public Map<String, Object> getStatisticsByDay(int year, int month, int day) {
        // Retrieve orders for the specific day using the repository
        List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
        
        // Calculate statistics for the retrieved orders
        return calculateStatistics(orders);
    }
    
    // Get revenue by date range with different view types
    public Map<String, Object> getRevenueByDateRange(String startDate, String endDate, String viewType) {
        List<Map<String, Object>> revenueData = new ArrayList<>();
        double totalRevenue = 0;
        
        try {
            java.time.LocalDate start = java.time.LocalDate.parse(startDate);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate);
            
            if ("day".equals(viewType)) {
                // Daily revenue
                java.time.LocalDate current = start;
                while (!current.isAfter(end)) {
                    List<Order> orders = orderRepository.findOrdersByDate(
                        current.getYear(), 
                        current.getMonthValue(), 
                        current.getDayOfMonth()
                    );
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> dayData = new HashMap<>();
                    dayData.put("date", current.toString());
                    dayData.put("revenue", stats.get("totalRevenue"));
                    dayData.put("orderCount", orders.size());
                    
                    revenueData.add(dayData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                    
                    current = current.plusDays(1);
                }
            } else if ("month".equals(viewType)) {
                // Monthly revenue
                java.time.LocalDate current = start.withDayOfMonth(1);
                java.time.LocalDate endMonth = end.withDayOfMonth(1);
                
                while (!current.isAfter(endMonth)) {
                    List<Order> orders = orderRepository.findOrdersByMonth(
                        current.getYear(), 
                        current.getMonthValue()
                    );
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("date", current.toString());
                    monthData.put("revenue", stats.get("totalRevenue"));
                    monthData.put("orderCount", orders.size());
                    
                    revenueData.add(monthData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                    
                    current = current.plusMonths(1);
                }
            } else if ("year".equals(viewType)) {
                // Yearly revenue
                for (int year = start.getYear(); year <= end.getYear(); year++) {
                    List<Order> orders = orderRepository.findOrdersByYear(year);
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> yearData = new HashMap<>();
                    yearData.put("date", String.valueOf(year));
                    yearData.put("revenue", stats.get("totalRevenue"));
                    yearData.put("orderCount", orders.size());
                    
                    revenueData.add(yearData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", revenueData);
        result.put("totalRevenue", totalRevenue);
        
        return result;
    }
    
    // Get daily revenue for a specific month
    public List<Map<String, Object>> getDailyRevenue(int year, int month) {
        List<Map<String, Object>> dailyRevenue = new ArrayList<>();
        int daysInMonth = java.time.Month.of(month).length(java.time.Year.isLeap(year));
        
        for (int day = 1; day <= daysInMonth; day++) {
            List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
            Map<String, Object> stats = calculateStatistics(orders);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", String.format("%04d-%02d-%02d", year, month, day));
            dayData.put("revenue", stats.get("totalRevenue"));
            dayData.put("orderCount", orders.size());
            
            dailyRevenue.add(dayData);
        }
        
        return dailyRevenue;
    }
    
    // Get monthly revenue for a specific year
    public List<Map<String, Object>> getMonthlyRevenue(int year) {
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            List<Order> orders = orderRepository.findOrdersByMonth(year, month);
            Map<String, Object> stats = calculateStatistics(orders);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", String.format("%04d-%02d", year, month));
            monthData.put("revenue", stats.get("totalRevenue"));
            monthData.put("orderCount", orders.size());
            
            monthlyRevenue.add(monthData);
        }
        
        return monthlyRevenue;
    }
    
}
