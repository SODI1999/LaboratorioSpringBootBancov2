# [TASKS-001] Scope-derived work — Bank Transfers & QR

Desglose de tareas atómicas en orden estricto de dependencia, trazables a criterios de aceptación y con verificación definida.

## Fase 1: Arquitectura Backend & Persistencia
- [x] **TASK-01 [backend]**: Scaffold del proyecto Spring Boot 3.4 con Java 25 y Maven Wrapper (`mvnw`) en `backend/`, configurando la conexión a PostgreSQL y parámetros Hibernate en `application.properties`.
  - *Criterios:* `AC-01`, `AC-02`
  - *Archivos:* `backend/pom.xml`, `backend/mvnw`, `backend/mvnw.cmd`, `backend/.mvn/wrapper/*`, `backend/src/main/resources/application.properties`, `PROMPTS.md`
  - *Verificación:* Compilación base con Maven Wrapper y validación de sintaxis de propiedades.

- [x] **TASK-02 [backend]**: Implementar entidades JPA `Account` y `Transaction` con restricciones relacionales y Java Records para los DTOs de transferencia (`TransferRequest`, `TransferResponse`, `AccountDto`).
  - *Criterios:* `AC-01`, `AC-02`
  - *Archivos:* `backend/src/main/java/com/udea/banco/entity/Account.java`, `backend/src/main/java/com/udea/banco/entity/Transaction.java`, `backend/src/main/java/com/udea/banco/dto/*`
  - *Verificación:* Compilación Java e inspección de inmutabilidad en DTOs.

- [x] **TASK-03 [backend]**: Crear repositorios JPA `AccountRepository` y `TransactionRepository`, junto con `DataInitializer` para sembrar cuentas de prueba (Diego, Pedro, María).
  - *Criterios:* `AC-01`, `AC-05`, `AC-06`
  - *Archivos:* `backend/src/main/java/com/udea/banco/repository/*`, `backend/src/main/java/com/udea/banco/config/DataInitializer.java`
  - *Verificación:* Inicialización de registros de prueba en base de datos.

## Fase 2: Lógica Transaccional, QR & API REST
- [x] **TASK-04 [backend]**: Implementar `QrCodeService` con ZXing para generar comprobantes QR codificados en Base64 PNG.
  - *Criterios:* `AC-03`
  - *Archivos:* `backend/src/main/java/com/udea/banco/service/QrCodeService.java`, `backend/pom.xml`
  - *Verificación:* Test unitario de generación de imagen QR con metadata estructurada.

- [x] **TASK-05 [backend]**: Desarrollar `TransferService` con `@Transactional`, validación estricta de saldo, excepciones de dominio (`InsufficientFundsException`, `AccountNotFoundException`, `InvalidTransferException`) y registro inmutable en auditoría.
  - *Criterios:* `AC-01`, `AC-02`, `AC-04`, `AC-07`, `AC-08`, `AC-09`
  - *Archivos:* `backend/src/main/java/com/udea/banco/service/TransferService.java`, `backend/src/main/java/com/udea/banco/exception/*`
  - *Verificación:* Pruebas unitarias de transferencia exitosa y rollback ante saldo insuficiente.

- [x] **TASK-06 [backend]**: Implementar controladores REST (`TransferController`, `AccountController`, `TransactionController`), `GlobalExceptionHandler`, configuración CORS (`CorsConfig`) y OpenAPI/Swagger (`OpenApiConfig`).
  - *Criterios:* `AC-04`, `AC-05`, `AC-06`, `AC-07`, `AC-08`, `AC-09`
  - *Archivos:* `backend/src/main/java/com/udea/banco/controller/*`, `backend/src/main/java/com/udea/banco/config/*`
  - *Verificación:* Pruebas de integración HTTP de endpoints (200, 201, 400, 404) y visualización en `/swagger-ui.html`.

## Fase 3: Cliente Frontend, Tarjetas 3D & Estados de UI
- [x] **TASK-07 [frontend]**: Inicializar aplicación React con Vite y TypeScript en `frontend/`, configurando Tailwind CSS con paleta obsidiana/esmeralda, escala modular y clases `tabular-nums`.
  - *Criterios:* `AC-10`, `AC-15`
  - *Archivos:* `frontend/package.json`, `frontend/vite.config.ts`, `frontend/tailwind.config.js`, `frontend/src/index.css`
  - *Verificación:* Ejecución exitosa de `npm run build` en `frontend/`.

- [x] **TASK-08 [frontend]**: Implementar tipos TypeScript rigurosos y capa de servicio HTTP con Axios (`bankApi.ts`) para cuentas, transferencias e historial.
  - *Criterios:* `AC-04`, `AC-05`, `AC-06`
  - *Archivos:* `frontend/src/types/bank.ts`, `frontend/src/services/bankApi.ts`
  - *Verificación:* Cero tipos `any` y tipado estricto en respuestas de API.

- [x] **TASK-09 [frontend]**: Desarrollar la pantalla editorial de presentación `LoginView` con selector de perfiles de prueba y transición fluida al dashboard.
  - *Criterios:* `AC-14`
  - *Archivos:* `frontend/src/components/LoginView.tsx`
  - *Verificación:* Transición visual de autenticación y carga de contexto de usuario.

- [x] **TASK-10 [frontend]**: Construir el componente táctil `BankCard3D` con perspectiva CSS 3D (`preserve-3d`, tilt interactivo con el puntero, chip EMV, cifras `tabular-nums` y respeto a `prefers-reduced-motion`).
  - *Criterios:* `AC-15`
  - *Archivos:* `frontend/src/components/BankCard3D.tsx`
  - *Verificación:* Inspección interactiva del efecto tilt 3D y comprobación de fallback estático plano.

- [x] **TASK-11 [frontend]**: Construir `TransferModal`, `ReceiptModal` (con QR renderizado) y `TransactionHistory` contemplando de forma estricta los 4 estados obligatorios (Loading, Empty, Error, Success).
  - *Criterios:* `AC-10`, `AC-11`, `AC-12`, `AC-13`
  - *Archivos:* `frontend/src/components/TransferModal.tsx`, `frontend/src/components/ReceiptModal.tsx`, `frontend/src/components/TransactionHistory.tsx`, `frontend/src/components/Dashboard.tsx`
  - *Verificación:* Prueba de interacción de transferencias, comprobación de 4 estados y renderizado de QR.

## Fase 4: Verificación Integral, Prompts & Documentación
- [x] **TASK-12 [delivery]**: Ejecución de suite de pruebas backend, build de frontend, generación completa de `PROMPTS.md` y `README.md` detallado para entrega universitaria.
  - *Criterios:* `AC-01` a `AC-15`
  - *Archivos:* `PROMPTS.md`, `README.md`, `specs/001-bank-transfers-qr/verification.md`
  - *Verificación:* `cd backend; .\mvnw.cmd test`, `npm run build`, auditoría limpia con `audit 001`.
