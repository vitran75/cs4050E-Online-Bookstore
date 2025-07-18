package com.example.demo.service;

import com.example.demo.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void applySenderDetails(MimeMessageHelper helper) throws MessagingException, UnsupportedEncodingException {
        helper.setFrom("yourbookstore@example.com", "Online Bookstore");
    }

    public void sendVerificationEmail(String recipient, String code) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);
            helper.setTo(recipient);
            helper.setSubject("Your Verification Code");
            helper.setText("<p>Your verification code is: <b>" + code + "</b></p>", true);
            mailSender.send(mime);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Unable to deliver verification email.", e);
        }
    }

    public void sendConfirmationEmail(String recipient) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);
            helper.setTo(recipient);
            helper.setSubject("Welcome to Online Bookstore");
            helper.setText("Thank you for registering! You may now log in and start shopping.", true);
            mailSender.send(mime);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Unable to send confirmation email.", e);
        }
    }

    public void sendPasswordResetCode(String recipient, String code) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);
            helper.setTo(recipient);
            helper.setSubject("Password Reset Request");
            helper.setText("Use this code to reset your password: <b>" + code + "</b>", true);
            mailSender.send(mime);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Reset email could not be sent.", e);
        }
    }

    public void sendPasswordResetConfirmation(String recipient) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);
            helper.setTo(recipient);
            helper.setSubject("Your Password Has Been Changed");
            helper.setText(
                "<p>Your password was successfully updated.</p>"
                + "<p>If this wasn't initiated by you, please contact us immediately.</p>",
                true
            );
            mailSender.send(mime);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Unable to send password update confirmation.", e);
        }
    }

    public void sendProfileUpdateConfirmation(String recipient) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);
            helper.setTo(recipient);
            helper.setSubject("Account Profile Updated");
            helper.setText("Your profile details were updated successfully. Contact support if this wasn't you.", true);
            mailSender.send(mime);
        } catch (MailException | MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Profile update notification could not be sent.", e);
        }
    }

    public void sendPromotionEmail(String recipient, String description, BigDecimal discount, Date expirationDate, String promoCode) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);

            String subject = "📚 Limited-Time Offer Just for You!";
            String expiration = (expirationDate != null)
                ? "Valid until: " + new SimpleDateFormat("yyyy-MM-dd").format(expirationDate)
                : "Act fast – ends soon!";

            String content = "<h2>🎉 New Deal at Online Bookstore!</h2>"
                           + "<p>" + description + "</p>"
                           + "<p><b>Discount:</b> " + discount + "% off</p>"
                           + "<p><b>Promo Code:</b> " + promoCode + "</p>"
                           + "<p>" + expiration + "</p>"
                           + "<p>Use it at checkout and enjoy your next great read!</p>";

            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(mime);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to deliver promotion email.", e);
        }
    }

    public void sendOrderConfirmationEmail(String recipient, int orderId, List<OrderItem> items, String customerName, LocalDateTime orderTime, BigDecimal total, BigDecimal tax, BigDecimal shipping, BigDecimal discount) {
        DecimalFormat df = new DecimalFormat("0.00");

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);

            int itemCount = items.size();
            BigDecimal itemSubtotal = items.stream()
                    .map(i -> i.getUnitPrice() != null ? i.getUnitPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String orderDate = orderTime.format(DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a"));

            StringBuilder itemList = new StringBuilder("<ul>");
            for (OrderItem item : items) {
                itemList.append("<li>")
                        .append(item.getBook()).append(" – $")
                        .append(item.getBook()).append("</li>");
            }
            itemList.append("</ul>");

            String body = "<h2>📦 Order Confirmation</h2>"
                        + "<p>Hi " + customerName + ",</p>"
                        + "<p>Your order <b>#" + orderId + "</b> has been placed on " + orderDate + ".</p>"
                        + "<p><b>Items (" + itemCount + "):</b></p>"
                        + itemList
                        + "<p><b>Subtotal:</b> $" + df.format(itemSubtotal) + "</p>"
                        + "<p><b>Shipping:</b> $" + df.format(shipping) + "</p>"
                        + "<p><b>Tax:</b> $" + df.format(tax) + "</p>"
                        + "<p><b>Discount:</b> -$" + df.format(discount) + "</p>"
                        + "<hr>"
                        + "<p><b>Total Charged:</b> $" + df.format(total) + "</p>"
                        + "<p>Thanks for shopping with Online Bookstore!</p>";

            helper.setTo(recipient);
            helper.setSubject("📦 Order Confirmation – Order #" + orderId);
            helper.setText(body, true);

            mailSender.send(mime);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Unable to send order confirmation email.", e);
        }
    }

    public void sendOrderRefundEmail(String recipient, String customerName, int orderId, String bookTitle, LocalDateTime orderDate, BigDecimal refundAmount) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true);
            applySenderDetails(helper);

            String formattedDate = orderDate.format(DateTimeFormatter.ofPattern("EEEE, MMM d, yyyy 'at' h:mm a"));

            String subject = "📬 Refund Processed – Order #" + orderId;
            String body = "<h2>Hi " + customerName + ",</h2>"
                        + "<p>Your refund for <b>Order #" + orderId + "</b> has been completed.</p>"
                        + "<p><b>Book:</b> " + bookTitle + "<br>"
                        + "<b>Ordered on:</b> " + formattedDate + "<br>"
                        + "<b>Refunded Amount:</b> $" + refundAmount.setScale(2, RoundingMode.HALF_UP) + "</p>"
                        + "<p>If you have questions, contact us anytime.</p>"
                        + "<p>Thank you for choosing Online Bookstore!</p>";

            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(mime);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send refund email.", e);
        }
    }
}
