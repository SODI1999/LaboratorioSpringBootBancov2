# [SPEC-001] Bank Transfers Qr

Fecha: 2026-10-30
Estado: SPECIFIED
Arquetipo: Feature

## 0. Clarification and Assumptions
- **Dominio y propósito:** Desarrollar el sistema bancario completo para traslado de dinero entre cuentas con histórico de transacciones, emisión de código QR codificado, vista de autenticación/login editorial como carta de presentación y visualización 3D interactiva de tarjetas bancarias ([SpringBoot AI.pdf](../../SpringBoot%20AI.pdf#page=11)).
- **Separación de alcance:** Se descarta el ejercicio de tutorial de reservas de citas (páginas 3-10 del PDF) en favor del ejercicio bancario final.
- **Nomenclatura y código:** Código (clases, métodos, atributos, endpoints, componentes) 100% en inglés según [CONSTITUTION.md](../../CONSTITUTION.md#L14-L18). Documentación y bitácora de prompts en español.
- **Formato DTO:** Uso de Java records para los contratos de transferencia y respuestas REST.
- **Transaccionalidad:** Atomicidad estricta en el débito y crédito entre cuentas con `@Transactional`.
- **Generación QR:** La transacción exitosa genera un payload codificado en Base64 / imagen con: `transactionId`, `sourceAccountNumber`, `destinationAccountNumber`, `amount`, `currency` y `timestamp`.
- **Frontend Stack & Estética:** React con Vite, TypeScript y Tailwind CSS puro (sin plantillas rígidas ni shadcn genérico). Diseño anti-slop gobernado por los principios Better UI y accesibilidad WCAG 2.2.
- **Bitácora de Prompts:** Registro duradero en `PROMPTS.md` mapeando cada funcionalidad a un prompt técnico formal.

## 1. Need and scope
- **Necesidad:** Permitir a usuarios bancarios autenticarse mediante una pantalla editorial elegante de presentación, visualizar sus productos financieros (cuentas de ahorros y tarjetas con física 3D interactiva), transferir fondos en tiempo real entre cuentas con validación de saldo, auditar el histórico cronológico de transacciones y obtener un comprobante con código QR.
- **Alcance funcional (MVP Completo):**
  1. Pantalla de Login / Carta de Presentación bancaria con selección de usuarios de prueba (ej. Diego / Pedro).
  2. Dashboard bancario con tarjetas financieras 3D interactivas (Ahorros/Débito y Crédito) con perspectiva CSS y cifras tabulares.
  3. API REST Spring Boot para consulta de cuentas, saldos y productos.
  4. Endpoint transaccional de transferencias con validaciones atómicas (saldo, cuentas distintas, monto positivo).
  5. Registro histórico inmutable de transacciones.
  6. Generación de código QR con metadata de comprobante.
  7. Formulario de transferencias con validación en vivo y modal de recibo con código QR renderizado.

## 2. Acceptance Criteria and Non-Goals

### Acceptance Criteria (EARS Syntax)
- **AC-01 [functional]:** The system SHALL maintain account balances using `BigDecimal` and enforce atomic debit from the source account and credit to the destination account within a single database transaction.
- **AC-02 [functional]:** The system SHALL persist every completed transfer in an immutable transaction history table including timestamp, source account number, destination account number, transferred amount, and a unique transaction identifier.
- **AC-03 [functional]:** The system SHALL generate a QR code containing encoded transaction payload metadata (`transactionId`, `sourceAccount`, `destinationAccount`, `amount`, `timestamp`) upon successful transfer completion.
- **AC-04 [functional]:** WHEN a valid transfer request is submitted with existing source/destination accounts and sufficient balance, the system SHALL execute the transfer, persist the transaction record, and return HTTP 201 Created or 200 OK with the transaction details and QR payload.
- **AC-05 [functional]:** WHEN a request to retrieve transaction history is received (`GET /api/transactions`), the system SHALL return the list of executed transactions sorted in reverse chronological order.
- **AC-06 [functional]:** WHEN a request to list accounts is received (`GET /api/accounts`), the system SHALL return the available bank accounts with their account numbers, holder names, and current balances.
- **AC-07 [functional]:** IF the source account has insufficient balance for the requested transfer amount, THEN the system SHALL reject the transfer without modifying any account balance, raise an `InsufficientFundsException`, and return HTTP 400 Bad Request or 422 Unprocessable Entity with a clear error payload.
- **AC-08 [functional]:** IF either the source account or destination account does not exist in the database, THEN the system SHALL reject the transfer and return HTTP 404 Not Found.
- **AC-09 [functional]:** IF the source account and destination account are identical or the transfer amount is less than or equal to zero, THEN the system SHALL reject the transfer with HTTP 400 Bad Request.
- **AC-10 [visual]:** WHILE account data or transfer processing is underway, the UI SHALL display a non-blocking Loading skeleton or spinner state without layout shift.
- **AC-11 [visual]:** IF the transaction history is empty, the UI SHALL display an Empty state explaining that no transfers have been executed yet, accompanied by a call to action to perform a transfer.
- **AC-12 [interaction]:** WHEN a transfer is completed successfully, the UI SHALL render a transaction receipt modal/card containing the transfer summary, updated balances, and the rendered QR code image.
- **AC-13 [interaction]:** IF a transfer fails due to insufficient funds, validation errors or server unavailability, THEN the UI SHALL render an Error banner or toast with the descriptive failure reason and allow immediate retry.
- **AC-14 [interaction]:** WHEN a user authenticates or selects their profile on the Login presentation screen, the UI SHALL establish the active session and transition to the banking dashboard displaying their assigned account and cards.
- **AC-15 [visual]:** The UI SHALL render tactile-styled bank cards with CSS 3D perspective (`preserve-3d`, dynamic pointer tilt, chip SVG, masked numbers and `tabular-nums` balances), falling back gracefully to flat static cards when `prefers-reduced-motion` is active.

### Non-Goals (Scope Boundaries)
- **Conversión de múltiples divisas:** El sistema opera en una única moneda base (COP); no incluye cotizaciones cambiarias externas.
- **Autenticación compleja OAuth2/JWT con servidor externo:** La autenticación se modela con gestión de sesión local contextual y perfiles bancarios predefinidos para la evaluación académica.
- **Transferencias interbancarias externas:** Solo se procesan transferencias entre cuentas pertenecientes al mismo banco (sistema cerrado).
- **Pasarelas de pago de terceros:** No se integran servicios de pago externos (Stripe, PSE, etc.).

## 3. Domain applicability

| Security & Compliance Control | Required? | Technical Enforcement |
| :--- | :---: | :--- |
| **Does it touch sensitive personal data (PII)?** | Sí | Nombres de titulares, números de cuenta y montos. Se validan formatos de entrada, se enmascaran números de tarjeta en UI y se excluyen de logs sensibles. |
| **Does it expose cross-tenant data?** | N/A | Sistema monolítico de una sola entidad bancaria académica (single tenant). |
| **Does it require audit logging?** | Sí | La tabla histórica de transacciones es de solo inserción (inmutable) y registra fecha, cuentas, monto y estado. |
| **Does it access or process sensitive data?** | Sí | Control transaccional `@Transactional(isolation = Isolation.READ_COMMITTED)` para prevenir condiciones de carrera y dobles gastos (*double spending*). |

## 4. Experience and limits

Se contemplan de manera obligatoria los 4 estados de interfaz según [CONSTITUTION.md](../../CONSTITUTION.md#L64-L66) y la guía de diseño:
1. **Loading State:** Skeletons contextuales en la tabla de historial y en el selector de cuentas mientras se resuelven las peticiones HTTP (`AC-10`).
2. **Empty State:** Vista limpia con mensaje explicativo e ilustración/icono simple cuando no existan transacciones previas registradas (`AC-11`).
3. **Error State:** Banner con descripción clara del motivo de rechazo (ej. fondos insuficientes o cuenta no encontrada) manteniendo los datos del formulario intactos para fácil corrección (`AC-13`).
4. **Ideal / Protected State:** Vista del formulario de transferencias con cuentas activas, saldo actual visible, y modal de comprobante con código QR renderizado tras completar la operación (`AC-12`).

## 5. Traceability
- **AC-01 a AC-04:** Cubiertos en arquitectura backend (Entidades `Account`, `Transaction`, `TransferService`, `TransferController`).
- **AC-05, AC-06:** Cubiertos en endpoints de consulta (`GET /api/accounts`, `GET /api/transactions`).
- **AC-07 a AC-09:** Cubiertos mediante excepciones de dominio (`InsufficientFundsException`, `AccountNotFoundException`, `InvalidTransferException`) y `GlobalExceptionHandler`.
- **AC-10 a AC-13:** Cubiertos en el cliente web frontend (componentes `TransferModal`, `TransactionHistory`, `TransferReceiptModal`).
- **AC-14, AC-15:** Cubiertos en la vista de presentación `LoginView` y el componente de tarjeta interactiva `BankCard3D`.
