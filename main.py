import numpy as np
import customtkinter as ctk
from tkinter import messagebox
import json
from datetime import datetime
import os
from PIL import Image, ImageTk
import platform

# Configuración de apariencia
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class LinearCipher:
    """Clase para cifrado/descifrado lineal usando matrices"""
    def __init__(self, block_size=1):
        self.block_size = block_size
        self.char_map = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
            'I': 9, 'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14, 'O': 15,
            'P': 16, 'Q': 17, 'R': 18, 'S': 19, 'T': 20, 'U': 21, 'V': 22,
            'W': 23, 'X': 24, 'Y': 25, 'Z': 26, '-': 27, ' ': 27,
            'Á': 28, 'É': 29, 'Í': 30, 'Ó': 31, 'Ú': 32, 'Ñ': 33, 'Ü': 34,
            '¿': 35, '?': 35, '¡': 36, '!': 36, '.': 37, ',': 38, ';': 39, ':': 40
        }
        self.reverse_map = {v: k for k, v in self.char_map.items()}
        self.encryption_matrix = self._get_encryption_matrix()

    def _get_encryption_matrix(self):
        """Retorna la matriz de cifrado según tamaño de bloque"""
        matrices = {
            1: [[1]],
            2: [[1, 2], [3, 5]],
            3: [[1, 2, 3], [0, 1, 4], [5, 6, 0]],
            4: [[1, 2, 3, 4], [0, 1, 4, 5], [2, 3, 1, 1], [1, 0, 1, 3]]
        }
        return np.array(matrices.get(self.block_size, [[1]]))

    def text_to_numbers(self, text):
        """Convierte texto a números según mapeo"""
        invalid_chars = []
        text = text.upper().replace(" ", "-")
        nums = []
        for c in text:
            if c not in self.char_map:
                invalid_chars.append(c)
            nums.append(self.char_map.get(c, 0))
        if invalid_chars:
            raise ValueError(f"Caracteres no admitidos: {', '.join(set(invalid_chars))}")
        return nums

    def numbers_to_text(self, numbers):
        """Convierte números a texto usando mapeo inverso"""
        text = []
        for n in numbers:
            char = self.reverse_map.get(n, "?")
            text.append(' ' if char == '-' and '-' not in self.char_map.values() else char)
        return "".join(text).replace("-", " ")

    def _pad_numbers(self, nums):
        """Rellena con ceros para completar el bloque"""
        remainder = len(nums) % self.block_size
        return nums + [0] * (self.block_size - remainder) if remainder != 0 else nums

    def encrypt(self, text):
        """Cifra texto usando la matriz de cifrado"""
        nums = self._pad_numbers(self.text_to_numbers(text))
        n = len(nums) // self.block_size
        M = np.array(nums).reshape((self.block_size, n), order="F")
        encrypted = self.encryption_matrix.dot(M)
        return M, encrypted

    def decrypt(self, encrypted_matrix):
        """Descifra matriz usando inversa de la matriz de cifrado"""
        try:
            inv_matrix = np.linalg.inv(self.encryption_matrix)
            decrypted = inv_matrix.dot(encrypted_matrix)
            decrypted = np.around(decrypted, decimals=3).astype(int)
            numbers = list(decrypted.flatten(order="F"))
            while numbers and numbers[-1] == 0:
                numbers.pop()
            return decrypted, self.numbers_to_text(numbers)
        except np.linalg.LinAlgError:
            raise ValueError("Matriz no invertible - no se puede descifrar")

