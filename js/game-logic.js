// =============================================
// GESTIÓN DEL ESTADO DEL JUEGO
// =============================================

/**
 * Estados posibles del juego
 */
const EstadoJuego = {
    TITULO: "titulo",
    CARGANDO: "cargando",
    CAPITULO1: "capitulo1",
    CAPITULO2: "capitulo2",
    PRUEBA: "prueba",
    CAPITULO3: "capitulo3",
    MENSAJES: "mensajes",
    CAPITULO4: "capitulo4",
    FINAL_BUENO: "final_bueno",
    FINAL_MALO: "final_malo"
};

/**
 * Datos y estado actual del juego
 */
const datosJuego = {
    estadoActual: EstadoJuego.TITULO,
    dialogoActual: 0,
    mensajeActual: 0,
    respuestasCorrectas: 0,
    aliasEsperado: "12 1 27 19 15 13 2 18 1",
    misionEsperada: "5 19 16 9 1 27 4 15 2 12 5 27 9 14 6 9 12 20 18 1 4 15 27 1 20 1 17 21 5 27 5 14 27 3 21 18 19 15 27 5 22 1 3 21 1 3 9 15 14 27 9 14 13 5 4 9 1 20 1",

    // Mensajes interceptados
    mensajes: [
        {
            id: 1,
            titulo: "Primer Mensaje (Frecuencia 4)",
            matriz: "175 59 189 107 120 5\n209 52 206 104 113 1\n74 51 104 88 86 9\n99 36 104 28 86 3",
            correcta: "La traición está cerca",
            opciones: [
                "El enemigo ya ha sido derrotado.",
                "La calma ha regresado al frente.",
                "Se ha encontrado una solución diplomática.",
                "La traición está cerca"
            ],
            pensamiento: "Un espía doble se ha infiltrado en la Agencia. Necesitamos actuar con precaución."
        },
        {
            id: 2,
            titulo: "Segundo Mensaje (Frecuencia 2)",
            matriz: "29 29 22 59 59 43 22 37 68 15 24 10\n75 86 65 156 150 110 65 106 177 44 69 29",
            correcta: "El ataque está en marcha",
            opciones: [
                "El ataque ha sido detenido con éxito.",
                "El enemigo ha sido engañado y se retira.",
                "Se ha firmado una tregua con el enemigo.",
                "El ataque está en marcha"
            ],
            pensamiento: "El enemigo ha iniciado su ofensiva. Debemos tomar decisiones rápidas."
        },
        {
            id: 3,
            titulo: "Tercer Mensaje (Frecuencia 3)",
            matriz: "64 24 120 108 66 123 95 52 48 66 14\n50 13 91 95 63 123 113 26 25 69 0\n129 69 252 180 93 150 50 157 141 69 70",
            correcta: "Iniciar protocolo de evacuación",
            opciones: [
                "Preparar defensa en las zonas rurales.",
                "Enviar refuerzos a la línea de frente.",
                "Continuar con el avance hacia el objetivo principal.",
                "Iniciar protocolo de evacuación"
            ],
            pensamiento: "Deben evacuar las áreas críticas antes de que sea demasiado tarde."
        }
    ],

    // Diálogos del juego
    dialogos: {
        oraculo: [
            {
                texto: "Buenas noches, agente. Hemos detectado que varios de nuestros mensajes han sido interceptados y nuestras formas de comunicación se han vuelto vulnerables.",
                boton: "Eso nos deja en una situación crítica, ¿cómo lo piensan solucionar?",
                icono: "question_mark"
            },
            {
                texto: "Los espías en las filas han creado un nuevo método de encriptación basado en álgebra lineal. Ve con el Profesor, él te explicará el proceso en detalle.",
                boton: "Está bien, iré con él",
                icono: "arrow_forward"
            }
        ],

        profesor: [
            {
                texto: "Un placer conocer al famoso agente 'La Sombra'. El Oráculo te envió para que te explique nuestro nuevo método de encriptación lineal, ¿no?",
                boton: "Sí, él me envió",
                icono: "arrow_forward"
            },
            {
                texto: "Bueno, prepárate porque te voy a explicar cómo encriptamos y desencriptamos mensajes. Es bastante sencillo una vez que entiendes las matemáticas detrás de todo esto. Empecemos, ¿listo?",
                boton: "Adelante, te escucho",
                icono: "arrow_forward"
            },
            {
                texto: "Primero, lo que hacemos es asignar un número a cada letra del alfabeto. Esto es fácil: A es 1, B es 2, C es 3… hasta Z que es 26. Y si encontramos un espacio, lo asignamos al número 27.",
                boton: "Parece algo simple",
                icono: "arrow_forward",
                formula: "A \\to 1, \\; B \\to 2, \\; \\dots, \\; Z \\to 26, \\; - \\to 27"
            },
            {
                texto: "Eso es lo primero. Ahora tenemos una secuencia de números que representa nuestro mensaje. Vamos a organizarlos en una matriz. Pero no cualquier matriz, sino una que se divide en partes iguales. Para eso, necesitamos conocer cuántos caracteres tenemos, digamos que tenemos m caracteres en total. Lo que hacemos es dividirlos en n partes.",
                boton: "Eso es ingenioso y práctico",
                icono: "arrow_forward",
                formula: "m_1 = n \\lceil m / n \\rceil"
            },
            {
                texto: "Con esto, sabemos cuántas filas tendrá nuestra matriz. Ahora, llenamos esa matriz con los números correspondientes a las letras del mensaje. ¡Y ahí es cuando empieza la magia!",
                boton: "Lo voy entendiendo",
                icono: "arrow_forward",
                formula: "M_{m_1/n \\times n} = \\begin{bmatrix} x_1 & x_{m_1/n + 1} & \\cdots & x_{(n-1) m_1/n + 1} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ x_{m_1/n} & x_{2 m_1/n} & \\cdots & x_{n m_1/n} \\end{bmatrix}"
            },
            {
                texto: "¡Ya tenemos nuestra matriz lista! Ahora, la parte divertida: aplicar una transformación lineal. Para esto, usamos una matriz invertible E. La multiplicamos por nuestra matriz M, y voilà, tenemos el mensaje encriptado M′.",
                boton: "Eso le agrega un nivel más de complejidad",
                icono: "arrow_forward",
                formula: "M' = E \\cdot M"
            },
            {
                texto: "Pero, claro, si el enemigo intercepta el mensaje, no podrá leerlo sin la clave, que es la matriz E. Ahora, para desencriptar, usamos la matriz inversa de E, que denotamos como E^{-1}.",
                boton: "Hay algún paso más que deba saber?",
                icono: "help",
                formula: "M = E^{-1} \\cdot M'"
            },
            {
                texto: "Y eso es todo. ¡Sencillo, no! Así que ahora, si me sigues bien, este sistema de encriptación te permitirá enviar mensajes de manera segura.",
                boton: "Creo que lo entendí",
                icono: "check"
            },
            {
                texto: "Para confirmar que comprendes el método, ingresa el alias asignado al espía ('La Sombra') en forma numérica.",
                boton: "Enviar",
                icono: "send"
            }
        ]
    }
};

