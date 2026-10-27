package backend.dto;

import backend.entity.Booking;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private String bookingReference;
    private String type;
    private String packageType;
    private String bikeBrand;
    private String bikeModel;
    private String bikeYear;
    private String regNumber;
    private String address;
    private String description;
    private String preferredDate;
    private String preferredTime;
    private String status;
    private LocalDateTime createdAt;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String bookingReference, String type, String packageType,
                           String bikeBrand, String bikeModel, String bikeYear, String regNumber,
                           String address, String description, String preferredDate, String preferredTime,
                           String status, LocalDateTime createdAt) {
        this.id = id;
        this.bookingReference = bookingReference;
        this.type = type;
        this.packageType = packageType;
        this.bikeBrand = bikeBrand;
        this.bikeModel = bikeModel;
        this.bikeYear = bikeYear;
        this.regNumber = regNumber;
        this.address = address;
        this.description = description;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static BookingResponse fromEntity(Booking booking) {
        if (booking == null) {
            return null;
        }
        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getBookingType(),
                booking.getPackageType(),
                booking.getBikeBrand(),
                booking.getBikeModel(),
                booking.getBikeYear(),
                booking.getRegNumber(),
                booking.getAddress(),
                booking.getDescription(),
                booking.getPreferredDate(),
                booking.getPreferredTime(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
