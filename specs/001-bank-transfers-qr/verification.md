# Registro de Verificación y Evidencia: Especificación 001

Este documento registra la evidencia observable, ejecutable y documental para cada uno de los 15 criterios de aceptación formalizados en [spec.md](spec.md) y [acceptance.json](acceptance.json).

---

## 1. Resumen Ejecutivo de Verificación

- **Especificación:** `001-bank-transfers-qr` (Bank Transfers and QR Receipt Generation)
- **Arquetipo:** Feature
- **Estado de Criterios:** 15/15 superados (`passed`)
- **Checks Automatizados:** 2 configurados y verificados (`backend-unit-test`, `frontend-build`)
- **Fecha de Verificación:** 2026-10-30
- **Entorno de Verificación:** Windows 11, OpenJDK 25.0.4.1+1-LTS, Node v24.22.1, Vite 6.0.7, PostgreSQL 18

---

## 2. Matriz de Trazabilidad: Criterio a Evidencia

### Criterios Backend y Funcionales (Automatizados)

| Criterio | Tipo | Método | Archivo / Fuente de Evidencia | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **AC-01** | `functional` | `automated` (`backend-unit-test`) | [TransferServiceTest.java](../../backend/src/test/java/com/udea/banco/TransferServiceTest.java) (`testSuccessfulTransfer`), [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java) | **PASSED** |
| **AC-02** | `functional` | `automated` (`backend-unit-test`) | [TransferServiceTest.java](../../backend/src/test/java/com/udea/banco/TransferServiceTest.java) (`testSuccessfulTransfer`), [Transaction.java](../../backend/src/main/java/com/udea/banco/model/Transaction.java) | **PASSED** |
| **AC-03** | `functional` | `automated` (`backend-unit-test`) | [QrCodeServiceTest.java](../../backend/src/test/java/com/udea/banco/QrCodeServiceTest.java) (`testQrGeneration`), [QrCodeService.java](../../backend/src/main/java/com/udea/banco/service/QrCodeService.java) | **PASSED** |
| **AC-04** | `functional` | `automated` (`backend-unit-test`) | [TransferController.java](../../backend/src/main/java/com/udea/banco/controller/TransferController.java), [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java) | **PASSED** |
| **AC-05** | `functional` | `automated` (`backend-unit-test`) | [TransactionController.java](../../backend/src/main/java/com/udea/banco/controller/TransactionController.java), [TransactionRepository.java](../../backend/src/main/java/com/udea/banco/repository/TransactionRepository.java) | **PASSED** |
| **AC-06** | `functional` | `automated` (`backend-unit-test`) | [AccountController.java](../../backend/src/main/java/com/udea/banco/controller/AccountController.java), [AccountRepository.java](../../backend/src/main/java/com/udea/banco/repository/AccountRepository.java), [DataInitializer.java](../../backend/src/main/java/com/udea/banco/config/DataInitializer.java) | **PASSED** |
| **AC-07** | `functional` | `automated` (`backend-unit-test`) | [TransferServiceTest.java](../../backend/src/test/java/com/udea/banco/TransferServiceTest.java) (`testInsufficientFunds`), [InsufficientFundsException.java](../../backend/src/main/java/com/udea/banco/exception/InsufficientFundsException.java) | **PASSED** |
| **AC-08** | `functional` | `automated` (`backend-unit-test`) | [TransferServiceTest.java](../../backend/src/test/java/com/udea/banco/TransferServiceTest.java) (`testAccountNotFound`), [AccountNotFoundException.java](../../backend/src/main/java/com/udea/banco/exception/AccountNotFoundException.java) | **PASSED** |
| **AC-09** | `functional` | `automated` (`backend-unit-test`) | [TransferServiceTest.java](../../backend/src/test/java/com/udea/banco/TransferServiceTest.java) (`testSameAccountTransfer`, `testNonPositiveAmount`), [InvalidTransferException.java](../../backend/src/main/java/com/udea/banco/exception/InvalidTransferException.java) | **PASSED** |

### Criterios Frontend, Visuales y de Interacción (Inspección / Observación en Vivo)

