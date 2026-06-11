package com.security.authX_backend.helpers;

import java.util.UUID;

public class UserIdHelper {
    public static UUID parseUUID(String id)
    {
        return  UUID.fromString(id);
    }
}
