// ===== VARIABLES DE ESTADO GLOBALES =====
let tape = []; // La cinta de la máquina de Turing
let headPosition = 0; // Posición actual del cabezal
let currentState = 'q0'; // Estado actual de la máquina
let stepCount = 0; // Contador de pasos ejecutados
let isRunning = false; // Bandera para saber si está ejecutándose automáticamente
let executionSpeed = 400; // Velocidad de ejecución en milisegundos

// Símbolo en blanco
const BLANK = '⊔';

// ===== TABLA DE TRANSICIONES =====
// Estructura: transitionTable[estado_actual][tipo_símbolo] = { newState, writeSymbol, move }
// Movimientos: 'R' = Derecha, 'S' = Quieto (Stay)
const transitionTable = {
    // Estados contadores q0 a q6 (caracteres 1-7)
    'q0': {
        'A': { newState: 'q1', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q1': {
        'A': { newState: 'q2', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q2': {
        'A': { newState: 'q3', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q3': {
        'A': { newState: 'q4', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q4': {
        'A': { newState: 'q5', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q5': {
        'A': { newState: 'q6', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    'q6': {
        'A': { newState: 'q7', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    // Estado q7 (carácter 8 - transición a aceptación)
    'q7': {
        'A': { newState: 'q_acc', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    },
    // Estado de aceptación (lazo)
    'q_acc': {
        'A': { newState: 'q_acc', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_acc', writeSymbol: 'BLANK', move: 'S' } // Acepta y se detiene
    },
    // Estado de rechazo (estado muerto)
    'q_rej': {
        'A': { newState: 'q_rej', writeSymbol: 'A', move: 'R' },
        'A\'': { newState: 'q_rej', writeSymbol: 'A\'', move: 'R' },
        'BLANK': { newState: 'q_rej', writeSymbol: 'BLANK', move: 'S' }
    }
};

// ===== FUNCIONES AUXILIARES =====

/**
 * Determina si un carácter es alfanumérico [a-zA-Z0-9]
 */
function isAlphanumeric(char) {
    if (char === BLANK) return false;
    return /^[a-zA-Z0-9]$/.test(char);
}

/**
 * Clasifica un símbolo para la tabla de transiciones
 */
function classifySymbol(char) {
    if (char === BLANK) return 'BLANK';
    if (isAlphanumeric(char)) return 'A';
    return 'A\'';
}

/**
 * Obtiene el tipo de clase CSS según el símbolo
 */
function getSymbolClass(char) {
    if (char === BLANK) return 'blank';
    if (isAlphanumeric(char)) return 'alphanumeric';
    return 'special';
}

// ===== FUNCIONES DE VISUALIZACIÓN =====

/**
 * Renderiza la cinta visualmente
 */
function renderTape() {
    const tapeElement = document.getElementById('tape');
    tapeElement.innerHTML = '';

    tape.forEach((symbol, index) => {
        const cell = document.createElement('div');
        cell.className = 'tape-cell';
        cell.textContent = symbol;
        
        // Añadir clase según el tipo de símbolo
        cell.classList.add(getSymbolClass(symbol));
        
        // Resaltar la posición del cabezal
        if (index === headPosition) {
            cell.classList.add('head');
        }
        
        tapeElement.appendChild(cell);
    });
}

/**
 * Actualiza la información de estado en la UI
 */
function updateStateDisplay() {
    document.getElementById('currentState').textContent = currentState;
    document.getElementById('headPosition').textContent = headPosition;
    
    const currentSymbol = tape[headPosition] || BLANK;
    document.getElementById('currentSymbol').textContent = currentSymbol;
    
    document.getElementById('stepCount').textContent = stepCount;
}

/**
 * Actualiza el mensaje de resultado
 */
function updateResult(message, status) {
    const resultBox = document.getElementById('result');
    const resultMessage = resultBox.querySelector('.result-message');
    
    resultMessage.textContent = message;
    
    // Limpiar clases previas
    resultBox.className = 'result-box';
    
    // Añadir nueva clase
    if (status) {
        resultBox.classList.add(status);
    }
}

// ===== FUNCIONES DE CONTROL DE LA MÁQUINA =====

/**
 * Carga la cinta inicial desde el input del usuario
 */
function loadTape() {
    const input = document.getElementById('tapeInput').value;
    
    if (!input) {
        alert('Por favor, ingrese una cadena para validar.');
        return;
    }
    
    // Inicializar la cinta con la entrada del usuario + símbolo en blanco al final
    tape = input.split('');
    tape.push(BLANK);
    
    // Resetear estado
    headPosition = 0;
    currentState = 'q0';
    stepCount = 0;
    isRunning = false;
    
    // Actualizar UI
    renderTape();
    updateStateDisplay();
    updateResult('Cinta cargada. Lista para ejecutar...', 'processing');
    
    // Habilitar botones
    document.getElementById('stepBtn').disabled = false;
    document.getElementById('runBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('loadBtn').disabled = true;
}

/**
 * Ejecuta un solo paso de la máquina de Turing
 * Retorna true si la máquina debe continuar, false si debe detenerse
 */
function executeStep() {
    // Verificar si ya terminó
    if (isHalted()) {
        return false;
    }
    
    // Leer el símbolo actual
    const currentSymbol = tape[headPosition] || BLANK;
    const symbolType = classifySymbol(currentSymbol);
    
    // Buscar la transición en la tabla
    const transition = transitionTable[currentState][symbolType];
    
    if (!transition) {
        console.error('Transición no definida:', currentState, symbolType);
        updateResult('Error: Transición no definida', 'rejected');
        return false;
    }
    
    // Aplicar la transición
    const { newState, writeSymbol, move } = transition;
    
    // Escribir símbolo (mantener el símbolo si es el mismo tipo)
    if (writeSymbol === 'A' || writeSymbol === 'A\'') {
        tape[headPosition] = currentSymbol;
    } else if (writeSymbol === 'BLANK') {
        tape[headPosition] = BLANK;
    }
    
    // Cambiar de estado
    currentState = newState;
    
    // Mover el cabezal
    if (move === 'R') {
        headPosition++;
        // Extender la cinta si es necesario
        if (headPosition >= tape.length) {
            tape.push(BLANK);
        }
    }
    // Si move === 'S', no se mueve el cabezal
    
    // Incrementar contador de pasos
    stepCount++;
    
    // Actualizar visualización
    renderTape();
    updateStateDisplay();
    
    // Verificar si llegó a un estado de parada
    if (isHalted()) {
        showFinalResult();
        return false;
    }
    
    return true;
}

/**
 * Verifica si la máquina debe detenerse
 */
function isHalted() {
    // La máquina se detiene cuando:
    // 1. Está en q_acc y lee BLANK (movimiento S)
    // 2. Está en q_rej y lee BLANK (movimiento S)
    const currentSymbol = tape[headPosition] || BLANK;
    const symbolType = classifySymbol(currentSymbol);
    
    if ((currentState === 'q_acc' || currentState === 'q_rej') && symbolType === 'BLANK') {
        const transition = transitionTable[currentState][symbolType];
        return transition.move === 'S';
    }
    
    return false;
}

/**
 * Muestra el resultado final de la ejecución
 */
function showFinalResult() {
    if (currentState === 'q_acc') {
        updateResult('CADENA ACEPTADA: La contraseña es válida (≥8 caracteres alfanuméricos)', 'accepted');
    } else if (currentState === 'q_rej') {
        updateResult('CADENA RECHAZADA: La contraseña no cumple con los requisitos', 'rejected');
    }
    
    // Deshabilitar botones de ejecución
    document.getElementById('stepBtn').disabled = true;
    document.getElementById('runBtn').disabled = true;
    isRunning = false;
}

/**
 * Ejecuta un paso individual (botón "Paso a Paso")
 */
function stepExecution() {
    if (!isHalted()) {
        executeStep();
    }
}

/**
 * Ejecuta automáticamente toda la máquina
 */
async function runAutomatically() {
    if (isRunning) {
        // Si ya está corriendo, detener
        isRunning = false;
        document.getElementById('runBtn').textContent = 'Ejecutar Auto';
        document.getElementById('stepBtn').disabled = false;
        return;
    }
    
    // Iniciar ejecución automática
    isRunning = true;
    document.getElementById('runBtn').textContent = 'Pausar';
    document.getElementById('stepBtn').disabled = true;
    
    while (isRunning && !isHalted()) {
        const shouldContinue = executeStep();
        
        if (!shouldContinue) {
            break;
        }
        
        // Esperar según la velocidad configurada
        await sleep(executionSpeed);
    }
    
    // Restaurar botón
    isRunning = false;
    document.getElementById('runBtn').textContent = 'Ejecutar Auto';
    document.getElementById('stepBtn').disabled = isHalted();
}

/**
 * Función auxiliar para pausar la ejecución
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reinicia toda la máquina al estado inicial
 */
function reset() {
    tape = [];
    headPosition = 0;
    currentState = 'q0';
    stepCount = 0;
    isRunning = false;
    
    // Limpiar visualización
    document.getElementById('tape').innerHTML = '';
    updateStateDisplay();
    updateResult('Esperando entrada...', 'waiting');
    
    // Resetear botones
    document.getElementById('loadBtn').disabled = false;
    document.getElementById('stepBtn').disabled = true;
    document.getElementById('runBtn').disabled = true;
    document.getElementById('runBtn').textContent = 'Ejecutar Auto';
    document.getElementById('resetBtn').disabled = true;
    
    // Limpiar input
    document.getElementById('tapeInput').value = '';
    document.getElementById('tapeInput').focus();
}

// ===== CONTROL DEL SLIDER DE VELOCIDAD =====
function updateSpeed() {
    const slider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    executionSpeed = parseInt(slider.value);
    speedValue.textContent = `${executionSpeed}ms`;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Botones de control
    document.getElementById('loadBtn').addEventListener('click', loadTape);
    document.getElementById('stepBtn').addEventListener('click', stepExecution);
    document.getElementById('runBtn').addEventListener('click', runAutomatically);
    document.getElementById('resetBtn').addEventListener('click', reset);
    
    // Slider de velocidad
    document.getElementById('speedSlider').addEventListener('input', updateSpeed);
    
    // Permitir cargar con Enter en el input
    document.getElementById('tapeInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('loadBtn').disabled) {
            loadTape();
        }
    });
    
    // Inicializar resultado
    updateResult('Esperando entrada...', 'waiting');
    
    console.log('Simulador de Máquina de Turing cargado correctamente');
    console.log('Regex: [a-zA-Z0-9]{8,}');
    console.log('Estados: q0-q7, q_acc, q_rej');
});