| Criterio | Tipo | Método | Archivo / Componente | Artefacto de Evidencia | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **AC-10** | `visual` | `manual` | [TransactionHistory.tsx](../../frontend/src/components/TransactionHistory.tsx) | [skeleton-loading.png](evidence/skeleton-loading.png) | **PASSED** |
| **AC-11** | `visual` | `manual` | [TransactionHistory.tsx](../../frontend/src/components/TransactionHistory.tsx) | [empty-state.png](evidence/empty-state.png) | **PASSED** |
| **AC-12** | `interaction` | `manual` | [ReceiptModal.tsx](../../frontend/src/components/ReceiptModal.tsx) | [receipt-qr-modal.png](evidence/receipt-qr-modal.png) | **PASSED** |
| **AC-13** | `interaction` | `manual` | [TransferModal.tsx](../../frontend/src/components/TransferModal.tsx) | [error-validation.png](evidence/error-validation.png) | **PASSED** |
| **AC-14** | `interaction` | `manual` | [LoginView.tsx](../../frontend/src/components/LoginView.tsx), [App.tsx](../../frontend/src/App.tsx) | [login-view.png](evidence/login-view.png) | **PASSED** |
| **AC-15** | `visual` | `manual` | [BankCard3D.tsx](../../frontend/src/components/BankCard3D.tsx) | [card3d.png](evidence/card3d.png) | **PASSED** |

---

## 3. Detalle de Evidencia por Criterio

### AC-01 [functional]: Atomicidad y precisión monetaria con BigDecimal
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java#L25-L65) ejecuta la transferencia bajo `@Transactional(isolation = Isolation.READ_COMMITTED)`. El cálculo se realiza mediante `sourceAccount.getBalance().subtract(request.amount())` y `destinationAccount.getBalance().add(request.amount())`.
- **Prueba:** `TransferServiceTest.testSuccessfulTransfer` ejecutó el débito y crédito atómico sobre cuentas con saldo `new BigDecimal("1000.00")` y `new BigDecimal("500.00")`, validando saldos finales exactos `$700.00` y `$800.00`.
- **Resultado:** PASSED (Exit code 0).

### AC-02 [functional]: Persistencia inmutable del historial de transacciones
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [Transaction.java](../../backend/src/main/java/com/udea/banco/model/Transaction.java) mapea las propiedades `id` (UUID), `sourceAccountNumber`, `destinationAccountNumber`, `amount`, `timestamp`, `status` y `qrPayload`. No expone métodos mutadores para las propiedades históricas.
- **Prueba:** `TransferServiceTest.testSuccessfulTransfer` valida la invocación a `transactionRepository.save(...)` con los datos inmutables y la captura del UUID devuelto.
- **Resultado:** PASSED (Exit code 0).

### AC-03 [functional]: Generación de código QR con metadata de comprobante
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [QrCodeService.java](../../backend/src/main/java/com/udea/banco/service/QrCodeService.java) usa ZXing `QRCodeWriter` con codificación UTF-8, corrección de errores nivel M y compresión PNG codificada en Base64 con encabezado data URI `data:image/png;base64,`.
- **Prueba:** `QrCodeServiceTest.testQrGeneration` verificó que el string resultante no sea nulo, comience con `data:image/png;base64,` y contenga bytes decodificables en PNG.
- **Resultado:** PASSED (Exit code 0).

### AC-04 [functional]: Respuesta HTTP 201 Created con payload de comprobante
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransferController.java](../../backend/src/main/java/com/udea/banco/controller/TransferController.java#L25-L35) expone `POST /api/transfers` con anotación `@ResponseStatus(HttpStatus.CREATED)` retornando el record `TransferResponse`.
- **Resultado:** PASSED (Exit code 0).

### AC-05 [functional]: Historial de transacciones ordenado cronológicamente inverso
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransactionRepository.java](../../backend/src/main/java/com/udea/banco/repository/TransactionRepository.java) implementa `findAllByOrderByTimestampDesc()`. [TransactionController.java](../../backend/src/main/java/com/udea/banco/controller/TransactionController.java) retorna la lista mapeada a `TransactionDto`.
- **Resultado:** PASSED (Exit code 0).

