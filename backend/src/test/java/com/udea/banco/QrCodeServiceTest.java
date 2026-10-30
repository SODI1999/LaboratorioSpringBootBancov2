package com.udea.banco;

import com.udea.banco.service.QrCodeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class QrCodeServiceTest {

    private final QrCodeService qrCodeService = new QrCodeService();

    @Test
    @DisplayName("AC-03: Generates non-empty QR code PNG data URI with correct Base64 prefix")
    void testQrGeneration() {
        String payload = "Banco TdeA | Txn: test-123 | De: CTA-1001 | Para: CTA-1002 | Monto: 10000.00 COP";
        String qrUri = qrCodeService.generateQrCodeBase64(payload);

        assertNotNull(qrUri);
        assertTrue(qrUri.startsWith("data:image/png;base64,"));
        assertTrue(qrUri.length() > 100);
    }
}
