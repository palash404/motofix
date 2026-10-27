package backend.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingRequest {

    @NotBlank(message = "Booking type is required")
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

    public BookingRequest() {
    }

    public BookingRequest(String type, String bikeModel, String address, String description) {
        this.type = type;
        this.bikeModel = bikeModel;
        this.address = address;
        this.description = description;
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
}