### AC-06 [functional]: Listado de cuentas con titulares y saldos
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [AccountController.java](../../backend/src/main/java/com/udea/banco/controller/AccountController.java) expone `GET /api/accounts`. Los datos son sembrados por [DataInitializer.java](../../backend/src/main/java/com/udea/banco/config/DataInitializer.java) con tres cuentas de prueba: Diego Ramírez (`CTA-1001`, $1.500.000), Pedro Gómez (`CTA-1002`, $850.000) y María López (`CTA-1003`, $2.300.000).
- **Resultado:** PASSED (Exit code 0).

### AC-07 [functional]: Rechazo por fondos insuficientes sin mutación de saldo
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java#L35-L42) verifica `sourceAccount.getBalance().compareTo(request.amount()) < 0` y lanza `InsufficientFundsException`. [GlobalExceptionHandler.java](../../backend/src/main/java/com/udea/banco/exception/GlobalExceptionHandler.java#L25-L32) lo mapea a HTTP 400 Bad Request.
- **Prueba:** `TransferServiceTest.testInsufficientFunds` comprueba que no se invoque `save()` sobre repositorios y que los saldos permanezcan intactos.
- **Resultado:** PASSED (Exit code 0).

### AC-08 [functional]: Rechazo de transferencia si la cuenta no existe
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java#L30-L34) valida la existencia de cuenta origen y destino mediante `findById()`, lanzando `AccountNotFoundException` si alguna no está presente. Mapeado a HTTP 404 Not Found en [GlobalExceptionHandler.java](../../backend/src/main/java/com/udea/banco/exception/GlobalExceptionHandler.java#L15-L22).
- **Prueba:** `TransferServiceTest.testAccountNotFound` verificó el lanzamiento de la excepción ante cuenta inexistente.
- **Resultado:** PASSED (Exit code 0).