class CryptoApp(ctk.CTk):
    """Interfaz gráfica para la herramienta criptográfica"""
    def __init__(self):
        super().__init__()
        self.title("Herramienta Criptográfica")
        self.geometry("1000x750")
        self.minsize(900, 650)
        
        # Configuración de colores
        self.colors = {
            'primary': '#D84040',
            'secondary': '#1D1616',
            'accent': '#EAD196',
            'background': '#0A0808',
            'text': '#EAD196',
            'hover': '#BF3131',
            'text_dark': '#1D1616',
            'process_btn': '#A31D1D'
        }
        
        # Variables de estado
        self.mode = "encrypt"
        self.result_text = ""
        self.history = []
        
        # Configuración de layout
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self.load_icons()
        self.load_window_icon()
        self.create_widgets()
        self.load_config()

    def load_window_icon(self):
        """Carga el ícono de la ventana principal con manejo robusto"""
        try:
            base_path = os.path.dirname(os.path.abspath(__file__))
            icon_path = os.path.join(base_path, "images", "icons", "icon_spy.ico")
            
            if not os.path.exists(icon_path):
                raise FileNotFoundError(f"Ícono no encontrado en: {icon_path}")
            
            if platform.system() == "Windows":
                self.iconbitmap(icon_path)
            else:
                img = Image.open(icon_path)
                self.iconphoto(True, ImageTk.PhotoImage(img))
                
        except Exception as e:
            print(f"[Advertencia] Error cargando ícono: {str(e)}")
            if __debug__:
                messagebox.showinfo("Debug", f"No se pudo cargar el ícono: {str(e)}")

    def load_icons(self):
        """Carga los íconos para la interfaz"""
        self.icons = {}
        try:
            base_path = os.path.dirname(os.path.abspath(__file__))
            icon_path = os.path.join(base_path, "images", "icons")
            sizes = {'small': 16, 'medium': 24, 'large': 32}
            
            for size_name, size in sizes.items():
                self.icons[size_name] = {
                    'lock': self._load_icon(os.path.join(icon_path, "lock.png"), size),
                    'unlock': self._load_icon(os.path.join(icon_path, "lock_open.png"), size),
                    'send': self._load_icon(os.path.join(icon_path, "send.png"), size),
                    'copy': self._load_icon(os.path.join(icon_path, "content_copy.png"), size),
                    'paste': self._load_icon(os.path.join(icon_path, "content_paste.png"), size),
                    'clear': self._load_icon(os.path.join(icon_path, "delete_forever.png"), size),
                    'history': self._load_icon(os.path.join(icon_path, "list_alt.png"), size),
                    'save': self._load_icon(os.path.join(icon_path, "save.png"), size),
                }
        except Exception as e:
            print(f"Error cargando íconos: {e}")

    def _load_icon(self, path, size):
        """Carga y redimensiona un ícono individual"""
        try:
            img = Image.open(path)
            img = img.resize((size, size), Image.Resampling.LANCZOS)
            return ctk.CTkImage(img)
        except Exception as e:
            print(f"Error cargando ícono {path}: {e}")
            return None

    def create_widgets(self):
        """Crea todos los componentes de la interfaz"""
        self.create_header()
        self.create_config_panel()
        self.create_input_area()
        self.create_action_buttons()
        self.create_output_area()
        self.create_status_bar()

    def create_header(self):
        """Crea el encabezado de la aplicación"""
        header = ctk.CTkFrame(self, corner_radius=0, fg_color=self.colors['secondary'])
        header.grid(row=0, column=0, sticky="nsew", padx=0, pady=(0, 5))
        
        title = ctk.CTkLabel(
            header,
            text="Herramienta Criptográfica",
            font=ctk.CTkFont(family="Roboto Mono", size=18, weight="bold"),
            text_color=self.colors['accent']
        )
        title.pack(pady=10)


    def create_config_panel(self):
        """Crea el panel de configuración"""
        config_frame = ctk.CTkFrame(self, corner_radius=10, fg_color=self.colors['secondary'])
        config_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=5)
        
        # Modo de operación
        self.mode_var = ctk.StringVar(value="encrypt")
        
        encrypt_btn = ctk.CTkRadioButton(
            config_frame,
            text="Cifrar",
            variable=self.mode_var,
            value="encrypt",
            command=self.update_ui,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        encrypt_btn.grid(row=0, column=0, padx=10, pady=5, sticky="w")
        
        decrypt_btn = ctk.CTkRadioButton(
            config_frame,
            text="Descifrar",
            variable=self.mode_var,
            value="decrypt",
            command=self.update_ui,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        decrypt_btn.grid(row=0, column=1, padx=10, pady=5, sticky="w")
        
        # Tamaño de bloque
        block_label = ctk.CTkLabel(
            config_frame,
            text="Tamaño de bloque:",
            font=ctk.CTkFont(size=12, weight="bold")
        )
        block_label.grid(row=0, column=2, padx=10, pady=5, sticky="e")
        
        self.block_size = ctk.CTkComboBox(
            config_frame,
            values=["1", "2", "3", "4"],
            state="readonly",
            width=80,
            dropdown_fg_color=self.colors['secondary'],
            button_color=self.colors['primary'],
            button_hover_color=self.colors['hover']
        )
        self.block_size.set("1")
        self.block_size.grid(row=0, column=3, padx=10, pady=5)
        
        # Botón guardar configuración
        save_btn = ctk.CTkButton(
            config_frame,
            text="Guardar Config",
            image=self.icons['medium']['save'],
            command=self.save_config,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        save_btn.grid(row=0, column=4, padx=10, pady=5)

    def create_input_area(self):
        """Crea el área de entrada de texto"""
        self.input_frame = ctk.CTkFrame(self, corner_radius=10)
        self.input_frame.grid(row=2, column=0, sticky="nsew", padx=10, pady=5)
        
        # Etiqueta de instrucción
        self.input_label = ctk.CTkLabel(
            self.input_frame,
            text="",
            font=ctk.CTkFont(size=12),
            anchor="w"
        )
        self.input_label.pack(pady=(5, 0), padx=10, anchor="w")
        
        # Área de texto
        self.input_text = ctk.CTkTextbox(
            self.input_frame,
            wrap="word",
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color=self.colors['background'],
            text_color=self.colors['text'],
            border_width=2,
            border_color=self.colors['primary'],
            corner_radius=8
        )
        self.input_text.pack(padx=10, pady=(0, 10), fill="both", expand=True)
        
        # Etiqueta de ejemplo
        self.example_label = ctk.CTkLabel(
            self.input_frame,
            text="",
            font=ctk.CTkFont(size=11),
            text_color="gray70",
            anchor="w"
        )
        self.example_label.pack(pady=(0, 5), padx=10, anchor="w")
        
        self.update_input_labels()

    def create_action_buttons(self):
        """Crea los botones de acción principales"""
        btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        btn_frame.grid(row=3, column=0, sticky="nsew", padx=10, pady=5)
        
        # Botón Procesar
        self.process_btn = ctk.CTkButton(
            btn_frame,
            text="Procesar",
            image=self.icons['medium']['send'],
            command=self.process,
            fg_color=self.colors['process_btn'],
            hover_color="#8A1919",
            text_color="white",
            font=ctk.CTkFont(size=12, weight="bold")
        )
        self.process_btn.pack(side="left", padx=5)
        
        # Botón Pegar
        paste_btn = ctk.CTkButton(
            btn_frame,
            text="Pegar",
            image=self.icons['medium']['paste'],
            command=self.paste_from_clipboard,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        paste_btn.pack(side="left", padx=5)
        
        # Botón Copiar
        self.copy_btn = ctk.CTkButton(
            btn_frame,
            text="Copiar",
            image=self.icons['medium']['copy'],
            command=self.copy_result,
            state="disabled",
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        self.copy_btn.pack(side="left", padx=5)
        
        # Botón Limpiar
        clear_btn = ctk.CTkButton(
            btn_frame,
            text="Limpiar",
            image=self.icons['medium']['clear'],
            command=self.clear_all,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        clear_btn.pack(side="left", padx=5)
        
        # Botón Historial
        history_btn = ctk.CTkButton(
            btn_frame,
            text="Historial",
            image=self.icons['medium']['history'],
            command=self.show_history,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover'],
            font=ctk.CTkFont(size=12, weight="bold")
        )
        history_btn.pack(side="right", padx=5)

    def create_output_area(self):
        """Crea el área de resultados"""
        self.output_frame = ctk.CTkFrame(self, corner_radius=10)
        self.output_frame.grid(row=4, column=0, sticky="nsew", padx=10, pady=5)
        
        self.output_canvas = ctk.CTkScrollableFrame(
            self.output_frame,
            fg_color=self.colors['background'],
            scrollbar_button_color=self.colors['primary'],
            scrollbar_button_hover_color=self.colors['hover']
        )
        self.output_canvas.pack(padx=10, pady=10, fill="both", expand=True)
        
        self.output_content = ctk.CTkFrame(self.output_canvas, fg_color="transparent")
        self.output_content.pack(fill="both", expand=True)

    def create_status_bar(self):
        """Crea la barra de estado"""
        self.status_var = ctk.StringVar(value="> Sistema listo")
        
        status_bar = ctk.CTkLabel(
            self,
            textvariable=self.status_var,
            anchor="w",
            font=ctk.CTkFont(family="Consolas", size=10),
            fg_color=self.colors['primary'],
            corner_radius=0
        )
        status_bar.grid(row=5, column=0, sticky="sew", padx=0, pady=(5, 0))

    def update_ui(self):
        """Actualiza la interfaz cuando cambia el modo"""
        self.update_input_labels()
        self.copy_btn.configure(state="disabled")
        mode = "CIFRAR" if self.mode_var.get() == "encrypt" else "DESCIFRAR"
        self.status_var.set(f"> Modo cambiado a {mode}")

    def update_input_labels(self):
        """Actualiza las etiquetas de instrucción y ejemplo"""
        if self.mode_var.get() == "encrypt":
            self.input_label.configure(text="Ingrese el texto a encriptar:")
            self.example_label.configure(text="Ejemplo: HOLA MUNDO")
        else:
            self.input_label.configure(text="Ingrese la matriz a desencriptar:")
            self.example_label.configure(text="Ejemplo:\n37 80\n93 185")

    def paste_from_clipboard(self):
        """Pega texto desde el portapapeles"""
        try:
            text = self.clipboard_get()
            self.input_text.delete("0.0", "end")
            self.input_text.insert("0.0", text)
        except Exception as e:
            messagebox.showwarning("Error", "No se pudo pegar desde el portapapeles")

    def process(self):
        """Procesa la operación de cifrado/descifrado"""
        text = self.input_text.get("0.0", "end").strip()
        
        if not text:
            messagebox.showwarning("Entrada vacía", "Por favor ingrese un texto o matriz válida.")
            return

        try:
            # Limpiar resultados anteriores
            for widget in self.output_content.winfo_children():
                widget.destroy()
            
            cipher = LinearCipher(block_size=int(self.block_size.get()))
            
            if self.mode_var.get() == "encrypt":
                self.process_encryption(cipher, text)
            else:
                self.process_decryption(cipher, text)
                
            self.copy_btn.configure(state="normal")
            self.status_var.set("> Operación completada con éxito")
            
        except ValueError as ve:
            messagebox.showerror("Error de Valor", f"Datos inválidos:\n{str(ve)}")
            self.status_var.set(f"> ERROR: {str(ve)}")
        except np.linalg.LinAlgError:
            messagebox.showerror("Error Matemático", "La matriz no es invertible - verifique sus datos")
            self.status_var.set("> ERROR: Matriz no invertible")
        except Exception as e:
            messagebox.showerror("Error Inesperado", f"Ocurrió un error inesperado:\n{str(e)}")
            self.status_var.set("> ERROR: Operación fallida")

    def process_encryption(self, cipher, text):
        """Procesa la operación de cifrado"""
        original, encrypted = cipher.encrypt(text)
        
        # Mostrar matrices
        self.create_matrix_section("Matriz Original", original)
        self.create_matrix_section("Matriz Encriptada", encrypted)
        self.create_matrix_section("Copiar esta matriz para descifrar:", encrypted, copyable=True)
        
        # Guardar en historial
        self.result_text = self.format_matrix(encrypted, for_copy=True)
        self.add_to_history({
            'type': 'ENCRYPT',
            'input': text,
            'output': self.result_text,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
        self.copy_btn.configure(text="Copiar Matriz")

    def process_decryption(self, cipher, text):
        """Procesa la operación de descifrado"""
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        matrix = []
        
        for line in lines:
            try:
                row = [float(x) for x in line.split()]
                matrix.append(row)
            except ValueError:
                raise ValueError(f"Línea inválida: '{line}'. Todos los valores deben ser números.")
        
        if not matrix:
            raise ValueError("No se ingresó una matriz válida")
        
        rows = len(matrix)
        cols = len(matrix[0]) if rows > 0 else 0
        
        if any(len(row) != cols for row in matrix):
            raise ValueError("Todas las filas deben tener el mismo número de columnas")
        
        matrix = np.array(matrix)
        decrypted, text_result = cipher.decrypt(matrix)
        
        # Mostrar resultados
        self.create_matrix_section("Matriz Descifrada", decrypted)
        
        # Mostrar texto descifrado
        text_frame = ctk.CTkFrame(
            self.output_content,
            corner_radius=10,
            fg_color=self.colors['secondary']
        )
        text_frame.pack(fill="x", pady=5, padx=5)
        
        title_label = ctk.CTkLabel(
            text_frame,
            text="Texto Descifrado",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color=self.colors['accent']
        )
        title_label.pack(pady=(5, 0))
        
        result_label = ctk.CTkLabel(
            text_frame,
            text=text_result.replace("-", " "),
            font=ctk.CTkFont(family="Consolas", size=12),
            wraplength=900,
            justify="left"
        )
        result_label.pack(pady=5, padx=10)
        
        # Guardar en historial
        self.result_text = text_result.replace("-", " ")
        self.add_to_history({
            'type': 'DECRYPT',
            'input': self.format_matrix(matrix, for_copy=True),
            'output': self.result_text,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
        self.copy_btn.configure(text="Copiar Texto")

    def create_matrix_section(self, title, matrix, copyable=False):
        """Crea una sección para mostrar una matriz"""
        frame = ctk.CTkFrame(
            self.output_content,
            corner_radius=10,
            fg_color=self.colors['secondary']
        )
        frame.pack(fill="x", pady=5, padx=5)
        
        title_label = ctk.CTkLabel(
            frame,
            text=title,
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color=self.colors['accent']
        )
        title_label.pack(pady=(5, 0))
        
        textbox = ctk.CTkTextbox(
            frame,
            wrap="none",
            font=ctk.CTkFont(family="Consolas", size=12),
            height=min(6, len(matrix) + 1),
            width=50,
            fg_color=self.colors['background'],
            text_color=self.colors['text'],
            border_width=2,
            border_color=self.colors['primary'],
            corner_radius=8
        )
        
        textbox.insert("0.0", self.format_matrix(matrix, copyable))
        textbox.configure(state="disabled")
        textbox.pack(pady=5, padx=10, fill="x")

    def format_matrix(self, matrix, for_copy=False):
        """Formatea una matriz para mostrarla o copiarla"""
        if len(matrix.shape) == 1:
            return " ".join(f"{x:.2f}" if isinstance(x, float) else str(x) for x in matrix)
        
        rows = []
        for row in matrix:
            if for_copy:
                formatted_row = " ".join(f"{int(x)}" if x.is_integer() else f"{x:.2f}" for x in row)
            else:
                max_len = max(len(f"{x:.2f}") for x in row)
                formatted_row = " ".join(f"{x:{max_len}.2f}" if isinstance(x, float) else f"{x:>{max_len}}" for x in row)
            rows.append(formatted_row)
        
        return "\n".join(rows)

    def copy_result(self):
        """Copia el resultado al portapapeles"""
        if self.result_text:
            self.clipboard_clear()
            self.clipboard_append(self.result_text)
            self.status_var.set("> Resultado copiado al portapapeles")
            messagebox.showinfo("Copiado", "El resultado ha sido copiado al portapapeles.")
        else:
            messagebox.showwarning("Advertencia", "No hay resultado para copiar.")

    def clear_all(self):
        """Limpia todas las áreas de la interfaz"""
        self.input_text.delete("0.0", "end")
        for widget in self.output_content.winfo_children():
            widget.destroy()
        self.result_text = ""
        self.copy_btn.configure(state="disabled")
        self.status_var.set("> Áreas limpiadas")

    def add_to_history(self, operation):
        """Agrega una operación al historial"""
        self.history.append(operation)
        if len(self.history) > 10:
            self.history.pop(0)

    def show_history(self):
        """Muestra el historial de operaciones"""
        if not self.history:
            messagebox.showinfo("Historial", "El historial está vacío")
            return
        
        history_window = ctk.CTkToplevel(self)
        history_window.title("Historial de Operaciones")
        history_window.geometry("600x400")
        
        main_frame = ctk.CTkFrame(history_window)
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        history_text = ctk.CTkTextbox(
            main_frame,
            wrap="word",
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color=self.colors['background'],
            text_color=self.colors['text']
        )
        history_text.pack(fill="both", expand=True, padx=5, pady=5)
        
        for i, op in enumerate(reversed(self.history), 1):
            history_text.insert("end", f"{i}. [{op['timestamp']}] {op['type']}\n")
            history_text.insert("end", f"   Entrada: {op['input'][:50]}{'...' if len(op['input']) > 50 else ''}\n")
            history_text.insert("end", f"   Salida: {op['output'][:50]}{'...' if len(op['output']) > 50 else ''}\n\n")
        
        history_text.configure(state="disabled")
        
        close_btn = ctk.CTkButton(
            main_frame,
            text="Cerrar",
            command=history_window.destroy,
            fg_color=self.colors['primary'],
            hover_color=self.colors['hover']
        )
        close_btn.pack(pady=10)

    def save_config(self):
        """Guarda la configuración actual en un archivo"""
        config = {
            'mode': self.mode_var.get(),
            'block_size': self.block_size.get(),
            'window_geometry': self.geometry()
        }
        
        try:
            with open('config.json', 'w') as f:
                json.dump(config, f)
            self.status_var.set("> Configuración guardada")
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo guardar la configuración:\n{str(e)}")

    def load_config(self):
        """Carga la configuración desde un archivo"""
        try:
            if os.path.exists('crypto_config.json'):
                with open('crypto_config.json', 'r') as f:
                    config = json.load(f)
                
                self.mode_var.set(config.get('mode', 'encrypt'))
                self.block_size.set(config.get('block_size', '1'))
                
                geometry = config.get('window_geometry')
                if geometry:
                    self.geometry(geometry)
                
                self.status_var.set("> Configuración cargada")
        except Exception as e:
            print(f"Error cargando configuración: {str(e)}")

if __name__ == "__main__":
    app = CryptoApp()
    app.mainloop()