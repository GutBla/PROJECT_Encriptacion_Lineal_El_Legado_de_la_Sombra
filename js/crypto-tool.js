/**
 * Módulo de herramienta criptográfica
 * Implementa encriptación/desencriptación matricial
 */
const CryptoApp = (() => {
    /* =============================================
       CLASE PRINCIPAL DE CRIPTOGRAFÍA
       ============================================= */
    class Cryptography {
        constructor(blockSize = 1) {
            this.blockSize = blockSize;
            this.mapping = {
                'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8,
                'I':9, 'J':10, 'K':11, 'L':12, 'M':13, 'N':14, 'O':15,
                'P':16, 'Q':17, 'R':18, 'S':19, 'T':20, 'U':21, 'V':22,
                'W':23, 'X':24, 'Y':25, 'Z':26, '-':27, ' ':27
            };
            this.revMapping = this._createReverseMapping();
            this.B = this._getEncryptionMatrix(blockSize);
        }

        /* =============================================
           MÉTODOS AUXILIARES DE MAPEO
           ============================================= */
        _createReverseMapping() {
            return Object.fromEntries(
                Object.entries(this.mapping).map(([k, v]) => [v, k])
            );
        }

        _getEncryptionMatrix(k) {
            const matrices = {
                1: [[1]],
                2: [[1, 2], [3, 5]],
                3: [[1, 2, 3], [0, 1, 4], [5, 6, 0]],
                4: [[1,2,3,4], [0,1,4,5], [2,3,1,1], [1,0,1,3]]
            };
            return matrices[k] || matrices[1];
        }

        textToNumbers(text) {
            return text.toUpperCase().replace(/ /g, '-')
                .split('').map(c => this.mapping[c] || 0);
        }

        numbersToText(numbers) {
            return numbers.map(n => this.revMapping[n] || '?').join('').replace(/-/g, ' ');
        }

        _padNumbers(nums) {
            const pad = this.blockSize - (nums.length % this.blockSize);
            return pad === this.blockSize ? nums : [...nums, ...Array(pad).fill(0)];
        }

        /* =============================================
           MÉTODOS PRINCIPALES DE ENCRIPTACIÓN/DESENCRIPTACIÓN
           ============================================= */
        encrypt(text) {
            let nums = this.textToNumbers(text);
            nums = this._padNumbers(nums);

            const cols = nums.length / this.blockSize;
            const M = Array.from({length: this.blockSize}, (_, i) =>
                Array.from({length: cols}, (_, j) => nums[i + j * this.blockSize])
            );

            const encrypted = this._matrixMultiply(this.B, M);
            return { original: M, encrypted };
        }

        decrypt(encryptedMatrix) {
            const encrypted = encryptedMatrix.map(row => [...row]);
            const BInv = this._matrixInverse(this.B);
            const decrypted = this._matrixMultiply(BInv, encrypted);

            const rounded = decrypted.map(row =>
                row.map(x => Math.round(x * 1000) / 1000)
                    .map(x => {
                        const rounded = Math.round(x);
                        return Math.abs(x - rounded) < 0.1 ? rounded : x;
                    })
            );

            const numbers = this._flattenMatrix(rounded);
            this._trimTrailingZeros(numbers);

            const text = this.numbersToText(numbers);

            return {
                matrix: rounded,
                text: text
            };
        }

        /* =============================================
           OPERACIONES CON MATRICES
           ============================================= */
        _matrixMultiply(a, b) {
            return a.map(row =>
                b[0].map((_, j) =>
                    row.reduce((sum, _, k) => sum + row[k] * b[k][j], 0)
                )
            );
        }

        _matrixInverse(mat) {
            if(mat.length === 1) {
                const det = mat[0][0];
                if(det === 0) throw new Error("Matriz no invertible");
                return [[1/det]];
            }

            if(mat.length === 2) {
                const a = mat[0][0], b = mat[0][1];
                const c = mat[1][0], d = mat[1][1];

                const det = a*d - b*c;
                if(det === 0) throw new Error("Matriz no invertible");

                return [
                    [d/det, -b/det],
                    [-c/det, a/det]
                ];
            }

            if(mat.length === 3) {
                const a = mat[0][0], b = mat[0][1], c = mat[0][2];
                const d = mat[1][0], e = mat[1][1], f = mat[1][2];
                const g = mat[2][0], h = mat[2][1], i = mat[2][2];

                const det = a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
                if(det === 0) throw new Error("Matriz no invertible");

                return [
                    [
                        (e*i - f*h)/det,
                        (c*h - b*i)/det,
                        (b*f - c*e)/det
                    ],
                    [
                        (f*g - d*i)/det,
                        (a*i - c*g)/det,
                        (c*d - a*f)/det
                    ],
                    [
                        (d*h - e*g)/det,
                        (b*g - a*h)/det,
                        (a*e - b*d)/det
                    ]
                ];
            }

            if(mat.length === 4) {
                const det = this._calculate4x4Determinant(mat);
                if(det === 0) throw new Error("Matriz no invertible");

                const inv = new Array(16);
                for(let i = 0; i < 4; i++) {
                    for(let j = 0; j < 4; j++) {
                        const submatrix = this._getSubmatrix(mat, i, j);
                        const subDet = this._calculate3x3Determinant(submatrix);
                        const sign = ((i + j) % 2 === 0) ? 1 : -1;
                        inv[j*4 + i] = sign * subDet / det;
                    }
                }

                return [
                    [inv[0], inv[1], inv[2], inv[3]],
                    [inv[4], inv[5], inv[6], inv[7]],
                    [inv[8], inv[9], inv[10], inv[11]],
                    [inv[12], inv[13], inv[14], inv[15]]
                ];
            }

            throw new Error("Tamaño de matriz no soportado para inversión");
        }

        /* =============================================
           CÁLCULO DE DETERMINANTES
           ============================================= */
        _calculate3x3Determinant(mat) {
            const a = mat[0][0], b = mat[0][1], c = mat[0][2];
            const d = mat[1][0], e = mat[1][1], f = mat[1][2];
            const g = mat[2][0], h = mat[2][1], i = mat[2][2];

            return a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g);
        }

        _calculate4x4Determinant(mat) {
            let det = 0;
            for(let i = 0; i < 4; i++) {
                const submatrix = this._getSubmatrix(mat, 0, i);
                const subDet = this._calculate3x3Determinant(submatrix);
                const sign = (i % 2 === 0) ? 1 : -1;
                det += sign * mat[0][i] * subDet;
            }
            return det;
        }

        /* =============================================
           MANIPULACIÓN DE MATRICES
           ============================================= */
        _getSubmatrix(mat, rowToRemove, colToRemove) {
            const submatrix = [];
            for(let i = 0; i < mat.length; i++) {
                if(i === rowToRemove) continue;
                const row = [];
                for(let j = 0; j < mat[i].length; j++) {
                    if(j === colToRemove) continue;
                    row.push(mat[i][j]);
                }
                submatrix.push(row);
            }
            return submatrix;
        }

        _flattenMatrix(matrix) {
            const numbers = [];
            for(let j = 0; j < matrix[0].length; j++) {
                for(let i = 0; i < matrix.length; i++) {
                    numbers.push(matrix[i][j]);
                }
            }
            return numbers;
        }

        _trimTrailingZeros(numbers) {
            while(numbers.length > 0 && numbers[numbers.length-1] === 0) {
                numbers.pop();
            }
        }
    }

    /* =============================================
       ESTADO DE LA APLICACIÓN
       ============================================= */
    let currentMode = 'encrypt';
    let lastResult = '';

    /* =============================================
       MÉTODOS AUXILIARES DE LA INTERFAZ
       ============================================= */
    const formatMatrix = (matrix) => {
        return matrix.map(row => row.join('\t')).join('\n');
    };

    const showError = (message, element) => {
        element.innerHTML = `<span style="color:#ff6b6b;">${message}</span>`;
        setTimeout(() => {
            element.innerHTML = '';
        }, 3000);
    };

    const createMatrixOutput = (matrix) => {
        const pre = document.createElement('pre');
        pre.className = 'crypto-matrix-output';
        pre.textContent = formatMatrix(matrix);
        return pre;
    };

    /* =============================================
       ANIMACIONES DEL MODAL
       ============================================= */
    const animateModal = (modal, action) => {
        if (action === 'open') {
            modal.classList.remove('modal-close');
            modal.classList.add('modal-open');
            modal.style.display = 'flex';
        } else {
            modal.classList.remove('modal-open');
            modal.classList.add('modal-close');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Coincide con la duración de la animación
        }
    };

    /* =============================================
       MÉTODOS PÚBLICOS DE LA APLICACIÓN
       ============================================= */
    return {
        init: function() {
            this._setupEventListeners();
            this._setupModalBehavior();
        },

        /* =============================================
           CONFIGURACIÓN DE EVENTOS
           ============================================= */
        _setupEventListeners: function() {
            // Botones de modo
            document.querySelectorAll('.crypto-mode-btn').forEach(btn => {
                btn.addEventListener('click', () => this._handleModeChange(btn));
            });

            // Botón de procesar
            document.getElementById('processCryptoBtn').addEventListener('click', () => this.process());

            // Botón de pegar
            document.getElementById('pasteCryptoBtn').addEventListener('click', async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    document.getElementById('cryptoInput').value = text;
                } catch (err) {
                    showError('No se pudo acceder al portapapeles', document.getElementById('cryptoOutput'));
                    console.error('Error al pegar:', err);
                }
            });

            // Botón de borrar
            document.getElementById('clearCryptoBtn').addEventListener('click', () => {
                document.getElementById('cryptoInput').value = '';
                document.getElementById('cryptoOutput').innerHTML = '';
                lastResult = '';
            });

            // Botón de copiar
            document.getElementById('copyCryptoBtn').addEventListener('click', () => this.copyResult());
        },

        _setupModalBehavior: function() {
            const cryptoBtn = document.getElementById('cryptoBtn');
            const cryptoModal = document.getElementById('cryptoModal');
            const closeBtn = document.getElementById('closeCryptoModal');

            cryptoBtn.addEventListener('click', () => {
                animateModal(cryptoModal, 'open');
            });

            closeBtn.addEventListener('click', () => {
                animateModal(cryptoModal, 'close');
            });

            window.addEventListener('click', (e) => {
                if(e.target === cryptoModal) {
                    animateModal(cryptoModal, 'close');
                }
            });
        },

        /* =============================================
           MANEJO DE MODOS (ENCRIPTAR/DESENCRIPTAR)
           ============================================= */
        _handleModeChange: function(btn) {
            document.querySelectorAll('.crypto-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;

            const placeholder = currentMode === 'encrypt'
                ? 'Ingresa el texto a encriptar...'
                : 'Ingresa la matriz (filas separadas por saltos de línea y números por espacios)';

            document.getElementById('cryptoInput').placeholder = placeholder;
            document.getElementById('cryptoOutput').textContent = '';
        },

        /* =============================================
           PROCESAMIENTO PRINCIPAL
           ============================================= */
        process: function() {
            const blockSize = parseInt(document.getElementById('cryptoBlockSize').value);
            const input = document.getElementById('cryptoInput').value.trim();
            const output = document.getElementById('cryptoOutput');

            if (!input) {
                showError('Por favor ingresa algún contenido', output);
                return;
            }

            output.innerHTML = '';

            try {
                const cipher = new Cryptography(blockSize);

                if(currentMode === 'encrypt') {
                    const { original, encrypted } = cipher.encrypt(input);
                    lastResult = encrypted.map(row => row.join(' ')).join('\n');

                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'crypto-result-columns';

                    const originalBox = document.createElement('div');
                    originalBox.className = 'crypto-result-box';
                    originalBox.innerHTML = '<h3>Matriz Original</h3><div class="crypto-result-box-content"></div>';
                    originalBox.querySelector('.crypto-result-box-content').appendChild(createMatrixOutput(original));

                    const encryptedBox = document.createElement('div');
                    encryptedBox.className = 'crypto-result-box';
                    encryptedBox.innerHTML = '<h3>Matriz Encriptada</h3><div class="crypto-result-box-content"></div>';
                    encryptedBox.querySelector('.crypto-result-box-content').appendChild(createMatrixOutput(encrypted));

                    resultDiv.appendChild(originalBox);
                    resultDiv.appendChild(encryptedBox);
                    output.appendChild(resultDiv);
                } else {
                    const matrix = this._parseMatrixInput(input);
                    const { matrix: decrypted, text } = cipher.decrypt(matrix);
                    lastResult = text;

                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'crypto-result-columns';

                    const decryptedBox = document.createElement('div');
                    decryptedBox.className = 'crypto-result-box';
                    decryptedBox.innerHTML = '<h3>Matriz Desencriptada</h3><div class="crypto-result-box-content"></div>';
                    decryptedBox.querySelector('.crypto-result-box-content').appendChild(createMatrixOutput(decrypted));

                    const textBox = document.createElement('div');
                    textBox.className = 'crypto-result-box';
                    textBox.innerHTML = `
                        <h3>Texto Resultante</h3>
                        <div class="crypto-result-box-content crypto-text-output">${text}</div>
                    `;

                    resultDiv.appendChild(decryptedBox);
                    resultDiv.appendChild(textBox);
                    output.appendChild(resultDiv);
                }
            } catch (error) {
                showError(error.message, output);
            }
        },

        /* =============================================
           MANEJO DE ENTRADA DE MATRICES
           ============================================= */
        _parseMatrixInput: function(input) {
            const matrix = input.split('\n')
                .filter(row => row.trim())
                .map(row => row.split(/\s+/).map(Number));

            if(matrix.length === 0) {
                throw new Error('La matriz no puede estar vacía');
            }

            const cols = matrix[0].length;
            if(!matrix.every(row => row.length === cols)) {
                throw new Error('Todas las filas deben tener el mismo número de elementos');
            }

            return matrix;
        },

        /* =============================================
           MANEJO DE RESULTADOS
           ============================================= */
        copyResult: function() {
            if(!lastResult) return;
            navigator.clipboard.writeText(lastResult).catch(err => console.error(err));
        }
    };
})();

/* =============================================
   INICIALIZACIÓN DE LA APLICACIÓN
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    CryptoApp.init();
});