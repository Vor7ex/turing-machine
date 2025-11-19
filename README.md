# Entregable (Fase 1)

## Regex elegido

Se eligió el regex correspondiente a una contraseña simple: [a-zA-Z0-9]{8,}. Coincide con una cadena que contiene exclusivamente caracteres alfanuméricos (letras mayúsculas, minúsculas o dígitos) y cuya longitud total es de al menos 8 caracteres.

## Diagrama AFD

## Tabla de transición de la MT

Usaremos las siguientes abreviaturas:
$A$: Cualquier carácter alfanumérico ($\text{[a-zA-Z0-9]}$).
$A'$: Cualquier carácter NO alfanumérico (símbolos, puntuación, etc.).
$\sqcup$: Símbolo en blanco (fin de la entrada).
$q_{\text{acc}}$: Estado de aceptación ($q_{accept}$).
$q_{\text{rej}}$: Estado de rechazo ($q_{reject}$).
$R$: Movimiento a la Derecha.
$S$: Movimiento Quieto (Stop/Stay).

| Estado Actual ($Q$) | Símbolo Leído ($x$) | Estado Siguiente ($Q'$) | Símbolo Escrito ($x'$) | Movimiento ($D$) | Razón / Comentario |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **q_i (i=0..6)** | A | q_{i+1} | A | R | **Contador (1 a 7):** Lee alfanumérico y avanza. |
| **q_7** | A | q_{acc} | A | R | **Carácter 8:** Llega al estado de aceptación. |
| **q_{acc}** | A | q_{acc} | A | R | **Lazo de Aceptación:** Longitud > 8, sigue leyendo. |
| **q_{acc}** | sqcup | q_{acc} | sqcup | S | **Fin de Cadena Válida:** Detiene la MT y acepta. |
| **q_{acc}** | A' | q_{rej} | A' | R | **Rechazo por Símbolo (tardío).** |
| **q_i (i=0..7)** | sqcup | q_{rej} | sqcup | S | **Rechazo por Longitud:** Cadena < 8 y termina. |
| **q_i (i=0..7)** | A' | q_{rej} | A' | R | **Rechazo por Símbolo (temprano).** |
| **q_{rej}** | A o A' o sqcup | q_{rej} | x | R/S | **Estado Muerto:** Cualquier entrada, permanece en rechazo. |