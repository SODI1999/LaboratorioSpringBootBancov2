# [PLAN-001] Technical Plan — Bank Transfers & QR

Fecha: 2026-10-30
Arquetipo: Feature
Estado: PLANNED

## 1. Evidence and existing architecture
- **Línea base:** Repositorio Git local inicializado en rama `main` en `C:\dev\LaboratorioSpringBootBancov2`.
- **Runtimes verificados:**
  - Java: OpenJDK Temurin `25.0.4.1+1-LTS` (`java -version` [exit code 0]).
  - Node.js: `v24.22.1` (`node -v` [exit code 0]).
  - npm: `11.19.1` (`npm -v` [exit code 0]).
  - PostgreSQL: Servicio Windows `postgresql-x64-18` activo en puerto 5432.
  - Maven Wrapper (`mvnw` / `mvnw.cmd`): Se incluirá en el scaffolding del backend al no existir `mvn` global en PATH.
- **Requerimientos fuente:** [SpringBoot AI.pdf](../../SpringBoot%20AI.pdf#page=11) (Tecnológico de Antioquia).
- **Gobernanza:** [CONSTITUTION.md](../../CONSTITUTION.md) (Zero Code Slop, Fail-Fast, DTOs con Java records, Javadoc en métodos públicos, nomenclatura en inglés).
- **Decisiones vigentes:** `stack-frontend` (React + Vite + TypeScript + Tailwind CSS puro anti-slop + Lucide Icons + Better UI) y `git-local-setup` (Git local en `main` con Conventional Commits).

## 2. Proposed change & Architecture

La solución se estructura como un sistema desacoplado (Backend API REST + Frontend SPA) con un registro pedagógico de prompts en `PROMPTS.md`:

```
LaboratorioSpringBootBancov2/
├── .gitignore
├── PROMPTS.md                   <-- Bitácora de prompts según especificación técnica
├── backend/                     <-- Servicio Backend Spring Boot 3.4 / Java 25
│   ├── pom.xml                  <-- Configuración Maven Backend
│   ├── mvnw / mvnw.cmd          <-- Maven Wrapper autónomo
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/udea/banco/
│   │   │   │   ├── BancoApplication.java
│   │   │   │   ├── config/          <-- CorsConfig, OpenApiConfig, DataInitializer
│   │   │   │   ├── controller/      <-- TransferController, AccountController, TransactionController
│   │   │   │   ├── dto/             <-- Java records: TransferRequest, TransferResponse, AccountDto
│   │   │   │   ├── entity/          <-- JPA Entities: Account, Transaction
│   │   │   │   ├── exception/       <-- InsufficientFundsException, AccountNotFoundException, GlobalExceptionHandler
│   │   │   │   ├── repository/      <-- AccountRepository, TransactionRepository
│   │   │   │   └── service/         <-- TransferService (Transactional), QrCodeService
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/java/com/udea/banco/ <-- Pruebas de integración atómicas
└── frontend/                    <-- Cliente React + Vite + TypeScript + Tailwind CSS
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── types/               <-- Tipos TS para Account, Transaction, TransferRequest/Response
        ├── services/            <-- Cliente Axios (bankApi.ts)
        └── components/
            ├── LoginView.tsx    <-- Carta de presentación / selector de perfil
            ├── BankCard3D.tsx   <-- Tarjeta bancaria táctil con CSS 3D perspective
            ├── TransferModal.tsx <-- Formulario de transferencia con validación en vivo
            ├── ReceiptModal.tsx <-- Comprobante con renderizado de QR y resumen
            ├── TransactionHistory.tsx <-- Tabla con los 4 estados (Loading, Empty, Error, Success)
            └── Dashboard.tsx    <-- Vista principal post-login
```

### Componentes Clave del Backend
1. **`Account` Entity:** Almacena `id`, `accountNumber` (único, ej. `CTA-1001`), `holderName`, `balance` (`BigDecimal`), `accountType` (`SAVINGS`, `CHECKING`), `currency` (`COP`), `createdAt`.
2. **`Transaction` Entity:** Registro inmutable de transacciones con `id`, `transactionId` (UUID único), `sourceAccountNumber`, `destinationAccountNumber`, `amount` (`BigDecimal`), `timestamp` (`LocalDateTime`), `status` (`SUCCESS`, `REJECTED`), `qrPayload` (`String` Base64 / data URI).
3. **`TransferService`:**
   - Método `executeTransfer(TransferRequest request)` anotado con `@Transactional(isolation = Isolation.READ_COMMITTED)`.
   - Verifica existencia de cuentas origen y destino (`AccountNotFoundException`).
   - Verifica que cuenta origen != destino (`InvalidTransferException`).
   - Verifica monto > 0 (`InvalidTransferException`).
   - Verifica saldo disponible (`InsufficientFundsException`).
   - Aplica débito a origen y crédito a destino de forma atómica.
   - Genera payload de QR mediante `QrCodeService` (ZXing).
   - Guarda el registro inmutable en `TransactionRepository` y retorna `TransferResponse`.
4. **`DataInitializer`:** Inicializa datos de prueba controlados al levantar el backend (ej. cuentas de Diego Ramirez con $1.500.000 COP y Pedro Gomez con $500.000 COP) para evitar configuración manual repetitiva.

## 3. Contracts and compatibility

### REST API Contracts (JSON)

#### 1. Transferencia entre cuentas
- **Endpoint:** `POST /api/transfers`
- **Request Body (Java Record `TransferRequest`):**
  ```json
  {
    "sourceAccountNumber": "CTA-1001",
    "destinationAccountNumber": "CTA-1002",
    "amount": 150000.00
  }
  ```
- **Response 201 Created (Java Record `TransferResponse`):**
  ```json
  {
    "transactionId": "b8f5c3a2-1e4d-4b8a-9f2e-7c8d9e0f1a2b",
    "sourceAccountNumber": "CTA-1001",
    "destinationAccountNumber": "CTA-1002",
    "amount": 150000.00,
    "sourceNewBalance": 1350000.00,
    "timestamp": "2026-10-30T17:00:00.000Z",
    "status": "SUCCESS",
    "qrPayload": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```
- **Error Response 400 Bad Request (Fondos Insuficientes):**
  ```json
  {
    "timestamp": "2026-10-30T17:00:00.000Z",
    "status": 400,
    "error": "INSUFFICIENT_FUNDS",
    "message": "Account CTA-1001 has insufficient funds. Available: 50000.00, Requested: 150000.00"
  }
  ```
- **Error Response 404 Not Found (Cuenta Inexistente):**
  ```json
  {
    "timestamp": "2026-10-30T17:00:00.000Z",
    "status": 404,
    "error": "ACCOUNT_NOT_FOUND",
    "message": "Account CTA-9999 not found"
  }
  ```

#### 2. Consulta de cuentas
- **Endpoint:** `GET /api/accounts`
- **Response 200 OK:**
  ```json
  [
    {
      "accountNumber": "CTA-1001",
      "holderName": "Diego Ramirez",
      "balance": 1500000.00,
      "accountType": "SAVINGS",
      "currency": "COP"
    },
    {
      "accountNumber": "CTA-1002",
      "holderName": "Pedro Gomez",
      "balance": 500000.00,
      "accountType": "SAVINGS",
      "currency": "COP"
    }
  ]
  ```

#### 3. Histórico de transacciones
- **Endpoint:** `GET /api/transactions`
- **Response 200 OK:** Lista de transacciones ordenadas descendentemente por fecha (`timestamp DESC`).

## 4. Observability
- **Logs estructurados (SLF4J / Logback):**
  - Registro de eventos: `[TRANSFER_INITIATED] source=CTA-1001 target=CTA-1002 amount=150000.00`
  - Confirmación exitosa: `[TRANSFER_SUCCESS] txnId=b8f5c3a2-... amount=150000.00 durationMs=12`
  - Registro de rechazos: `[TRANSFER_REJECTED] reason=INSUFFICIENT_FUNDS account=CTA-1001`
- **Seguridad en observabilidad:** Prohibido registrar credenciales, números completos de tarjetas o datos personales sensibles en logs.

## 5. Technology, setup and documentation decisions
- **Backend:** Java 25 LTS, Spring Boot 3.4.x, Spring Data JPA, Hibernate, PostgreSQL Driver, SpringDoc OpenAPI 2.x, ZXing 3.5.3.
- **Frontend:** Node.js 24, Vite 6, React 19, TypeScript 5, Tailwind CSS 3.4+, Lucide React.
- **Documentación de código:** Javadoc riguroso en interfaces, repositorios, servicios y controladores. Nombres 100% en inglés.
- **Mapeo técnico de Prompts:** Archivo `PROMPTS.md` con los pasos progresivos requeridos por la especificación del sistema.

## 6. UI & Interaction Design (Art Direction Contract)

### Arquetipo Estético: *Swiss Precision Fintech & Tactile Banking*
- **Justificación:** Transmite solvencia, seguridad y modernidad tecnológica sin caer en clichés de IA (cero fondos morados saturados, cero tarjetas anidadas sin función).
- **Paleta de Color y Contraste:**
  - Superficie base: Obsidiana oscura `#0B0F17` / Gris carbón `#111827`.
  - Acento funcional: Esmeralda financiero `#10B981` (para ingresos y transacciones exitosas) y carmesí sobrio `#EF4444` (para débitos y errores).
  - Texto principal: Blanco tiza `#F9FAFB` (contraste > 12:1 sobre fondo oscuro).
  - Texto secundario: Gris pizarra `#9CA3AF` (contraste > 4.5:1 WCAG AAA).
- **Tipografía & Datos:**
  - Escala modular con base de 4px / ritmo de 8px.
  - Cifras monetarias, números de cuenta y códigos de comprobante con clase `font-mono tabular-nums tracking-tight` para estabilidad visual absoluta.
- **Tarjetas Bancarias 3D Interactivas:**
  - Estilo físico táctil: acabado mate titanio/carbón con chip EMV vectorizado en SVG dorado, símbolo contactless, logo del banco y número troquelado.
  - Dinámica 3D: Contenedor con `perspective: 1000px`, tarjeta con `transform-style: preserve-3d` y rotación sutil calculada según la posición del cursor (`rotateX` / `rotateY` limitados a +/- 10°).
  - Accesibilidad `prefers-reduced-motion`: Desactiva la rotación 3D y renderiza la tarjeta en posición estática 2D.
- **Matriz de los 4 Estados Obligatorios:**
  1. *Loading:* Skeleton loader contextual sin CLS (`AC-10`).
  2. *Empty:* Historial vacío con ilustración sobria y botón directo para transferir (`AC-11`).
  3. *Error:* Toast/Banner explicativo con motivo claro y botón de reintento (`AC-13`).
  4. *Ideal / Protected:* Dashboard activo con saldo actualizado y modal de comprobante con código QR renderizado (`AC-12`).

## 7. Verification Strategy
1. **Pruebas Automatizadas Backend:**
   - Pruebas unitarias y de integración en Spring Boot (`TransferServiceTest`):
     - Transferencia exitosa actualiza saldos atómicamente (`AC-01`, `AC-04`).
     - Creación de registro inmutable en histórico (`AC-02`).
     - Generación válida de QR con payload no vacío (`AC-03`).
     - Rechazo y rollback cuando saldo es insuficiente (`AC-07`).
     - Rechazo cuando cuenta no existe (`AC-08`).
     - Rechazo cuando origen == destino o monto <= 0 (`AC-09`).
2. **Pruebas de Interfaz Frontend:**
   - Login y transición fluida a dashboard (`AC-14`).
   - Renderizado táctil de tarjeta 3D y estabilidad de cifras tabulares (`AC-15`).
   - Inspección visual de los 4 estados (Loading, Empty, Error, Success con QR).
   - Verificación de contraste WCAG 2.2 con herramientas de inspección.

## 8. Rollback / Recovery
- **Control de versiones:** Commits atómicos con Conventional Commits que permiten revertir cualquier cambio de forma limpia (`git revert`).
- **Base de datos:** `spring.jpa.hibernate.ddl-auto=update` para persistencia continua y scripts limpios de inicialización.
