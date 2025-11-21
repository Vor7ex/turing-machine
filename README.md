# Información del proyecto

El presente proyecto busca construir un simulador de Máquina de Turing (MT) con HTML, CSS y JavaScript que emule un Autómata Finito (AFD) diseñado para validar una expresión regular (Regex) de un formulario web.

Realizado para la materia de Gramáticas y Lenguajes Formales.

Autor: Juan Alejandro Salgado Arcila

# Entregable (Fase 1)

## Regex elegido

Se eligió el regex correspondiente a una contraseña simple: `[a-zA-Z0-9]{8,}`. Coincide con una cadena que contiene exclusivamente caracteres alfanuméricos (letras mayúsculas, minúsculas o dígitos) y cuya longitud total es de al menos 8 caracteres.

### Justificación de la elección del regex

La expresión regular `[a-zA-Z0-9]{8,}` fue seleccionada por las siguientes razones:

1. **Aplicación práctica real**: Este patrón es ampliamente utilizado en sistemas de autenticación para validar contraseñas básicas. Representa un caso de uso común en el desarrollo web y aplicaciones de seguridad informática.

2. **Complejidad didáctica apropiada**: 
   - No es trivial (requiere contar caracteres y validar un alfabeto específico)
   - No es excesivamente complejo (permite una implementación clara del AFD)
   - Ilustra perfectamente conceptos fundamentales de autómatas finitos

3. **Demostración de conceptos clave**:
   - **Conteo finito**: La necesidad de contar hasta 8 caracteres demuestra el uso de estados secuenciales
   - **Validación de alfabeto**: La restricción a caracteres alfanuméricos muestra el manejo de diferentes símbolos de entrada
   - **Aceptación con bucle**: El estado de aceptación con lazo (para cadenas de longitud > 8) ilustra la capacidad de los AFD para reconocer lenguajes infinitos con recursos finitos

4. **Relevancia educativa**: Permite visualizar claramente cómo un AFD puede implementar una política de seguridad simple, conectando la teoría de la computación con problemas del mundo real.

## Demostración: ¿Por qué este regex es un lenguaje regular?

Para demostrar que el lenguaje definido por `[a-zA-Z0-9]{8,}` es **regular**, presentamos múltiples argumentos formales:

### 1. Representación mediante expresión regular

Por definición, todo lenguaje que puede ser descrito mediante una expresión regular es un **lenguaje regular**. La expresión `[a-zA-Z0-9]{8,}` está construida usando operaciones regulares básicas:

- **Unión**: `[a-zA-Z0-9]` representa la unión de los alfabetos a-z, A-Z y 0-9
- **Concatenación**: `{8,}` indica concatenación repetida (al menos 8 veces)
- **Clausura de Kleene** (implícita): `{8,}` equivale a `{8} · (alfabeto)*`

Esta expresión puede reescribirse formalmente como:

$$L = \Sigma^8 \cdot \Sigma^*$$

donde $\Sigma = \{a, b, ..., z, A, B, ..., Z, 0, 1, ..., 9\}$

### 2. Existencia de un Autómata Finito Determinista (AFD)

El **Teorema de Kleene** establece que un lenguaje es regular si y solo si existe un autómata finito que lo reconoce. En este proyecto se ha diseñado explícitamente un AFD con las siguientes características:

- **Conjunto de estados finito**: $Q = \{q_0, q_1, q_2, q_3, q_4, q_5, q_6, q_7, q_{acc}, q_{rej}\}$ (10 estados)
- **Alfabeto de entrada**: $\Sigma = [a-zA-Z0-9] \cup \{\text{otros símbolos}\}$
- **Estado inicial**: $q_0$
- **Estados de aceptación**: $F = \{q_{acc}\}$
- **Función de transición**: Definida completamente en la tabla de transición

Este AFD reconoce exactamente el lenguaje descrito por el regex, lo que prueba que es regular.

### 3. Propiedades de los lenguajes regulares

El lenguaje cumple con propiedades características de los lenguajes regulares:

- **Propiedad de bombeo (Pumping Lemma)**: Para cualquier cadena $w \in L$ con $|w| \geq 8$, se puede descomponer en $w = xyz$ donde:
  - $|xy| \leq 8$
  - $|y| \geq 1$
  - Para todo $i \geq 0$, $xy^iz \in L$
  
  Esto se cumple porque después de contar 8 caracteres, cualquier número adicional de caracteres alfanuméricos es aceptado.

- **Memoria finita**: El autómata solo necesita "recordar" cuántos caracteres alfanuméricos ha leído (hasta 8), lo cual requiere un número finito de estados.

### 4. Equivalencia con la Máquina de Turing restringida

Aunque este proyecto simula el comportamiento mediante una Máquina de Turing, la MT está operando en modo **AFD restringido**:

- Solo se mueve hacia la **derecha** (R) o se detiene (S)
- **No modifica** la cinta (escribe el mismo símbolo que lee)
- **No retrocede** para leer símbolos anteriores
- Usa **memoria finita** (número fijo de estados)

Esta restricción demuestra que cualquier lenguaje regular puede ser reconocido por una MT que opera como un simple autómata finito, validando la jerarquía de Chomsky donde los lenguajes regulares (Tipo 3) son un subconjunto de los lenguajes reconocidos por MTs.

### Conclusión formal

El lenguaje $L = \{w \in [a-zA-Z0-9]^* \mid |w| \geq 8\}$ es **regular** porque:

1. ✓ Puede expresarse mediante una expresión regular
2. ✓ Existe un AFD que lo reconoce (demostrado en el diagrama)
3. ✓ Cumple con el pumping lemma para lenguajes regulares
4. ✓ Requiere solo memoria finita para su reconocimiento

## Diagrama AFD

![Diagrama AFD [a-zA-Z0-9]{8,}](https://i.imgur.com/GuRVbsA.png)

## Tabla de transición de la MT

Usaremos las siguientes abreviaturas:

- **A**: Cualquier carácter alfanumérico [a-zA-Z0-9]
- **A'**: Cualquier carácter NO alfanumérico (símbolos, puntuación, etc.)
- **⊔**: Símbolo en blanco (fin de la entrada)
- **q_acc**: Estado de aceptación
- **q_rej**: Estado de rechazo
- **R**: Movimiento a la Derecha
- **S**: Movimiento Quieto (Stay)

| Estado Actual (Q) | Símbolo Leído (x) | Estado Siguiente (Q') | Símbolo Escrito (x') | Movimiento (D) | Razón / Comentario |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **q_i (i=0..6)** | A | q_{i+1} | A | R | **Contador (1 a 7):** Lee alfanumérico y avanza. |
| **q_7** | A | q_acc | A | R | **Carácter 8:** Llega al estado de aceptación. |
| **q_acc** | A | q_acc | A | R | **Lazo de Aceptación:** Longitud > 8, sigue leyendo. |
| **q_acc** | ⊔ | q_acc | ⊔ | S | **Fin de Cadena Válida:** Detiene la MT y acepta. |
| **q_acc** | A' | q_rej | A' | R | **Rechazo por Símbolo (tardío).** |
| **q_i (i=0..7)** | ⊔ | q_rej | ⊔ | S | **Rechazo por Longitud:** Cadena < 8 y termina. |
| **q_i (i=0..7)** | A' | q_rej | A' | R | **Rechazo por Símbolo (temprano).** |
| **q_rej** | A o A' o ⊔ | q_rej | x | R/S | **Estado Muerto:** Cualquier entrada, permanece en rechazo. |