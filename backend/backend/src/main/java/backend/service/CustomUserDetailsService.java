package backend.service;

import backend.entity.User;
import backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        String query = usernameOrEmail != null ? usernameOrEmail.trim() : "";
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(query);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByNameIgnoreCase(query);
        }

        User user = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("User not found with email or name: " + usernameOrEmail)
        );

        return new UserPrincipal(user);
    }
}