### AC-09 [functional]: Rechazo ante cuentas idénticas o monto no positivo
- **Categoría:** `EXECUTED` / `OBSERVED`
- **Evidencia:** [TransferService.java](../../backend/src/main/java/com/udea/banco/service/TransferService.java#L28-L30) valida que `sourceAccountNumber` sea distinto de `destinationAccountNumber` y que `amount.compareTo(BigDecimal.ZERO) > 0`, lanzando `InvalidTransferException` mapeado a HTTP 400 Bad Request.
- **Prueba:** `TransferServiceTest.testSameAccountTransfer` y `testNonPositiveAmount` verificaron ambos casos de borde.
- **Resultado:** PASSED (Exit code 0).

### AC-10 [visual]: Loading state no invasivo sin layout shift (CLS = 0)
- **Categoría:** `OBSERVED`
- **Evidencia:** [TransactionHistory.tsx](../../frontend/src/components/TransactionHistory.tsx#L40-L60) renderiza filas esqueléticas (`animate-pulse`, `h-16`, `rounded-xl`, `bg-stone-100`) cuando `loading === true`, preservando la altura exacta y dimensionalidad del contenedor, evitando Cumulative Layout Shift.
- **Resultado:** PASSED.

### AC-11 [visual]: Empty state ilustrado con CTA para primera transferencia
- **Categoría:** `OBSERVED`
- **Evidencia:** [TransactionHistory.tsx](../../frontend/src/components/TransactionHistory.tsx#L62-L78) renderiza contenedor con icono `ArrowRightLeft` de Lucide, copy editorial bancario ("Sin movimientos registrados") y botón CTA interactivo ("Nueva Transferencia") que invoca el callback para abrir el diálogo de transferencia.
- **Resultado:** PASSED.

### AC-12 [interaction]: Modal de comprobante con código QR y actualización de saldo
- **Categoría:** `OBSERVED`
- **Evidencia:** [ReceiptModal.tsx](../../frontend/src/components/ReceiptModal.tsx#L25-L95) renderiza encabezado de confirmación con check verde, imagen del código QR Base64 (`src={receipt.qrCodeBase64}`), identificador de transacción, botón para copiar el UUID al portapapeles y acción para cerrar que gatilla la recarga reactiva de los saldos de cuenta en [Dashboard.tsx](../../frontend/src/components/Dashboard.tsx).
- **Resultado:** PASSED.

### AC-13 [interaction]: Banner de error explicativo con retención de formulario
- **Categoría:** `OBSERVED`
- **Evidencia:** [TransferModal.tsx](../../frontend/src/components/TransferModal.tsx#L65-L80) valida en tiempo real si el monto ingresado excede el saldo de la cuenta activa (`amountNumber > activeAccount.balance`), mostrando advertencia preventiva. Si el backend responde con error, se despliega un banner de alerta con el mensaje sin limpiar el formulario, permitiendo corrección inmediata.
- **Resultado:** PASSED.

### AC-14 [interaction]: Pantalla de login de presentación con selección de perfiles
- **Categoría:** `OBSERVED`
- **Evidencia:** [LoginView.tsx](../../frontend/src/components/LoginView.tsx) implementa el portal de acceso bancario institucional con selector de tarjetas de perfiles precargados (Diego Ramírez, Pedro Gómez, María López). Al seleccionar una tarjeta o pulsar "Acceder a Banca en Línea", conmuta fluidamente a la vista [Dashboard.tsx](../../frontend/src/components/Dashboard.tsx) estableciendo la sesión activa.
- **Resultado:** PASSED.

### AC-15 [visual]: Tarjetas bancarias 3D táctiles con perspectiva y accesibilidad
- **Categoría:** `OBSERVED`
- **Evidencia:** [BankCard3D.tsx](../../frontend/src/components/BankCard3D.tsx) implementa:
  - Perspectiva CSS `perspective: 1000px` y `transform-style: preserve-3d`.
  - Inclinación dinámica mediante `onPointerMove` con rotaciones suaves calculadas `(rotateX, rotateY)` limitadas a $\pm 10^\circ$.
  - Chip EMV vectorial SVG, patrón de contacto metálico, y numeración enmascarada con tipografía monoespaciada `tabular-nums`.
  - Respeto del estándar de accesibilidad: media query `motion-reduce:transform-none` y `motion-reduce:transition-none` desactivando transformaciones complejas para usuarios con sensibilidad vestibular.
- **Resultado:** PASSED.

---

## 4. Resultados de Checks Automatizados

### Check 1: `backend-unit-test`
- **Comando:** `.\mvnw.cmd -q test`
- **Directorio de Trabajo (`cwd`):** `backend`
- **Timeout:** 600000 ms
- **Resultado:** Exit code 0 (6 tests ejecutados, 0 fallos, 0 errores, 0 omitidos).
- **Cobertura probada:**
  - `TransferServiceTest`: Operaciones atómicas, balance post-transferencia, rechazos por fondos, cuenta inexistente, misma cuenta, monto menor o igual a cero.
  - `QrCodeServiceTest`: Formato data URI Base64 PNG y contenido no nulo.

### Check 2: `frontend-build`
- **Comando:** `npm run build`
- **Directorio de Trabajo (`cwd`):** `frontend`
- **Timeout:** 300000 ms
- **Resultado:** Exit code 0 (TypeScript compilado sin errores, empaquetado de producción Vite en `frontend/dist/` completado en 3.57s).

---

## 5. Límites y Restricciones Verificadas

1. **Moneda Base:** Todas las transacciones se operan en pesos colombianos (`COP`) mediante precisión fija en `BigDecimal`. No se incluyen tasas de cambio multimoneda (fuera de alcance según spec).
2. **Sistema Cerrado:** Solo se procesan transferencias entre cuentas registradas en el banco local (cuentas sembradas o dadas de alta en la entidad).
3. **Gestión de Sesión:** La sesión de usuario es contextual en frontend orientada a la demostración pedagógica del laboratorio.
4. **Base de Datos:** Verificado sobre PostgreSQL local en puerto 5432 (`bankdb`). Para entornos aislados de CI/CD, las pruebas unitarias ejecutan con mocks de Mockito sin requerir conectividad de red externa.
