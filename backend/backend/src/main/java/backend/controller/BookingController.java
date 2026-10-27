package backend.controller;

import backend.dto.BookingRequest;
import backend.dto.BookingResponse;
import backend.entity.Booking;
import backend.entity.User;
import backend.repository.BookingRepository;
import backend.repository.UserRepository;
import backend.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        if (auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getUser();
        }
        return userRepository.findByEmailIgnoreCase(auth.getName()).orElse(null);
    }

    private synchronized String generateUniqueBookingReference() {
        int year = LocalDate.now().getYear();
        for (int i = 0; i < 50; i++) {
            int seq = ThreadLocalRandom.current().nextInt(100000, 999999);
            String ref = String.format("MF-%d-%06d", year, seq);
            if (!bookingRepository.existsByBookingReference(ref)) {
                return ref;
            }
        }
        return "MF-" + year + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User must be authenticated to create a booking"));
        }

        Booking booking = new Booking(
                user,
                request.getType(),
                request.getBikeModel(),
                request.getAddress(),
                request.getDescription()
        );

        // Populate package type
        if (request.getPackageType() != null && !request.getPackageType().isBlank()) {
            booking.setPackageType(request.getPackageType().trim());
        } else {
            if ("HOME_REPAIR".equalsIgnoreCase(request.getType())) {
                booking.setPackageType("General Service");
            } else if ("SERVICE_CENTER".equalsIgnoreCase(request.getType())) {
                booking.setPackageType("Complete Workshop Service");
            } else if ("BREAKDOWN".equalsIgnoreCase(request.getType())) {
                booking.setPackageType("Emergency Roadside Dispatch");
            } else {
                booking.setPackageType("General Service");
            }
        }

        // Vehicle brand & model
        if (request.getBikeBrand() != null && !request.getBikeBrand().isBlank()) {
            booking.setBikeBrand(request.getBikeBrand().trim());
        } else if (request.getBikeModel() != null && !request.getBikeModel().isBlank()) {
            String[] parts = request.getBikeModel().trim().split("\\s+");
            booking.setBikeBrand(parts[0]);
        } else {
            booking.setBikeBrand("Yamaha");
        }

        if (request.getBikeModel() != null && !request.getBikeModel().isBlank()) {
            booking.setBikeModel(request.getBikeModel().trim());
        } else {
            booking.setBikeModel("Yamaha FZ-S");
        }

        // Bike Year
        if (request.getBikeYear() != null && !request.getBikeYear().isBlank()) {
            booking.setBikeYear(request.getBikeYear().trim());
        } else {
            booking.setBikeYear("2022");
        }

        // Registration number
        if (request.getRegNumber() != null && !request.getRegNumber().isBlank()) {
            booking.setRegNumber(request.getRegNumber().trim());
        } else {
            booking.setRegNumber("WB12AB3456");
        }

        // Preferred Date & Time
        if (request.getPreferredDate() != null && !request.getPreferredDate().isBlank()) {
            booking.setPreferredDate(request.getPreferredDate().trim());
        } else {
            LocalDate targetDate = LocalDate.now().plusDays(1);
            booking.setPreferredDate(targetDate.format(DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH)));
        }

        if (request.getPreferredTime() != null && !request.getPreferredTime().isBlank()) {
            booking.setPreferredTime(request.getPreferredTime().trim());
        } else {
            booking.setPreferredTime("10:00 AM - 12:00 PM");
        }

        // Description fallback
        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            booking.setDescription(request.getDescription().trim());
        } else {
            booking.setDescription("Full checkup, oil change, and essential maintenance.");
        }

        // Concurrency-safe save with unique reference generation and collision retry
        Booking saved = null;
        for (int attempt = 0; attempt < 5; attempt++) {
            String reference = generateUniqueBookingReference();
            booking.setBookingReference(reference);
            try {
                saved = bookingRepository.save(booking);
                break;
            } catch (DataIntegrityViolationException ex) {
                if (attempt == 4) {
                    throw ex;
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(BookingResponse.fromEntity(saved));
    }

    @GetMapping
    public ResponseEntity<?> getMyBookings() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User must be authenticated"));
        }

        List<BookingResponse> responses = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestBooking() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User must be authenticated"));
        }

        var opt = bookingRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId());
        if (opt.isPresent()) {
            return ResponseEntity.ok(BookingResponse.fromEntity(opt.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "No bookings found for the current user"));
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<?> getBookingByReference(@PathVariable String reference) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User must be authenticated"));
        }

        String cleanRef = reference.startsWith("#") ? reference.substring(1) : reference;

        var opt = bookingRepository.findByBookingReference(cleanRef)
                .filter(b -> b.getUser().getId().equals(user.getId()));
        if (opt.isPresent()) {
            return ResponseEntity.ok(BookingResponse.fromEntity(opt.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Booking not found"));
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User must be authenticated"));
        }

        var opt = bookingRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()));
        if (opt.isPresent()) {
            return ResponseEntity.ok(BookingResponse.fromEntity(opt.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Booking not found"));
    }
}
