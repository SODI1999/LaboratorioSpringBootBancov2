package com.udea.banco.repository;

import com.udea.banco.entity.Account;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Account} entities.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Finds an account by its unique public account number.
     *
     * @param accountNumber public account identifier
     * @return optional containing the account if found
     */
    Optional<Account> findByAccountNumber(String accountNumber);

    /**
     * Checks if an account exists with the specified account number.
     *
     * @param accountNumber public account identifier
     * @return true if an account exists, false otherwise
     */
    boolean existsByAccountNumber(String accountNumber);
}
