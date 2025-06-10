import os

def listar_estructura_directorios(carpeta, nivel=0):
    """Función recursiva para listar directorios y archivos en formato de árbol"""
    indentacion = "│   " * nivel
    nombre_carpeta = os.path.basename(carpeta)  # Obtiene el nombre de la carpeta
    print(f"{indentacion}├── {nombre_carpeta}/")
    
    # Listar los archivos y carpetas dentro de la carpeta actual
    try:
        contenido = os.listdir(carpeta)
    except PermissionError:
        print(f"{indentacion}│   (Permiso denegado)")
        return
    
    # Ordenar los elementos por nombre para tener un listado más limpio
    contenido.sort()
    
    for item in contenido:
        ruta_item = os.path.join(carpeta, item)
        
        if os.path.isdir(ruta_item):
            # Si es una carpeta, llamamos a la función recursiva
            listar_estructura_directorios(ruta_item, nivel + 1)
        else:
            # Si es un archivo, lo mostramos con una indentación apropiada
            print(f"{indentacion}│   └── {item}")

def obtener_estructura(proyecto_raiz):
    """Función que imprime la estructura completa del proyecto"""
    if not os.path.isdir(proyecto_raiz):
        print(f"Error: {proyecto_raiz} no es un directorio válido.")
        return
    
    print(f"Estructura de carpetas para el proyecto en: {proyecto_raiz}\n")
    listar_estructura_directorios(proyecto_raiz)

# Ruta a tu proyecto en Windows (puedes cambiarla por la que desees)
ruta_proyecto = r"C:\Users\Sebastian Sanchez\Desktop\2025-1\electiva 2\proyecto airbnb\rent-finder"

obtener_estructura(ruta_proyecto)
