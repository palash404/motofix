package backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 32, name = "booking_reference")
    private String bookingReference;

    @Column(nullable = false, name = "booking_type")
    private String bookingType;

    @Column(name = "package_type", length = 100)
    private String packageType;

    @Column(name = "bike_brand", length = 100)
    private String bikeBrand;

    @Column(name = "bike_model", length = 100)
    private String bikeModel;

    @Column(name = "bike_year", length = 20)
    private String bikeYear;

    @Column(name = "reg_number", length = 50)
    private String regNumber;

    @Column(length = 500)
    private String address;

    @Column(length = 1000)
    private String description;

    @Column(name = "preferred_date", length = 50)
    private String preferredDate;

    @Column(name = "preferred_time", length = 50)
    private String preferredTime;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    public Booking() {
    }

    public Booking(User user, String bookingType, String bikeModel, String address, String description) {
        this.user = user;
        this.bookingType = bookingType;
        this.bikeModel = bikeModel;
        this.address = address;
        this.description = description;
        this.status = "BOOKING_CONFIRMED";
    }

    public Booking(User user, String bookingReference, String bookingType, String bikeModel, String address, String description) {
        this.user = user;
        this.bookingReference = bookingReference;
        this.bookingType = bookingType;
        this.bikeModel = bikeModel;
        this.address = address;
        this.description = description;
        this.status = "BOOKING_CONFIRMED";
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "BOOKING_CONFIRMED";
        }
        if (this.bookingReference == null || this.bookingReference.isBlank()) {
            int year = LocalDateTime.now().getYear();
            int code = java.util.concurrent.ThreadLocalRandom.current().nextInt(100000, 999999);
            this.bookingReference = String.format("MF-%d-%06d", year, code);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public String getPackageType() {
        return packageType;
    }

    public void setPackageType(String packageType) {
        this.packageType = packageType;
    }

    public String getBikeBrand() {
        return bikeBrand;
    }

    public void setBikeBrand(String bikeBrand) {
        this.bikeBrand = bikeBrand;
    }

    public String getBikeModel() {
        return bikeModel;
    }

    public void setBikeModel(String bikeModel) {
        this.bikeModel = bikeModel;
    }

    public String getBikeYear() {
        return bikeYear;
    }

    public void setBikeYear(String bikeYear) {
        this.bikeYear = bikeYear;
    }

    public String getRegNumber() {
        return regNumber;
    }

    public void setRegNumber(String regNumber) {
        this.regNumber = regNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
