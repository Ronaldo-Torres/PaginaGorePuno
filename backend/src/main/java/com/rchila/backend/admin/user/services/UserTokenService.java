package com.rchila.backend.admin.user.services;

import com.rchila.backend.admin.user.repositories.models.User;


public interface UserTokenService {

    String generateActivationToken(User user);

    boolean activateAccount(String token);

    String generateResetPasswordToken(User user);

    User validateResetPasswordToken(String token);

    boolean resetPassword(String token, String newPassword);
}