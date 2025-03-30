import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import json


class Cryptography:
    def __init__(self, block_size=2):
        self.block_size = block_size
        self.mapping = {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8,
                        "I": 9, "J": 10, "K": 11, "L": 12, "M": 13, "N": 14, "O": 15,
                        "P": 16, "Q": 17, "R": 18, "S": 19, "T": 20, "U": 21, "V": 22,
                        "W": 23, "X": 24, "Y": 25, "Z": 26, "-": 27, " ": 27}
        self.rev_mapping = {v: k for k, v in self.mapping.items()}
        self.B = self._get_encryption_matrix(self.block_size)

    def _get_encryption_matrix(self, k):
        if k == 1:
            return np.array([[1]])
        elif k == 2:
            return np.array([[1, 2], [3, 5]])
        elif k == 3:
            return np.array([[1, 2, 3], [0, 1, 4], [5, 6, 0]])
        elif k == 4:
            return np.array([[1, 2, 3, 4], [0, 1, 4, 5], [2, 3, 1, 1], [1, 0, 1, 3]])
        else:
            raise ValueError("Solo se soportan bloques de 1, 2, 3 o 4.")

    def text_to_numbers(self, text):
        text = text.upper().replace(" ", "-")
        return [self.mapping.get(c, 0) for c in text]

    def numbers_to_text(self, numbers):
        return "".join([self.rev_mapping.get(n, "?") for n in numbers])

    def _pad_numbers(self, nums):
        remainder = len(nums) % self.block_size
        if remainder != 0:
            pad_count = self.block_size - remainder
            nums.extend([0] * pad_count)
        return nums

    def encrypt(self, text):
        nums = self.text_to_numbers(text)
        nums = self._pad_numbers(nums)
        n = len(nums) // self.block_size
        M = np.array(nums).reshape((self.block_size, n), order="F")
        encrypted = self.B.dot(M)
        return M, encrypted

    def decrypt(self, encrypted_matrix):
        B_inv = np.linalg.inv(self.B)
        decrypted = B_inv.dot(encrypted_matrix)
        decrypted = np.rint(decrypted).astype(int)
        numbers = list(decrypted.flatten(order="F"))
        while numbers and numbers[-1] == 0:
            numbers.pop()
        text = self.numbers_to_text(numbers)
        return decrypted, text


class CryptographyGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Criptografía")
        self.root.geometry("800x600")
        self.setup_ui()

        # Variables
        self.mode = "encrypt"
        self.result_text = ""

    def setup_ui(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Modo (Encriptar/Desencriptar)
        mode_frame = ttk.LabelFrame(main_frame, text="Modo", padding="10")
        mode_frame.pack(fill=tk.X, pady=5)

        self.mode_var = tk.StringVar(value="encrypt")
        ttk.Radiobutton(mode_frame, text="🔒 Encriptar", variable=self.mode_var,
                        value="encrypt", command=self.update_ui).pack(side=tk.LEFT, padx=10)
        ttk.Radiobutton(mode_frame, text="🔓 Desencriptar", variable=self.mode_var,
                        value="decrypt", command=self.update_ui).pack(side=tk.LEFT, padx=10)

        # Tamaño de bloque
        block_frame = ttk.LabelFrame(main_frame, text="Configuración", padding="10")
        block_frame.pack(fill=tk.X, pady=5)

        ttk.Label(block_frame, text="Tamaño de bloque (filas):").pack(side=tk.LEFT, padx=5)
        self.block_size = ttk.Combobox(block_frame, values=[1, 2, 3, 4], state="readonly")
        self.block_size.current(1)  # Valor por defecto: 2
        self.block_size.pack(side=tk.LEFT, padx=5)

        # Área de entrada
        input_frame = ttk.LabelFrame(main_frame, text="Entrada", padding="10")
        input_frame.pack(fill=tk.BOTH, expand=True, pady=5)

        self.input_area = scrolledtext.ScrolledText(input_frame, wrap=tk.WORD, height=8)
        self.input_area.pack(fill=tk.BOTH, expand=True)
        self.update_input_placeholder()

        # Botones
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=5)

        self.process_button = ttk.Button(button_frame, text="🚀 Procesar", command=self.process)
        self.process_button.pack(side=tk.LEFT, padx=5)

        self.copy_button = ttk.Button(button_frame, text="📋 Copiar Resultado", command=self.copy_result)
        self.copy_button.pack(side=tk.LEFT, padx=5)

        # Área de salida
        output_frame = ttk.LabelFrame(main_frame, text="Resultado", padding="10")
        output_frame.pack(fill=tk.BOTH, expand=True, pady=5)

        self.output_area = scrolledtext.ScrolledText(output_frame, wrap=tk.WORD, height=12, state=tk.DISABLED)
        self.output_area.pack(fill=tk.BOTH, expand=True)

    def update_ui(self):
        self.update_input_placeholder()

    def update_input_placeholder(self):
        self.input_area.delete("1.0", tk.END)
        if self.mode_var.get() == "encrypt":
            self.input_area.insert("1.0", "✏️ Ingresa el texto a encriptar...")
        else:
            self.input_area.insert("1.0",
                                   "✏️ Ingresa la matriz a desencriptar (filas separadas por saltos de línea y números por espacios)...")
        self.input_area.config(fg="grey")

        # Configurar eventos para el placeholder
        self.input_area.bind("<FocusIn>", self.clear_placeholder)
        self.input_area.bind("<FocusOut>", self.restore_placeholder)

    def clear_placeholder(self, event):
        if self.input_area.get("1.0", "end-1c") in [
            "✏️ Ingresa el texto a encriptar...",
            "✏️ Ingresa la matriz a desencriptar (filas separadas por saltos de línea y números por espacios)..."
        ]:
            self.input_area.delete("1.0", tk.END)
            self.input_area.config(fg="black")

    def restore_placeholder(self, event):
        if not self.input_area.get("1.0", "end-1c").strip():
            self.update_input_placeholder()

    def process(self):
        # Verificar si el texto es el placeholder
        current_text = self.input_area.get("1.0", "end-1c")
        if current_text.startswith("✏️"):
            messagebox.showwarning("Advertencia", "Por favor ingresa un texto válido.")
            return

        try:
            block_size = int(self.block_size.get())
            cipher = Cryptography(block_size=block_size)

            self.output_area.config(state=tk.NORMAL)
            self.output_area.delete("1.0", tk.END)

            if self.mode_var.get() == "encrypt":
                M, encrypted = cipher.encrypt(current_text)
                self.output_area.insert(tk.END, "📝 Matriz Original (a partir del texto):\n")
                self.output_area.insert(tk.END, str(M) + "\n\n")
                self.output_area.insert(tk.END, "🔐 Matriz Encriptada (B · M):\n")
                self.output_area.insert(tk.END, str(encrypted) + "\n")
                self.result_text = self.format_matrix(encrypted)
                self.copy_button.config(text="📋 Copiar Matriz Encriptada")
            else:
                lines = current_text.strip().splitlines()
                matrix = []
                for line in lines:
                    if line.strip():
                        row = [int(x) for x in line.split()]
                        matrix.append(row)
                matrix = np.array(matrix)
                decrypted, text = cipher.decrypt(matrix)
                self.output_area.insert(tk.END, "🔓 Matriz Desencriptada (B⁻¹ · Matriz Encriptada):\n")
                self.output_area.insert(tk.END, str(decrypted) + "\n\n")
                self.output_area.insert(tk.END, "💬 Texto Desencriptado:\n")
                final_text = text.replace("-", " ")
                self.output_area.insert(tk.END, final_text + "\n")
                self.result_text = final_text
                self.copy_button.config(text="📋 Copiar Texto Desencriptado")

        except Exception as e:
            messagebox.showerror("Error", f"Ocurrió un error:\n{str(e)}")
            self.result_text = ""
        finally:
            self.output_area.config(state=tk.DISABLED)

    def format_matrix(self, matrix):
        rows = []
        for row in matrix:
            rows.append(" ".join(str(x) for x in row))
        return "\n".join(rows)

    def copy_result(self):
        if self.result_text:
            self.root.clipboard_clear()
            self.root.clipboard_append(self.result_text)
            messagebox.showinfo("Copiado", "El resultado ha sido copiado al portapapeles.")
        else:
            messagebox.showwarning("Advertencia", "No hay resultado para copiar.")


if __name__ == "__main__":
    root = tk.Tk()
    app = CryptographyGUI(root)
    root.mainloop()