// =============================================
// ELEMENTOS DEL DOM
// =============================================
const contenedorJuego = document.getElementById("game-container");

// =============================================
// FUNCIONES PRINCIPALES DEL JUEGO
// =============================================

/**
 * Renderiza la escena actual del juego
 */
async function renderizarEscena() {
    // Limpiar con animación si hay contenido previo
    if (contenedorJuego.innerHTML !== '') {
        contenedorJuego.style.animation = 'fadeOut 0.5s forwards';
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    contenedorJuego.innerHTML = "";
    contenedorJuego.style.animation = 'fadeIn 0.5s forwards';

    switch(datosJuego.estadoActual) {
        case EstadoJuego.TITULO: return renderizarTitulo();
        case EstadoJuego.CARGANDO: return renderizarCargando();
        case EstadoJuego.CAPITULO1: return renderizarCapitulo1();
        case EstadoJuego.CAPITULO2: return renderizarCapitulo2();
        case EstadoJuego.PRUEBA: return renderizarPrueba();
        case EstadoJuego.CAPITULO3: return renderizarCapitulo3();
        case EstadoJuego.MENSAJES: return renderizarMensajesInterceptados();
        case EstadoJuego.CAPITULO4: return renderizarCapitulo4();
        case EstadoJuego.FINAL_BUENO: return renderizarFinal(true);
        case EstadoJuego.FINAL_MALO: return renderizarFinal(false);
    }

    renderizarFormulas();
}

/**
 * Renderiza las fórmulas matemáticas usando MathJax
 */
function renderizarFormulas() {
    if (window.MathJax) {
        const mathContainers = document.querySelectorAll('.math-display:not(.mathjax-processed)');
        if (mathContainers.length > 0) {
            MathJax.typesetClear(mathContainers);
            MathJax.typesetPromise(mathContainers)
                .then(() => {
                    mathContainers.forEach(container => {
                        container.classList.add('mathjax-processed');
                    });
                })
                .catch(err => console.error("Error al renderizar fórmulas:", err));
        }
    }
}

// =============================================
// FUNCIONES DE RENDERIZADO DE ESCENAS
// =============================================

/**
 * Renderiza la pantalla de título
 */
function renderizarTitulo() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
      <h1 class="typewriter">El Legado de la Sombra</h1>
      <p class="typewriter-subtitle">Una aventura de espionaje y criptografía</p>
      <img src="images/scene_main.png" class="scene-image" alt="Ciudad nocturna">
      <button class="game-button" onclick="iniciarJuego()">Iniciar Misión</button>
    </div>
    `;
}

/**
 * Renderiza la pantalla de carga
 */
function renderizarCargando() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
      <h2>CARGANDO MISIÓN SECRETA</h2>
      <div class="progress-container">
        <div id="barra-carga" class="progress-bar"></div>
      </div>
      <p class="loading-text">Descifrando archivos clasificados...</p>
    </div>
    `;
    animarBarraDeCarga();
}

