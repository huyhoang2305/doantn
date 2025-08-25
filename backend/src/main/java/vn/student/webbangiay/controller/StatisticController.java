package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vn.student.webbangiay.service.StatisticService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/statistics")
public class StatisticController {

    private static final Logger logger = LoggerFactory.getLogger(StatisticController.class);

    @Autowired
    private StatisticService statisticService;

    // Get statistics for today
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getStatisticsToday() {
        try {
            Map<String, Object> statistics = statisticService.getStatisticsToday();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            logger.error("Error getting today's statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve today's statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get statistics for the current month
    @GetMapping("/this-month")
    public ResponseEntity<Map<String, Object>> getStatisticsThisMonth() {
        try {
            Map<String, Object> statistics = statisticService.getStatisticsThisMonth();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            logger.error("Error getting this month's statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve this month's statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get statistics for the current year
    @GetMapping("/this-year")
    public ResponseEntity<Map<String, Object>> getStatisticsThisYear() {
        try {
            Map<String, Object> statistics = statisticService.getStatisticsThisYear();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            logger.error("Error getting this year's statistics: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve this year's statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Get item quantity by category for the current year
    @GetMapping("/item-quantity-by-category")
    public ResponseEntity<Map<String, Integer>> getItemQuantityByCategory() {
        try {
            Map<String, Integer> categoryQuantities = statisticService.getItemQuantityByCategory();
            return ResponseEntity.ok(categoryQuantities);
        } catch (Exception e) {
            logger.error("Error getting item quantity by category: ", e);
            return ResponseEntity.internalServerError().body(new HashMap<>());
        }
    }

    // Get monthly statistics for the current year
    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyStatisticsForYear() {
        try {
            List<Map<String, Object>> monthlyStats = statisticService.getMonthlyStatisticsForCurrentYear();
            return ResponseEntity.ok(monthlyStats);
        } catch (Exception e) {
            logger.error("Error getting monthly statistics for the year: ", e);
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    // Get daily statistics for a specific month
    @GetMapping("/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsForMonth(@RequestParam("year") int year, @RequestParam("month") int month) {
        try {
            List<Map<String, Object>> dailyStats = statisticService.getDailyStatisticsForMonth(year, month);
            return ResponseEntity.ok(dailyStats);
        } catch (Exception e) {
            logger.error("Error getting daily statistics for month {}/{}: ", year, month, e);
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

    // Get statistics for a specific day
    @GetMapping("/by-day")
    public ResponseEntity<Map<String, Object>> getStatisticsByDay(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("day") int day) {
        try {
            Map<String, Object> stats = statisticService.getStatisticsByDay(year, month, day);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error getting statistics for day {}/{}/{}: ", year, month, day, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve statistics for the specified day");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Get revenue by date range
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "viewType", defaultValue = "day") String viewType) {
        try {
            Map<String, Object> revenue = statisticService.getRevenueByDateRange(startDate, endDate, viewType);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            logger.error("Error getting revenue by date range {}-{} ({}): ", startDate, endDate, viewType, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve revenue by date range");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // Get daily revenue for a specific month
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        try {
            List<Map<String, Object>> dailyRevenue = statisticService.getDailyRevenue(year, month);
            return ResponseEntity.ok(dailyRevenue);
        } catch (Exception e) {
            logger.error("Error getting daily revenue for {}/{}: ", year, month, e);
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }
    
    // Get monthly revenue for a specific year
    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(@RequestParam("year") int year) {
        try {
            List<Map<String, Object>> monthlyRevenue = statisticService.getMonthlyRevenue(year);
            return ResponseEntity.ok(monthlyRevenue);
        } catch (Exception e) {
            logger.error("Error getting monthly revenue for year {}: ", year, e);
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }

}
