package com.udea.banco.repository;

import com.udea.banco.entity.Transaction;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Transaction} entities.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Retrieves all transactions ordered by timestamp in descending order.
     *
     * @return list of historical transactions from newest to oldest
     */
    List<Transaction> findAllByOrderByTimestampDesc();

    /**
     * Retrieves transactions related to an account (as source or destination).
     *
     * @param sourceAccount      source account identifier
     * @param destinationAccount destination account identifier
     * @return list of matching transactions
     */
    List<Transaction> findBySourceAccountNumberOrDestinationAccountNumberOrderByTimestampDesc(
            String sourceAccount, String destinationAccount);
}