/**
 * Renderiza el primer capítulo
 */
function renderizarCapitulo1() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
      <h2 class="chapter-title">Capítulo 1: La Ciudad en la Penumbra</h2>
      <div class="chapter-content">
        <p>En una época de crisis, la corrupción y la traición han tejido una red que amenaza con desestabilizar la nación. En este oscuro panorama, la Agencia Eclipse opera en las sombras, custodiando secretos vitales para la supervivencia del país.</p>
        <p>Tú eres <strong>La Sombra</strong>, un agente de élite conocido por resolver los casos más imposibles. Tu reputación en la Agencia Eclipse es legendaria, pero esta vez, la misión es diferente.</p>
        <img src="images/noir_city_night.png" class="scene-image" alt="Ciudad nocturna">
        <button class="game-button" onclick="mostrarTransicionCapitulo(); setTimeout(() => avanzarEscena(), 2000)">
          <span class="material-icons">arrow_forward</span>
          Continuar
        </button>
      </div>
    </div>
    `;
}

/**
 * Renderiza el segundo capítulo
 */
function renderizarCapitulo2() {
    if (datosJuego.dialogoActual === 0) {
        contenedorJuego.innerHTML = `
        <div class="game-section">
          <h2 class="chapter-title">Capítulo 2: El Método de Encriptación Lineal</h2>
        </div>
        `;
    } else {
        contenedorJuego.innerHTML = '';
    }

    setTimeout(() => {
        if (datosJuego.dialogoActual < datosJuego.dialogos.oraculo.length) {
            renderizarDialogoOraculo();
        } else if (datosJuego.dialogoActual < datosJuego.dialogos.oraculo.length + datosJuego.dialogos.profesor.length) {
            renderizarDialogoProfesor();
        } else {
            mostrarTransicionCapitulo();
            setTimeout(() => {
                datosJuego.estadoActual = EstadoJuego.PRUEBA;
                renderizarEscena();
            }, 2000);
        }
    }, 100);
}

/**
 * Renderiza un diálogo con el Oráculo
 */
async function renderizarDialogoOraculo() {
    const dialogo = datosJuego.dialogos.oraculo[datosJuego.dialogoActual];

    const dialogContainer = document.createElement('div');
    dialogContainer.className = `game-dialog`;
    dialogContainer.innerHTML = `
      <img src="images/character_oracle.png" class="character-image" alt="El Oráculo">
      <div class="dialog-text">
        <div class="character-name">El Oráculo</div>
        <div class="dialog-content">${dialogo.texto}</div>
        <button class="game-button" onclick="avanzarDialogo()">
          <span class="material-icons">${dialogo.icono}</span>
          ${dialogo.boton}
        </button>
      </div>
    `;

    contenedorJuego.appendChild(dialogContainer);
}

/**
 * Renderiza un diálogo con el Profesor
 */
async function renderizarDialogoProfesor() {
    const indice = datosJuego.dialogoActual - datosJuego.dialogos.oraculo.length;
    const dialogo = datosJuego.dialogos.profesor[indice];

    let contenidoMatematico = '';
    if (dialogo.formula) {
        contenidoMatematico = `
        <div class="math-container">
            <div class="math-display">
                \\[ ${dialogo.formula} \\]
            </div>
        </div>
        `;
    }

    const dialogContainer = document.createElement('div');
    dialogContainer.className = `game-dialog`;
    dialogContainer.innerHTML = `
      <img src="images/character_professor.png" class="character-image" alt="El Profesor">
      <div class="dialog-text">
        <div class="character-name"><strong>El Profesor</strong></div>
        <div class="dialog-content">${dialogo.texto}</div>
        ${contenidoMatematico}
        <button class="game-button" onclick="avanzarDialogo()">
          ${dialogo.boton}
        </button>
      </div>
    `;

    contenedorJuego.appendChild(dialogContainer);
    renderizarFormulas();
}

/**
 * Renderiza la prueba de encriptación
 */
function renderizarPrueba() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
      <div class="game-dialog">
        <img src="images/character_professor.png" class="character-image" alt="El Profesor">
        <div class="dialog-text">
          <div class="character-name"><strong>El Profesor</strong></div>
          <div class="dialog-content">Para confirmar que comprendes el método, ingresa el alias asignado al espía ('La Sombra') en forma numérica.</div>
          <div class="input-container">
            <input type="text" id="entradaAlias" class="game-input" placeholder="Ej: 8 15 12 1 27 13 21 14 4 15">
          </div>
          <button class="game-button" onclick="verificarAlias()">Enviar</button>
        </div>
      </div>
    </div>
    `;
}

