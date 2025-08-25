package vn.student.webbangiay.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.webbangiay.dto.GuestDto;
import vn.student.webbangiay.response.GuestResponse;
import vn.student.webbangiay.service.GuestService;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {
    @Autowired
    private GuestService guestService;

    @PostMapping
    public ResponseEntity<GuestResponse> createGuest(@RequestBody GuestDto guestDto) {
        GuestResponse createdGuestResponse = guestService.createGuest(guestDto);
        return new ResponseEntity<>(createdGuestResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{guestId}")
    public ResponseEntity<GuestResponse> getGuestById(@PathVariable Integer guestId) {
        GuestResponse guestResponse = guestService.getGuestById(guestId);
        return new ResponseEntity<>(guestResponse, HttpStatus.OK);
    }

    @PutMapping("/{guestId}")
    public ResponseEntity<GuestResponse> updateGuest(
            @PathVariable Integer guestId,
            @RequestBody GuestDto guestDto) {
        GuestResponse updatedGuestResponse = guestService.updateGuest(guestId, guestDto);
        return new ResponseEntity<>(updatedGuestResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{guestId}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Integer guestId) {
        guestService.deleteGuest(guestId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<List<GuestResponse>> getAllGuests() {
        List<GuestResponse> guests = guestService.getAllGuests();
        return new ResponseEntity<>(guests, HttpStatus.OK);
    }
}
