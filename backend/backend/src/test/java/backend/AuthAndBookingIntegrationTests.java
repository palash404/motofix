package backend;

import backend.dto.RegisterRequest;
import backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class AuthAndBookingIntegrationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private backend.repository.BookingRepository bookingRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();

        bookingRepository.deleteAll();
        userRepository.findByEmailIgnoreCase("testuser@motofix.com")
                .ifPresent(userRepository::delete);
        userRepository.findByEmailIgnoreCase("dupuser@motofix.com")
                .ifPresent(userRepository::delete);
        userRepository.findByEmailIgnoreCase("otheruser@motofix.com")
                .ifPresent(userRepository::delete);
    }

    private String toJson(String name, String email, String password) {
        return "{\"name\":\"" + name + "\",\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    private String toLoginJson(String email, String password) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    private String toBookingJson(String type, String bikeModel, String address, String description) {
        return "{\"type\":\"" + type + "\",\"bikeModel\":\"" + bikeModel + "\",\"address\":\"" + address + "\",\"description\":\"" + description + "\"}";
    }

    @Test
    @DisplayName("Registration succeeds and hashes password in database")
    void testRegisterSuccess() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("Test User", "testuser@motofix.com", "secret123")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Test User")))
                .andExpect(jsonPath("$.email", is("testuser@motofix.com")))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());

        // Verify in DB that password is not plaintext
        var userInDb = userRepository.findByEmailIgnoreCase("testuser@motofix.com");
        assertTrue(userInDb.isPresent());
        assertTrue(userInDb.get().getPasswordHash().startsWith("$2a$") ||
                   userInDb.get().getPasswordHash().startsWith("$2b$"));
    }

    @Test
    @DisplayName("Duplicate email registration returns 409 Conflict")
    void testDuplicateEmailReturns409() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("User One", "dupuser@motofix.com", "pass1234")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("User Two", "DUPUSER@motofix.com", "differentpass")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", is("An account with this email address already exists.")));
    }

    @Test
    @DisplayName("Registration validation rejects invalid emails and short passwords")
    void testRegistrationValidation() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("", "not-an-email", "123")))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Login with wrong credentials returns 401 across all path variants")
    void testLoginWithWrongPasswordReturns401() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("Test User", "testuser@motofix.com", "correctpassword")))
                .andExpect(status().isCreated());

        // Test /api/auth/login
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("testuser@motofix.com", "wrongpassword")))
                .andExpect(status().isUnauthorized());

        // Test /api/login
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("testuser@motofix.com", "wrongpassword")))
                .andExpect(status().isUnauthorized());

        // Test /login
        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("testuser@motofix.com", "wrongpassword")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /login returns 200 OK info instead of 500 static resource error")
    void testGetLoginReturns200() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ok")));

        mockMvc.perform(get("/api/auth/login"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ok")));
    }

    @Test
    @DisplayName("Complete session lifecycle: login, access me, access bookings, logout, re-access blocked")
    void testSessionLifecycleAndProtectedBookings() throws Exception {
        // 1. Register
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("Alice Rider", "testuser@motofix.com", "securePass123")))
                .andExpect(status().isCreated());

        // 2. Unauthenticated access to /api/auth/me returns 401
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());

        // 3. Unauthenticated access to /api/bookings returns 401
        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toBookingJson("HOME_REPAIR", "Yamaha R15", "123 Main St", "Brake service needed")))
                .andExpect(status().isUnauthorized());

        // 4. Login and extract session
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("testuser@motofix.com", "securePass123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("testuser@motofix.com")))
                .andReturn();

        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session);

        // 5. Authenticated session access to /api/auth/me returns 200
        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Alice Rider")))
                .andExpect(jsonPath("$.email", is("testuser@motofix.com")));

        // 6. Authenticated session access to create booking succeeds
        mockMvc.perform(post("/api/bookings")
                        .session(session)
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toBookingJson("HOME_REPAIR", "Yamaha R15", "123 Main St", "Brake service needed")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.type", is("HOME_REPAIR")))
                .andExpect(jsonPath("$.bikeModel", is("Yamaha R15")));

        // 7. Authenticated session access to list bookings
        mockMvc.perform(get("/api/bookings").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type", is("HOME_REPAIR")));

        // 8. Logout
        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isOk());

        // 9. Session invalidated -> /api/auth/me now returns 401
        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Booking confirmation flow: reference generation, lookup by reference, latest booking, and user isolation")
    void testBookingConfirmationAndTrackingSecurity() throws Exception {
        // 1. Register and login User A
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("User A", "testuser@motofix.com", "pass12345")))
                .andExpect(status().isCreated());

        MvcResult loginResultA = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("testuser@motofix.com", "pass12345")))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession sessionA = (MockHttpSession) loginResultA.getRequest().getSession(false);

        // 2. User A creates a booking
        String bookingJson = "{\"type\":\"HOME_REPAIR\",\"bikeModel\":\"Yamaha FZ-S\",\"address\":\"123 Park Street, Kolkata\",\"description\":\"Full checkup, oil change\",\"packageType\":\"General Service\"}";
        MvcResult createResult = mockMvc.perform(post("/api/bookings")
                        .session(sessionA)
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookingJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookingReference", notNullValue()))
                .andExpect(jsonPath("$.status", is("BOOKING_CONFIRMED")))
                .andExpect(jsonPath("$.packageType", is("General Service")))
                .andExpect(jsonPath("$.bikeModel", is("Yamaha FZ-S")))
                .andReturn();

        com.jayway.jsonpath.ReadContext ctx = com.jayway.jsonpath.JsonPath.parse(createResult.getResponse().getContentAsString());
        String bookingRef = ctx.read("$.bookingReference");
        Number bookingId = ctx.read("$.id");
        assertNotNull(bookingId);
        assertTrue(bookingRef.matches("^MF-\\d{4}-\\d{6}$"), "Reference should match MF-YYYY-XXXXXX format: " + bookingRef);

        // 3. User A retrieves booking by reference
        mockMvc.perform(get("/api/bookings/ref/" + bookingRef).session(sessionA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingReference", is(bookingRef)))
                .andExpect(jsonPath("$.bikeModel", is("Yamaha FZ-S")));

        // 3b. User A retrieves booking by numeric ID
        mockMvc.perform(get("/api/bookings/" + bookingId).session(sessionA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(bookingId)))
                .andExpect(jsonPath("$.bookingReference", is(bookingRef)));

        // 4. User A retrieves latest booking
        mockMvc.perform(get("/api/bookings/latest").session(sessionA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingReference", is(bookingRef)));

        // 5. Register and login User B
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson("User B", "otheruser@motofix.com", "pass67890")))
                .andExpect(status().isCreated());

        MvcResult loginResultB = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toLoginJson("otheruser@motofix.com", "pass67890")))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession sessionB = (MockHttpSession) loginResultB.getRequest().getSession(false);

        // 6. User B cannot access User A's booking by reference -> 404
        mockMvc.perform(get("/api/bookings/ref/" + bookingRef).session(sessionB))
                .andExpect(status().isNotFound());

        // 6b. User B cannot access User A's booking by numeric ID -> 404
        mockMvc.perform(get("/api/bookings/" + bookingId).session(sessionB))
                .andExpect(status().isNotFound());

        // 7. User B has no latest booking -> 404 with proper message
        mockMvc.perform(get("/api/bookings/latest").session(sessionB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("No bookings found for the current user")));

        // 8. Non-existent numeric ID -> 404
        mockMvc.perform(get("/api/bookings/999999").session(sessionA))
                .andExpect(status().isNotFound());
    }
}