/**
 * Renderiza el tercer capítulo
 */
function renderizarCapitulo3() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
        <h2 class="chapter-title">Capítulo 3: Los Mensajes Interceptados</h2>
        <div class="chapter-content">
            <p>Tres mensajes han sido interceptados, esto proviene de un agente de la agencia. Son urgentes. Si los enemigos los descifran antes que tú, el plan estará perdido. Tu misión es encontrar su verdadero significado.</p>
            <p>Si aciertas al menos dos de los tres mensajes previos, tendrás una oportunidad de completar la misión con éxito.</p>
            <img src="images/intercepted_messages.png" class="scene-image" alt="Mensajes interceptados">
            <button class="game-button" onclick="iniciarMensajesInterceptados()">
              <span class="material-icons">visibility</span>
              Ver mensajes
            </button>
        </div>
    </div>
    `;
}

/**
 * Renderiza los mensajes interceptados
 */
function renderizarMensajesInterceptados() {
    if (datosJuego.mensajeActual < datosJuego.mensajes.length) {
        const mensaje = datosJuego.mensajes[datosJuego.mensajeActual];
        const opcionesMezcladas = mezclarArray([...mensaje.opciones]);

        contenedorJuego.innerHTML = `
        <div class="game-section">
            <h3>${mensaje.titulo}</h3>
            <div class="message-content">
                <p><strong>Matriz cifrada:</strong></p>
                <pre>${mensaje.matriz}</pre>
                <p class="instruction">Selecciona la interpretación correcta:</p>
                <div class="options-grid">
                ${opcionesMezcladas.map(opcion => `
                    <button class="option-button" onclick="registrarRespuesta('${opcion.replace(/'/g, "\\'")}')">
                        ${opcion}
                    </button>
                `).join('')}
                </div>
            </div>
        </div>
        `;
    } else {
        mostrarTransicionCapitulo();
        setTimeout(() => {
            datosJuego.estadoActual = datosJuego.respuestasCorrectas >= 2 ? EstadoJuego.CAPITULO4 : EstadoJuego.FINAL_MALO;
            renderizarEscena();
        }, 2000);
    }
}

/**
 * Renderiza el cuarto capítulo
 */
function renderizarCapitulo4() {
    contenedorJuego.innerHTML = `
    <div class="game-section">
      <h2 class="chapter-title">Capítulo 4: La Misión Crucial</h2>
      <div class="chapter-content">
        <p>La misión final está en tus manos. El destino de la nación pende de un hilo, y solo tú puedes evitar que todo se derrumbe. Debes enviar un mensaje codificado a la Agencia Eclipse para evitar una catástrofe.</p>
        <p>El mensaje a enviar es el siguiente:</p>
        <p class="critical-message"><strong>"ESPIA DOBLE INFILTRADO ATAQUE EN CURSO EVACUACION INMEDIATA"</strong></p>
        <p>Ingresa la secuencia numérica correspondiente.</p>
        <input type="text" id="entradaMision" class="game-input" placeholder="Ej: 5 19 16 ...">
        <button class="game-button" onclick="verificarMision()">
          <span class="material-icons">send</span>
          Enviar
        </button>
      </div>
    </div>
    `;
}

/**
 * Renderiza el final del juego
 * @param {boolean} finalBueno - Indica si es el final bueno o malo
 */
function renderizarFinal(finalBueno) {
    const imagen = finalBueno ? "scene_good_end.png" : "scene_bad_end.png";
    const titulo = finalBueno ? "Final Bueno: Misión Cumplida" : "Final Malo: Misión Fallida";
    const texto = finalBueno ?
        "La misión fue un éxito. Lograste mantener la paz, pero todos saben que la calma es solo temporal. La fragilidad de la situación podría desbordarse en cualquier momento, pero por ahora, la victoria es tuya. Has logrado salvar a la nación de un destino oscuro, aunque las sombras siguen acechando. La Agencia Eclipse sigue en pie, pero los enemigos nunca descansan." :
        "La misión falló. El ataque se llevó a cabo y todo quedó en ruinas. Los enemigos lograron descifrar los mensajes antes que tú y la ciudad cayó en el caos. La Agencia Eclipse ha sido desmantelada y los pocos sobrevivientes ahora viven en la clandestinidad. En las sombras, aún queda la esperanza de un contraataque.";

    contenedorJuego.innerHTML = `
    <div class="game-section">
      <h2 class="chapter-title">${titulo}</h2>
      <div class="chapter-content">
        <p>${texto}</p>
        <img src="images/${imagen}" class="scene-image" alt="${titulo}">
        <button class="game-button" onclick="reiniciarJuego()">
          <span class="material-icons">replay</span>
          Jugar de nuevo
        </button>
      </div>
    </div>
    `;
}

// =============================================
// FUNCIONES DE LÓGICA DEL JUEGO
// =============================================

/**
 * Avanza el diálogo actual
 */
async function avanzarDialogo() {
    // Animación de salida hacia abajo
    const currentDialog = contenedorJuego.querySelector('.game-dialog');
    if (currentDialog) {
        currentDialog.style.animation = 'slideOutToBottom 0.5s forwards';
        await new Promise(resolve => setTimeout(resolve, 500));
        currentDialog.remove();
    }

    datosJuego.dialogoActual++;
    renderizarEscena();
}

/**
 * Verifica el alias ingresado por el jugador
 */
function verificarAlias() {
    const entrada = document.getElementById("entradaAlias").value.trim();

    if (entrada === datosJuego.aliasEsperado) {
        contenedorJuego.innerHTML = `
        <div class="game-section">
            <div class="game-dialog">
                <img src="images/character_professor.png" class="character-image" alt="El Profesor">
                <div class="dialog-text">
                    <div class="character-name">El Profesor</div>
                    <div class="dialog-content">¡Correcto! Has entendido perfectamente el método. Prepárate para la siguiente fase de la misión.</div>
                    <button class="game-button" onclick="mostrarTransicionCapitulo('Tiempo después...'); setTimeout(() => avanzarACapitulo3(), 2000)">
                      <span class="material-icons">arrow_forward</span>
                      Continuar
                    </button>
                </div>
            </div>
        </div>
        `;
    } else {
        mostrarError("Alias incorrecto. Recuerda: 'LA SOMBRA' es 12 1 27 19 15 13 2 18 1");
    }
}

/**
 * Avanza al tercer capítulo
 */
function avanzarACapitulo3() {
    datosJuego.estadoActual = EstadoJuego.CAPITULO3;
    renderizarEscena();
}

/**
 * Inicia la sección de mensajes interceptados
 */
function iniciarMensajesInterceptados() {
    datosJuego.estadoActual = EstadoJuego.MENSAJES;
    datosJuego.mensajeActual = 0;
    renderizarEscena();
}

/**
 * Registra la respuesta del jugador a un mensaje interceptado
 * @param {string} seleccionada - Opción seleccionada por el jugador
 */
function registrarRespuesta(seleccionada) {
    const mensaje = datosJuego.mensajes[datosJuego.mensajeActual];
    if (seleccionada === mensaje.correcta) {
        datosJuego.respuestasCorrectas++;

        const seccion = document.createElement("div");
        seccion.className = "game-section";
        seccion.innerHTML = `
        <div class="feedback-message correct">
            <span class="material-icons">verified</span>
            <p class="dialog-content">${mensaje.pensamiento}</p>
            <button class="game-button" onclick="datosJuego.mensajeActual++; renderizarEscena()">
              <span class="material-icons">arrow_forward</span>
              Continuar
            </button>
        </div>
        `;
        contenedorJuego.appendChild(seccion);
    } else {
        const seccion = document.createElement("div");
        seccion.className = "game-section";
        seccion.innerHTML = `
        <div class="feedback-message incorrect">
            <span class="material-icons">error</span>
            <p>Respuesta incorrecta. Siguiente mensaje...</p>
            <button class="game-button" onclick="datosJuego.mensajeActual++; renderizarEscena()">
              <span class="material-icons">arrow_forward</span>
              Continuar
            </button>
        </div>
        `;
        contenedorJuego.appendChild(seccion);
    }
}

/**
 * Verifica la misión final del jugador
 */
function verificarMision() {
    const entrada = document.getElementById("entradaMision").value.trim();

    if (entrada.toUpperCase() === datosJuego.misionEsperada.toUpperCase()) {
        datosJuego.estadoActual = EstadoJuego.FINAL_BUENO;
    } else {
        datosJuego.estadoActual = EstadoJuego.FINAL_MALO;
    }
    mostrarTransicionCapitulo();
    setTimeout(() => renderizarEscena(), 2000);
}

// =============================================
// FUNCIONES UTILITARIAS
// =============================================

/**
 * Anima la barra de carga
 */
function animarBarraDeCarga() {
    let start = null;
    const barraCarga = document.getElementById("barra-carga");

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / 3000 * 100, 100);

        barraCarga.style.width = `${progress}%`;
        barraCarga.style.backgroundColor = `hsl(${progress * 1.2}, 80%, 50%)`;

        if (progress < 100) {
            window.requestAnimationFrame(step);
        } else {
            datosJuego.estadoActual = EstadoJuego.CAPITULO1;
            renderizarEscena();
        }
    }

    window.requestAnimationFrame(step);
}

/**
 * Mezcla un array aleatoriamente
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado
 */
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const divError = document.createElement("div");
    divError.className = "error-message";
    divError.innerHTML = `
        <span class="material-icons">error</span>
        <p>${mensaje}</p>
    `;
    contenedorJuego.prepend(divError);

    setTimeout(() => {
        if (divError.parentElement) {
            divError.parentElement.removeChild(divError);
        }
    }, 3000);
}

/**
 * Muestra una transición entre capítulos
 * @param {string} texto - Texto opcional para mostrar en la transición
 */
function mostrarTransicionCapitulo(texto = "") {
    const transicion = document.createElement('div');
    transicion.className = 'chapter-transition';
    transicion.innerHTML = `
        <div class="chapter-transition-content">
            <span class="material-icons">hourglass_top</span>
            ${texto ? `<p>${texto}</p>` : ''}
        </div>
    `;
    document.body.appendChild(transicion);

    setTimeout(() => {
        transicion.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => transicion.remove(), 1000);
    }, 2000);
}

/**
 * Reinicia el juego al estado inicial
 */
function reiniciarJuego() {
    datosJuego.estadoActual = EstadoJuego.TITULO;
    datosJuego.dialogoActual = 0;
    datosJuego.mensajeActual = 0;
    datosJuego.respuestasCorrectas = 0;
    renderizarEscena();
}

/**
 * Avanza a la siguiente escena del juego
 */
function avanzarEscena() {
    const transiciones = {
        [EstadoJuego.TITULO]: EstadoJuego.CARGANDO,
        [EstadoJuego.CARGANDO]: EstadoJuego.CAPITULO1,
        [EstadoJuego.CAPITULO1]: EstadoJuego.CAPITULO2,
        [EstadoJuego.CAPITULO2]: EstadoJuego.PRUEBA,
        [EstadoJuego.PRUEBA]: null,
        [EstadoJuego.CAPITULO3]: EstadoJuego.MENSAJES,
        [EstadoJuego.MENSAJES]: () => {
            datosJuego.mensajeActual++;
            if (datosJuego.mensajeActual >= datosJuego.mensajes.length) {
                return datosJuego.respuestasCorrectas >= 2 ? EstadoJuego.CAPITULO4 : EstadoJuego.FINAL_MALO;
            }
            return EstadoJuego.MENSAJES;
        },
        [EstadoJuego.CAPITULO4]: EstadoJuego.FINAL_BUENO
    };

    const siguienteEstado = typeof transiciones[datosJuego.estadoActual] === 'function'
        ? transiciones[datosJuego.estadoActual]()
        : transiciones[datosJuego.estadoActual];

    if (siguienteEstado) {
        datosJuego.estadoActual = siguienteEstado;
        renderizarEscena();
    }
}

/**
 * Inicia el juego desde el principio
 */
function iniciarJuego() {
    datosJuego.estadoActual = EstadoJuego.CARGANDO;
    renderizarEscena();
}

// =============================================
// INICIALIZACIÓN DEL JUEGO
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Precargar imágenes
    const imagenes = [
        'images/character_oracle.png',
        'images/character_professor.png',
        'images/scene_main.png',
        'images/noir_city_night.png',
        'images/intercepted_messages.png',
        'images/scene_good_end.png',
        'images/scene_bad_end.png'
    ];
    imagenes.forEach(src => new Image().src = src);

    renderizarEscena();
});