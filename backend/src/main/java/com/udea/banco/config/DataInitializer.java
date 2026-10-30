package com.udea.banco.config;

import com.udea.banco.entity.Account;
import com.udea.banco.repository.AccountRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initializes default demo bank accounts when the database is empty.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AccountRepository accountRepository;

    /**
     * Constructor injection.
     *
     * @param accountRepository repository for account management
     */
    public DataInitializer(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public void run(String... args) {
        if (accountRepository.count() == 0) {
            log.info("Seeding initial demo bank accounts...");

            Account diego = new Account(
                    "CTA-1001",
                    "Diego Ramirez",
                    new BigDecimal("1500000.00"),
                    "SAVINGS",
                    "COP",
                    LocalDateTime.now()
            );

            Account pedro = new Account(
                    "CTA-1002",
                    "Pedro Gomez",
                    new BigDecimal("500000.00"),
                    "SAVINGS",
                    "COP",
                    LocalDateTime.now()
            );

            Account maria = new Account(
                    "CTA-1003",
                    "Maria Restrepo",
                    new BigDecimal("2800000.00"),
                    "CHECKING",
                    "COP",
                    LocalDateTime.now()
            );

            accountRepository.save(diego);
            accountRepository.save(pedro);
            accountRepository.save(maria);

            log.info("Initialized 3 demo accounts: CTA-1001 (Diego), CTA-1002 (Pedro), CTA-1003 (Maria).");
        }
    }
}
