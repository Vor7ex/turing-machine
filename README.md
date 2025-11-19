# Entregable (Fase 1)

## Regex elegido

Se eligió el regex correspondiente a una contraseña simple: [a-zA-Z0-9]{8,}. Coincide con una cadena que contiene exclusivamente caracteres alfanuméricos (letras mayúsculas, minúsculas o dígitos) y cuya longitud total es de al menos 8 caracteres.

## Diagrama AFD

![Diagrama AFD [a-zA-Z0-9]{8,}](https://imgur.com/a/0vUqhRj)

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